import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ChartBar,
  Kanban,
  Building,
  Timer,
  ChartLine,
  User,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export const menuItems = [
  {
    title: "Overview",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Pipeline",
    path: "/dashboard/pipeline",
    icon: Kanban,
  },
  {
    title: "Performance",
    path: "/dashboard/performance",
    icon: User,
  },
  {
    title: "Companies",
    path: "/dashboard/companies",
    icon: Building,
  },
  {
    title: "Deal Velocity",
    path: "/dashboard/velocity",
    icon: Timer,
  },
  {
    title: "Forecasting",
    path: "/dashboard/forecasting",
    icon: ChartLine,
  },
];

export function DashboardSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { open, setOpen } = useSidebar();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-between px-2 mb-2">
            <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(!open)}
              className="h-7 w-7"
            >
              {open ? (
                <PanelLeftClose className="h-4 w-4" />
              ) : (
                <PanelLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className={
                      location.pathname === item.path
                        ? "bg-accent text-accent-foreground"
                        : ""
                    }
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}