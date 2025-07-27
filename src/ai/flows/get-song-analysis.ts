'use server';

/**
 * @fileOverview An AI agent for generating a detailed analysis of a song.
 *
 * - getSongAnalysis - A function that returns a detailed analysis paragraph for a given song.
 * - SongAnalysisInput - The input type for the getSongAnalysis function.
 * - SongAnalysisOutput - The return type for the getSongAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SongAnalysisInputSchema = z.object({
  artist: z.string().describe('The artist of the song.'),
  title: z.string().describe('The title of the song.'),
  bpm: z.string().describe('The beats per minute (BPM) of the song.'),
  key: z.string().describe("The musical key of the song (e.g., 'C Major', 'A# Minor')."),
  duration: z.string().describe('The duration of the song (e.g., "3:45").'),
});
export type SongAnalysisInput = z.infer<typeof SongAnalysisInputSchema>;

const SongAnalysisOutputSchema = z.object({
    analysis: z.string().describe('A detailed paragraph analyzing the song\'s musical characteristics. It should mention the tempo, key, mode (major/minor), energy, danceability, and time signature.'),
});
export type SongAnalysisOutput = z.infer<typeof SongAnalysisOutputSchema>;

export async function getSongAnalysis(input: SongAnalysisInput): Promise<SongAnalysisOutput> {
  return getSongAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getSongAnalysisPrompt',
  input: {schema: SongAnalysisInputSchema},
  output: {schema: SongAnalysisOutputSchema},
  prompt: `You are a music expert and analyst. You are writing a short, engaging summary of a song for a music information website.

You will be given the song's title, artist, BPM, key, and duration.

Based on this information and your knowledge, write a descriptive paragraph (around 50-70 words) about the song.

The paragraph must include:
- The tempo (BPM), and a mention of its half-time and double-time equivalents.
- The duration in minutes and seconds.
- The musical key and mode (e.g., "C key and a major mode").
- A comment on its energy level and danceability.
- The time signature (assume 4/4 beats per bar unless you know otherwise for this specific song).

Do not use markdown. Write a single paragraph.

Example:
"Space Oddity - 2015 Remaster is a song by David Bowie with a tempo of 134 BPM. It can also be used half-time at 67 BPM or double-time at 268 BPM. The track runs 5 minutes and 18 seconds long with a C key and a major mode. It has average energy and is not very danceable with a time signature of 4 beats per bar."

Song Details:
- Title: {{{title}}}
- Artist: {{{artist}}}
- BPM: {{{bpm}}}
- Key: {{{key}}}
- Duration: {{{duration}}}
`,
});

const getSongAnalysisFlow = ai.defineFlow(
  {
    name: 'getSongAnalysisFlow',
    inputSchema: SongAnalysisInputSchema,
    outputSchema: SongAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
