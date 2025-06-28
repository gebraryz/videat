'use client';

import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useState, type FC } from 'react';
import { PartialVideoMetadata } from './types';
import { Button } from '@/components/ui/button';

const MAX_TAGS = 10;

export const VideoCard: FC<PartialVideoMetadata> = ({
  url,
  videoId,
  title,
  tags,
  channel,
  thumbnails,
  language,
}) => {
  const t = useTranslations();
  const [isThumbnailZoomed, setIsThumbnailZoomed] = useState(false);

  const getTagJsx = (tag: string) => (
    <Link href={`?tags=${tag}`} key={tag}>
      <Badge key={tag} variant="secondary" className="text-xs">
        {tag}
      </Badge>
    </Link>
  );

  const thumbnailUrl = thumbnails.maxres?.url ?? thumbnails.medium.url;

  return (
    <>
      <div className="flex h-full flex-col rounded-sm border shadow">
        <div className="relative h-[200px] w-full">
          <Image
            className="rounded-tl-sm rounded-tr-sm"
            src={thumbnailUrl}
            alt={t('components.videos.video-card.thumbnail', { title })}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL={thumbnails.default?.url}
            onClick={() => {
              setIsThumbnailZoomed(true);
            }}
          />
        </div>
        <div className="flex flex-grow flex-col">
          <div className="p-4">
            {language ? (
              <Link href={`?language=${language.code}`} title={language.name}>
                <Badge variant="outline" className="mb-2 text-xs">
                  {language.name}
                </Badge>
              </Link>
            ) : null}
            <div>
              <h3 className="font-bold">
                <q>{title}</q>
              </h3>
              <Link
                href={`/channel/${channel.id}`}
                title={channel.title}
                className="text-muted-foreground"
              >
                {channel.title}
              </Link>
            </div>
            {tags && tags.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-1">
                {tags.slice(0, MAX_TAGS).map((tag) => getTagJsx(tag))}
                {tags.length > MAX_TAGS ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge variant="outline" className="text-xs">
                          +{tags.length - MAX_TAGS}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent className="bg-primary-foreground flex max-h-[400px] flex-col gap-y-1 overflow-y-auto">
                        {tags.slice(MAX_TAGS).map((tag) => getTagJsx(tag))}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : null}
              </div>
            ) : null}
          </div>
          <div className="mx-4 mt-auto mb-4 flex flex-col gap-y-2">
            <Button variant="outline" className="w-full" asChild>
              <Link href={`/videos/${videoId}`}>
                {t('components.videos.video-card.details')}
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href={url} target="_blank" rel="noreferrer noopener">
                {t('components.videos.video-card.watch')}
              </Link>
            </Button>
          </div>
        </div>
      </div>
      {isThumbnailZoomed ? (
        <Dialog open={isThumbnailZoomed} onOpenChange={setIsThumbnailZoomed}>
          <DialogContent className="!max-w-[800px]">
            <DialogHeader>
              <DialogTitle>
                <q>{title}</q>
              </DialogTitle>
            </DialogHeader>
            <div className="relative h-[400px] w-full">
              <Image src={thumbnailUrl} alt={title} fill />
            </div>
          </DialogContent>
        </Dialog>
      ) : null}
    </>
  );
};
