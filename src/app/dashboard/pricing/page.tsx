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
    name: 'Starter Farmer',
    price: 'Free',
    commission: '5%',
    features: [
      'List up to 5 products',
      'Basic market price access',
      'Community forum access',
      'Standard support',
    ],
    popular: false,
    cta: 'Get Started',
  },
  {
    name: 'Pro Farmer',
    price: '₹999',
    pricePeriod: '/month',
    commission: '2%',
    features: [
      'Unlimited product listings',
      'Advanced AI recommendations',
      'Real-time price alerts',
      '0% commission on first 5 orders',
      'Priority support',
    ],
    popular: true,
    cta: 'Upgrade to Pro',
  },
  {
    name: 'Business Buyer',
    price: '₹4999',
    pricePeriod: '/month',
    commission: '1.5%',
    features: [
      'Bulk order placement',
      'Access to verified sellers network',
      'Advanced supply chain analytics',
      'Dedicated account manager',
      '24/7 premium support',
    ],
    popular: false,
    cta: 'Contact Sales',
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
          Find the Perfect Plan for Your Needs
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Affordable pricing for everyone. From individual farmers to large buyers.
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
                <Button className={cn('w-full', !plan.popular && 'bg-secondary text-secondary-foreground hover:bg-secondary/80')}>
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
