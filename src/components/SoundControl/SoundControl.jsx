import React, { useRef, useState } from 'react';
import { Music, Volume2, VolumeOff } from 'lucide-react';
import './SoundControl.css';

function SoundControl() {
    const audioRef = useRef(null);
    const [isMuted, setIsMuted] = useState(true);
    const [volume, setVolume] = useState(30);

    const playMusic = () => {
        audioRef.current.volume = volume / 100;
        audioRef.current.play();
        setIsMuted(false);
    };

    const muteMusic = () => {
        audioRef.current.pause();
        setIsMuted(true);
    };

    const changeVolume = (event) => {
        const nextVolume = Number(event.target.value);
        setVolume(nextVolume);
        audioRef.current.volume = nextVolume / 100;
    };

    return (
        <div className='sound_controls'>
            <audio ref={audioRef} type="audio/mpeg" src='/bg_music.mp3' loop />

            <div className='sound_menu'>
                <button
                    type="button"
                    className={!isMuted ? 'active' : ''}
                    data-tooltip="Play the music"
                    onClick={playMusic}
                >
                    <Volume2 size={18} />
                </button>
                <button
                    type="button"
                    className={isMuted ? 'active' : ''}
                    data-tooltip="Mute the music"
                    onClick={muteMusic}
                >
                    <VolumeOff size={18} />
                </button>
                <span className='sound_slider' data-tooltip="Adjust the volume">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={changeVolume}
                    />
                </span>
            </div>

            <Music size={18} />
            <span> Ambiant Music : Yule - Ian Post</span>
        </div>
    );
};

export default SoundControl;
