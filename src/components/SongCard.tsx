import { Song } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { Spotify, Apple, Amazon } from '@/components/icons';

export default function SongCard({ song }: { song: Song }) {
  return (
    <Card className="rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-md bg-card border-2 border-border">
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
          <div className="flex-grow grid grid-cols-2 items-center gap-4">
            <div>
              <p className="text-sm text-muted-foreground">{song.artist}</p>
              <h3 className="text-2xl font-bold text-foreground">{song.title}</h3>
            </div>
            <div className="flex justify-end gap-6 text-right">
              <div>
                <p className="text-xs text-muted-foreground">KEY</p>
                <p className="font-bold text-lg">{song.key}</p>
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
        </div>
      </CardContent>
      <Separator />
      <div className="p-3 flex items-center justify-start gap-6 text-muted-foreground">
        <a href={song.links.spotify} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm hover:text-primary" onClick={(e) => e.stopPropagation()}>
          <Spotify className="h-4 w-4" /> Spotify
        </a>
        <a href={song.links.appleMusic} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm hover:text-primary" onClick={(e) => e.stopPropagation()}>
          <Apple className="h-4 w-4" /> Apple Music
        </a>
        <a href={song.links.amazonMusic} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm hover:text-primary" onClick={(e) => e.stopPropagation()}>
          <Amazon className="h-4 w-4" /> Amazon
        </a>
      </div>
    </Card>
  );
}
