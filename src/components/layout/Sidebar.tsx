"use client";
// import React from "react";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import { Bell, Menu, X, Home, Users, ChartBar, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";


type DecodedToken = {
  name: string;
  email: string;
  role?: string;
  [key: string]: any;
};
const Sidebar = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const pathname = usePathname();
  const [user, setUser] = useState<DecodedToken | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error("Token tidak valid:", error);
      }
    }
  }, []);
  
  const menuItems = [
    { 
      href: '/dashboard', 
      label: 'Dashboard', 
      icon: Home
    },
    { 
      href: '/dashboard/siswa', 
      label: 'Siswa', 
      icon: Users
    },
    { 
      href: '/dashboard/kelas', 
      label: 'Kelas', 
      icon: ChartBar
    },
    { 
      href: '/dashboard/pelanggaran', 
      label: 'Pelanggaran', 
      icon: ChartBar
    },
  ];
  
  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-6 border-b">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-primary-foreground font-semibold text-sm">S</span>
          </div>
          <h1 className="text-lg font-semibold tracking-tight">SchoolApp</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-8 w-8"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map(({ href, label, icon: Icon}) => {
          const isActive = href === '/dashboard'
          ? pathname === '/dashboard'
          : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                "flex items-center justify-between w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-600 text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <div className="flex items-center space-x-3">
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
      
      {/* Footer */}
      <div className="p-4 border-t">
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-blue-600 text-primary-foreground text-xs">
              AD
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || "Admin User"}</p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email ||"admin@school.com"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
  
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64 lg:overflow-y-auto lg:border-r">
        <SidebarContent />
      </aside>
      
      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Sidebar;