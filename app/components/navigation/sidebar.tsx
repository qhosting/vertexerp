'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Home,
  Users,
  Package,
  ShoppingCart,
  FileText,
  CreditCard,
  PlusCircle,
  MinusCircle,
  RefreshCw,
  Shield,
  BarChart3,
  Settings,
  Menu,
  Zap,
  Building,
  Bot,
  Database,
  FileCheck,
  TrendingUp,
  Truck,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface NavigationItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  badge?: string | number;
}

interface NavigationGroup {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: NavigationItem[];
}

const navigationGroups: NavigationGroup[] = [
  {
    id: 'comercial',
    title: 'Comercial',
    icon: <ShoppingCart className="h-4 w-4 text-emerald-500" />,
    items: [
      { title: 'Clientes', href: '/clientes', icon: <Users className="h-4 w-4" /> },
      { title: 'Productos', href: '/productos', icon: <Package className="h-4 w-4" /> },
      { title: 'Pedidos', href: '/pedidos', icon: <ShoppingCart className="h-4 w-4" /> },
      { title: 'Ventas', href: '/ventas', icon: <FileText className="h-4 w-4" /> },
      { title: 'Compras', href: '/compras', icon: <Truck className="h-4 w-4" />, badge: 'Nuevo' },
    ]
  },
  {
    id: 'cobranza',
    title: 'Cobranza y Crédito',
    icon: <CreditCard className="h-4 w-4 text-blue-500" />,
    items: [
      { title: 'Pagarés', href: '/pagares', icon: <CreditCard className="h-4 w-4" /> },
      { title: 'Notas de Cargo', href: '/notas-cargo', icon: <PlusCircle className="h-4 w-4" /> },
      { title: 'Notas de Crédito', href: '/notas-credito', icon: <MinusCircle className="h-4 w-4" /> },
      { title: 'Reestructuras', href: '/reestructuras', icon: <RefreshCw className="h-4 w-4" /> },
      { title: 'Factura Electrónica', href: '/facturacion-electronica', icon: <FileCheck className="h-4 w-4" />, badge: 'Nuevo' },
    ]
  },
  {
    id: 'analisis',
    title: 'Análisis y Soporte',
    icon: <BarChart3 className="h-4 w-4 text-indigo-500" />,
    items: [
      { title: 'Reportes', href: '/reportes', icon: <BarChart3 className="h-4 w-4" /> },
      { title: 'BI / Analíticos', href: '/business-intelligence', icon: <TrendingUp className="h-4 w-4" />, badge: 'Nuevo' },
      { title: 'Garantías', href: '/garantias', icon: <Shield className="h-4 w-4" /> },
      { title: 'Auditoría', href: '/auditoria', icon: <Database className="h-4 w-4" />, badge: 'Nuevo' },
    ]
  },
  {
    id: 'ajustes',
    title: 'Ajustes',
    icon: <Settings className="h-4 w-4 text-gray-500" />,
    items: [
      { title: 'Automatización', href: '/automatizacion', icon: <Bot className="h-4 w-4" />, badge: 'Nuevo' },
      { title: 'Configuración', href: '/configuracion', icon: <Settings className="h-4 w-4" /> },
    ]
  }
];

function NavigationContent() {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  // Auto-expandir grupo si alguna subruta está activa
  useEffect(() => {
    const activeGroup = navigationGroups.find(group => 
      group.items.some(item => pathname === item.href || pathname.startsWith(item.href + '/'))
    );
    if (activeGroup) {
      setOpenGroups(prev => ({ ...prev, [activeGroup.id]: true }));
    }
  }, [pathname]);

  const toggleGroup = (id: string) => {
    setOpenGroups(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const isDashboardActive = pathname === '/dashboard' || pathname === '/';

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 border-r border-slate-800">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20">
            <Building className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-md font-bold tracking-tight text-white">VertexERP</span>
            <span className="text-[10px] font-medium text-emerald-400 uppercase tracking-widest">Corporativo</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-4">
          
          {/* Dashboard Direct Link */}
          <div className="px-2">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start gap-3 h-10 text-slate-300 hover:text-white hover:bg-slate-800/60',
                  isDashboardActive && 'bg-slate-800 text-white font-medium border-l-2 border-emerald-500 rounded-l-none pl-[14px]'
                )}
              >
                <Home className={cn("h-4 w-4", isDashboardActive ? "text-emerald-400" : "text-slate-400")} />
                <span className="flex-1 text-left">Dashboard</span>
              </Button>
            </Link>
          </div>

          {/* Grouped Menus */}
          <div className="space-y-2">
            {navigationGroups.map((group) => {
              const isOpen = !!openGroups[group.id];
              const isGroupActive = group.items.some(item => 
                pathname === item.href || pathname.startsWith(item.href + '/')
              );

              return (
                <div key={group.id} className="space-y-1">
                  {/* Group Header Button */}
                  <div className="px-2">
                    <Button
                      variant="ghost"
                      onClick={() => toggleGroup(group.id)}
                      className={cn(
                        'w-full justify-between gap-3 h-10 text-slate-400 hover:text-white hover:bg-slate-800/40 font-semibold text-xs uppercase tracking-wider',
                        isGroupActive && 'text-slate-200'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {group.icon}
                        <span>{group.title}</span>
                      </div>
                      {isOpen ? (
                        <ChevronDown className="h-3.5 w-3.5 text-slate-500 transition-transform duration-200" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5 text-slate-500 transition-transform duration-200" />
                      )}
                    </Button>
                  </div>

                  {/* Group Sub-items */}
                  {isOpen && (
                    <div className="pl-4 pr-2 space-y-1 border-l border-slate-800 ml-5 mt-1 transition-all duration-300 ease-in-out">
                      {group.items.map((item, itemIdx) => {
                        const isSubActive = pathname === item.href || pathname.startsWith(item.href + '/');

                        return (
                          <Link key={itemIdx} href={item.href}>
                            <Button
                              variant="ghost"
                              className={cn(
                                'w-full justify-start gap-3 h-9 text-xs text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-md',
                                isSubActive && 'bg-slate-800 text-white font-medium text-emerald-400'
                              )}
                            >
                              <div className={cn("w-1.5 h-1.5 rounded-full bg-slate-600", isSubActive && "bg-emerald-500")} />
                              <span className="flex-1 text-left">{item.title}</span>
                              {item.badge && (
                                <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-semibold px-2 py-0.5 rounded-full">
                                  {item.badge}
                                </span>
                              )}
                            </Button>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* Separator & Badge */}
        <div className="mt-8 px-4 py-3 bg-slate-950/40 rounded-lg border border-slate-800/40 mx-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <Zap className="h-3.5 w-3.5 animate-pulse" />
            <span>VertexERP Activado</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Suite corporativa premium con base de datos en tiempo real.
          </p>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/50">
        <div className="text-[10px] text-slate-500 space-y-1">
          <div>Última actualización: 18/05/2026</div>
          <div>© 2026 VertexERP Completo</div>
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="md:hidden text-slate-400 hover:text-white">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Abrir menú</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64 bg-slate-900 border-r-slate-800">
          <NavigationContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-slate-800 bg-slate-900">
        <NavigationContent />
      </div>
    </>
  );
}

export default Sidebar;
