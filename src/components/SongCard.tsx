import { Song } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Spotify, Apple, Amazon } from '@/components/icons';
import Image from 'next/image';
import Link from 'next/link';

export default function SongCard({ song }: { song: Song }) {
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <Card className="rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-md bg-card border-2 border-border hover:border-primary/50">
      <CardContent className="p-4">
        <div className="flex items-center gap-6">
          <div className="relative w-20 h-20 flex-shrink-0">
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
            <p className="text-xs uppercase text-muted-foreground tracking-wider">{song.artist}</p>
            <h3 className="text-2xl font-bold text-foreground">{song.title}</h3>
          </div>
          <div className="flex items-center gap-6 text-center">
            <div>
                <p className="text-xs text-muted-foreground">KEY</p>
                <p className="font-bold text-lg">{song.key.split(" ")[0]}</p>
            </div>
             <div>
                <p className="text-xs text-muted-foreground">DURATION</p>
                <p className="font-bold text-lg">{song.duration}</p>
            </div>
             <div>
                <p className="text-xs text-muted-foreground">BPM</p>
                <p className="font-bold text-lg">{song.bpm}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <Separator />
      <div className="grid grid-cols-3">
         <a
            href={song.links.spotify}
            target="_blank"
            rel="noopener noreferrer"
            onClick={stopPropagation}
            className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground p-3 transition-colors"
          >
            <Spotify className="h-5 w-5" /> Spotify
        </a>
         <a
            href={song.links.appleMusic}
            target="_blank"
            rel="noopener noreferrer"
            onClick={stopPropagation}
            className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground p-3 transition-colors border-x"
          >
            <Apple className="h-5 w-5" /> Apple Music
        </a>
         <a
            href={song.links.amazonMusic}
            target="_blank"
            rel="noopener noreferrer"
            onClick={stopPropagation}
            className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground p-3 transition-colors"
          >
            <Amazon className="h-5 w-5" /> Amazon
        </a>
      </div>
    </Card>
  );
}
