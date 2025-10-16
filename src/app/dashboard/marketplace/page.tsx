'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketplaceItem } from "@/components/marketplace-item";
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collectionGroup, query } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import type { ProduceListing, UserProfile } from "@/lib/types";
import { useCollection as useUsersCollection } from "@/firebase/firestore/use-collection";

type ProduceListingWithSeller = ProduceListing & { seller?: UserProfile };

const wantedItems = [
    { id: 1, name: "Organic Turmeric", quantity: "5 quintal", price: "Up to ₹8,000/qtl", buyer: "Spice India Exports", location: "Erode, TN", imageId: "produce-onions" },
    { id: 2, name: "Fresh Cashews", quantity: "1 tonne", price: "Up to ₹70,000/qtl", buyer: "Konkan Dry Fruits", location: "Panaji, Goa", imageId: "produce-wheat" },
    { id: 3, name: "Long-staple Cotton", quantity: "50 tonne", price: "Market Rate", buyer: "National Textiles", location: "Coimbatore, TN", imageId: "produce-rice" },
    { id: 4, name: "Malka Masoor Dal", quantity: "10 quintal", price: "Up to ₹6,500/qtl", buyer: "Delhi Grain Traders", location: "New Delhi, DL", imageId: "produce-oranges" },
];


export default function MarketplacePage() {
  const db = useFirestore();

  const produceListingsQuery = useMemoFirebase(
    () => db ? query(collectionGroup(db, 'produceListings')) : null,
    [db]
  );
  const { data: produceListings, isLoading: isLoadingListings } = useCollection<ProduceListing>(produceListingsQuery);
  
  const usersQuery = useMemoFirebase(
      () => db ? query(collection(db, 'users')) : null,
      [db]
  );
  const { data: users, isLoading: isLoadingUsers } = useUsersCollection<UserProfile>(usersQuery);

  const forSaleItems: ProduceListingWithSeller[] = produceListings?.map(listing => {
      const seller = users?.find(user => user.id === listing.userId);
      return { ...listing, seller };
  }) || [];

  const isLoading = isLoadingListings || isLoadingUsers;

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
            {isLoading && (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[400px] w-full" />)
            )}
            {!isLoading && forSaleItems.map(item => (
              <MarketplaceItem 
                key={item.id}
                name={item.cropName}
                quantity={`${item.quantity} units`}
                price={`₹${item.price}/unit`}
                seller={item.seller?.name || 'Unknown Seller'}
                location={item.seller?.region || 'Unknown Location'}
                type="sale" 
                contactInfo={item.contactInfo}
              />
            ))}
             {!isLoading && forSaleItems.length === 0 && (
                <div className="col-span-full text-center text-muted-foreground py-10">
                    No produce has been listed for sale yet.
                </div>
            )}
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
