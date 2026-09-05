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
import { useNavigate } from "react-router-dom"
import {useAuth} from "@/contexts/AuthContext"
import { Group, LogOut, Settings, User, Users } from "lucide-react"

export default function NavBar(){
     const navigate = useNavigate();
    const {logout} = useAuth();

        function handleLogout(){
            logout();
            navigate("/login",{replace:true})
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
                    <DropdownMenuItem><User /> Profile</DropdownMenuItem>
                    <DropdownMenuItem><Settings /> Setting</DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                    <DropdownMenuItem><Users /> Team</DropdownMenuItem>

                    <DropdownMenuItem onClick={handleLogout}><LogOut /> Logout</DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    )
}