'use client';

import type { FC } from 'react';
import { ElementCard } from '../element-card';
import { VideoCard } from './video-card';
import { PartialVideoMetadata } from './video-card/types';
import { useTranslations } from 'next-intl';
import { Search, Video, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

export const Videos: FC<{
  data: PartialVideoMetadata[];
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
}> = ({ data, onClearFilters, hasActiveFilters = false }) => {
  const t = useTranslations();
  const router = useRouter();

  const EmptyState = () => (
    <div className="col-span-full flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="bg-muted/50 mb-6 flex h-20 w-20 items-center justify-center rounded-full">
        {hasActiveFilters ? (
          <Search className="text-muted-foreground/60 h-10 w-10" />
        ) : (
          <Video className="text-muted-foreground/60 h-10 w-10" />
        )}
      </div>

      <h3 className="text-foreground mb-3 text-xl font-semibold">
        {hasActiveFilters
          ? t('components.videos.no_results_title')
          : t('components.videos.no_videos_title')}
      </h3>

      <p className="text-muted-foreground mb-6 max-w-md text-sm leading-relaxed">
        {hasActiveFilters
          ? t('components.videos.no_results_description')
          : t('components.videos.no_videos_description')}
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        {hasActiveFilters && onClearFilters ? (
          <Button variant="default" onClick={onClearFilters} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            {t('components.videos.clear_filters')}
          </Button>
        ) : null}

        <Button
          variant={hasActiveFilters ? 'outline' : 'default'}
          onClick={() => router.refresh()}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          {t('components.videos.refresh')}
        </Button>
      </div>

      {!hasActiveFilters ? (
        <div className="bg-muted/30 border-muted-foreground/20 mt-8 rounded-lg border border-dashed p-4">
          <p className="text-muted-foreground text-xs">
            {t('components.videos.help_text')}
          </p>
        </div>
      ) : null}
    </div>
  );

  return (
    <ElementCard className="grid gap-6 md:grid-cols-3">
      {data.length > 0 ? (
        data.map((video) => <VideoCard key={video.id} {...video} />)
      ) : (
        <EmptyState />
      )}
    </ElementCard>
  );
};
