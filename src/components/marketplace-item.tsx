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
import { Package, IndianRupee, MessageSquare, MapPin } from "lucide-react";

interface MarketplaceItemProps {
  name: string;
  quantity: string;
  price: string;
  location: string;
  imageId?: string;
  seller?: string;
  buyer?: string;
  type: 'sale' | 'wanted';
}

export function MarketplaceItem({ name, quantity, price, location, imageId, seller, buyer, type }: MarketplaceItemProps) {
  const image = imageId ? PlaceHolderImages.find(img => img.id === imageId) : null;
  
  return (
    <Card className="rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 bg-card/60 backdrop-blur-sm overflow-hidden flex flex-col">
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
        <CardDescription>{type === 'sale' ? `Sold by ${seller}` : `Wanted by ${buyer}`}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
         <div className="flex items-center text-sm text-muted-foreground">
            <Package className="mr-2 h-4 w-4" />
            <span>Quantity: {quantity}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
            <IndianRupee className="mr-2 h-4 w-4" />
            <span>Price: {price}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-2 h-4 w-4" />
            <span>Location: {location}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
            <MessageSquare className="mr-2 h-4 w-4" />
            {type === 'sale' ? 'Contact Seller' : 'Contact Buyer'}
        </Button>
      </CardFooter>
    </Card>
  );
}
