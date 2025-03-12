
import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';

const BackgroundMusic = () => {
  const [audio] = useState(new Audio('/background-music.mp3'));
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    audio.loop = true;
    audio.volume = 0.3;
    
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [audio]);

  const toggleMusic = () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="fixed bottom-4 right-4 bg-black/20 backdrop-blur-sm border border-white/10 text-white hover:bg-white/10"
      onClick={toggleMusic}
    >
      {isPlaying ? (
        <Volume2 className="h-5 w-5" />
      ) : (
        <VolumeX className="h-5 w-5" />
      )}
    </Button>
  );
};

export default BackgroundMusic;
