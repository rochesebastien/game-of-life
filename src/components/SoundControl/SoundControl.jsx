import React, { useRef, useState, useEffect } from 'react';
import './SoundControl.css';

function SoundControl() {
    const audioRef = useRef(null);
    const [isMuted, setIsMuted] = useState(true);

    const toggleMute = () => {
        if (!isMuted) {
            audioRef.current.pause();
            setIsMuted(true);
        } else {
            audioRef.current.play();
            setIsMuted(false);
            audioRef.current.volume = 0.3;
        }
    };

    return (
        <div className='sound_controls' onClick={toggleMute}>
            <audio ref={audioRef} type="audio/mpeg" src='/bg_music.mp3' autoPlay />
            <img src={isMuted ? '/icons/volume-off.svg' : '/icons/volume-on.svg'} alt="On/Off" />
            <span> Ambiant Music : Yule - Ian Post</span>      
        </div>
    );
};

export default SoundControl;