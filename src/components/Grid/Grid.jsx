import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Hand, Pen } from 'lucide-react';
import { cellKey, parseKey } from '../../game/life';
import './Grid.css';

const DEFAULT_SCALE = 20;   // pixels per cell at 100% zoom
const MIN_SCALE = 0.02;     // ~80 000 cells across a 1600px wide screen
const MAX_SCALE = 240;      // a single cell fills a big chunk of the screen
const GRID_LINES_FROM = 6;  // below that, cells are too small to draw borders
const WORLD_LIMIT = 1e9;    // far beyond anything reachable, keeps maths precise

const MIN_BRUSH = 1;        // a single cell, the historical behaviour
const MAX_BRUSH = 64;       // wide enough to fill a screen, cheap enough to paint

const BACKGROUND_COLOR = '#000000';
const LINE_COLOR = '#171718';
const AXIS_COLOR = '#2a2a2d';
const CELL_COLOR = '#ffffff';
const BRUSH_HALO_COLOR = 'rgba(0, 0, 0, 0.8)';
const BRUSH_RING_COLOR = 'rgba(255, 255, 255, 0.9)';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/** Zoom shown as a percentage, with decimals while it is far below 100%. */
const formatZoom = (scale) => {
    const percent = (scale / DEFAULT_SCALE) * 100;
    return `${percent >= 10 ? Math.round(percent) : percent.toFixed(1)}%`;
};

const MAX_STROKE_STEPS = 512; // a drag while fully zoomed out crosses thousands of cells

/**
 * Every cell crossed by the segment going from one cell to another.
 * `spacing` leaves gaps between the samples: a wide brush covers them anyway,
 * and it keeps a single drag from expanding into millions of cell tests.
 */
const lineBetween = (from, to, spacing = 1) => {
    const distance = Math.max(Math.abs(to[0] - from[0]), Math.abs(to[1] - from[1]));
    const steps = Math.min(Math.ceil(distance / spacing), MAX_STROKE_STEPS);
    if (steps === 0) return [to];

    const points = [];
    for (let i = 1; i <= steps; i += 1) {
        points.push([
            Math.round(from[0] + ((to[0] - from[0]) * i) / steps),
            Math.round(from[1] + ((to[1] - from[1]) * i) / steps),
        ]);
    }
    return points;
};

/** The disc of cells covered by a brush of `size` cells across, centred on a cell. */
const brushCells = (centerX, centerY, size) => {
    if (size <= 1) return [[centerX, centerY]];

    const radius = size / 2;
    const reach = Math.floor(radius);
    const cells = [];
    for (let dy = -reach; dy <= reach; dy += 1) {
        for (let dx = -reach; dx <= reach; dx += 1) {
            if (dx * dx + dy * dy <= radius * radius) cells.push([centerX + dx, centerY + dy]);
        }
    }
    return cells;
};

/** Bigger brushes grow faster, so the full range stays a few wheel notches away. */
const brushStep = (size) => Math.max(1, Math.round(size * 0.2));

