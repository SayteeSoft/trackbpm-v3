
'use client';

import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"

interface Plan {
    name: string;
    price: string;
    currency: string;
    productId: string;
}

interface PayPalButtonProps {
    plan: Plan;
}

export default function PayPalButton({ plan }: PayPalButtonProps) {
    const [{ isPending }] = usePayPalScriptReducer();
    const { toast } = useToast();

    const createOrder = async (): Promise<string> => {
        try {
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    plan: plan,
                }),
            });

            if (!response.ok) {
                const errorBody = await response.json();
                const errorMessage = errorBody.error || `Server responded with ${response.status}`;
                throw new Error(errorMessage);
            }

            const orderData = await response.json();

            if (orderData.id) {
                return orderData.id;
            } else {
                const errorDetail = orderData?.details?.[0];
                const errorMessage = errorDetail
                    ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                    : JSON.stringify(orderData);
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            toast({
                title: "Error",
                description: `Could not initiate PayPal Checkout: ${errorMessage}`,
                variant: "destructive",
            });
            // Must return a Promise that resolves to a faulty order ID to prevent the blank popup.
            // Returning an empty string is a way to signal failure to the PayPal script.
            return Promise.reject(new Error('Failed to create order.'));
        }
    };
    
    const onApprove = async (data: any, actions: any) => {
        try {
            const response = await fetch(
                `/api/orders/${data.orderID}/capture`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const orderData = await response.json();
            const errorDetail = orderData?.details?.[0];

            if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
                return actions.restart();
            } else if (errorDetail) {
                throw new Error(`${errorDetail.description} (${orderData.debug_id})`);
            } else {
                const transaction =
                    orderData?.purchase_units?.[0]?.payments?.captures?.[0] ||
                    orderData?.purchase_units?.[0]?.payments?.authorizations?.[0];
                
                toast({
                    title: "Transaction Successful!",
                    description: `Transaction ${transaction.status}: ${transaction.id}`,
                    variant: "success",
                });
                console.log(
                    "Capture result",
                    orderData,
                    JSON.stringify(orderData, null, 2)
                );
            }
        } catch (error) {
            console.error(error);
             toast({
                title: "Error",
                description: `Sorry, your transaction could not be processed. ${error}`,
                variant: "destructive",
            });
        }
    };

    const onError = (err: any) => {
        console.error("PayPal Checkout onError", err);
        toast({
            title: "PayPal Error",
            description: "An error occurred with the PayPal transaction. Please try again.",
            variant: "destructive",
        });
    };

    return (
        <div className="w-full">
            {isPending ? <Loader2 className="animate-spin mx-auto" /> : null}
            <PayPalButtons
                style={{ layout: "vertical", label: "pay" }}
                createOrder={createOrder}
                onApprove={onApprove}
                onError={onError}
                forceReRender={[plan]}
            />
        </div>
    );
}
