
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { RolePermissions } from '@/lib/types';
import { useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  CreditCard,
  Truck,
  FileText,
  Settings,
  Building2,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Wallet,
  BarChart3,
  Menu,
  MessageCircle,
} from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon: any;
  permission: string;
  badge?: string;
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    permission: 'dashboard',
  },
  {
    title: 'Clientes',
    href: '/clientes',
    icon: Users,
    permission: 'clientes',
  },
  {
    title: 'Productos',
    href: '/productos',
    icon: Package,
    permission: 'productos',
  },
  {
    title: 'Ventas',
    href: '/ventas',
    icon: ShoppingCart,
    permission: 'ventas',
  },
  {
    title: 'Cobranza',
    href: '/cobranza',
    icon: CreditCard,
    permission: 'cobranza',
  },
  {
    title: 'Cobranza Móvil',
    href: '/dashboard/cobranza-movil',
    icon: Smartphone,
    permission: 'cobranza',
  },
  {
    title: 'Comunicación',
    href: '/comunicacion',
    icon: MessageCircle,
    permission: 'clientes',
  },
  {
    title: 'Almacén',
    href: '/almacen',
    icon: Truck,
    permission: 'almacen',
  },
  {
    title: 'Cuentas por Pagar',
    href: '/cuentas-pagar',
    icon: Wallet,
    permission: 'almacen',
  },
  {
    title: 'Gestión de Crédito',
    href: '/credito',
    icon: UserCheck,
    permission: 'cobranza',
  },
  {
    title: 'Reportes',
    href: '/reportes',
    icon: BarChart3,
    permission: 'reportes',
  },
  {
    title: 'Configuración',
    href: '/configuracion',
    icon: Settings,
    permission: 'configuracion',
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession() || {};

  const userRole = session?.user?.role;
  const permissions = userRole ? RolePermissions[userRole] : {};

  const filteredNavItems = navItems?.filter?.(item => {
    const permission = permissions?.[item?.permission];
    return permission?.read === true;
  }) || [];

  const toggleCollapsed = () => setCollapsed(!collapsed);
  const toggleMobile = () => setMobileOpen(!mobileOpen);

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={toggleMobile}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed left-0 top-0 z-40 h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out',
          collapsed ? 'w-16' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          className
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              {!collapsed && (
                <h1 className="text-xl font-bold text-gray-900">
                  Sistema ERP
                </h1>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCollapsed}
              className="hidden md:flex"
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-2 py-4">
            {filteredNavItems?.map?.((item) => {
              const isActive = pathname === item.href || 
                              (item.href !== '/dashboard' && pathname?.startsWith?.(item.href));
              
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <item.icon
                      className={cn(
                        'mr-3 flex-shrink-0 h-5 w-5',
                        isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                      )}
                    />
                    {!collapsed && (
                      <>
                        <span className="flex-1">{item.title}</span>
                        {item?.badge && (
                          <span className="ml-3 inline-block py-0.5 px-2 text-xs bg-blue-100 text-blue-800 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* User info */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                  {session?.user?.firstName?.charAt?.(0) || session?.user?.name?.charAt?.(0) || 'U'}
                </div>
              </div>
              {!collapsed && (
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">
                    {session?.user?.firstName || session?.user?.name || 'Usuario'}
                  </p>
                  <p className="text-xs text-gray-500">{session?.user?.role}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
