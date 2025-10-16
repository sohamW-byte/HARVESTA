import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketplaceItem } from "@/components/marketplace-item";

const forSaleItems = [
    { id: 1, name: "Sona Masoori Rice", imageId: "produce-rice", quantity: "10 quintal", price: "₹2,800/qtl", seller: "Ramesh Kumar", location: "Guntur, AP" },
    { id: 2, name: "Nagpur Oranges", imageId: "produce-oranges", quantity: "500 kg", price: "₹4,500/100kg", seller: "Sita Devi", location: "Nagpur, MH" },
    { id: 3, name: "MP Sharbati Wheat", imageId: "produce-wheat", quantity: "20 quintal", price: "₹2,500/qtl", seller: "Amit Singh", location: "Sehore, MP" },
    { id: 4, name: "Bangalore Rose Onions", imageId: "produce-onions", quantity: "2 tonne", price: "₹1,800/qtl", seller: "Lakshmi Reddy", location: "Bengaluru, KA" },
    { id: 5, name: "Alphonso Mangoes", imageId: "produce-mangoes", quantity: "100 dozen", price: "₹800/dozen", seller: "Gopal Yadav", location: "Ratnagiri, MH" },
    { id: 6, name: "Darjeeling Tea", imageId: "produce-tea", quantity: "50 kg", price: "₹1,500/kg", seller: "Tenzing Bhutia", location: "Darjeeling, WB" },
];

const wantedItems = [
    { id: 1, name: "Organic Turmeric", quantity: "5 quintal", price: "Up to ₹8,000/qtl", buyer: "Spice India Exports", location: "Erode, TN" },
    { id: 2, name: "Fresh Cashews", quantity: "1 tonne", price: "Up to ₹70,000/qtl", buyer: "Konkan Dry Fruits", location: "Panaji, Goa" },
    { id: 3, name: "Long-staple Cotton", quantity: "50 tonne", price: "Market Rate", buyer: "National Textiles", location: "Coimbatore, TN" },
    { id: 4, name: "Malka Masoor Dal", quantity: "10 quintal", price: "Up to ₹6,500/qtl", buyer: "Delhi Grain Traders", location: "New Delhi, DL" },
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
              <MarketplaceItem key={item.id} {...item} type="sale" />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="wanted" className="mt-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wantedItems.map(item => (
              <MarketplaceItem key={item.id} {...item} type="wanted" />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