function Grid({ cells, setCells }) {
    const canvasRef = useRef(null);
    // The camera lives in a ref: it changes on every mouse move and must not
    // trigger a React render, the canvas is redrawn by hand instead.
    const cameraRef = useRef({ x: 0, y: 0, scale: DEFAULT_SCALE });
    const cellsRef = useRef(cells);
    const dprRef = useRef(1);
    const frameRef = useRef(0);
    const pointersRef = useRef(new Map());
    const gestureRef = useRef(null);
    const strokeRef = useRef(null);
    const modeRef = useRef('draw');
    const brushRef = useRef(MIN_BRUSH);
    // Last pointer position, in client coordinates, for the brush preview.
    const hoverRef = useRef(null);

    const [mode, setMode] = useState('draw');
    const [zoom, setZoom] = useState(DEFAULT_SCALE);
    const [brush, setBrush] = useState(MIN_BRUSH);

    modeRef.current = mode;

    const draw = useCallback(() => {
        frameRef.current = 0;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const { x: camX, y: camY, scale } = cameraRef.current;

        ctx.setTransform(dprRef.current, 0, 0, dprRef.current, 0, 0);
        ctx.fillStyle = BACKGROUND_COLOR;
        ctx.fillRect(0, 0, width, height);

        // Screen position of the world origin (cell 0,0).
        const originX = width / 2 - camX * scale;
        const originY = height / 2 - camY * scale;

        const minCol = Math.floor(-originX / scale) - 1;
        const maxCol = Math.ceil((width - originX) / scale) + 1;
        const minRow = Math.floor(-originY / scale) - 1;
        const maxRow = Math.ceil((height - originY) / scale) + 1;

        if (scale >= GRID_LINES_FROM) {
            ctx.lineWidth = 1;
            ctx.strokeStyle = LINE_COLOR;
            ctx.beginPath();
            for (let col = minCol; col <= maxCol; col += 1) {
                const screenX = Math.round(originX + col * scale) + 0.5;
                ctx.moveTo(screenX, 0);
                ctx.lineTo(screenX, height);
            }
            for (let row = minRow; row <= maxRow; row += 1) {
                const screenY = Math.round(originY + row * scale) + 0.5;
                ctx.moveTo(0, screenY);
                ctx.lineTo(width, screenY);
            }
            ctx.stroke();

            // A discreet marker on the origin so the player never feels lost.
            ctx.strokeStyle = AXIS_COLOR;
            ctx.beginPath();
            const axisX = Math.round(originX) + 0.5;
            const axisY = Math.round(originY) + 0.5;
            ctx.moveTo(axisX, 0);
            ctx.lineTo(axisX, height);
            ctx.moveTo(0, axisY);
            ctx.lineTo(width, axisY);
            ctx.stroke();
        }

        // Only the living cells are stored, and only the visible ones are painted:
        // the cost of a frame follows the population, not the size of the world.
        ctx.fillStyle = CELL_COLOR;
        const size = scale >= GRID_LINES_FROM ? scale - 1 : Math.max(scale, 1);
        for (const key of cellsRef.current) {
            const [x, y] = parseKey(key);
            if (x < minCol || x > maxCol || y < minRow || y > maxRow) continue;
            ctx.fillRect(originX + x * scale, originY + y * scale, size, size);
        }

        // Brush preview, the way an image editor shows the size of its tool.
        // It is centred on the hovered cell so it frames exactly what a click paints.
        const hover = hoverRef.current;
        if (hover && modeRef.current === 'draw') {
            const rect = canvas.getBoundingClientRect();
            const cellX = Math.floor((hover.x - rect.left - originX) / scale);
            const cellY = Math.floor((hover.y - rect.top - originY) / scale);
            const centerX = originX + (cellX + 0.5) * scale;
            const centerY = originY + (cellY + 0.5) * scale;
            const radius = Math.max((brushRef.current / 2) * scale, 4);

            // A dark halo under a light ring keeps the circle readable over both
            // the empty background and a dense cluster of living cells.
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.lineWidth = 3;
            ctx.strokeStyle = BRUSH_HALO_COLOR;
            ctx.stroke();
            ctx.lineWidth = 1;
            ctx.strokeStyle = BRUSH_RING_COLOR;
            ctx.stroke();
        }
    }, []);

    const requestDraw = useCallback(() => {
        if (frameRef.current) return;
        frameRef.current = requestAnimationFrame(draw);
    }, [draw]);

    const resize = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const dpr = window.devicePixelRatio || 1;
        dprRef.current = dpr;
        canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
        canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
        draw();
    }, [draw]);

    const screenToWorld = useCallback((clientX, clientY) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const { x, y, scale } = cameraRef.current;
        return {
            x: x + (clientX - rect.left - rect.width / 2) / scale,
            y: y + (clientY - rect.top - rect.height / 2) / scale,
        };
    }, []);

    const screenToCell = useCallback((clientX, clientY) => {
        const world = screenToWorld(clientX, clientY);
        return [Math.floor(world.x), Math.floor(world.y)];
    }, [screenToWorld]);

    const moveCamera = useCallback((x, y) => {
        const camera = cameraRef.current;
        camera.x = clamp(x, -WORLD_LIMIT, WORLD_LIMIT);
        camera.y = clamp(y, -WORLD_LIMIT, WORLD_LIMIT);
        requestDraw();
    }, [requestDraw]);

    /** Zooms while keeping the world point under (clientX, clientY) in place. */
    const zoomAt = useCallback((factor, clientX, clientY) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const camera = cameraRef.current;
        const nextScale = clamp(camera.scale * factor, MIN_SCALE, MAX_SCALE);
        if (nextScale === camera.scale) return;

        const rect = canvas.getBoundingClientRect();
        const anchorX = clientX === undefined ? rect.left + rect.width / 2 : clientX;
        const anchorY = clientY === undefined ? rect.top + rect.height / 2 : clientY;
        const world = screenToWorld(anchorX, anchorY);

        camera.scale = nextScale;
        moveCamera(
            world.x - (anchorX - rect.left - rect.width / 2) / nextScale,
            world.y - (anchorY - rect.top - rect.height / 2) / nextScale,
        );
        setZoom(nextScale);
    }, [moveCamera, screenToWorld]);

    const resetView = useCallback(() => {
        cameraRef.current = { x: 0, y: 0, scale: DEFAULT_SCALE };
        setZoom(DEFAULT_SCALE);
        requestDraw();
    }, [requestDraw]);

    const paintCells = useCallback((targets) => {
        const stroke = strokeRef.current;
        if (!stroke) return;

        const size = brushRef.current;
        const fresh = [];
        for (const [x, y] of targets) {
            for (const [brushX, brushY] of brushCells(x, y, size)) {
                const key = cellKey(brushX, brushY);
                if (stroke.painted.has(key)) continue;
                stroke.painted.add(key);
                fresh.push(key);
            }
        }
        if (fresh.length === 0) return;

        setCells((previous) => {
            const next = new Set(previous);
            for (const key of fresh) {
                if (stroke.alive) next.add(key);
                else next.delete(key);
            }
            return next;
        });
    }, [setCells]);

    // Space is reserved for play/pause, panning goes through the hand mode,
    // the right button or the middle button.
    const isPanIntent = (event) => (
        modeRef.current === 'pan'
        || event.button === 1
        || event.button === 2
    );

    const handlePointerDown = (event) => {
        const canvas = canvasRef.current;
        canvas.setPointerCapture(event.pointerId);
        pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

        if (pointersRef.current.size === 2) {
            // Two fingers: pinch to zoom and drag to pan, whatever the current mode.
            strokeRef.current = null;
            const [a, b] = [...pointersRef.current.values()];
            const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
            gestureRef.current = {
                type: 'pinch',
                distance: Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)),
                world: screenToWorld(mid.x, mid.y),
                scale: cameraRef.current.scale,
            };
            return;
        }

        if (pointersRef.current.size > 2) return;

        if (isPanIntent(event)) {
            gestureRef.current = {
                type: 'pan',
                pointerId: event.pointerId,
                origin: { x: event.clientX, y: event.clientY },
                camera: { ...cameraRef.current },
            };
            return;
        }

        const cell = screenToCell(event.clientX, event.clientY);
        strokeRef.current = {
            // A stroke starting on a living cell erases, one starting on an
            // empty cell draws: the same drag never flickers cells on and off.
            alive: !cellsRef.current.has(cellKey(cell[0], cell[1])),
            painted: new Set(),
            last: cell,
        };
        paintCells([cell]);
    };

    const handlePointerMove = (event) => {
        hoverRef.current = { x: event.clientX, y: event.clientY };
        requestDraw();

        const pointers = pointersRef.current;
        if (!pointers.has(event.pointerId)) return;
        pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

        const gesture = gestureRef.current;

        if (gesture?.type === 'pinch' && pointers.size >= 2) {
            const canvas = canvasRef.current;
            const rect = canvas.getBoundingClientRect();
            const [a, b] = [...pointers.values()];
            const distance = Math.max(1, Math.hypot(a.x - b.x, a.y - b.y));
            const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
            const nextScale = clamp(gesture.scale * (distance / gesture.distance), MIN_SCALE, MAX_SCALE);

            cameraRef.current.scale = nextScale;
            moveCamera(
                gesture.world.x - (mid.x - rect.left - rect.width / 2) / nextScale,
                gesture.world.y - (mid.y - rect.top - rect.height / 2) / nextScale,
            );
            setZoom(nextScale);
            return;
        }

        if (gesture?.type === 'pan' && gesture.pointerId === event.pointerId) {
            const { scale } = cameraRef.current;
            moveCamera(
                gesture.camera.x - (event.clientX - gesture.origin.x) / scale,
                gesture.camera.y - (event.clientY - gesture.origin.y) / scale,
            );
            return;
        }

        const stroke = strokeRef.current;
        if (stroke) {
            const cell = screenToCell(event.clientX, event.clientY);
            if (cell[0] === stroke.last[0] && cell[1] === stroke.last[1]) return;
            paintCells(lineBetween(stroke.last, cell, Math.max(1, brushRef.current / 2)));
            stroke.last = cell;
        }
    };

    const endPointer = (event) => {
        const canvas = canvasRef.current;
        if (canvas.hasPointerCapture(event.pointerId)) {
            canvas.releasePointerCapture(event.pointerId);
        }
        pointersRef.current.delete(event.pointerId);
        strokeRef.current = null;

        if (pointersRef.current.size === 0) {
            gestureRef.current = null;
        } else if (gestureRef.current?.type === 'pinch') {
            // One finger left: keep panning from where that finger is now.
            const [pointerId, position] = [...pointersRef.current.entries()][0];
            gestureRef.current = {
                type: 'pan',
                pointerId,
                origin: { ...position },
                camera: { ...cameraRef.current },
            };
        }
    };

    useEffect(() => {
        cellsRef.current = cells;
        requestDraw();
    }, [cells, requestDraw]);

    useEffect(() => {
        const canvas = canvasRef.current;
        resize();

        const observer = new ResizeObserver(resize);
        observer.observe(canvas);
        window.addEventListener('resize', resize);

        // Wheel must be non passive to prevent the browser from scrolling/zooming.
        const handleWheel = (event) => {
            event.preventDefault();

            // Ctrl (or Cmd) turns the wheel into a brush size control.
            if (event.ctrlKey || event.metaKey) {
                const direction = event.deltaY > 0 ? -1 : 1;
                const next = clamp(
                    brushRef.current + direction * brushStep(brushRef.current),
                    MIN_BRUSH,
                    MAX_BRUSH,
                );
                if (next === brushRef.current) return;

                brushRef.current = next;
                setBrush(next);
                hoverRef.current = { x: event.clientX, y: event.clientY };
                requestDraw();
                return;
            }

            const unit = event.deltaMode === 1 ? 20 : event.deltaMode === 2 ? 400 : 1;
            zoomAt(Math.exp((-event.deltaY * unit) / 400), event.clientX, event.clientY);
        };
        canvas.addEventListener('wheel', handleWheel, { passive: false });

        // The preview must not linger once the pointer leaves the board.
        const handlePointerLeave = () => {
            hoverRef.current = null;
            requestDraw();
        };
        canvas.addEventListener('pointerleave', handlePointerLeave);

        const handleKeyDown = (event) => {
            if (event.target instanceof HTMLInputElement) return;

            const camera = cameraRef.current;
            const step = 120 / camera.scale; // always ~120px on screen

            switch (event.key) {
                case '+':
                case '=':
                    zoomAt(1.25);
                    break;
                case '-':
                case '_':
                    zoomAt(0.8);
                    break;
                case '0':
                    resetView();
                    break;
                case 'ArrowUp':
                    moveCamera(camera.x, camera.y - step);
                    event.preventDefault();
                    break;
                case 'ArrowDown':
                    moveCamera(camera.x, camera.y + step);
                    event.preventDefault();
                    break;
                case 'ArrowLeft':
                    moveCamera(camera.x - step, camera.y);
                    event.preventDefault();
                    break;
                case 'ArrowRight':
                    moveCamera(camera.x + step, camera.y);
                    event.preventDefault();
                    break;
                default:
                    break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', resize);
            canvas.removeEventListener('wheel', handleWheel);
            canvas.removeEventListener('pointerleave', handlePointerLeave);
            window.removeEventListener('keydown', handleKeyDown);
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
        };
    }, [moveCamera, requestDraw, resetView, resize, zoomAt]);

    // Switching to the hand hides the preview, switching back brings it out.
    useEffect(() => {
        requestDraw();
    }, [mode, requestDraw]);

    const panning = mode === 'pan';

    return (
        <div className="grid">
            <canvas
                ref={canvasRef}
                className={`grid_canvas ${panning ? 'is_panning' : ''}`}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={endPointer}
                onPointerCancel={endPointer}
                onContextMenu={(event) => event.preventDefault()}
            />

            <div className="grid_viewport_controls">
                <button
                    type="button"
                    data-tooltip={panning ? 'Switch to draw mode' : `Switch to move mode · brush ${brush}`}
                    onClick={() => setMode(panning ? 'draw' : 'pan')}
                >
                    {panning ? <Hand size={18} /> : <Pen size={18} />}
                </button>
                <button type="button" data-tooltip="Zoom out" onClick={() => zoomAt(0.8)}>−</button>
                <button
                    type="button"
                    className="grid_zoom_level"
                    data-tooltip="Back to the origin"
                    onClick={resetView}
                >
                    {formatZoom(zoom)}
                </button>
                <button type="button" data-tooltip="Zoom in" onClick={() => zoomAt(1.25)}>+</button>
            </div>

            <p className="grid_hint">
                wheel : zoom · ctrl + wheel : brush · right click + drag : move · space : play / pause
            </p>
        </div>
    );
}

export default Grid;
