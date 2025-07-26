export type CanvasComponentData = {
  id: string;
  type: 'button' | 'card' | 'input' | 'textarea' | 'heading';
  props?: Record<string, any>;
};
