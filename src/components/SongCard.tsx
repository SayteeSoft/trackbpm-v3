import { Song } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

export default function SongCard({ song }: { song: Song }) {
  return (
    <Card className="flex flex-col rounded-md overflow-hidden shadow-md transition-shadow hover:shadow-lg bg-secondary border-none hover:bg-accent">
      <CardContent className="p-0">
        <div className="flex items-center">
          <div className="relative w-16 h-16 flex-shrink-0">
            <Image
              src={song.imageUrl}
              alt={`${song.title} album art`}
              layout="fill"
              objectFit="cover"
              data-ai-hint="album cover"
            />
          </div>
          <div className="flex-grow p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
            <div className="sm:col-span-1">
              <h3 className="text-lg font-bold">{song.title}</h3>
              <p className="text-sm text-muted-foreground">{song.artist}</p>
            </div>
            <div className="text-right sm:text-center">
              <p className="text-xs text-muted-foreground">BPM</p>
              <p className="font-bold text-lg">{song.bpm}</p>
            </div>
            <div className="text-right sm:text-center">
              <p className="text-xs text-muted-foreground">KEY</p>
              <p className="font-bold">{song.key}</p>
            </div>
            <div className="text-right sm:text-center">
              <p className="text-xs text-muted-foreground">DURATION</p>
              <p className="font-bold">{song.duration}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
