import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ChartBar,
  Kanban,
  Building,
  Timer,
  ChartLine,
  User,
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
} from "@/components/ui/sidebar";

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

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
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