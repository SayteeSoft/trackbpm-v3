import type { CanvasComponentData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import Image from 'next/image';

type CanvasRendererProps = {
  component: CanvasComponentData;
  onRemove: (id: string) => void;
};

function renderComponent(component: CanvasComponentData) {
  switch (component.type) {
    case 'heading':
      return <h2 className="text-2xl font-bold font-headline tracking-tight">Preview Heading</h2>;
    case 'button':
      return <Button>Click me</Button>;
    case 'input':
      return (
        <div className="w-full space-y-1.5">
          <Label htmlFor={component.id}>Text Input</Label>
          <Input id={component.id} placeholder="Enter text..." />
        </div>
      );
    case 'textarea':
        return (
            <div className="w-full space-y-1.5">
                <Label htmlFor={component.id}>Text Area</Label>
                <Textarea id={component.id} placeholder="Enter a long text..." />
            </div>
        );
    case 'card':
      return (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This is the content of the card. You can put anything you want here.</p>
          </CardContent>
        </Card>
      );
    default:
      return null;
  }
}

export default function CanvasRenderer({ component, onRemove }: CanvasRendererProps) {
  return (
    <div className="relative group p-4 border border-border/50 rounded-lg bg-background hover:bg-white transition-all hover:border-primary/50 animate-in fade-in zoom-in-95 duration-300">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 bg-background hover:bg-muted"
          onClick={() => onRemove(component.id)}
          aria-label="Remove component"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center justify-center min-h-[100px]">
        {renderComponent(component)}
      </div>
    </div>
  );
}
