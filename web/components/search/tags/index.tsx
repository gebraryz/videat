import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/utils/cn';
import { Plus, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRef, useState, type FC } from 'react';
import { Tag } from './types';

const EXAMPLE_TAGS = [
  'tutorial',
  'react',
  'javascript',
  'beginner',
  'advanced',
];

export const SearchTags: FC<{
  selectedTags: Tag[];
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
}> = ({ selectedTags, addTag, removeTag }) => {
  const t = useTranslations();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [inputValue, setInputValue] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const currentExampleTag =
    EXAMPLE_TAGS[placeholderIndex % EXAMPLE_TAGS.length];

  const handleAddTag = () => {
    const newTag = inputValue.trim();

    if (newTag && !selectedTags.find((tag) => tag.name === newTag)) {
      addTag(newTag);
      setInputValue('');
      setPlaceholderIndex((previousState) => previousState + 1);
    }
  };

  const getPlaceholder = () => {
    if (selectedTags.length === 0) {
      return `np. ${currentExampleTag}`;
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div
        className={cn(
          'border-input focus-visible:border-ring focus-visible:ring-ring/50 bg-background flex min-h-10 w-full cursor-text items-center gap-1.5 rounded-md border text-base shadow-xs transition-[color,box-shadow] outline-none',
          'hover:border-input/80',
          isFocused ? 'border-ring ring-ring/50 ring-[3px]' : '',
          selectedTags.length > 0 ? 'px-2 py-1.5' : 'px-3 py-2',
          'md:min-h-9 md:text-sm',
        )}
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
          {selectedTags.map((selectedTag) => (
            <Badge
              key={selectedTag.name}
              variant="secondary"
              className="animate-in fade-in-0 zoom-in-95 flex shrink-0 items-center gap-1 px-2 py-1 text-xs duration-200"
            >
              <span className="max-w-[100px] truncate sm:max-w-none">
                {selectedTag.name}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-secondary-foreground/20 h-3 w-3 shrink-0 rounded-full p-0 transition-colors"
                onClick={(event) => {
                  event.stopPropagation();
                  removeTag(selectedTag.name);
                }}
                aria-label={t('components.search.tags.remove_tag', {
                  tag: selectedTag.name,
                })}
              >
                <X className="h-2.5 w-2.5" />
              </Button>
            </Badge>
          ))}

          <div className="flex min-w-0 flex-1 items-center gap-2">
            <Input
              ref={inputRef}
              className="placeholder:text-muted-foreground/60 h-auto min-w-[120px] flex-1 border-0 p-0 text-sm shadow-none focus-visible:ring-0"
              type="text"
              value={inputValue}
              placeholder={getPlaceholder()}
              onChange={({ target: { value } }) => {
                setInputValue(value);

                if (value.includes(',')) {
                  const newTag = value.split(',')[0].trim();

                  if (
                    newTag &&
                    !selectedTags.find((tag) => tag.name === newTag)
                  ) {
                    addTag(newTag);
                    setPlaceholderIndex((prev) => prev + 1);
                  }

                  setInputValue('');
                }
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ',') {
                  event.preventDefault();

                  handleAddTag();
                } else if (
                  event.key === 'Backspace' &&
                  inputValue === '' &&
                  selectedTags.length > 0
                ) {
                  removeTag(selectedTags[selectedTags.length - 1].name);
                }
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />

            {inputValue.trim() ? (
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-accent animate-in fade-in-0 zoom-in-95 h-6 w-6 shrink-0 rounded-full p-0 transition-all duration-200"
                onClick={handleAddTag}
                aria-label={t('components.search.tags.add_tag')}
              >
                <Plus className="h-3 w-3" />
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      {isFocused && selectedTags.length === 0 ? (
        <div className="text-muted-foreground animate-in fade-in-0 slide-in-from-top-1 absolute top-full mt-1 px-1 text-xs duration-200">
          {t('components.search.tags.placeholder', {
            example: currentExampleTag,
          })}
        </div>
      ) : null}
    </div>
  );
};
