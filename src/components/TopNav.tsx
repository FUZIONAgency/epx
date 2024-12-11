import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { Bell, ChevronDown, Search, Menu } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

const TopNav = () => {
  const navigate = useNavigate();
  const supabase = useSupabaseClient();
  const user = useUser();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <nav 
      className="border-b" 
      style={{
        backgroundImage: `url('https://ep5.exhibitpower.com/../upload/header.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="flex h-16 items-center px-4 bg-black bg-opacity-50">
        {/* Left section */}
        <div className="flex items-center space-x-6">
          {/* App Logo */}
          <div className="text-xl font-bold h-10 w-32">
            <img
              src="https://ep5.exhibitpower.com/../upload/header.png"
              alt="App Logo"
              className="h-full w-full object-contain"
            />
          </div>

          {/* Main Navigation */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-white">Products</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-4 w-[400px]">
                    <NavigationMenuLink className="cursor-pointer hover:bg-accent p-2 rounded text-white">
                      Product 1
                    </NavigationMenuLink>
                    <NavigationMenuLink className="cursor-pointer hover:bg-accent p-2 rounded text-white">
                      Product 2
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-white">Solutions</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-4 w-[400px]">
                    <NavigationMenuLink className="cursor-pointer hover:bg-accent p-2 rounded text-white">
                      Solution 1
                    </NavigationMenuLink>
                    <NavigationMenuLink className="cursor-pointer hover:bg-accent p-2 rounded text-white">
                      Solution 2
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Search Box */}
        <div className="flex-1 px-6">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 bg-white bg-opacity-80"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-6">
          {/* Company Logo */}
          <div className="h-8 w-8">
            <img
              src="https://ep5.exhibitpower.com/../upload/header.png"
              alt="Company Logo"
              className="h-full w-full object-contain"
            />
          </div>

          {/* Notification Bell */}
          <button className="relative">
            <Bell className="h-5 w-5 text-white" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
              3
            </span>
          </button>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="text-white">
                  {user?.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-white">
                {user?.email?.split("@")[0]}
              </span>
              <ChevronDown className="h-4 w-4 text-white" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;