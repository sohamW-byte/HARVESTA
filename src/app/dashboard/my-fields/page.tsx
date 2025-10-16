'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const fieldSchema = z.object({
  region: z.string().min(2, { message: 'Region is required.' }),
  cropsGrown: z.string().min(3, { message: 'Please list at least one crop.' }),
  produceAvailability: z.string().min(5, { message: 'Please describe your produce availability.' }),
});

type FieldFormValues = z.infer<typeof fieldSchema>;

const submissionHistory = [
  {
    date: '2023-10-15',
    region: 'Nashik, Maharashtra',
    crops: 'Grapes, Onions',
    availability: '500 kg of Thompson Seedless grapes available for immediate sale.',
  },
  {
    date: '2023-06-02',
    region: 'Anantapur, Andhra Pradesh',
    crops: 'Groundnut, Sweet Orange',
    availability: '2 tonnes of Groundnut (K-6 variety) ready by next week.',
  },
  {
    date: '2023-03-20',
    region: 'Moga, Punjab',
    crops: 'Wheat, Rice',
    availability: '10 quintals of high-quality Sharbati wheat harvested.',
  },
];


export default function MyFieldsPage() {
  const form = useForm<FieldFormValues>({
    resolver: zodResolver(fieldSchema),
    defaultValues: {
      region: '',
      cropsGrown: '',
      produceAvailability: '',
    },
  });
  
  function onSubmit(data: FieldFormValues) {
    console.log(data);
    // Here you would typically send the data to your backend
    alert('Data submitted! Check the console for the values.');
    form.reset();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">My Fields</h1>
      <p className="text-muted-foreground">Manage your farm's information and track your produce.</p>
      
      <div className="mt-8 grid gap-12">
        <Card>
          <CardHeader>
            <CardTitle>Update Farm Details</CardTitle>
            <CardDescription>
              Enter your current farm information. This will be visible to potential buyers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Region</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., Nashik, Maharashtra" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cropsGrown"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Main Crops Grown</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., Grapes, Onions, Tomatoes" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="produceAvailability"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Produce Availability</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="E.g., 500 kg of Thompson Seedless grapes available for immediate sale."
                          {...field}
                        />
                      </FormControl>
                       <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Save Changes</Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Submission History</CardTitle>
            <CardDescription>A log of your previous farm detail updates.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Crops Grown</TableHead>
                  <TableHead>Produce Availability</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissionHistory.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell>{entry.date}</TableCell>
                    <TableCell>{entry.region}</TableCell>
                    <TableCell>{entry.crops}</TableCell>
                    <TableCell>{entry.availability}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
