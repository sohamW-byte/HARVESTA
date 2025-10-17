'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketplaceItem } from "@/components/marketplace-item";
import { useTranslation } from "@/hooks/use-translation";
import { motion } from "framer-motion";

const forSaleItems = [
    { id: 1, name: "Sona Masoori Rice", quantity: "10 quintal", price: "₹2,800/qtl", seller: "Ramesh Kumar", location: "Nalgonda, TS", imageId: "produce-rice", contactInfo: "9876543210" },
    { id: 2, name: "Nagpur Oranges", quantity: "50 kg", price: "₹40/kg", seller: "Sunita Deshpande", location: "Nagpur, MH", imageId: "produce-oranges", contactInfo: "9876543211" },
    { id: 3, name: "Organic Turmeric", quantity: "5 quintal", price: "₹8,000/qtl", seller: "Vijay Farms", location: "Erode, TN", imageId: "produce-tea", contactInfo: "9876543212" },
    { id: 4, name: "Alphonso Mangoes", quantity: "10 dozen", price: "₹1,200/dozen", seller: "Konkan Orchards", location: "Ratnagiri, MH", imageId: "produce-mangoes", contactInfo: "9876543213" },
    { id: 5, name: "Shimla Apples", quantity: "20 boxes", price: "₹1,500/box", seller: "Himalayan Fresh", location: "Shimla, HP", imageId: "produce-apples", contactInfo: "9876543214" },
    { id: 6, name: "Darjeeling Tea", quantity: "100 kg", price: "₹2,500/kg", seller: "Glenburn Tea Estate", location: "Darjeeling, WB", imageId: "produce-tea", contactInfo: "9876543215" },
];


const wantedItems = [
    { id: 1, name: "Organic Turmeric", quantity: "5 quintal", price: "Up to ₹8,000/qtl", buyer: "Spice India Exports", location: "Erode, TN", imageId: "produce-tea" },
    { id: 2, name: "Fresh Cashews", quantity: "1 tonne", price: "Up to ₹70,000/qtl", buyer: "Konkan Dry Fruits", location: "Panaji, Goa", imageId: "produce-cashews" },
    { id: 3, name: "Long-staple Cotton", quantity: "50 tonne", price: "Market Rate", buyer: "National Textiles", location: "Coimbatore, TN", imageId: "produce-rice" },
    { id: 4, name: "Malka Masur Dal", quantity: "10 quintal", price: "Up to ₹6,500/qtl", buyer: "Delhi Grain Traders", location: "New Delhi, DL", imageId: "produce-onions" },
    { id: 5, name: "Soybeans", quantity: "100 tonne", price: "Market Rate", buyer: "Agro Processors Inc.", location: "Indore, MP", imageId: "produce-soybean", contactInfo: "9876543216" },
    { id: 6, name: "Cardamom", quantity: "500 kg", price: "Up to ₹1,800/kg", buyer: "Kerala Spice Co.", location: "Idukki, KL", imageId: "produce-cardamom", contactInfo: "9876543217" },
];

export default function MarketplacePage() {
  const { t } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">{t('Marketplace')}</h1>
      <p className="text-muted-foreground">{t('Buy and sell produce directly with verified partners.')}</p>
      
      <Tabs defaultValue="for-sale" className="mt-6">
        <TabsList>
          <TabsTrigger value="for-sale">{t('For Sale')}</TabsTrigger>
          <TabsTrigger value="wanted">{t('Wanted')}</TabsTrigger>
        </TabsList>
        <TabsContent value="for-sale" className="mt-4">
          <motion.div 
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {forSaleItems.map(item => (
              <MarketplaceItem
                key={item.id}
                name={t(item.name)}
                quantity={t(item.quantity)}
                price={item.price}
                seller={t(item.seller)}
                location={t(item.location)}
                imageId={item.imageId}
                type="sale" 
                contactInfo={item.contactInfo}
              />
            ))}
          </motion.div>
        </TabsContent>
        <TabsContent value="wanted" className="mt-4">
          <motion.div 
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {wantedItems.map(item => (
              <MarketplaceItem key={item.id} {...item} type="wanted" contactInfo="9876543210" />
            ))}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
