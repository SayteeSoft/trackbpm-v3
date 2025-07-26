import { Button } from '@/components/ui/button';
import type { CanvasComponentData } from '@/lib/types';
import { RectangleHorizontal, Type, MousePointerClick, TextCursorInput, MessageSquare } from 'lucide-react';

type ComponentPaletteProps = {
  onAddComponent: (type: CanvasComponentData['type']) => void;
};

const availableComponents = [
  { type: 'heading', label: 'Heading', icon: Type },
  { type: 'button', label: 'Button', icon: MousePointerClick },
  { type: 'input', label: 'Input', icon: TextCursorInput },
  { type: 'textarea', label: 'Textarea', icon: MessageSquare },
  { type: 'card', label: 'Card', icon: RectangleHorizontal },
] as const;

export default function ComponentPalette({ onAddComponent }: ComponentPaletteProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {availableComponents.map(({ type, label, icon: Icon }) => (
        <Button
          key={type}
          variant="outline"
          className="flex flex-col h-20 items-center justify-center gap-2 p-2 text-center"
          onClick={() => onAddComponent(type)}
        >
          <Icon className="h-5 w-5 text-muted-foreground" />
          <span className="text-xs font-semibold">{label}</span>
        </Button>
      ))}
    </div>
  );
}
