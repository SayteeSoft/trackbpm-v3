import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ThemeCustomizer() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Primary Color</Label>
        <div className="flex items-center gap-2">
          <Input type="color" defaultValue="#D0C4DE" className="p-1 h-10 w-12" disabled />
          <Input type="text" defaultValue="#D0C4DE" readOnly />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Background Color</Label>
        <div className="flex items-center gap-2">
          <Input type="color" defaultValue="#F7F5F9" className="p-1 h-10 w-12" disabled />
          <Input type="text" defaultValue="#F7F5F9" readOnly />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Accent Color</Label>
        <div className="flex items-center gap-2">
          <Input type="color" defaultValue="#B0A4C4" className="p-1 h-10 w-12" disabled />
          <Input type="text" defaultValue="#B0A4C4" readOnly />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Font</Label>
        <Select defaultValue="inter" disabled>
          <SelectTrigger>
            <SelectValue placeholder="Select a font" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="inter">Inter</SelectItem>
            <SelectItem value="roboto">Roboto</SelectItem>
            <SelectItem value="lato">Lato</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
