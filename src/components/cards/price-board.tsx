import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const prices = [
  { crop: "Tomato", region: "Hyderabad", price: "₹2,500/qtl", updated: "5m ago" },
  { crop: "Onion", region: "Nashik", price: "₹1,800/qtl", updated: "15m ago" },
  { crop: "Potato", region: "Agra", price: "₹1,500/qtl", updated: "30m ago" },
  { crop: "Wheat", region: "Punjab", price: "₹2,100/qtl", updated: "1h ago" },
  { crop: "Soybean", region: "Indore", price: "₹4,500/qtl", updated: "2h ago" },
];

export function PriceBoard() {
  return (
    <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 bg-card/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Market Prices</CardTitle>
        <CardDescription>Live prices from various regions.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Crop 🌾</TableHead>
              <TableHead>Location 📍</TableHead>
              <TableHead>Price 💰</TableHead>
              <TableHead className="text-right">Last Updated ⏱️</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prices.map((item) => (
              <TableRow key={item.crop}>
                <TableCell className="font-medium">{item.crop}</TableCell>
                <TableCell>{item.region}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell className="text-right">{item.updated}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
