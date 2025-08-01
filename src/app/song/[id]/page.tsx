
import { notFound } from 'next/navigation';
import { getSpotifyTrackDetails } from '@/lib/actions';
import { getSongAnalysis } from '@/ai/flows/get-song-analysis';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spotify, Apple, Amazon } from '@/components/icons';
import Link from 'next/link';
import Image from 'next/image';
import AdBanner from '@/components/AdBanner';
import AdBannerSkyscraper from '@/components/AdBannerSkyscraper';
import { Separator } from '@/components/ui/separator';

async function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="bg-card border-border p-4 text-center">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </Card>
  );
}

async function ListenOnCard({ service, url, icon }: { service: string; url: string; icon: React.ReactNode }) {
  return (
     <a href={url} target="_blank" rel="noopener noreferrer" className="block">
      <Card className="bg-card border-border p-4 text-center transition-colors hover:bg-muted/50">
          <p className="text-sm text-muted-foreground">Listen on</p>
          <div className="flex items-center justify-center gap-2 mt-1">
            {icon}
            <p className="text-lg font-semibold">{service}</p>
          </div>
      </Card>
    </a>
  );
}

export default async function SongPage({ params: { id } }: { params: { id: string } }) {
  const result = await getSpotifyTrackDetails(id);

  if (result.error || !result.song) {
    console.error(result.error);
    notFound();
  }

  const { song } = result;

  // Start fetching analysis as soon as we have song details
  const analysisPromise = getSongAnalysis({
    title: song.title,
    artist: song.artist,
    bpm: song.bpm,
    key: song.key,
    duration: song.duration,
  });

  const amazonSearchUrl = `https://music.amazon.com/search/${encodeURIComponent(song.title + ' ' + song.artist)}`;
  const appleSearchUrl = `https://music.apple.com/us/search?term=${encodeURIComponent(song.title + ' ' + song.artist)}`;
  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(song.artist)}`;

  // Simple Markdown to HTML converter for bolding
  const renderAnalysis = (text: string) => {
    const html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return { __html: html };
  };

  const analysisResult = await analysisPromise;


  return (
    <div className="bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-[calc(42rem+90px)] mx-auto">
            <div className="flex flex-col md:flex-row gap-8 justify-center">
                <div className="w-full">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-8">
                    <div className="flex-shrink-0 mx-auto sm:mx-0">
                        <Link href={youtubeSearchUrl} target="_blank" rel="noopener noreferrer">
                            <Image 
                            src={song.imageUrl || 'https://placehold.co/300x300.png'} 
                            alt={`${song.title} album art`} 
                            width={250} 
                            height={250} 
                            className="rounded-lg w-full sm:w-[250px] h-auto shadow-lg"
                            data-ai-hint="album cover"
                            priority={true}
                            />
                        </Link>
                    </div>
                    <div className="flex-1 mt-5 sm:mt-1 text-center sm:text-left">
                        <p className="text-lg font-medium text-foreground mb-2">{song.artist}</p>
                        <h1 className="text-[36px] sm:text-[60px] font-bold tracking-tighter text-foreground leading-tight pr-4">{song.title}</h1>
                        {song.bpm && (
                        <Badge variant="destructive" className="mt-4">
                            <span className="mr-2">•</span> {Math.round(parseFloat(song.bpm))} BPM
                        </Badge>
                        )}
                    </div>
                    </div>

                    <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-center md:text-left">Song Metrics</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <MetricCard label="Key" value={song.key} />
                        <MetricCard label="Duration" value={song.duration} />
                        <MetricCard label="Tempo (BPM)" value={Math.round(parseFloat(song.bpm)).toString()} />
                        <ListenOnCard 
                        service="Spotify"
                        url={`https://open.spotify.com/track/${song.id}`} 
                        icon={<Spotify className="h-6 w-6" />}
                        />
                        <ListenOnCard 
                        service="Apple Music"
                        url={appleSearchUrl}
                        icon={<Apple className="h-6 w-6" />}
                        />
                        <ListenOnCard 
                        service="Amazon"
                        url={amazonSearchUrl}
                        icon={<Amazon className="h-6 w-6" />}
                        />
                    </div>
                    </div>
                    
                    {analysisResult.analysis && (
                    <div className="space-y-4">
                        <p 
                            className="text-base text-muted-foreground leading-relaxed"
                            dangerouslySetInnerHTML={renderAnalysis(analysisResult.analysis)}
                        />
                        <Separator className="my-6" />
                        <a href={`https://www.google.com/search?q=${encodeURIComponent(song.title + ' ' + song.artist + ' BPM')}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">
                            Find BPM on another source
                        </a>
                    </div>
                    )}
                    <Button variant="link" asChild className="mt-8 px-0">
                    <Link href="/">← Back to search</Link>
                    </Button>
                </div>

                <div className="w-full md:w-[160px] flex-shrink-0 hidden md:block">
                    <AdBannerSkyscraper />
                </div>
            </div>
        </div>
        
        <div className="my-12 max-w-[calc(42rem+90px)] mx-auto">
          <AdBanner />
        </div>
       
      </main>
    </div>
  );
}
