import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function FieldMapCard() {
  const fieldMapImage = PlaceHolderImages.find(img => img.id === 'field-map');

  return (
    <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 h-full bg-card/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Main Field</CardTitle>
        <CardDescription>Satellite view of your primary cultivation area.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-[4/3] relative overflow-hidden rounded-lg">
          {fieldMapImage ? (
            <Image
              src={fieldMapImage.imageUrl}
              alt={fieldMapImage.description}
              fill
              className="object-cover"
              data-ai-hint={fieldMapImage.imageHint}
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">Map image not available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
