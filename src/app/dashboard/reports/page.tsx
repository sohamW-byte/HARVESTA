'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from '@/hooks/use-location';
import type { ReportGenerationOutput } from '@/ai/flows/report-generation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, FileText, Leaf, TrendingUp, Award, Droplets, Info } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

const mockReportData: ReportGenerationOutput = {
  soilQuality: "The black soil in the Nashik region is rich in humus and well-suited for horticulture. It has good moisture retention, which is ideal for grape and onion cultivation, but may require improved drainage for certain other crops.",
  trendingCrops: [
    "Table Grapes: Consistently high demand for export markets.",
    "Onions (Red): A staple crop with strong local and national demand, though prices can be volatile.",
    "Tomatoes: Suitable for the climate, with a steady market for both fresh and processing varieties.",
    "Pomegranates: Increasing popularity and good returns for quality produce."
  ],
  bestCrop: "Table Grapes",
  recommendation: "Given the soil profile and strong export market link, focusing on high-quality table grapes is the most profitable recommendation. Consider varieties like Thompson Seedless or Flame Seedless for best results.",
  otherFeatures: [
    "Utilize drip irrigation to manage water efficiently, especially for grape cultivation.",
    "Explore government subsidies available for setting up polyhouses for tomato cultivation to extend the growing season.",
    "Practice crop rotation with legumes like soybean or chickpea to naturally improve soil nitrogen levels after an onion harvest."
  ]
};


export default function ReportsPage() {
  const { userProfile, loading: userLoading } = useAuth();
  const { location: browserLocation, loading: locationLoading } = useLocation();
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<ReportGenerationOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const effectiveLocation = browserLocation?.address || userProfile?.region;

  const handleGenerateReport = async () => {
    if (!effectiveLocation) {
      setError('Your location is not set. Please update your profile in the "My Fields" page or allow location access.');
      return;
    }

    setLoading(true);
    setReport(null);
    setError(null);

    // Simulate AI generation with a delay
    setTimeout(() => {
        setReport(mockReportData);
        setLoading(false);
    }, 2000); // 2-second delay to mimic processing
  };
  
  const isPageLoading = userLoading || locationLoading;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Farm Reports</h1>
          <p className="text-muted-foreground">Generate a detailed analysis and recommendation report for your farm.</p>
        </div>
        <Button onClick={handleGenerateReport} disabled={loading || isPageLoading} className="w-full md:w-auto">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </>
          )}
        </Button>
      </div>

      {isPageLoading && <Skeleton className="h-40 w-full" />}
      
      {!isPageLoading && !report && !loading && (
        <Card className="w-full max-w-2xl mx-auto text-center">
            <CardHeader>
                <div className="mx-auto bg-muted rounded-full p-4 w-fit">
                    <FileText className="h-12 w-12 text-muted-foreground" />
                </div>
                <CardTitle className="mt-4">Your Custom Report Awaits</CardTitle>
                <CardDescription>
                    {effectiveLocation 
                        ? `Click "Generate Report" to get AI-powered insights for your location in ${effectiveLocation}.`
                        : <>Please <Link href="/dashboard/my-fields" className="underline">set your location</Link> or grant browser permissions to enable report generation.</>
                    }
                </CardDescription>
            </CardHeader>
        </Card>
      )}

      {error && (
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <Info className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
            </div>
            <Skeleton className="h-64 w-full" />
             <Skeleton className="h-48 w-full" />
        </div>
      )}

      {report && (
        <div className="space-y-6 animate-in fade-in-50">
            <Alert className="bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-900/20 dark:border-blue-500/30 dark:text-blue-200">
                <Award className="h-4 w-4 !text-blue-500" />
                <AlertTitle className="font-semibold">Top Recommendation: {report.bestCrop}</AlertTitle>
                <AlertDescription>
                   {report.recommendation}
                </AlertDescription>
            </Alert>
            
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Leaf className="text-primary"/> Soil Quality Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{report.soilQuality}</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><TrendingUp className="text-accent"/> Market Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-2 text-sm">
                            {report.trendingCrops.map((crop, index) => <li key={index}>{crop}</li>)}
                        </ul>
                    </CardContent>
                </Card>
            </div>
            
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Droplets className="text-blue-500"/> Other Tips & Features</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc pl-5 space-y-2 text-sm">
                        {report.otherFeatures.map((feature, index) => <li key={index}>{feature}</li>)}
                    </ul>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
