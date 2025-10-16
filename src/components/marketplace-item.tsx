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
import { Package, IndianRupee, MapPin, Phone } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="h-full"
    >
      <Card className="rounded-2xl overflow-hidden flex flex-col h-full">
        {image && (
          <div className="relative aspect-video">
            <Image
              src={image.imageUrl}
              alt={t(image.description)}
              fill
              className="object-cover"
              data-ai-hint={image.imageHint}
            />
          </div>
        )}
        <CardHeader>
          <CardTitle>{t(name)}</CardTitle>
          <CardDescription>{type === 'sale' ? `${t('Sold by')} ${t(seller || '')}` : `${t('Wanted by')} ${t(buyer || '')}`}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow space-y-2">
           <div className="flex items-center text-sm text-muted-foreground">
              <Package className="mr-2 h-4 w-4 flex-shrink-0" />
              <span>{t('Quantity')}: {t(quantity)}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
              <IndianRupee className="mr-2 h-4 w-4 flex-shrink-0" />
              <span>{t('Price')}: {t(price)}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
              <span>{t('Location')}: {t(location)}</span>
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
    </motion.div>
  );
}
