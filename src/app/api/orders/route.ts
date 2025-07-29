
import { NextResponse } from 'next/server';

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;

async function getAccessToken() {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
    const response = await fetch('https://api.sandbox.paypal.com/v1/oauth2/token', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    });
    const data = await response.json();
    return data.access_token;
}

export async function POST(request: Request) {
    const { plan } = await request.json();
    const accessToken = await getAccessToken();

    try {
        const response = await fetch('https://api.sandbox.paypal.com/v2/checkout/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                intent: 'CAPTURE',
                purchase_units: [{
                    amount: {
                        currency_code: plan.currency,
                        value: plan.price,
                        breakdown: {
                            item_total: {
                                currency_code: plan.currency,
                                value: plan.price
                            }
                        }
                    },
                    items: [{
                        name: plan.name,
                        quantity: '1',
                        unit_amount: {
                            currency_code: plan.currency,
                            value: plan.price
                        },
                        sku: plan.productId,
                        description: `TRACK⚡BPM ${plan.name} Plan`
                    }]
                }]
            })
        });

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error("Failed to create order:", error);
        return NextResponse.json({ error: "Failed to create order." }, { status: 500 });
    }
}
