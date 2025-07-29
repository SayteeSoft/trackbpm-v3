
'use client';

import { CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PayPalButton from '@/components/PayPalButton';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const plans = [
  {
    name: 'Basic',
    price: '99.99',
    currency: 'GBP',
    description: 'Advertisement on Song details page',
    features: [
      '1 x Leaderboard Ad - banner',
      'Horizontal size (728px by 90px)',
    ],
    cta: 'Get Basic',
    popular: false,
    productId: 'basic-plan',
  },
  {
    name: 'Standard',
    price: '199.99',
    currency: 'GBP',
    description: 'Advertisement on Song landing page',
    features: [
        '1 x Leaderboard Ad - banner',
        'Horizontal dimensions (728 x 90)',
    ],
    cta: 'Get Standard',
    popular: true,
    productId: 'standard-plan',
  },
  {
    name: 'Advanced',
    price: '299.99',
    currency: 'GBP',
    description: 'Advertisement on Song landing pages',
    features: [
      '1 x Leaderboard Ad - banner',
      'Horizontal dimensions (728 x 90)',
      '1 x PopUp Ad - banner',
      'Horizontal dimensions (728 x 90)',
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
        </main>
        </div>
    </PayPalScriptProvider>
  );
}
