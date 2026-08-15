/**
 * Sparse Game of Life engine.
 *
 * The board is not stored as a fixed size matrix but as a Set of the living
 * cells only, each one keyed by its "x,y" coordinates. Coordinates are plain
 * integers that can be negative, so the world has no borders: only the living
 * cells cost memory, wherever they are.
 */

export const cellKey = (x, y) => `${x},${y}`;

export const parseKey = (key) => {
    const separator = key.indexOf(',');
    return [Number(key.slice(0, separator)), Number(key.slice(separator + 1))];
};

/**
 * Computes the next generation.
 *
 * Only the living cells and their direct neighbours can change state, so we
 * count the neighbours of every living cell instead of scanning the (infinite)
 * board. Cost is O(living cells) instead of O(width * height).
 */
export const nextGeneration = (cells) => {
    const neighborCounts = new Map();

    for (const key of cells) {
        const [x, y] = parseKey(key);
        for (let dx = -1; dx <= 1; dx += 1) {
            for (let dy = -1; dy <= 1; dy += 1) {
                if (dx === 0 && dy === 0) continue;
                const neighborKey = cellKey(x + dx, y + dy);
                neighborCounts.set(neighborKey, (neighborCounts.get(neighborKey) || 0) + 1);
            }
        }
    }

    const next = new Set();
    for (const [key, count] of neighborCounts) {
        // A living cell survives with 2 or 3 neighbours, a dead one is born with exactly 3.
        if (count === 3 || (count === 2 && cells.has(key))) {
            next.add(key);
        }
    }

    return next;
};
