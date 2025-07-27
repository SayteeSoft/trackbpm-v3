import { Song } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spotify, Apple, Amazon } from '@/components/icons';
import Link from 'next/link';

export default function SongCard({ song }: { song: Song }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{song.title}</CardTitle>
        <CardDescription>{song.artist}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">{song.description}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4">
        <div className="text-sm">
          <p className="font-semibold">BPM: {song.bpm}</p>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" className="flex-1 hover:bg-gray-700" asChild>
            <a href={song.links.spotify} target="_blank" rel="noopener noreferrer">
              <Spotify className="h-5 w-5 mr-2" /> Spotify
            </a>
          </Button>
          <Button variant="outline" className="flex-1 hover:bg-gray-700" asChild>
            <a href={song.links.appleMusic} target="_blank" rel="noopener noreferrer">
              <Apple className="h-5 w-5 mr-2" /> Apple Music
            </a>
          </Button>
          <Button variant="outline" className="flex-1 hover:bg-gray-700" asChild>
            <a href={song.links.amazonMusic} target="_blank" rel="noopener noreferrer">
              <Amazon className="h-5 w-5 mr-2" /> Amazon
            </a>
          </Button>
        </div>
        <Button asChild className="w-full">
          <Link href={`/song/${song.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
