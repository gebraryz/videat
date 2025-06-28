import { Search } from 'lucide-react';
import type { FC } from 'react';
import { Input } from '../ui/input';
import { useTranslations } from 'next-intl';

export const SearchInput: FC<{
  value: string;
  placeholder?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ value, placeholder, onChange }) => {
  const t = useTranslations();

  return (
    <div className="relative w-full">
      <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
      <Input
        type="search"
        value={value}
        onChange={onChange}
        className="bg-background pl-8"
        placeholder={placeholder ?? t('components.search.input.example-search')}
      />
    </div>
  );
};
