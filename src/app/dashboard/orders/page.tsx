'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Package, ShoppingCart } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

const ordersData = [
  {
    id: 'ORD001',
    product: 'Sona Masoori Rice',
    partner: 'Anjali Traders',
    date: '2023-10-25',
    amount: '₹28,000',
    commission: '₹1,400',
    status: 'Completed',
    type: 'sale',
  },
  {
    id: 'ORD002',
    product: 'Organic Turmeric',
    partner: 'Spice India Exports',
    date: '2023-10-28',
    amount: '₹40,000',
    commission: '₹800',
    status: 'Shipped',
    type: 'sale',
  },
  {
    id: 'ORD003',
    product: 'Long-staple Cotton',
    partner: 'Ramesh Kumar',
    date: '2023-11-01',
    amount: '₹1,50,000',
    commission: '₹2,250',
    status: 'Pending',
    type: 'purchase',
  },
  {
    id: 'ORD004',
    product: 'Nagpur Oranges',
    partner: 'Fresh Fruits Co.',
    date: '2023-11-02',
    amount: '₹2,000',
    commission: '₹100',
    status: 'Processing',
    type: 'sale',
  },
  {
    id: 'ORD005',
    product: 'Fresh Cashews',
    partner: 'Goa Farms',
    date: '2023-11-05',
    amount: '₹7,000',
    commission: '₹105',
    status: 'Canceled',
    type: 'purchase',
  },
];

const sales = ordersData.filter(o => o.type === 'sale');
const purchases = ordersData.filter(o => o.type === 'purchase');

export default function OrdersPage() {
    const { t } = useTranslation();

    const renderStatusBadge = (status: string) => {
        const lowerStatus = status.toLowerCase();
        let variant: "default" | "secondary" | "destructive" | "outline" = "secondary";
        if (lowerStatus === 'completed') variant = 'default';
        if (lowerStatus === 'shipped') variant = 'outline';
        if (lowerStatus === 'pending' || lowerStatus === 'processing') variant = 'secondary';
        if (lowerStatus === 'canceled') variant = 'destructive';

        return <Badge variant={variant} className="capitalize">{status}</Badge>;
    };

    const OrderTable = ({ orders }: { orders: typeof ordersData }) => (
        <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Partner</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orders.length > 0 ? orders.map((order) => (
                <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{t(order.product)}</TableCell>
                    <TableCell>{t(order.partner)}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.amount}</TableCell>
                    <TableCell className="text-primary">{order.commission}</TableCell>
                    <TableCell>{renderStatusBadge(order.status)}</TableCell>
                </TableRow>
                )) : (
                    <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                            No orders found.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <FileText className="text-accent" />
          Order Management
        </h1>
        <p className="text-muted-foreground">
          Track your sales, purchases, and earnings all in one place.
        </p>
      </div>

      <Tabs defaultValue="sales">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="sales">
            <Package className="mr-2 h-4 w-4" />
            My Sales
          </TabsTrigger>
          <TabsTrigger value="purchases">
            <ShoppingCart className="mr-2 h-4 w-4" />
            My Purchases
          </TabsTrigger>
        </TabsList>
        <TabsContent value="sales">
            <Card>
                <CardHeader>
                    <CardTitle>My Sales</CardTitle>
                    <CardDescription>All orders where you are the seller.</CardDescription>
                </CardHeader>
                <CardContent>
                    <OrderTable orders={sales} />
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="purchases">
            <Card>
                <CardHeader>
                    <CardTitle>My Purchases</CardTitle>
                    <CardDescription>All orders where you are the buyer.</CardDescription>
                </CardHeader>
                <CardContent>
                    <OrderTable orders={purchases} />
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
