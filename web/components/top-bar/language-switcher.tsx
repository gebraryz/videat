"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setUserLocale } from "@/utils/locale";
import { Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { FC } from "react";

export const TopBarLanguageSwitcher: FC = () => {
  const t = useTranslations();
  const locale = useLocale();

  const languages = {
    en: {
      name: t("components.top-bar.language-switcher.english"),
      value: "en",
      icon: "🇬🇧",
    },
    pl: {
      name: t("components.top-bar.language-switcher.polish"),
      value: "pl",
      icon: "🇵🇱",
    },
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label={t("components.top-bar.language-switcher.switch")}
        >
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">
            {t("components.top-bar.language-switcher.switch")}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(languages).map(([key, { name, value, icon }]) => (
          <DropdownMenuItem
            key={key}
            disabled={value === locale}
            onClick={() => {
              setUserLocale(value);
            }}
            className="flex items-center gap-2"
          >
            <span>{icon}</span>
            {name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
