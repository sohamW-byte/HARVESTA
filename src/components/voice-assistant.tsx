
'use client';

import 'regenerator-runtime/runtime';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, MicOff, Loader2, Bot } from 'lucide-react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { processVoiceCommand } from '@/ai/flows/voice-assistant-flow';

export function VoiceAssistant() {
  const router = useRouter();
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [spokenResponse, setSpokenResponse] = useState('');
  const [lastCommand, setLastCommand] = useState('');
  const [isMounted, setIsMounted] = useState(false);


  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const speak = useCallback((text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const handleToggleListen = () => {
    if (isListening) {
      SpeechRecognition.stopListening();
      setIsListening(false);
    } else {
      resetTranscript();
      setSpokenResponse('');
      setLastCommand('');
      SpeechRecognition.startListening({ continuous: false, language: 'en-IN' });
      setIsListening(true);
      setIsDialogOpen(true);
    }
  };

  useEffect(() => {
    setIsListening(listening);
    if (!listening && transcript) {
      // User has stopped speaking
      setIsProcessing(true);
      setLastCommand(transcript);
      processVoiceCommand({ command: transcript })
        .then((result) => {
          setSpokenResponse(result.response);
          speak(result.response);

          if (result.intent === 'navigate' && result.target) {
            // Wait a moment before navigating to allow user to hear response
            setTimeout(() => {
                router.push(`/dashboard/${result.target}`);
                setIsDialogOpen(false);
            }, 1500);
          }
        })
        .catch((err) => {
          console.error(err);
          const errorMsg = "Sorry, I had trouble understanding that.";
          setSpokenResponse(errorMsg);
          speak(errorMsg);
        })
        .finally(() => {
          setIsProcessing(false);
          resetTranscript();
        });
    }
  }, [listening, transcript, resetTranscript, router, speak]);

  if (!isMounted || !browserSupportsSpeechRecognition) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleToggleListen}
            className={cn(
              "fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg z-50 transition-colors duration-300",
              isListening ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"
            )}
            size="icon"
          >
            {isListening ? (
              <MicOff className="h-8 w-8" />
            ) : (
              <Mic className="h-8 w-8" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>{isListening ? 'Stop Listening' : 'Activate Voice Assistant'}</p>
        </TooltipContent>
      </Tooltip>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot />
              Harvesta Assistant
            </DialogTitle>
            <DialogDescription>
              {isListening ? "I'm listening..." : "How can I help you today?"}
            </DialogDescription>
          </DialogHeader>
          <div className="py-8 text-center space-y-4">
            <div className="text-2xl font-semibold h-14">
                {isProcessing ? <Loader2 className="h-8 w-8 mx-auto animate-spin" /> : transcript || <span className="text-muted-foreground">...</span>}
            </div>
            {lastCommand && <p className="text-sm text-muted-foreground">You said: "{lastCommand}"</p>}
            {spokenResponse && <p className="text-lg text-primary mt-4">{spokenResponse}</p>}
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
