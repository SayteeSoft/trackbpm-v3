
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

export async function POST(request: Request, { params }: { params: { orderID: string } }) {
    const { orderID } = params;
    const accessToken = await getAccessToken();

    try {
        const response = await fetch(`https://api.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        
        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error("Failed to capture order:", error);
        return NextResponse.json({ error: "Failed to capture order." }, { status: 500 });
    }
}
