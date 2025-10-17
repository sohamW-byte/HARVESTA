'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, Sparkles, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

// In a real app, these would come from Firebase Storage, Genkit, etc.
// For this demo, we'll simulate the process.

export default function ImageExamplesPage() {
  const { toast } = useToast();
  const [userUpload, setUserUpload] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dynamicSeed, setDynamicSeed] = useState('example-seed');
  const [dynamicImageUrl, setDynamicImageUrl] = useState('https://picsum.photos/seed/example-seed/600/400');
  const [aiPrompt, setAiPrompt] = useState('a vibrant field of sunflowers at sunset');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    // Simulate upload to Firebase Storage
    setTimeout(() => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserUpload(e.target?.result as string);
        setIsUploading(false);
        toast({ title: 'Upload Successful', description: 'Image is now displayed.' });
      };
      reader.readAsDataURL(file);
    }, 1500);
  };

  const handleSeedChange = () => {
    const newSeed = `seed-${Date.now()}`;
    setDynamicSeed(newSeed);
    setDynamicImageUrl(`https://picsum.photos/seed/${newSeed}/600/400`);
  };

  const handleGenerateImage = () => {
    if (!aiPrompt) return;
    setIsGenerating(true);
    // Simulate call to a Genkit flow
    setTimeout(() => {
      // In a real app, the response from Genkit would be a data URI.
      // We'll use a dynamic Picsum URL to simulate a unique generated image.
      const generatedUrl = `https://picsum.photos/seed/${aiPrompt.replace(/\s/g, '-')}/600/400`;
      setGeneratedImage(generatedUrl);
      setIsGenerating(false);
      toast({ title: 'Image Generated', description: 'The AI-powered image is now ready.' });
    }, 2500);
  };

  return (
    <div className="container mx-auto py-8 space-y-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dynamic Image Handling</h1>
        <p className="text-muted-foreground">Examples of different ways to load images dynamically.</p>
      </div>

      {/* Method 1: User Uploads */}
      <Card>
        <CardHeader>
          <CardTitle>Method 1: User Image Uploads</CardTitle>
          <CardDescription>
            The most common method for dynamic images like profile pictures or product photos. The image is uploaded to a cloud service like Firebase Storage, and its URL is saved.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file-upload">Select an image to upload</Label>
            <Input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} disabled={isUploading} />
          </div>
          <div className="border-2 border-dashed rounded-lg p-4 min-h-[200px] flex items-center justify-center bg-muted/50">
            {isUploading ? (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p>Simulating upload...</p>
              </div>
            ) : userUpload ? (
              <Image src={userUpload} alt="User upload preview" width={400} height={300} className="rounded-md object-contain max-h-60" />
            ) : (
              <div className="text-center text-muted-foreground">
                <Upload className="mx-auto h-8 w-8 mb-2" />
                <p>Your uploaded image will appear here.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Method 2: Dynamic Placeholders */}
      <Card>
        <CardHeader>
          <CardTitle>Method 2: Dynamic Placeholders via API</CardTitle>
          <CardDescription>
            Construct an image URL with parameters (like a seed or ID) to fetch images from a service like Picsum Photos. Useful for development and placeholders.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button onClick={handleSeedChange}>Generate New Image</Button>
            <p className="text-sm text-muted-foreground">Current Seed: <span className="font-mono">{dynamicSeed}</span></p>
          </div>
          <div className="border-2 border-dashed rounded-lg p-4 min-h-[200px] flex items-center justify-center bg-muted/50">
             <Image src={dynamicImageUrl} alt="Dynamic placeholder" width={600} height={400} className="rounded-md object-contain max-h-60" key={dynamicSeed} />
          </div>
        </CardContent>
      </Card>

      {/* Method 3: AI Generation */}
      <Card>
        <CardHeader>
          <CardTitle>Method 3: AI-Generated Images</CardTitle>
          <CardDescription>
            Use Genkit to generate images from a text prompt. The result is typically a `data URI` that can be displayed directly or stored for later use.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ai-prompt">Enter a prompt for the AI</Label>
            <div className="flex gap-2">
              <Input id="ai-prompt" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder="e.g., a horse in a spacesuit" />
              <Button onClick={handleGenerateImage} disabled={isGenerating}>
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generate
              </Button>
            </div>
          </div>
          <div className="border-2 border-dashed rounded-lg p-4 min-h-[200px] flex items-center justify-center bg-muted/50">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p>AI is creating your image...</p>
              </div>
            ) : generatedImage ? (
              <Image src={generatedImage} alt={aiPrompt} width={600} height={400} className="rounded-md object-contain max-h-60" />
            ) : (
              <div className="text-center text-muted-foreground">
                <ImageIcon className="mx-auto h-8 w-8 mb-2" />
                <p>Your AI-generated image will appear here.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
