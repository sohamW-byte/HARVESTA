
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, MicOff, Loader2, Bot, AlertTriangle } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

// Declare the SpeechRecognition interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function VoiceAssistant() {
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [spokenResponse, setSpokenResponse] = useState('');
  const [transcript, setTranscript] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null);

  const recognitionRef = useRef<any | null>(null);

  useEffect(() => {
    setIsMounted(true);
    // Check for SpeechRecognition API support first
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      setHasMicPermission(false);
      console.error("Browser does not support the Web Speech API.");
    }
  }, []);

  const initializeSpeechRecognition = useCallback(() => {
    if (recognitionRef.current) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
      setSpokenResponse('');
      setIsDialogOpen(true);
    };

    recognition.onend = () => {
      setIsListening(false);
      // Let dialog close naturally or by user action
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setTranscript(finalTranscript);
        handleProcessCommand(finalTranscript);
      } else {
        const interim = event.results[0]?.[0]?.transcript || '';
        setTranscript(interim);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setHasMicPermission(false);
        toast({
          variant: 'destructive',
          title: 'Voice Assistant Error',
          description: 'Microphone access was denied. Please enable it in your browser settings.',
        });
      }
      setIsListening(false);
      // setIsDialogOpen(false);
    };
    
    recognitionRef.current = recognition;
  }, [toast]);


  const handleMicPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasMicPermission(false);
        toast({ variant: 'destructive', title: 'Unsupported Browser', description: 'Your browser does not support microphone access.'});
        return false;
      }
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setHasMicPermission(true);
        initializeSpeechRecognition();
        return true;
      } catch (error) {
        console.error("Microphone access denied:", error);
        setHasMicPermission(false);
        toast({
            variant: 'destructive',
            title: 'Microphone Access Denied',
            description: 'Please enable microphone permissions in your browser settings to use the voice assistant.',
            duration: 5000,
        });
        return false;
      }
  };


  const handleProcessCommand = async (command: string) => {
    if (!command || isProcessing) return;

    setIsProcessing(true);
    try {
      const result = await processVoiceCommand({ command });
      setSpokenResponse(result.response);
      speak(result.response);

      if (result.intent === 'navigate' && result.target) {
        setTimeout(() => {
          router.push(`/dashboard/${result.target}`);
          setIsDialogOpen(false);
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      const errorMsg = "Sorry, I had trouble understanding that.";
      setSpokenResponse(errorMsg);
      speak(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const speak = useCallback((text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const handleToggleListen = async () => {
    let permissionGranted = hasMicPermission;

    // If permission status is unknown, request it now.
    if (permissionGranted === null) {
        permissionGranted = await handleMicPermission();
    }
    
    // If permission is false after checking, do nothing.
    if (!permissionGranted) {
        setIsDialogOpen(true); // Open dialog to show the error
        return;
    }
    
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if (!recognitionRef.current) {
        initializeSpeechRecognition();
      }
      recognitionRef.current?.start();
    }
  };
  
  if (!isMounted) {
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
              isListening ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90",
              hasMicPermission === false && "bg-muted-foreground hover:bg-muted-foreground/90 cursor-not-allowed"
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
          {hasMicPermission === false 
            ? <p>Microphone access is required</p>
            : <p>{isListening ? 'Stop Listening' : 'Activate Voice Assistant'}</p>
          }
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
              {hasMicPermission === false ? "Microphone access is required." : isListening && !isProcessing ? "I'm listening..." : isProcessing ? "Thinking..." : "How can I help you today?"}
            </DialogDescription>
          </DialogHeader>
          <div className="py-8 text-center space-y-4">
             {hasMicPermission === false ? (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Microphone Blocked</AlertTitle>
                    <AlertDescription>
                        Please enable microphone permissions in your browser's site settings to use the voice assistant.
                    </AlertDescription>
                </Alert>
             ) : (
                <>
                    <div className="text-2xl font-semibold h-14">
                        {isProcessing && !spokenResponse ? <Loader2 className="h-8 w-8 mx-auto animate-spin" /> : transcript || <span className="text-muted-foreground">...</span>}
                    </div>
                    {spokenResponse && <p className="text-lg text-primary mt-4">{spokenResponse}</p>}
                </>
             )}
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
