import { Card } from '@/components/ui/card';

export default function AdBanner() {
  return (
    <Card className="flex items-center justify-center h-28 rounded-md bg-muted/50 border border-border">
      <div className="text-center text-muted-foreground">
        <p className="text-xs">Advertisement</p>
        <p className="text-2xl font-bold text-foreground/50">728 x 90</p>
      </div>
    </Card>
  );
}
