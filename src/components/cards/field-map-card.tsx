import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { Sprout } from 'lucide-react';

export function FieldMapCard() {
  const fieldMapImage = PlaceHolderImages.find(img => img.id === 'field-map');
  const cropImages = [
    PlaceHolderImages.find(img => img.id === 'produce-rice'),
    PlaceHolderImages.find(img => img.id === 'produce-wheat'),
    PlaceHolderImages.find(img => img.id === 'produce-oranges'),
  ].filter(Boolean); // Filter out any undefined images

  return (
    <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 h-full bg-card/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Main Field</CardTitle>
        <CardDescription>
          Satellite view and currently cultivated crops.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
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
        <div>
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-3">
                <Sprout className="h-4 w-4" />
                <span>Crops in this Field</span>
            </h3>
            <div className="grid grid-cols-3 gap-4">
                {cropImages.map((image) => (
                    image && (
                        <div key={image.id} className="relative aspect-square overflow-hidden rounded-md group">
                            <Image 
                                src={image.imageUrl}
                                alt={image.description}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                data-ai-hint={image.imageHint}
                            />
                             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <Badge variant="secondary" className="absolute bottom-2 left-2">{image.description}</Badge>
                        </div>
                    )
                ))}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
