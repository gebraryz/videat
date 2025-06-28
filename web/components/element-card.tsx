import { cn } from '@/utils/cn';
import type { FC, PropsWithChildren } from 'react';

export const ElementCard: FC<PropsWithChildren<{ className?: string }>> = ({
  className,
  children,
}) => (
  <div className={cn('bg-background rounded-sm p-6 shadow', className)}>
    {children}
  </div>
);
