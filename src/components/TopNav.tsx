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
      className="border-b relative"
      style={{
        backgroundImage: 'url(https://luewnstegrjsnlucdkja.supabase.co/storage/v1/object/public/site/EPHeader.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="relative z-10 bg-black/30">
        <div className="flex h-16 items-center px-4 text-white">
          {/* Left section */}
          <div className="flex items-center space-x-6">
            {/* App Logo */}
            <div className="text-xl font-bold h-10 w-32 flex items-start">
              <img
                src="https://luewnstegrjsnlucdkja.supabase.co/storage/v1/object/public/site/WhiteLogo.png"
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
                    <div className="grid gap-3 p-4 w-[400px] bg-white text-black">
                      <NavigationMenuLink className="cursor-pointer hover:bg-accent p-2 rounded">
                        Product 1
                      </NavigationMenuLink>
                      <NavigationMenuLink className="cursor-pointer hover:bg-accent p-2 rounded">
                        Product 2
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-white">Solutions</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-4 w-[400px] bg-white text-black">
                      <NavigationMenuLink className="cursor-pointer hover:bg-accent p-2 rounded">
                        Solution 1
                      </NavigationMenuLink>
                      <NavigationMenuLink className="cursor-pointer hover:bg-accent p-2 rounded">
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
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 bg-white/90 border-white/20"
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
                  <AvatarFallback>
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
      </div>
    </nav>
  );
};

export default TopNav;