import { notFound } from 'next/navigation';
import { songs } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spotify, Apple, Amazon } from '@/components/icons';
import { Separator } from '@/components/ui/separator';

export default function SongPage({ params }: { params: { id: string } }) {
  const song = songs.find((s) => s.id === params.id);

  if (!song) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl font-bold">{song.title}</CardTitle>
          <CardDescription className="text-xl text-muted-foreground">{song.artist}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-2xl font-semibold mb-2">About this song</h3>
            <p className="text-muted-foreground">{song.longDescription}</p>
             <br/>
            <Separator className="my-4" />
            <a href={`https://www.google.com/search?q=${encodeURIComponent(song.title + ' ' + song.artist + ' BPM')}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                Find BPM on another source
            </a>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-2">Listen on</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href={song.links.spotify} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xl hover:underline">
                <Spotify className="h-6 w-6" /> Spotify
              </a>
              <a href={song.links.appleMusic} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xl hover:underline">
                <Apple className="h-6 w-6" /> Apple Music
              </a>
              <a href={song.links.amazonMusic} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xl hover:underline">
                <Amazon className="h-6 w-6" /> Amazon
              </a>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" asChild>
            <a href="/">Back to search</a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
