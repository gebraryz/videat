'use client';

import { ElementCard } from '@/components/element-card';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/utils/cn';
import { usePathname } from 'next/navigation';
import type { FC } from 'react';
import type { VideosPagination as VideosPaginationType } from './types';

export const VideosPagination: FC<{ data: VideosPaginationType }> = ({
  data: { currentPage, hasNextPage, hasPreviousPage, totalPages },
}) => {
  const pathname = usePathname();

  const redirectToPage = (page: number) => `${pathname}?page=${page}`;

  return (
    <ElementCard>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className={cn(
                hasPreviousPage
                  ? 'cursor-pointer'
                  : 'cursor-not-allowed opacity-50',
              )}
              href={hasPreviousPage ? redirectToPage(currentPage - 1) : '#'}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, index) => (
            <PaginationItem key={index}>
              <PaginationLink href={redirectToPage(index + 1)}>
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          {totalPages > 5 ? (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          ) : null}
          <PaginationItem>
            <PaginationNext
              className={cn(
                hasNextPage
                  ? 'cursor-pointer'
                  : 'cursor-not-allowed opacity-50',
              )}
              href={hasNextPage ? redirectToPage(currentPage + 1) : '#'}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </ElementCard>
  );
};
