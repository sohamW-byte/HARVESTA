import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketplaceItem } from "@/components/marketplace-item";

const forSaleItems = [
  { id: 1, name: "Organic Tomatoes", imageId: "produce-tomato", quantity: "50kg", price: "₹3,000", seller: "Ramesh Kumar" },
  { id: 2, name: "Sweet Corn", imageId: "produce-corn", quantity: "100kg", price: "₹2,200", seller: "Sita Devi" },
  { id: 3, name: "Golden Wheat", imageId: "produce-wheat", quantity: "5 quintal", price: "₹10,500", seller: "Amit Singh" },
];

const wantedItems = [
  { id: 1, name: "Basmati Rice", quantity: "2 quintal", price: "Up to ₹6,000", buyer: "Anjali Traders" },
  { id: 2, name: "Red Onions", quantity: "500kg", price: "Up to ₹9,000", buyer: "City Exports" },
];


export default function MarketplacePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
      <p className="text-muted-foreground">Buy and sell produce with other farmers.</p>
      
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
