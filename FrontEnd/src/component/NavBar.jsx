import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Languages, LogOut, Settings, User, Users } from "lucide-react";

import { ModeToggle } from "@/components/ToggleChange";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";

export default function NavBar() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { t, i18n } = useTranslation();

  const currentLanguage = i18n.resolvedLanguage || i18n.language;
  const isDari = currentLanguage.startsWith("prs");

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <nav className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-2">
      <SidebarTrigger />

      <div className="flex items-center gap-2 px-2">
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={t("language")}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Languages className="size-4" />
            <span>{isDari ? "دری" : "EN"}</span>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>{t("language")}</DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => i18n.changeLanguage("en")}>
              English
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => i18n.changeLanguage("prs")}>
              دری
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ModeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={t("myAccount")}
            className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Avatar className="ml-2">
              <AvatarImage src="#" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>{t("myAccount")}</DropdownMenuLabel>

              <DropdownMenuItem>
                <Link to="/profile" className="flex items-center gap-2">
                  <User />
                  {t("profile")}
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Link to="/settings" className="flex items-center gap-2">
                  <Settings />
                  {t("settings")}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link to="/users" className="flex items-center gap-2">
                  <Users />
                  {t("team")}
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={handleLogout}>
                <LogOut />
                {t("logout")}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
