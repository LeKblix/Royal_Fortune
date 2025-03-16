
import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

const BackgroundMusic: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Create audio element once during component mount
    audioRef.current = new Audio('/thebeats.mp3');
    
    if (audioRef.current) {
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
      audioRef.current.preload = 'auto';
      
      // Add event listeners for better error handling
      audioRef.current.addEventListener('canplaythrough', () => {
        console.log('Audio loaded successfully');
        setAudioLoaded(true);
      });
      
      audioRef.current.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        toast({
          title: "Erreur audio",
          description: "Impossible de charger la musique de fond.",
          variant: "destructive"
        });
        setAudioLoaded(false);
      });
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current.remove();
        audioRef.current = null;
      }
    };
  }, [toast]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      toast({
        title: "Musique désactivée",
        description: "La musique de fond a été coupée.",
      });
    } else {
      // Use a promise to handle play() failures
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            toast({
              title: "Musique activée",
              description: "La musique de fond a été lancée.",
            });
          })
          .catch(error => {
            console.error('Playback failed:', error);
            toast({
              title: "Erreur de lecture",
              description: "La musique ne peut pas être lue. Vérifiez que le fichier /public/thebeats.mp3 existe.",
              variant: "destructive"
            });
            setIsPlaying(false);
          });
      }
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="fixed bottom-4 right-4 bg-black/20 backdrop-blur-sm border border-white/10 text-white hover:bg-white/10 z-50"
      onClick={toggleMusic}
      title={isPlaying ? "Couper la musique" : "Jouer la musique"}
      disabled={!audioLoaded}
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
