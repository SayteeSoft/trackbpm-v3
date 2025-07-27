import { Song } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

export default function SongCard({ song }: { song: Song }) {
  return (
    <Card className="rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-md bg-card border-2 border-border hover:border-primary/50">
      <CardContent className="p-4">
        <div className="flex items-center gap-6">
           <div className="relative w-16 h-16 flex-shrink-0">
            <Image
              src={song.imageUrl}
              alt={`${song.title} album art`}
              layout="fill"
              objectFit="cover"
              className="rounded-md"
              data-ai-hint="album cover"
            />
          </div>
          <div className="flex-grow">
            <h3 className="text-lg font-bold text-foreground">{song.title}</h3>
            <p className="text-sm text-muted-foreground">{song.artist}</p>
          </div>
          <div className="text-right">
             <p className="text-3xl font-bold text-foreground">{song.bpm}</p>
             <p className="text-xs text-muted-foreground">BPM</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
