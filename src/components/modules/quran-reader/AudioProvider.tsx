"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Verse } from "./types";

interface AudioContextType {
  currentVerseId: string | null;
  isPlaying: boolean;
  isLoading: boolean;
  play: (verse: Verse, playlist: Verse[]) => void;
  pause: () => void;
  toggle: (verse: Verse, playlist: Verse[]) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentVerseId, setCurrentVerseId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [playlist, setPlaylist] = useState<Verse[]>([]);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const getVerseKey = (verse: Verse) => `${verse.surahId}-${verse.id}`;

  const playVerse = (verse: Verse) => {
    if (!verse.audio) return;

    setIsLoading(true);
    setCurrentVerseId(getVerseKey(verse));

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = verse.audio;
    } else {
      audioRef.current = new Audio(verse.audio);
    }

    audioRef.current.play()
      .then(() => {
        setIsLoading(false);
        setIsPlaying(true);
      })
      .catch((err) => {
        console.error("Playback error:", err);
        setIsLoading(false);
        setIsPlaying(false);
      });

    audioRef.current.onended = () => {
      playNext(verse);
    };
  };

  const playNext = (currentVerse: Verse) => {
    const currentIndex = playlist.findIndex(v => getVerseKey(v) === getVerseKey(currentVerse));
    if (currentIndex !== -1 && currentIndex < playlist.length - 1) {
      const nextVerse = playlist[currentIndex + 1];
      playVerse(nextVerse);
    } else {
      setIsPlaying(false);
      setCurrentVerseId(null);
    }
  };

  const play = (verse: Verse, newPlaylist: Verse[]) => {
    setPlaylist(newPlaylist);
    playVerse(verse);
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggle = (verse: Verse, newPlaylist: Verse[]) => {
    const verseKey = getVerseKey(verse);
    if (currentVerseId === verseKey && isPlaying) {
      pause();
    } else {
      play(verse, newPlaylist);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <AudioContext.Provider value={{ currentVerseId, isPlaying, isLoading, play, pause, toggle }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
