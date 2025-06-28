import { VideosPagination } from '@/components/videos-pagination/types';
import { PartialVideoMetadata } from '@/components/videos/video-card/types';
import { getLocale } from './locale';
import { request } from './request';

export interface SearchParams {
  page: number;
  search?: string;
  language?: string;
  tags?: string[];
  category?: string;
}

export const getVideos = async (params: SearchParams) => {
  const locale = await getLocale();

  const data = await request.get<{
    data: PartialVideoMetadata[];
    pagination: VideosPagination;
  }>('/videos', {
    params,
    headers: { 'Accept-Language': locale },
  });

  return data;
};
