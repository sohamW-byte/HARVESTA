'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// Declare the SpeechRecognition interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface SpeechRecognitionHook {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  isUnsupported: boolean;
  error: string | null;
}

export const useSpeechRecognition = (): SpeechRecognitionHook => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any | null>(null);

  const isUnsupported =
    typeof window === 'undefined' ||
    !(window.SpeechRecognition || window.webkitSpeechRecognition);

  useEffect(() => {
    if (isUnsupported) {
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current;

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPart;
        } else {
          interimTranscript += transcriptPart;
        }
      }
      setTranscript(finalTranscript || interimTranscript);
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'no-speech') {
        setError('No speech was detected. Please try again.');
      } else if (event.error === 'audio-capture') {
        setError('Microphone is not available. Please check your hardware.');
      } else if (event.error === 'not-allowed') {
        setError('Microphone access was denied. Please enable it in your browser settings.');
      } else {
        setError(`An error occurred: ${event.error}`);
      }
      console.error('Speech recognition error:', event.error);
    };

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      setTranscript('');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [isUnsupported]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      if (error === 'Microphone access was denied. Please enable it in your browser settings.') {
          // Don't try to start if permission is denied.
          return;
      }
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Error starting speech recognition:", e);
      }
    }
  }, [isListening, error]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  return { isListening, transcript, startListening, stopListening, isUnsupported, error };
};
