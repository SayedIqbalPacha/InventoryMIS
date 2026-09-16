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
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Settings, User, Users } from "lucide-react";

export default function NavBar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <nav className="sticky top-0   flex items-center justify-between px-2 h-16 border-b bg-background">
      {/* left */}

      <SidebarTrigger />
      {/* right */}
      <div className="flex  justify-between items-center px-2 ">
        <ModeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="ml-4">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem>
                <Link to="/profile" className="flex items-center gap-2">
                  <User /> Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings /> Setting
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link to="/users" className="flex items-center gap-2">
                  <Users /> Team
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={handleLogout}>
                <LogOut /> Logout
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
