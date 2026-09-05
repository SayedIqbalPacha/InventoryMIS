import { ModeToggle } from "@/components/ToggleChange"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
 
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { logout } from "@/services/auth"
import { useNavigate } from "react-router-dom"


export default function NavBar(){
        const navigate = useNavigate();

        function handleLogout(){
            logout()
            navigate("/Login")
        }

    return(
        <nav className="sticky top-0 z-50  flex items-center justify-between px-2  py-2 bg-neutral-900">
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
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Setting</DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                    <DropdownMenuItem>Team</DropdownMenuItem>

                    <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    )
}