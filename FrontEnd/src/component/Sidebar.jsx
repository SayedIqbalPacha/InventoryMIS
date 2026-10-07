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
  Search,
  Settings,
  SquaresUniteIcon,
  UserIcon,
  HandCoins,
  CircleDollarSign,
  ChartCandlestick,
  ChevronDown,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useTranslation } from "react-i18next";

const mainItems = [
  {
    key: "dashboard",
    icon: LayoutDashboard,
    link: "/dashboard",
  },
  {
    key: "items",
    icon: Package,
    link: "/items",
  },
  {
    key: "categories",
    icon: Boxes,
    link: "/catagory",
  },
  {
    key: "customers",
    icon: Users,
    link: "/customer",
  },

  {
    key: "vendors",
    icon: Truck,
    link: "/vendor",
  },
  {
    key: "units",
    icon: SquaresUniteIcon,
    link: "/units",
  },
  {
    key: "users",
    icon: UserIcon,
    link: "/users",
  },
];

const transactionItems = [
  {
    key: "purchase",
    icon: ShoppingBag,
    link: "/purchase",
  },
  {
    key: "sales",
    icon: ShoppingCart,
    link: "/sales",
  },
  {
    key: "currency",
    icon: DollarSign,
    link: "/currency",
  },
  {
    key: "exchangeRates",
    icon: ChartCandlestick,
    link: "/exchange-rates",
  },
  {
    key: "customerPayments",
    icon: HandCoins,
    link: "/customerPayment",
  },
  {
    key: "vendorPayment",
    icon: CircleDollarSign,
    link: "/vendorPayment",
  },
  {
    key: "reports",
    icon: FileText,
    link: "/reports",
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const sidebarSide = i18n.resolvedLanguage?.startsWith("prs")
    ? "right"
    : "left";
  const activityRouteActive = [
    "/customer-activity",
    "/vendor-activity",
  ].includes(location.pathname);
  const [activitiesOpen, setActivitiesOpen] = useState(activityRouteActive);

  return (
    <Sidebar side={sidebarSide} collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                ERP
              </div>

              <div className="grid flex-1 text-start text-sm leading-tight">
                <span className="truncate font-semibold">{t("appName")}</span>

                <span className="truncate text-xs">{t("appSubtitle")}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("management")}</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.key} className="py-2">
                  <Link to={item.link} className="flex justify-between ">
                    <SidebarMenuButton tooltip={t(item.key)}>
                      <item.icon />
                      <span className="ms-2">{t(item.key)}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{t("transactions")}</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className="py-1">
                <SidebarMenuButton
                  tooltip={t("searchActivities")}
                  isActive={activityRouteActive}
                  onClick={() => setActivitiesOpen((open) => !open)}
                  aria-expanded={activitiesOpen}
                >
                  <Search />
                  <span className="flex-1">{t("searchActivities")}</span>
                  <ChevronDown
                    className={`ms-auto transition-transform ${activitiesOpen ? "rotate-180" : ""}`}
                  />
                </SidebarMenuButton>
                {activitiesOpen && (
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        render={<Link to="/customer-activity" />}
                        isActive={location.pathname === "/customer-activity"}
                      >
                        <Users />
                        <span>{t("customerActivity")}</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        render={<Link to="/vendor-activity" />}
                        isActive={location.pathname === "/vendor-activity"}
                      >
                        <Truck />
                        <span>{t("vendorActivity")}</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
              {transactionItems.map((item) => (
                <SidebarMenuItem key={item.key} className="py-2">
                  <Link to={item.link} className="flex justify-between">
                    <SidebarMenuButton tooltip={t(item.key)}>
                      <item.icon />
                      <span className="ms-2">{t(item.key)}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{t("system")}</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link to="/settings" className="flex justify-between">
                  <SidebarMenuButton tooltip={t("settings")}>
                    <Settings />
                    <span className="ms-2">{t("settings")}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link to="/profile" className="flex justify-between">
              <SidebarMenuButton tooltip={t("profile")}>
                <Users />
                <span className="ms-2">{t("profile")}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
