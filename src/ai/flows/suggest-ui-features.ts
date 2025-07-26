'use server';

/**
 * @fileOverview A UI feature suggestion AI agent.
 *
 * - suggestUiFeatures - A function that suggests UI features based on a description of the desired application.
 * - SuggestUiFeaturesInput - The input type for the suggestUiFeatures function.
 * - SuggestUiFeaturesOutput - The return type for the suggestUiFeatures function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestUiFeaturesInputSchema = z.object({
  appDescription: z
    .string()
    .describe('The description of the desired application.'),
});
export type SuggestUiFeaturesInput = z.infer<typeof SuggestUiFeaturesInputSchema>;

const SuggestUiFeaturesOutputSchema = z.object({
  suggestedFeatures: z.array(z.string()).describe('The suggested UI features for the application.'),
});
export type SuggestUiFeaturesOutput = z.infer<typeof SuggestUiFeaturesOutputSchema>;

export async function suggestUiFeatures(input: SuggestUiFeaturesInput): Promise<SuggestUiFeaturesOutput> {
  return suggestUiFeaturesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestUiFeaturesPrompt',
  input: {schema: SuggestUiFeaturesInputSchema},
  output: {schema: SuggestUiFeaturesOutputSchema},
  prompt: `You are a UI/UX expert. You will use the description of the desired application to suggest a list of UI features that would be relevant to the application.

Description: {{{appDescription}}}

Suggest UI features:`,
});

const suggestUiFeaturesFlow = ai.defineFlow(
  {
    name: 'suggestUiFeaturesFlow',
    inputSchema: SuggestUiFeaturesInputSchema,
    outputSchema: SuggestUiFeaturesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
