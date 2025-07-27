import { Song } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spotify, Apple, Amazon } from '@/components/icons';
import Image from 'next/image';

export default function SongCard({ song }: { song: Song }) {
  return (
    <Card className="flex flex-col rounded-md overflow-hidden shadow-md transition-shadow hover:shadow-lg">
      <CardContent className="p-0">
        <div className="flex">
          <div className="relative w-24 h-24 flex-shrink-0">
            <Image
              src={song.imageUrl}
              alt={`${song.title} album art`}
              layout="fill"
              objectFit="cover"
              data-ai-hint="album cover"
            />
          </div>
          <div className="flex-grow p-4 flex justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{song.artist}</p>
              <h3 className="text-lg font-bold">{song.title}</h3>
            </div>
            <div className="flex gap-4 text-right">
              <div>
                <p className="text-xs text-muted-foreground">KEY</p>
                <p className="font-bold">{song.key}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">DURATION</p>
                <p className="font-bold">{song.duration}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">BPM</p>
                <p className="font-bold">{song.bpm}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t">
          <div className="flex">
            <Button variant="ghost" className="flex-1 rounded-none text-muted-foreground hover:bg-gray-100" asChild>
              <a href={song.links.spotify} target="_blank" rel="noopener noreferrer">
                <Spotify className="h-4 w-4 mr-2" /> Spotify
              </a>
            </Button>
            <div className="border-l h-auto"></div>
            <Button variant="ghost" className="flex-1 rounded-none text-muted-foreground hover:bg-gray-100" asChild>
              <a href={song.links.appleMusic} target="_blank" rel="noopener noreferrer">
                <Apple className="h-4 w-4 mr-2" /> Apple Music
              </a>
            </Button>
            <div className="border-l h-auto"></div>
            <Button variant="ghost" className="flex-1 rounded-none text-muted-foreground hover:bg-gray-100" asChild>
              <a href={song.links.amazonMusic} target="_blank" rel="noopener noreferrer">
                <Amazon className="h-4 w-4 mr-2" /> Amazon
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
