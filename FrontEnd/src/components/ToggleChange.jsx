import { Moon, Sun } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useTheme } from "@/components/ThemProvider";
import { useTranslation } from "react-i18next";

 export function ModeToggle() {
  const { t } = useTranslation();
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger  className="inline-flex h-9 w-9 items-center justify-center rounded-md border">
        {/* <Button variant="outline" size="icon"> */}
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />

          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />

          <span className="sr-only">{t("toggleTheme")}</span>
        {/* </Button> */}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          {t("lightTheme")}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setTheme("dark")}>
          {t("darkTheme")}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setTheme("system")}>
          {t("themeSystem")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
