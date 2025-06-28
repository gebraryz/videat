'use client';

import { Filter, Search as SearchIcon, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { ElementCard } from '../element-card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { PartialVideoMetadata } from '../videos/video-card/types';
import { SearchCategories } from './categories';
import { Category } from './categories/types';
import { useIsMobile } from './hooks';
import { SearchInput } from './input';
import { SearchLanguages } from './languages';
import { Language } from './languages/types';
import { SearchTags } from './tags';
import { Tag } from './tags/types';

export const Search: FC<{
  randomVideo: PartialVideoMetadata | null;
  tags: Tag[];
  languages: Language[];
  categories: Category[];
}> = ({ randomVideo, languages, categories }) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations();

  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<Category | null>(null);
  const [language, setLanguage] = useState<Language | null>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [openPopover, setOpenPopover] = useState<
    'categories' | 'languages' | null
  >(null);

  const isMobile = useIsMobile();

  useEffect(() => {
    const urlSearch = searchParams.get('search');
    const urlCategory = searchParams.get('category');
    const urlLanguage = searchParams.get('language');
    const urlTags = searchParams.get('tags');

    setSearchQuery(urlSearch || '');

    setCategory(
      urlCategory
        ? categories.find((cat) => cat.id === urlCategory) || null
        : null,
    );

    setLanguage(
      urlLanguage
        ? languages.find((lang) => lang.code === urlLanguage) || null
        : null,
    );

    setSelectedTags(
      urlTags ? urlTags.split(',').map((name) => ({ name: name.trim() })) : [],
    );
  }, [searchParams, categories, languages]);

  useEffect(() => {
    if (!showMobileFilters) {
      setOpenPopover(null);
    }
  }, [showMobileFilters]);

  const hasActiveFilters = Boolean(
    searchQuery || category || language || selectedTags.length > 0,
  );

  const activeFiltersCount =
    (searchQuery ? 1 : 0) +
    (category ? 1 : 0) +
    (language ? 1 : 0) +
    selectedTags.length;

  const handleSearch = () => {
    const queryString = new URLSearchParams();

    if (searchQuery) queryString.set('search', searchQuery);
    if (category) queryString.set('category', category.id);
    if (language) queryString.set('language', language.code);
    if (selectedTags.length > 0) {
      queryString.set('tags', selectedTags.map((tag) => tag.name).join(','));
    }

    router.push(`${pathname}?${queryString.toString()}`);
    setShowMobileFilters(false);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setCategory(null);
    setLanguage(null);
    setSelectedTags([]);
  };

  const handleCategoryChange = (isOpen: boolean) => {
    setOpenPopover(isOpen ? 'categories' : null);
  };

  const handleLanguageChange = (isOpen: boolean) => {
    setOpenPopover(isOpen ? 'languages' : null);
  };

  const addTag = (tagName: string) => {
    setSelectedTags([...selectedTags, { name: tagName }]);
  };

  const removeTag = (tagName: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag.name !== tagName));
  };

  return (
    <ElementCard>
      <div className="space-y-4">
        <div className="flex w-full gap-3">
          <div className="flex-1">
            <SearchInput
              placeholder={
                randomVideo
                  ? t('components.search.placeholder_with_example', {
                      title: randomVideo.title,
                    })
                  : t('components.search.placeholder')
              }
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>

          {isMobile ? (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="relative"
              >
                <Filter className="h-4 w-4" />
                {activeFiltersCount > 0 && (
                  <span className="bg-primary text-primary-foreground absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-xs">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
              <Button type="button" onClick={handleSearch}>
                <SearchIcon className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              onClick={handleSearch}
              className="cursor-pointer"
            >
              <SearchIcon className="mr-0.5 h-4 w-4" />
              {t('components.search.search_action')}
            </Button>
          )}
        </div>

        {isMobile ? (
          showMobileFilters ? (
            <div className="space-y-3 rounded-lg border p-4 shadow-lg">
              <SearchCategories
                key="mobile-categories"
                categories={categories}
                selectedCategory={category}
                isMenuOpen={openPopover === 'categories'}
                onOpeningMenuChange={handleCategoryChange}
                onCategorySelect={setCategory}
              />
              <SearchLanguages
                key="mobile-languages"
                languages={languages}
                selectedLanguage={language}
                isMenuOpen={openPopover === 'languages'}
                onOpeningMenuChange={handleLanguageChange}
                onLanguageSelect={setLanguage}
              />
              <SearchTags
                selectedTags={selectedTags}
                addTag={addTag}
                removeTag={removeTag}
              />
              <div className="flex gap-2 border-t pt-2">
                <Button
                  type="button"
                  onClick={handleSearch}
                  className="flex-1 cursor-pointer"
                >
                  <SearchIcon className="mr-2 h-4 w-4" />
                  {t('components.search.search_action')}
                </Button>
                {hasActiveFilters && (
                  <Button
                    type="button"
                    variant="outline"
                    className="cursor-pointer"
                    onClick={clearAllFilters}
                  >
                    {t('components.search.clear_all_filters')}
                  </Button>
                )}
              </div>
            </div>
          ) : null
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <SearchCategories
              key="desktop-categories"
              categories={categories}
              selectedCategory={category}
              isMenuOpen={openPopover === 'categories'}
              onOpeningMenuChange={handleCategoryChange}
              onCategorySelect={setCategory}
            />
            <SearchLanguages
              key="desktop-languages"
              languages={languages}
              selectedLanguage={language}
              isMenuOpen={openPopover === 'languages'}
              onOpeningMenuChange={handleLanguageChange}
              onLanguageSelect={setLanguage}
            />
            <div className="min-w-0 flex-1">
              <SearchTags
                selectedTags={selectedTags}
                addTag={addTag}
                removeTag={removeTag}
              />
            </div>
          </div>
        )}

        {hasActiveFilters ? (
          <div className="border-t pt-3">
            <div className="flex flex-wrap items-center gap-2">
              {searchQuery ? (
                <Badge variant="outline" className="gap-1">
                  <span className="text-muted-foreground text-xs">
                    {t('components.search.search_query')}:
                  </span>
                  <span className="max-w-[100px] truncate sm:max-w-none">
                    {searchQuery}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="hover:bg-muted ml-1 cursor-pointer rounded-full p-0.5 transition-colors"
                    aria-label={t('components.search.clear_search_query')}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ) : null}
              {category ? (
                <Badge variant="outline" className="gap-1">
                  <span className="text-muted-foreground text-xs">
                    {t('components.search.category')}:
                  </span>
                  <span className="max-w-[100px] truncate sm:max-w-none">
                    {category.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCategory(null)}
                    className="hover:bg-muted ml-1 cursor-pointer rounded-full p-0.5 transition-colors"
                    aria-label={t('components.search.clear_category')}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ) : null}
              {language ? (
                <Badge variant="outline" className="gap-1">
                  <span className="text-muted-foreground text-xs">
                    {t('components.search.language')}:
                  </span>
                  <span className="max-w-[100px] truncate sm:max-w-none">
                    {language.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => setLanguage(null)}
                    className="hover:bg-muted ml-1 cursor-pointer rounded-full p-0.5 transition-colors"
                    aria-label={t('components.search.clear_language')}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ) : null}
              {selectedTags.map((tag) => (
                <Badge key={tag.name} variant="outline" className="gap-1">
                  <span className="text-muted-foreground text-xs">
                    {t('components.search.tag')}:
                  </span>
                  <span className="max-w-[100px] truncate sm:max-w-none">
                    {tag.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag.name)}
                    className="hover:bg-muted ml-1 cursor-pointer rounded-full p-0.5 transition-colors"
                    aria-label={t('components.search.remove_tag', {
                      tag: tag.name,
                    })}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-muted-foreground hover:text-foreground h-auto cursor-pointer px-2 py-1 text-xs"
              >
                {t('components.search.clear_all_filters')}
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </ElementCard>
  );
};
