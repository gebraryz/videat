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
import { Language } from './types';
import { useIsMobile } from '../hooks';

export const SearchLanguages: FC<{
  languages: Language[];
  selectedLanguage: Language | null;
  isMenuOpen: boolean;
  onOpeningMenuChange: (value: boolean) => void;
  onLanguageSelect: (language: Language | null) => void;
}> = ({
  languages,
  selectedLanguage,
  isMenuOpen,
  onLanguageSelect,
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

  const handleLanguageSelect = useCallback(
    (language: Language) => {
      onLanguageSelect(language);
      onOpeningMenuChange(false);
    },
    [onLanguageSelect, onOpeningMenuChange],
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
            {selectedLanguage && languages?.length > 0
              ? languages.find(
                  (language) => language.code === selectedLanguage.code,
                )?.name
              : t('components.search.languages.language')}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent
        className="w-full p-0"
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
            placeholder={t('components.search.languages.language')}
            onFocus={(event) => event.stopPropagation()}
          />
          <CommandList>
            <CommandEmpty>
              {t('components.search.languages.no-language-found')}
            </CommandEmpty>
            <CommandGroup>
              {languages.map((language) => (
                <CommandItem
                  key={language.code}
                  value={language.code}
                  onSelect={() => handleLanguageSelect(language)}
                  onTouchEnd={(event) => {
                    event.preventDefault();

                    handleLanguageSelect(language);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedLanguage?.code === language.code
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                  {language.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
