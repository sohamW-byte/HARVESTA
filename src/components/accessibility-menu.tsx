"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Accessibility, Sun, Moon, Type } from 'lucide-react';
import { useAccessibility } from '@/hooks/use-accessibility';

export function AccessibilityMenu() {
  const {
    fontSize,
    setFontSize,
    colorInversion,
    setColorInversion,
  } = useAccessibility();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Accessibility className="h-5 w-5" />
          <span className="sr-only">Toggle accessibility settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel>Accessibility Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Type className="mr-2 h-4 w-4" />
            <span>Font Size</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
             <DropdownMenuItem onSelect={() => setFontSize('sm')}>Small</DropdownMenuItem>
             <DropdownMenuItem onSelect={() => setFontSize('base')}>Default</DropdownMenuItem>
             <DropdownMenuItem onSelect={() => setFontSize('lg')}>Large</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <div
          className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
          onSelect={(e) => e.preventDefault()} // Prevent closing the menu
        >
            <Sun className="mr-2 h-4 w-4" />
            <Label htmlFor="color-inversion-switch" className="flex-1">
                Color Inversion
            </Label>
            <Switch
                id="color-inversion-switch"
                checked={colorInversion}
                onCheckedChange={setColorInversion}
            />
        </div>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}
