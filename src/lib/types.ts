export type Song = {
  id: string;
  title: string;
  artist: string;
  bpm: string;
  description: string;
  longDescription: string;
  links: {
    spotify: string;
    appleMusic: string;
    amazonMusic: string;
  };
};

export type CanvasComponentData = {
  id: string;
  type: 'button' | 'card' | 'input' | 'textarea' | 'heading';
  props?: Record<string, any>;
};
