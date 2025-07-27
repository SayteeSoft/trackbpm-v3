
'use client'
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast"

export default function ContactPage() {
    const { toast } = useToast()
    const [result, setResult] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');


  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.currentTarget);

    const accessKey = "3ee1a7f3-b3d8-4b7d-a39a-3f40659920cb";
    if (!accessKey) {
        setResult("Access key is missing.");
        console.error("Web3Forms access key is not set in environment variables.");
        return;
    }
    formData.append("access_key", accessKey);

    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();

        if (data.success) {
            toast({
                title: "Message Sent!",
                description: "Thanks for reaching out. We'll get back to you soon.",
            })
            setName('');
            setEmail('');
            setMessage('');
            setResult(data.message);
        } else {
            console.error("Error from Web3Forms:", data);
            setResult(data.message);
             toast({
                title: "Error",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            })
        }
    } catch(error) {
        console.error("Submission error:", error);
        setResult("An error occurred while submitting the form.");
        toast({
            title: "Error",
            description: "Something went wrong. Please try again.",
            variant: "destructive",
        })
    }
  };


  return (
    <div className="bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Contact Us</CardTitle>
              <CardDescription>
                Have a question or feedback? Fill out the form below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-6">
                <input type="hidden" name="subject" value="New Email from TRACK⚡BPM" />
                <input type="hidden" name="from_name" value="TRACK⚡BPM Contact Form" />
                <input type="hidden" name="redirect" value="https://web3forms.com/success" />

                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    type="text" 
                    placeholder="Your Name" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="your.email@example.com" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Your message..."
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
               {result && <p className="text-sm text-muted-foreground mt-4 text-center">{result}</p>}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
