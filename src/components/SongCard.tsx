
import { Song } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Spotify, Apple, Amazon } from '@/components/icons';
import Image from 'next/image';
import Link from 'next/link';

export default function SongCard({ song }: { song: Song }) {
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();
  const amazonSearchUrl = `https://music.amazon.com/search/${encodeURIComponent(song.title + ' ' + song.artist)}`;
  const appleSearchUrl = `https://music.apple.com/us/search?term=${encodeURIComponent(song.title + ' ' + song.artist)}`;

  return (
    <Card className="rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-md bg-card border-2 border-border hover:border-primary/50">
      <Link href={`/song/${song.id}`} className="block hover:bg-muted/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image
                  src={song.imageUrl || 'https://placehold.co/100x100.png'}
                  alt={`${song.title} album art`}
                  fill
                  className="rounded-md object-cover"
                  data-ai-hint="album cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs uppercase text-muted-foreground font-semibold tracking-wider truncate">{song.artist}</p>
                <h3 className="text-xl font-bold text-foreground truncate">{song.title}</h3>
              </div>
            </div>
            
            <div className="flex items-center gap-8 text-center flex-shrink-0">
              <div>
                <p className="text-xs font-semibold text-muted-foreground tracking-widest">KEY</p>
                <p className="font-bold text-lg">{song.key || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground tracking-widest">DURATION</p>
                <p className="font-bold text-lg">{song.duration || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground tracking-widest">BPM</p>
                <p className="font-bold text-lg">{song.bpm || '-'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Link>
      <Separator />
      <div className="grid grid-cols-3">
         <a
            href={`https://open.spotify.com/track/${song.id}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={stopPropagation}
            className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground p-3 transition-colors"
          >
            <Spotify className="h-5 w-5" /> Spotify
        </a>
         <a
            href={appleSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={stopPropagation}
            className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground p-3 transition-colors border-x hover:bg-muted/50 hover:text-foreground"
          >
            <Apple className="h-5 w-5" /> Apple Music
        </a>
         <a
            href={amazonSearchUrl}
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
