'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketplaceItem } from "@/components/marketplace-item";
import { Skeleton } from "@/components/ui/skeleton";

const forSaleItems = [
    { id: 1, name: "Sona Masoori Rice", quantity: "10 quintal", price: "₹2,800/qtl", seller: "Ramesh Kumar", location: "Nalgonda, TS", imageId: "produce-rice", contactInfo: "9876543210" },
    { id: 2, name: "Nagpur Oranges", quantity: "50 kg", price: "₹40/kg", seller: "Sunita Deshpande", location: "Nagpur, MH", imageId: "produce-oranges", contactInfo: "9876543211" },
    { id: 3, name: "Organic Turmeric", quantity: "5 quintal", price: "₹8,000/qtl", seller: "Vijay Farms", location: "Erode, TN", imageId: "produce-tea", contactInfo: "9876543212" },
    { id: 4, name: "Alphonso Mangoes", quantity: "10 dozen", price: "₹1,200/dozen", seller: "Konkan Orchards", location: "Ratnagiri, MH", imageId: "produce-mangoes", contactInfo: "9876543213" },
];


const wantedItems = [
    { id: 1, name: "Organic Turmeric", quantity: "5 quintal", price: "Up to ₹8,000/qtl", buyer: "Spice India Exports", location: "Erode, TN", imageId: "produce-tea" },
    { id: 2, name: "Fresh Cashews", quantity: "1 tonne", price: "Up to ₹70,000/qtl", buyer: "Konkan Dry Fruits", location: "Panaji, Goa", imageId: "produce-wheat" },
    { id: 3, name: "Long-staple Cotton", quantity: "50 tonne", price: "Market Rate", buyer: "National Textiles", location: "Coimbatore, TN", imageId: "produce-rice" },
    { id: 4, name: "Malka Masoor Dal", quantity: "10 quintal", price: "Up to ₹6,500/qtl", buyer: "Delhi Grain Traders", location: "New Delhi, DL", imageId: "produce-onions" },
];


export default function MarketplacePage() {

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
      <p className="text-muted-foreground">Buy and sell produce directly with verified partners.</p>
      
      <Tabs defaultValue="for-sale" className="mt-6">
        <TabsList>
          <TabsTrigger value="for-sale">For Sale</TabsTrigger>
          <TabsTrigger value="wanted">Wanted</TabsTrigger>
        </TabsList>
        <TabsContent value="for-sale" className="mt-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {forSaleItems.map(item => (
              <MarketplaceItem
                key={item.id}
                name={item.name}
                quantity={item.quantity}
                price={item.price}
                seller={item.seller}
                location={item.location}
                imageId={item.imageId}
                type="sale" 
                contactInfo={item.contactInfo}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="wanted" className="mt-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wantedItems.map(item => (
              <MarketplaceItem key={item.id} {...item} type="wanted" contactInfo="9876543210" />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
