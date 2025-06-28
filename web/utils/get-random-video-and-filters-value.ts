'use server';

import { Category } from '@/components/search/categories/types';
import { Language } from '@/components/search/languages/types';
import { Tag } from '@/components/search/tags/types';
import { PartialVideoMetadata } from '@/components/videos/video-card/types';
import { getLocale } from './locale';
import { request } from './request';

export const getRandomVideoAndFiltersValues = async () => {
  const locale = await getLocale();

  let randomVideo: { data: PartialVideoMetadata | null } = { data: null };

  try {
    randomVideo = await request.get<PartialVideoMetadata>('/videos/random', {
      headers: { 'Accept-Language': locale },
    });
  } catch (e) {
    console.warn('No random video available:', e);
    randomVideo = { data: null }; // fallback
  }

  const categories = await request.get<Category[]>('/videos/categories', {
    headers: { 'Accept-Language': locale },
  });

  const tags = await request.get<Tag[]>('/videos/tags', {
    headers: { 'Accept-Language': locale },
  });

  const languages = await request.get<Language[]>('/videos/languages', {
    headers: { 'Accept-Language': locale },
  });

  return {
    randomVideo,
    categories,
    languages,
    tags,
  };
};
