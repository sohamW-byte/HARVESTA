import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Package, IndianRupee, MessageSquare, MapPin, Phone } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

interface MarketplaceItemProps {
  name: string;
  quantity: string;
  price: string;
  location: string;
  imageId?: string;
  seller?: string;
  buyer?: string;
  type: 'sale' | 'wanted';
  contactInfo?: string;
}

export function MarketplaceItem({ name, quantity, price, location, imageId, seller, buyer, type, contactInfo }: MarketplaceItemProps) {
  const image = imageId ? PlaceHolderImages.find(img => img.id === imageId) : PlaceHolderImages.find(i => i.id.includes('produce'));
  const { t } = useTranslation();
  
  return (
    <Card className="rounded-2xl overflow-hidden flex flex-col">
      {image && (
        <div className="relative aspect-video">
          <Image
            src={image.imageUrl}
            alt={image.description}
            fill
            className="object-cover"
            data-ai-hint={image.imageHint}
          />
        </div>
      )}
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{type === 'sale' ? `${t('Sold by')} ${seller}` : `${t('Wanted by')} ${buyer}`}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
         <div className="flex items-center text-sm text-muted-foreground">
            <Package className="mr-2 h-4 w-4 flex-shrink-0" />
            <span>{t('Quantity')}: {quantity}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
            <IndianRupee className="mr-2 h-4 w-4 flex-shrink-0" />
            <span>{t('Price')}: {price}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
            <span>{t('Location')}: {location}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" asChild>
            <a href={`tel:${contactInfo}`}>
                <Phone className="mr-2 h-4 w-4" />
                {type === 'sale' ? t('Contact Seller') : t('Contact Buyer')}
            </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
