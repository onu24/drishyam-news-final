'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  PenSquare, 
  Users, 
  Tags, 
  Menu, 
  X,
  ShieldAlert,
  Settings
} from 'lucide-react';

export function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/admin') return pathname === '/admin';
    return pathname.startsWith(path);
  };

  const menuGroups = [
    {
      title: 'Editorial',
      items: [
        { href: '/admin', label: 'Overview', icon: LayoutDashboard },
        { href: '/admin/articles', label: 'All Articles', icon: FileText },
        { href: '/admin/articles/new', label: 'New Story', icon: PenSquare },
      ]
    },
    {
      title: 'Management',
      items: [
        { href: '/admin/categories', label: 'Categories', icon: Tags },
        { href: '/admin/authors', label: 'Authors', icon: Users },
        { href: '#', label: 'Settings', icon: Settings }, // Placeholder for future
      ]
    }
  ];

  const SidebarContent = () => (
    <>
      <div className="flex items-center justify-between p-6 border-b border-border/50">
        <div>
          <h2 className="font-serif text-2xl font-bold tracking-tight text-primary">Drishyam</h2>
          <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mt-1">
            Newsroom Hub
          </p>
        </div>
        {/* Mobile Close Button */}
        <button 
          className="md:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md"
          onClick={() => setIsMobileOpen(false)}
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
        {menuGroups.map((group) => (
          <div key={group.title}>
            <h3 className="px-3 mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-all ${
                      active
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                    }`}
                  >
                    <item.icon 
                      size={18} 
                      className={`mr-3 flex-shrink-0 ${active ? 'text-primary' : 'text-muted-foreground'}`} 
                    />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-6 border-t border-border/50">
        <div className="flex items-center gap-3 px-3 py-3 rounded-md bg-amber-500/10 text-amber-600 border border-amber-500/20">
          <ShieldAlert size={18} className="flex-shrink-0" />
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-wider">Security</span>
            <span className="text-xs font-medium">Open Access Mode</span>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Toggle Button (Fixed visible only on small screens) */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed z-[60] bottom-6 right-6 p-4 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-transform active:scale-95"
      >
        <Menu size={24} />
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-background border-r border-border h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)}>
          <aside 
            className="w-[280px] bg-background border-r border-border h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}
