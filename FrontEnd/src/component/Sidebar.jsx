
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ShoppingBag,
  Users,
  Truck,
  Boxes,
  DollarSign,
  FileText,
  Settings,
  House,
  SquaresUniteIcon,
  UserIcon,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const mainItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
     link:"/",
  },
  {
    title: "Items",
    icon: Package,
     link:"/items",
  },
  {
    title: "Categories",
    icon: Boxes,
     link:"/catagory",
  },
  {
    title: "Customers",
    icon: Users,
     link:"/customer",
  },
  {
    title: "Vendors",
    icon: Truck,
     link:"/vendor",
  },
  {
    title: "Units",
    icon: SquaresUniteIcon,
     link:"/units",
  },
  {
    title: "Users",
    icon: UserIcon,
     link:"/users",
  },

];

const transactionItems = [
  {
    title: "Purchase",
    icon: ShoppingBag,
    link:"/purchase",
  },
  {
    title: "Sales",
    icon: ShoppingCart,
    link:"/sales",
  },
  {
    title: "Currency",
    icon: DollarSign,
    link:"/currency"
  },
  {
    title: "Reports",
    icon: FileText,
    link:"/reports"
  },
];

export function AppSidebar() {
  return (
   
    <Sidebar collapsible="icon">
      <SidebarHeader>
       
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                ERP
              </div>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  My ERP System
                </span>

                <span className="truncate text-xs">
                  Management System
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title} className="py-2">
                  <SidebarMenuButton  tooltip={item.title}>
                    <Link to={item.link} className="flex justify-between ">
                      <item.icon />
                      <span className="ml-2">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Transactions</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {transactionItems.map((item) => (
                <SidebarMenuItem key={item.title} className="py-2">
                  <SidebarMenuButton  tooltip={item.title}>
                    <Link to={item.link} className="flex justify-between">
                      <item.icon />
                      <span className="ml-2">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton  tooltip="Settings">
                  <Link to="" className="flex justify-between">
                    <Settings />
                    <span className="ml-2">Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton  tooltip="Profile">
              <Link to="" className="flex justify-between">
                <Users />
                <span className="ml-2">Profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
   
  );
}

