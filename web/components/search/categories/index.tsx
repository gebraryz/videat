import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/utils/cn';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { useCallback, useRef } from 'react';
import { Category } from './types';
import { useIsMobile } from '../hooks';

export const SearchCategories: FC<{
  categories: Category[];
  selectedCategory: Category | null;
  isMenuOpen: boolean;
  onOpeningMenuChange: (value: boolean) => void;
  onCategorySelect: (category: Category | null) => void;
}> = ({
  categories,
  selectedCategory,
  isMenuOpen,
  onCategorySelect,
  onOpeningMenuChange,
}) => {
  const t = useTranslations();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const isMobile = useIsMobile();

  const handleTriggerInteraction = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      onOpeningMenuChange(!isMenuOpen);
    },
    [isMenuOpen, onOpeningMenuChange],
  );

  const handleCategorySelect = useCallback(
    (category: Category) => {
      if (category.id === selectedCategory?.id) {
        onCategorySelect(null);
      } else {
        onCategorySelect(category);
      }
      onOpeningMenuChange(false);
    },
    [onCategorySelect, onOpeningMenuChange, selectedCategory],
  );

  return (
    <Popover open={isMenuOpen} onOpenChange={onOpeningMenuChange}>
      <div className="relative">
        <PopoverTrigger asChild>
          <Button
            ref={triggerRef}
            variant="outline"
            role="combobox"
            className="w-full justify-between"
            aria-expanded={isMenuOpen}
            onClick={handleTriggerInteraction}
            style={{
              WebkitUserSelect: 'none',
              userSelect: 'none',
              WebkitTouchCallout: 'none',
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'none',
            }}
          >
            {selectedCategory && categories?.length > 0
              ? categories.find(
                  (category) => category.id === selectedCategory.id,
                )?.title
              : t('components.search.categories.category')}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent
        className="w-[200px] p-0"
        align="start"
        side="bottom"
        sideOffset={4}
        style={
          !isMobile
            ? { width: '100%' }
            : { width: triggerRef.current?.offsetWidth }
        }
        onInteractOutside={(event) => {
          const target = event.target as Element;

          if (triggerRef.current?.contains(target)) {
            event.preventDefault();
          }
        }}
      >
        <Command>
          <CommandInput
            placeholder={t('components.search.categories.category')}
            onFocus={(e) => e.stopPropagation()}
          />
          <CommandList>
            <CommandEmpty>
              {t('components.search.categories.no-category-found')}
            </CommandEmpty>
            <CommandGroup>
              {categories.map((category) => (
                <CommandItem
                  key={category.id}
                  value={category.id}
                  onSelect={() => handleCategorySelect(category)}
                  onTouchEnd={(event) => {
                    event.preventDefault();

                    handleCategorySelect(category);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedCategory?.id === category.id
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                  {category.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
