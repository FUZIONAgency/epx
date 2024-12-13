import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { Bell, ChevronDown, Search, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { menuItems } from "@/components/DashboardSidebar";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const TopNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const supabase = useSupabaseClient();
  const user = useUser();
  const [searchOpen, setSearchOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleSearch = (value: string) => {
    const item = menuItems.find((item) => item.title.toLowerCase() === value.toLowerCase());
    if (item) {
      navigate(item.path);
      setSearchOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-white">
      <div className="flex h-16 items-center px-4">
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
        </div>

        {/* Search Box - Hidden on mobile */}
        <div className="flex-1 px-6 hidden md:block">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search pages..."
              className="pl-8 bg-white border-gray-200"
              onClick={() => setSearchOpen(true)}
              readOnly
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-6 ml-auto">
          {/* Company Logo */}
          <div className="h-8 w-8 hidden md:block">
            <img
              src="https://ep5.exhibitpower.com/../upload/header.png"
              alt="Company Logo"
              className="h-full w-full object-contain"
            />
          </div>

          {/* Notification Bell */}
          <button className="relative">
            <Bell className="h-5 w-5 text-black" />
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
              <span className="text-sm font-medium text-black hidden md:block">
                {user?.email?.split("@")[0]}
              </span>
              <ChevronDown className="h-4 w-4 text-black hidden md:block" />
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

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger>
                <Menu className="h-6 w-6" />
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 mt-4">
                  {/* Mobile Search */}
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search pages..."
                      className="pl-8 bg-white border-gray-200"
                      onClick={() => setSearchOpen(true)}
                      readOnly
                    />
                  </div>

                  {/* Mobile Navigation using Sidebar Menu Items */}
                  <div className="space-y-2">
                    {menuItems.map((item) => (
                      <button
                        key={item.title}
                        onClick={() => {
                          navigate(item.path);
                        }}
                        className="flex items-center space-x-2 w-full p-2 hover:bg-accent rounded-md"
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Search all pages..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Pages">
            {menuItems.map((item) => (
              <CommandItem
                key={item.title}
                value={item.title}
                onSelect={handleSearch}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </nav>
  );
};

export default TopNav;