
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

            const orderData = await response.json();

            if (!response.ok) {
                const errorMessage = orderData.error || `Server responded with ${response.status}`;
                throw new Error(errorMessage);
            }

            if (orderData.id) {
                return orderData.id;
            } else {
                const errorDetail = orderData?.details?.[0];
                const errorMessage = errorDetail
                    ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id || ''})`
                    : JSON.stringify(orderData);
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error("Create Order Error:", error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            toast({
                title: "Error Creating Order",
                description: `Could not initiate PayPal Checkout: ${errorMessage}`,
                variant: "destructive",
            });
            // Reject the promise to prevent the PayPal popup from opening with a faulty/missing order ID
            return Promise.reject(new Error(errorMessage));
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
        // This toast is now more relevant because createOrder rejects on failure.
        toast({
            title: "PayPal Error",
            description: "An error occurred with the PayPal transaction. Please try again or contact support.",
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
