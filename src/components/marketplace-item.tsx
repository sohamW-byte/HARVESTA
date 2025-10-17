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
import { Package, IndianRupee, MapPin, ShoppingCart, Info } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


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
  
  const itemVariants = {
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0 }
  };

  const commissionRate = 0.05; // 5%
  const priceValue = parseFloat(price.replace(/[^0-9.-]+/g,""));
  const quantityValue = parseFloat(quantity.replace(/[^0-9.-]+/g,""));
  const totalAmount = priceValue * quantityValue;
  const commission = totalAmount * commissionRate;


  const handleBuy = () => {
    // In a real app, this would trigger an order creation flow
    console.log(`Order placed for ${quantity} of ${name}`);
  }

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300 }}
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
          {type === 'sale' ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="w-full">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {t('Buy Now')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Your Order</AlertDialogTitle>
                  <AlertDialogDescription>
                    You are about to place an order for <span className="font-semibold">{quantity}</span> of <span className="font-semibold">{name}</span>.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                        <span>Total Amount:</span>
                        <span className="font-medium">₹{totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center text-primary">
                        <div className="flex items-center gap-1">
                            <Info className="h-3 w-3" />
                            <span>Harvesta Commission (5%):</span>
                        </div>
                        <span className="font-medium">₹{commission.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                        <span>Grand Total:</span>
                        <span>₹{(totalAmount + commission).toLocaleString('en-IN')}</span>
                    </div>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleBuy}>Confirm Order</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
             <Button className="w-full" asChild>
                 <a href={`tel:${contactInfo}`}>
                    <Info className="mr-2 h-4 w-4" />
                    {t('View Details')}
                 </a>
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
