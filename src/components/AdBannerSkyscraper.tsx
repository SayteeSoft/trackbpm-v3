import { Card } from '@/components/ui/card';

export default function AdBannerSkyscraper() {
  return (
    <Card className="sticky top-8 flex items-center justify-center w-[160px] h-[600px] rounded-md bg-muted/50 border border-border">
      <div className="text-center text-muted-foreground">
        <p className="text-xs">Advertisement</p>
        <p className="text-2xl font-bold text-foreground/50">160 x 600</p>
      </div>
    </Card>
  );
}
