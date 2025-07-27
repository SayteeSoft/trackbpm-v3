import { Card } from '@/components/ui/card';

export default function AdBanner() {
  return (
    <Card className="flex items-center justify-center h-28 rounded-md bg-gray-100">
      <div className="text-center text-muted-foreground">
        <p className="text-sm">Advertisement</p>
        <p className="text-2xl font-bold">728 x 90</p>
      </div>
    </Card>
  );
}
