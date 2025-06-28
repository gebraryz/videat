'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { FC, FormEvent } from 'react';
import { useState } from 'react';
import { Input } from '../ui/input';

export const TopBarSearch: FC = () => {
  const router = useRouter();
  const [query, setQuery] = useState<string>('');

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();

    if (query.trim()) {
      router.push(`?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
      <Input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="bg-background w-[150px] pl-8 lg:w-[400px]"
      />
    </form>
  );
};
