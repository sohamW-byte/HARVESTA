'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Input, type InputProps } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, AlertTriangle } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export interface VoiceInputProps extends Omit<InputProps, 'onChange'> {
  onValueChange: (value: string) => void;
}

const VoiceInput = React.forwardRef<HTMLInputElement, VoiceInputProps>(
  ({ className, onValueChange, value, ...props }, ref) => {
    const {
      isListening,
      transcript,
      startListening,
      stopListening,
      isUnsupported,
      error,
    } = useSpeechRecognition();

    React.useEffect(() => {
      if (transcript) {
        onValueChange(transcript);
      }
    }, [transcript, onValueChange]);

    const handleMicClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    }

    const hasError = isUnsupported || !!error;

    return (
      <div className="relative w-full">
        <Input
          ref={ref}
          className={cn('pr-10', className)}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          {...props}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          <TooltipProvider>
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'h-7 w-7 rounded-full',
                    isListening && 'bg-red-500/20 text-red-500',
                    hasError && 'bg-yellow-500/20 text-yellow-600'
                  )}
                  onClick={handleMicClick}
                  disabled={props.disabled || isUnsupported}
                >
                  {hasError ? (
                     <AlertTriangle className="h-4 w-4" />
                  ) : isListening ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {isListening ? 'Stop listening' : 'Use microphone'}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                {hasError 
                    ? <p>{error || 'Speech recognition not supported.'}</p>
                    : <p>{isListening ? 'Stop listening' : 'Start listening'}</p>
                }
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    );
  }
);

VoiceInput.displayName = 'VoiceInput';

export { VoiceInput };
