'use client';

import { Check, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/use-translation';

const plans = [
  {
    name: 'Basic Farmer',
    price: 'Free',
    commission: '5%',
    features: [
      'List up to 10 products',
      'Basic market price access',
      'Community forum access',
      'Standard email support',
    ],
    popular: false,
    cta: 'Continue with Basic',
  },
  {
    name: 'Growth Farmer',
    price: '₹499',
    pricePeriod: '/month',
    commission: '3%',
    features: [
      'List up to 50 products',
      'AI Crop Recommendations',
      'Real-time price alerts',
      'Priority email support',
    ],
    popular: true,
    cta: 'Upgrade to Growth',
  },
  {
    name: 'Pro Farmer',
    price: '₹1499',
    pricePeriod: '/month',
    commission: '1.5%',
    features: [
      'Unlimited product listings',
      'Advanced AI Analytics & Reports',
      'Dedicated Relationship Manager',
      '24/7 Phone & Email Support',
    ],
    popular: false,
    cta: 'Upgrade to Pro',
  },
];

export default function PricingPage() {
    const { t } = useTranslation();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
            staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
            type: 'spring',
            stiffness: 100,
            },
        },
    };

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">
          Find the Perfect Plan for Your Farm
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Simple, transparent pricing that grows with you.
        </p>
      </div>

      <motion.div 
        className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 items-start"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {plans.map((plan) => (
          <motion.div key={plan.name} variants={itemVariants}>
            <Card
              className={cn(
                'flex flex-col h-full rounded-2xl',
                plan.popular ? 'border-primary border-2 shadow-lg relative' : ''
              )}
            >
              {plan.popular && (
                <div className="absolute top-0 -translate-y-1/2 w-full flex justify-center">
                    <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Most Popular
                    </div>
                </div>
              )}
              <CardHeader>
                <CardTitle>{t(plan.name)}</CardTitle>
                <CardDescription>
                  Commission Rate: <span className="font-bold text-primary">{plan.commission}</span>
                </CardDescription>
                <div>
                  <span className="text-4xl font-bold">{t(plan.price)}</span>
                  {plan.pricePeriod && (
                    <span className="text-muted-foreground">{plan.pricePeriod}</span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="text-sm text-muted-foreground">{t(feature)}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className={cn('w-full', !plan.popular && 'bg-secondary text-secondary-foreground hover:bg-secondary/80')} variant={plan.popular ? 'default' : 'outline'}>
                  {t(plan.cta)}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
