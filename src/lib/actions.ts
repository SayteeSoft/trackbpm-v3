'use server';

import { suggestUiFeatures } from '@/ai/flows/suggest-ui-features';
import { z } from 'zod';

export async function getSuggestedFeatures(appDescription: string): Promise<{suggestions?: string[], error?: string}> {
  const schema = z.string().min(10, { message: 'Please provide a more detailed description (at least 10 characters).' });
  const validation = schema.safeParse(appDescription);
  if (!validation.success) {
    return { error: validation.error.flatten().formErrors[0] };
  }

  try {
    const result = await suggestUiFeatures({ appDescription });
    return { suggestions: result.suggestedFeatures };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to get suggestions from AI. Please try again later.' };
  }
}
