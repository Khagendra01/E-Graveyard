import React, { useEffect, useState } from "react";
import { SpeakerLoudIcon, SpeakerOffIcon } from "@radix-ui/react-icons";

interface AudioPlayerProps {
  src: string;
  volume?: number;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, volume = 0.1 }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audioElement = new Audio(src);
    audioElement.volume = volume;
    setAudio(audioElement);

    // Play the audio by default when the component mounts
    audioElement.play().catch((error) => {
      console.error("Error playing audio:", error);
    });

    return () => {
      audioElement.pause();
    };
  }, [src, volume]);

  const handleMusic = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play().catch((error) => {
          console.error("Error playing audio:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <button onClick={handleMusic}>
      {isPlaying ? (
        <SpeakerLoudIcon className="w-8 h-8 inline-block" />
      ) : (
        <SpeakerOffIcon className="w-8 h-8 inline-block" />
      )}
    </button>
  );
};

export default AudioPlayer;
