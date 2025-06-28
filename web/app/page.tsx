import { Search } from '@/components/search';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Videos } from '@/components/videos';
import { VideosPagination } from '@/components/videos-pagination';
import { getRandomVideoAndFiltersValues } from '@/utils/get-random-video-and-filters-value';
import { getVideos, SearchParams } from '@/utils/get-videos';
import { Suspense, type FC } from 'react';

const HomePageSearch: FC = async () => {
  const { categories, languages, tags, randomVideo } =
    await getRandomVideoAndFiltersValues();

  return (
    <Search
      tags={tags.data}
      categories={categories.data}
      languages={languages.data}
      randomVideo={randomVideo.data}
    />
  );
};

const HomePageVideosAndPagination: FC<{ params: SearchParams }> = async ({
  params,
}) => {
  const {
    data: { data: videos, pagination },
  } = await getVideos(params);

  return (
    <div className="flex flex-col gap-y-7">
      <Videos data={videos} />
      <Separator />
      <VideosPagination data={pagination} />
    </div>
  );
};

const HomePage: FC<{ searchParams: SearchParams }> = ({ searchParams }) => {
  return (
    <div className="flex flex-col gap-y-7">
      <Suspense fallback={<Skeleton className="h-[136px]" />}>
        <HomePageSearch />
      </Suspense>
      <Separator />
      <Suspense fallback={<Skeleton className="h-[550px]" />}>
        <HomePageVideosAndPagination params={searchParams} />
      </Suspense>
    </div>
  );
};

export default HomePage;
