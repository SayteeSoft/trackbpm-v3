
import { notFound } from 'next/navigation';
import { getSpotifyTrackDetails } from '@/lib/actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spotify, Apple, Amazon } from '@/components/icons';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import Image from 'next/image';
import AdBanner from '@/components/AdBanner';

export default async function SongPage({ params }: { params: { id: string } }) {
  const result = await getSpotifyTrackDetails(params.id);

  if (result.error || !result.song) {
    console.error(result.error);
    notFound();
  }

  const { song } = result;

  const amazonSearchUrl = `https://music.amazon.com/search/${encodeURIComponent(song.title + ' ' + song.artist)}`;
  const appleSearchUrl = `https://music.apple.com/us/search?term=${encodeURIComponent(song.title + ' ' + song.artist)}`;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card className="bg-card border-none shadow-none">
                <CardHeader className="p-0">
                  <CardTitle className="text-4xl font-bold">{song.title}</CardTitle>
                  <CardDescription className="text-xl text-muted-foreground">{song.artist}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 mt-6 p-0">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">About this song</h3>
                    <p className="text-muted-foreground">
                        This data is fetched from Spotify. More details can be found on the official pages.
                    </p>
                    <Separator className="my-6" />
                     <a href={`https://www.google.com/search?q=${encodeURIComponent(song.title + ' ' + song.artist + ' BPM')}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">
                        Find BPM on another source
                    </a>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Listen on</h3>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button variant="outline" asChild>
                        <a href={`https://open.spotify.com/track/${song.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                          <Spotify className="h-6 w-6" /> Spotify
                        </a>
                      </Button>
                      <Button variant="outline" asChild>
                        <a href={appleSearchUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                          <Apple className="h-6 w-6" /> Apple Music
                        </a>
                      </Button>
                      <Button variant="outline" asChild>
                        <a href={amazonSearchUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                          <Amazon className="h-6 w-6" /> Amazon
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
               <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Song Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">BPM</span>
                        <span className="font-bold text-lg">{song.bpm}</span>
                    </div>
                    <Separator/>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Key</span>
                        <span className="font-bold text-lg">{song.key}</span>
                    </div>
                     <Separator/>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Duration</span>
                        <span className="font-bold text-lg">{song.duration}</span>
                    </div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                    <Image src={song.imageUrl || 'https://placehold.co/300x300.png'} alt={`${song.title} album art`} width={300} height={300} className="rounded-md w-full h-auto" data-ai-hint="album cover"/>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="my-8">
            <AdBanner />
          </div>
          <Button variant="link" asChild className="mt-8 px-0">
            <Link href="/">← Back to search</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
