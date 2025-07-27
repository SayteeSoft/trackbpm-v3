
export type Song = {
  id: string;
  title: string;
  artist: string;
  bpm: string;
  key: string;
  duration: string;
  imageUrl: string;
  description?: string; // Optional now
  longDescription?: string; // Optional now
  links?: { // Optional now
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
