
'use client';

import { CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const PayPalButton = dynamic(() => import('@/components/PayPalButton'), {
  ssr: false,
  loading: () => <div className="flex justify-center items-center h-[48px]"><Loader2 className="animate-spin" /></div>,
});


const plans = [
  {
    name: 'Basic',
    price: '99.99',
    currency: 'GBP',
    description: 'Ads on the Songs landing pages',
    features: [
      '1 x Skyscraper Ad - banner',
      'Vertical size (160px x 600px)',
      '1 x placement per payment',
    ],
    cta: 'Get Basic',
    popular: false,
    productId: 'basic-plan',
  },
  {
    name: 'Standard',
    price: '199.99',
    currency: 'GBP',
    description: 'Ads on the Songs landing pages',
    features: [
        '1 x Leaderboard Ad - banner',
        'Horizontal size (728px x 90px)',
        '1 x placement per payment',
    ],
    cta: 'Get Standard',
    popular: true,
    productId: 'standard-plan',
  },
  {
    name: 'Advanced',
    price: '299.99',
    currency: 'GBP',
    description: 'Ads on Songs landing & details pages',
    features: [
      '1 x Leaderboard Ad - banner',
      'Horizontal size (728px x 90px)',
      '1 x Leaderboard Ad - banner',
      'Horizontal size (728px x 90px)',
      '2 x placement per payments',
    ],
    cta: 'Get Advanced',
    popular: false,
    productId: 'advanced-plan',
  },
];

const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'sb',
    currency: 'GBP',
    intent: 'capture',
};

export default function PricingPage() {
  return (
    <PayPalScriptProvider options={initialOptions}>
        <div className="bg-background">
        <main className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Pricing Plans</h1>
            <p className="mt-4 text-lg text-muted-foreground">Choose the plan that's right for you.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
                <Card key={plan.name} className={`flex flex-col ${plan.popular ? 'border-primary border-2 shadow-lg' : ''}`}>
                {plan.popular && (
                    <Badge className="w-fit self-center -mt-3 bg-primary text-primary-foreground">Most Popular</Badge>
                )}
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between text-center">
                    <div>
                        <div className="mb-6">
                            <span className="text-4xl font-extrabold">£{plan.price}</span>
                            <span className="text-muted-foreground">/12mo</span>
                        </div>
                        <ul className="space-y-3 text-left mb-8">
                        {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                            <span dangerouslySetInnerHTML={{ __html: feature }}></span>
                            </li>
                        ))}
                        </ul>
                    </div>
                    <div className="mt-auto">
                    <PayPalButton plan={plan} />
                    </div>
                </CardContent>
                </Card>
            ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-muted-foreground">
                For a single Pop-Up banner on the site Songs landing page, click &gt; <Link href="/contact" className="text-primary underline hover:text-primary/80">Contact Us!</Link>
              </p>
            </div>
        </main>
        </div>
    </PayPalScriptProvider>
  );
}
