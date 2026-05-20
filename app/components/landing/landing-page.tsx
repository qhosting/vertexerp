'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  ArrowRight, 
  CheckCircle, 
  Smartphone, 
  ShieldCheck, 
  Database, 
  HelpCircle,
  MessageSquare,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Users,
  FileText,
  Receipt,
  BrainCircuit,
  Store,
  Globe,
  FileHeart,
  ChevronDown,
  ChevronUp,
  Activity,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  X,
  BadgePercent,
  Briefcase,
  FileCheck2
} from 'lucide-react';

export function CorporateLandingPage() {
  // Estados para el contacto general
  const [contactForm, setContactForm] = useState({ name: '', email: '', company: '', phone: '', message: '' });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [submittingContact, setSubmittingContact] = useState(false);

  // Estados generales
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Estados del E-commerce
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('Todos');
  const [cart, setCart] = useState<{ producto: any; cantidad: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Checkout
  const [checkoutMode, setCheckoutMode] = useState<'b2c' | 'b2b' | null>(null);
  const [checkoutForm, setCheckoutForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    empresa: '',
    direccion: '',
    notas: '',
    metodoPago: 'Tarjeta de Crédito'
  });
  const [checkoutSuccess, setCheckoutSuccess] = useState<{ folio?: string; isB2B?: boolean } | null>(null);
  const [submittingCheckout, setSubmittingCheckout] = useState(false);

  // Cargar productos desde la base de datos real
  useEffect(() => {
    async function loadCatalog() {
      try {
        const response = await fetch('/api/ecommerce/productos');
        if (response.ok) {
          const data = await response.json();
          setProductos(data.productos || []);
        }
      } catch (error) {
        console.error('Error cargando catálogo público:', error);
      } finally {
        setLoading(false);
      }
    }
    loadCatalog();
  }, []);

  // Manejar el formulario de contacto para registrar un Prospecto en el CRM
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;

    setSubmittingContact(true);
    try {
      const response = await fetch('/api/ecommerce/cotizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clienteNombre: contactForm.name,
          clienteEmail: contactForm.email,
          clienteTelefono: contactForm.phone,
          empresa: contactForm.company,
          items: [{ productoId: null, cantidad: 1, precioUnitario: 0 }],
          notas: `Consulta general del sitio web corporativo:\n${contactForm.message}`
        })
      });

      if (response.ok) {
        setContactSubmitted(true);
        setTimeout(() => {
          setContactSubmitted(false);
          setContactForm({ name: '', email: '', company: '', phone: '', message: '' });
        }, 5000);
      }
    } catch (e) {
      console.error('Error al registrar prospecto de contacto:', e);
    } finally {
      setSubmittingContact(false);
    }
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  // E-commerce: agregar producto al carrito
  const addToCart = (producto: any) => {
    setCart((prevCart) => {
      const existing = prevCart.find(item => item.producto.id === producto.id);
      if (existing) {
        return prevCart.map(item => 
          item.producto.id === producto.id 
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prevCart, { producto, cantidad: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateCartQty = (productId: string, delta: number) => {
    setCart((prevCart) => {
      return prevCart.map(item => {
        if (item.producto.id === productId) {
          const newQty = item.cantidad + delta;
          return newQty > 0 ? { ...item, cantidad: newQty } : null;
        }
        return item;
      }).filter((item): item is { producto: any; cantidad: number } => item !== null);
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter(item => item.producto.id !== productId));
  };

  // Calcular precio y nivel de descuento de un producto en base a su cantidad (Precios Multinivel)
  const getProductPriceAndTier = (producto: any, cantidad: number) => {
    let precio = producto.precio1;
    let tier = 'Precio Público';

    if (cantidad >= 5 && producto.precio3 > 0) {
      precio = producto.precio3;
      tier = producto.etiquetaPrecio3 || 'Precio Distribuidor';
    } else if (cantidad >= 2 && producto.precio2 > 0) {
      precio = producto.precio2;
      tier = producto.etiquetaPrecio2 || 'Precio Mayorista';
    }

    return { precio, tier };
  };

  // Cálculos del Carrito
  const cartTotals = cart.reduce((acc, item) => {
    const { precio } = getProductPriceAndTier(item.producto, item.cantidad);
    const itemSubtotal = precio * item.cantidad;
    return {
      subtotal: acc.subtotal + itemSubtotal,
    };
  }, { subtotal: 0 });

  const subtotal = cartTotals.subtotal;
  const iva = subtotal * 0.16;
  const total = subtotal + iva;

  // Procesar pedido (B2C) o cotización (B2B)
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutForm.nombre || !checkoutForm.email) return;

    setSubmittingCheckout(true);
    try {
      const itemsPayload = cart.map(item => {
        const { precio } = getProductPriceAndTier(item.producto, item.cantidad);
        return {
          productoId: item.producto.id,
          cantidad: item.cantidad,
          precioUnitario: precio
        };
      });

      if (checkoutMode === 'b2c') {
        // Enviar pedido real a /api/ecommerce/pedidos
        const response = await fetch('/api/ecommerce/pedidos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clienteNombre: checkoutForm.nombre,
            clienteEmail: checkoutForm.email,
            clienteTelefono: checkoutForm.telefono,
            items: itemsPayload,
            metodoPago: checkoutForm.metodoPago,
            referenciaPago: 'ECO-WEB-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
            total: total,
            observaciones: `Pedido B2C - Envío: ${checkoutForm.direccion}. Notas: ${checkoutForm.notas}`
          })
        });

        if (response.ok) {
          const resData = await response.json();
          setCheckoutSuccess({ folio: resData.folio, isB2B: false });
          setCart([]);
        }
      } else {
        // Enviar cotización B2B a /api/ecommerce/cotizar para crear Prospecto
        const response = await fetch('/api/ecommerce/cotizar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clienteNombre: checkoutForm.nombre,
            clienteEmail: checkoutForm.email,
            clienteTelefono: checkoutForm.telefono,
            empresa: checkoutForm.empresa,
            items: itemsPayload,
            notas: `Solicitud de Cotización Comercial.\nDirección: ${checkoutForm.direccion}\nNotas del proyecto: ${checkoutForm.notas}`
          })
        });

        if (response.ok) {
          const resData = await response.json();
          setCheckoutSuccess({ isB2B: true });
          setCart([]);
        }
      }
    } catch (e) {
      console.error('Error al procesar checkout:', e);
    } finally {
      setSubmittingCheckout(false);
    }
  };

  // Obtener categorías únicas presentes en los productos
  const categorias = ['Todos', ...Array.from(new Set(productos.map(p => p.categoria).filter(Boolean)))];

  // Filtrar productos
  const filteredProducts = productos.filter(p => {
    const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.modelo?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategoria === 'Todos' || p.categoria === selectedCategoria;
    return matchesSearch && matchesCategory;
  });

  const faqs = [
    {
      q: "¿Cumple con la normativa CFDI 4.0 del SAT mexicano?",
      a: "Totalmente. Nuestro addon de facturación oficial SAT está conectado nativamente a Contpaqi API local, lo que le permite timbrar Facturas Electrónicas, Recibos Electrónicos de Pago (REP) y Notas de Crédito y Cargo con estricto apego al estándar del SAT, utilizando sus propios Certificados de Sello Digital (CSD)."
    },
    {
      q: "¿Cómo funciona el seguimiento de cobranza satelital y por GPS?",
      a: "Nuestra aplicación móvil para gestores de campo registra las visitas y cobros con coordenadas satelitales en tiempo real. Cuenta con validación estricta de IMEI del teléfono para evitar fraudes, soporte para firmas electrónicas y geocercas que guían al gestor por las rutas más eficientes optimizando el rendimiento."
    },
    {
      q: "¿Puedo habilitar o desactivar módulos según las necesidades de mi negocio?",
      a: "Sí. VertexERP es 100% modular y cuenta con un ecosistema de addons integrados de marca blanca. Desde el panel de administración, puedes prender o apagar módulos completos (CRM, POS, E-commerce, IA predictiva). La interfaz de usuario lateral y los permisos del sistema se adaptan de forma instantánea."
    },
    {
      q: "¿Qué es el motor de Inteligencia Artificial Abacus.AI integrado?",
      a: "Es un motor analítico avanzado que estudia los patrones históricos de pago, días de cobro y montos pendientes para generar gráficas predictivas en tiempo real. Calcula de manera inteligente el riesgo de morosidad por cliente, permitiendo a la empresa tomar acciones preventivas de cobranza."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-slate-950/80 border-b border-slate-900/80 px-6 py-4 flex items-center justify-between transition-all">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              VertexERP
            </span>
            <span className="block text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-widest -mt-0.5">
              Marca Blanca
            </span>
          </div>
        </div>

        <nav className="hidden md:flex space-x-8 text-sm font-semibold text-slate-400">
          <a href="#inicio" className="hover:text-white transition-colors relative">Inicio</a>
          <a href="#soluciones" className="hover:text-white transition-colors relative">Módulos</a>
          <a href="#tienda" className="hover:text-white transition-colors relative flex items-center gap-1.5">
            Tienda Comercial <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </a>
          <a href="#precios" className="hover:text-white transition-colors relative">Precios</a>
          <a href="#faq" className="hover:text-white transition-colors relative">Faq</a>
          <a href="#contacto" className="hover:text-white transition-colors relative">Contacto</a>
        </nav>

        <div className="flex items-center space-x-4">
          {/* Botón Flotante del Carrito */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative h-10 w-10 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 flex items-center justify-center text-slate-300 hover:text-white transition-all"
          >
            <ShoppingCart className="h-5 w-5" />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-5 min-w-[20px] px-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black rounded-full flex items-center justify-center text-[10px] shadow animate-bounce">
                {cart.reduce((a, b) => a + b.cantidad, 0)}
              </span>
            )}
          </button>

          <Link 
            href="/login" 
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 text-sm font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Acceder al ERP
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-24 pb-20 relative overflow-hidden">
        <div className="max-w-4xl space-y-8 z-10">
          <div className="inline-flex items-center space-x-2 bg-slate-900/90 border border-slate-800 rounded-full px-4.5 py-1.5 text-xs text-blue-400 font-semibold shadow-inner mb-2 animate-pulse">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Mapeo y Timbrado Dinámico de Addons Activo</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
            El ERP Modular de <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Marca Blanca para Empresas
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Optimiza tus almacenes, gestiona créditos con pagarés estructurados, calcula cobros con geolocalización satelital en campo y automatiza facturas ante el SAT.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <a 
              href="#tienda" 
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-white px-7 py-3.5 text-base font-bold text-slate-950 shadow-md hover:bg-slate-100 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Comprar o Cotizar B2B
            </a>
            <a 
              href="#soluciones" 
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800/80 px-7 py-3.5 text-base font-bold text-slate-300 transition-all"
            >
              Ver Catálogo de Módulos
            </a>
          </div>
        </div>
      </section>

      {/* Solutions / Addons Grid Section */}
      <section id="soluciones" className="py-24 bg-slate-900/30 border-y border-slate-900 px-6">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Ecosistema Modular de Addons</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base">
              Nuestra arquitectura de Marca Blanca te permite prender y apagar los módulos de la empresa desde el panel general.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1: CRM Clientes */}
            <div className="bg-slate-950/60 border border-slate-900/80 rounded-2xl p-6 hover:border-slate-800 transition-all flex flex-col justify-between hover:shadow-lg hover:shadow-blue-500/5 group">
              <div className="space-y-4">
                <div className="h-12 w-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 transition-all group-hover:scale-110">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white">CRM y Expediente de Clientes</h3>
                <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                  Completo registro comercial de clientes, referencias personales, avales, historial crediticio unificado y mapeo satelital.
                </p>
              </div>
              <div className="pt-6 border-t border-slate-900/60 mt-6 flex justify-between items-center">
                <span className="text-[10px] bg-slate-900 text-emerald-400 border border-emerald-500/10 px-2 py-0.5 rounded font-semibold font-mono">CRM-CLIENTES</span>
                <span className="text-[10px] text-slate-500 font-medium">Requerido por Ventas</span>
              </div>
            </div>

            {/* Card 2: Almacen */}
            <div className="bg-slate-950/60 border border-slate-900/80 rounded-2xl p-6 hover:border-slate-800 transition-all flex flex-col justify-between hover:shadow-lg hover:shadow-blue-500/5 group">
              <div className="space-y-4">
                <div className="h-12 w-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 transition-all group-hover:scale-110">
                  <Database className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Inventario y Multialmacén</h3>
                <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                  Monitoreo de stock en tiempo real, múltiples listas de precios bases, lotes, números de serie, órdenes de compra y Kardex integrado.
                </p>
              </div>
              <div className="pt-6 border-t border-slate-900/60 mt-6 flex justify-between items-center">
                <span className="text-[10px] bg-slate-900 text-blue-400 border border-blue-500/10 px-2 py-0.5 rounded font-semibold font-mono">INVENTARIO-CXP</span>
                <span className="text-[10px] text-slate-500 font-medium">Incluye Kardex</span>
              </div>
            </div>

            {/* Card 3: Pagarés */}
            <div className="bg-slate-950/60 border border-slate-900/80 rounded-2xl p-6 hover:border-slate-800 transition-all flex flex-col justify-between hover:shadow-lg hover:shadow-blue-500/5 group">
              <div className="space-y-4">
                <div className="h-12 w-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400 transition-all group-hover:scale-110">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Pagarés e Intereses Moratorios</h3>
                <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                  Fraccionamiento de deudas comerciales en pagarés atómicos. Motor que calcula de forma diaria intereses moratorios automáticos.
                </p>
              </div>
              <div className="pt-6 border-t border-slate-900/60 mt-6 flex justify-between items-center">
                <span className="text-[10px] bg-slate-900 text-amber-400 border border-amber-500/10 px-2 py-0.5 rounded font-semibold font-mono">PAGARES-INTERESES</span>
                <span className="text-[10px] text-slate-500 font-medium">Financiero y Crédito</span>
              </div>
            </div>

            {/* Card 4: Cobranza Satelital */}
            <div className="bg-slate-950/60 border border-slate-900/80 rounded-2xl p-6 hover:border-slate-800 transition-all flex flex-col justify-between hover:shadow-lg hover:shadow-blue-500/5 group">
              <div className="space-y-4">
                <div className="h-12 w-12 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400 transition-all group-hover:scale-110">
                  <Smartphone className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Cobranza Móvil GPS</h3>
                <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                  Seguimiento de rutas de gestores de cobranza en campo. Mapeo de visitas GPS, control por IMEI y registro inmediato de abonos.
                </p>
              </div>
              <div className="pt-6 border-t border-slate-900/60 mt-6 flex justify-between items-center">
                <span className="text-[10px] bg-slate-900 text-cyan-400 border border-cyan-500/10 px-2 py-0.5 rounded font-semibold font-mono">COBRANZA-GPS</span>
                <span className="text-[10px] text-slate-500 font-medium">Geolocalización Móvil</span>
              </div>
            </div>

            {/* Card 5: Facturacion */}
            <div className="bg-slate-950/60 border border-slate-900/80 rounded-2xl p-6 hover:border-slate-800 transition-all flex flex-col justify-between hover:shadow-lg hover:shadow-blue-500/5 group">
              <div className="space-y-4">
                <div className="h-12 w-12 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-400 transition-all group-hover:scale-110">
                  <Receipt className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Timbrado Fiscal SAT CFDI 4.0</h3>
                <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                  Facturación nativa directa a través de PAC oficial. Integración robusta con el servidor SDK local de Contpaqi Comercial.
                </p>
              </div>
              <div className="pt-6 border-t border-slate-900/60 mt-6 flex justify-between items-center">
                <span className="text-[10px] bg-slate-900 text-rose-400 border border-rose-500/10 px-2 py-0.5 rounded font-semibold font-mono">FACTURACION-SAT</span>
                <span className="text-[10px] text-slate-500 font-medium">100% Cumplimiento Fiscal</span>
              </div>
            </div>

            {/* Card 6: AI Predictive */}
            <div className="bg-slate-950/60 border border-slate-900/80 rounded-2xl p-6 hover:border-slate-800 transition-all flex flex-col justify-between hover:shadow-lg hover:shadow-blue-500/5 group">
              <div className="space-y-4">
                <div className="h-12 w-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 transition-all group-hover:scale-110">
                  <BrainCircuit className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Business Intelligence & AI</h3>
                <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                  Análisis predictivos automáticos de morosidad. Gráficas de rendimiento e IA integrada mediante modelos de Abacus.AI.
                </p>
              </div>
              <div className="pt-6 border-t border-slate-900/60 mt-6 flex justify-between items-center">
                <span className="text-[10px] bg-slate-900 text-purple-400 border border-purple-500/10 px-2 py-0.5 rounded font-semibold font-mono">DASHBOARD-AI</span>
                <span className="text-[10px] text-slate-500 font-medium">Analítica de Predicción</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DYNAMIC E-COMMERCE & BUSINESS STOREFRONT SECTION */}
      <section id="tienda" className="py-24 bg-slate-950 border-b border-slate-900/80 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Header de la Tienda */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4.5 py-1.5 text-xs text-emerald-400 font-semibold shadow-inner mb-2">
              <Store className="h-3.5 w-3.5" />
              <span>Tienda y Distribuidor Comercial (B2C & B2B)</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
              Catálogo Corporativo de Productos
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              Compra directa con entrega exprés o solicita cotizaciones mayoristas en lotes industriales con tarifas preferentes de distribuidor.
            </p>
          </div>

          {/* Filtros y Buscador */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/40 p-4 border border-slate-900 rounded-2xl backdrop-blur-sm">
            {/* Buscador */}
            <div className="w-full md:w-80">
              <input 
                type="text"
                placeholder="Buscar productos, marcas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs md:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
            {/* Categorías */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categorias.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoria(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedCategoria === cat 
                      ? 'bg-blue-600 text-white shadow shadow-blue-500/10' 
                      : 'bg-slate-950 border border-slate-850 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Loader u Grilla de Productos */}
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center space-y-4">
              <div className="h-10 w-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
              <span className="text-xs text-slate-500">Cargando existencias reales del almacén...</span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="h-64 bg-slate-900/10 border border-slate-900 border-dashed rounded-2xl flex flex-col items-center justify-center text-center p-8">
              <p className="text-slate-400 font-bold">No hay productos disponibles actualmente</p>
              <p className="text-slate-600 text-xs mt-1">Intente cambiar el criterio de búsqueda o de categoría.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((prod) => (
                <div 
                  key={prod.id} 
                  className="bg-slate-900/40 border border-slate-900/80 rounded-2xl p-5 hover:border-slate-800 hover:shadow-xl hover:shadow-blue-500/5 transition-all flex flex-col justify-between group relative"
                >
                  {/* Imagen y Badges */}
                  <div className="relative w-full h-48 rounded-xl bg-slate-950 border border-slate-900 flex items-center justify-center overflow-hidden mb-4">
                    {prod.imagen ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={prod.imagen} 
                        alt={prod.nombre} 
                        className="object-cover w-full h-full group-hover:scale-105 transition-all duration-300"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-700">
                        <Store className="h-12 w-12 stroke-[1.5] mb-2" />
                        <span className="text-[10px] uppercase tracking-wider font-bold">Catálogo ERP</span>
                      </div>
                    )}

                    {/* Badge de Oferta / Destacado */}
                    {prod.destacado && (
                      <span className="absolute top-3 left-3 bg-blue-500/15 border border-blue-400/20 text-blue-400 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow">
                        Destacado
                      </span>
                    )}
                    {prod.oferta && (
                      <span className="absolute top-3 right-3 bg-emerald-500/15 border border-emerald-400/20 text-emerald-400 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow">
                        Oferta
                      </span>
                    )}
                  </div>

                  {/* Detalles del Producto */}
                  <div className="space-y-2 text-left">
                    <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase">
                      <span>{prod.categoria || 'Sin Categoría'}</span>
                      <span>Código: {prod.codigo}</span>
                    </div>

                    <h3 className="text-lg font-bold text-white leading-tight group-hover:text-blue-400 transition-colors">
                      {prod.nombre}
                    </h3>
                    <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                      {prod.descripcion || 'Sin descripción comercial proporcionada.'}
                    </p>

                    {prod.marca && (
                      <span className="inline-block text-[10px] bg-slate-950 border border-slate-900 text-slate-400 px-2 py-0.5 rounded font-medium">
                        {prod.marca} {prod.modelo && ` - ${prod.modelo}`}
                      </span>
                    )}

                    {/* Precios Multinivel */}
                    <div className="pt-3 border-t border-slate-900/60 mt-3 space-y-2">
                      <div className="flex justify-between items-baseline">
                        <span className="text-[11px] text-slate-500">Precio Público:</span>
                        <span className="text-lg font-black text-white">
                          ${prod.precio1.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      
                      {prod.precio2 > 0 && (
                        <div className="flex justify-between items-center text-[11px] text-emerald-400 font-semibold bg-emerald-500/5 px-2 py-1 rounded border border-emerald-500/10">
                          <div className="flex items-center gap-1">
                            <BadgePercent className="h-3.5 w-3.5" />
                            <span>Precio Mayorista (2+ pzs):</span>
                          </div>
                          <span>${prod.precio2.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                        </div>
                      )}

                      {prod.precio3 > 0 && (
                        <div className="flex justify-between items-center text-[11px] text-blue-400 font-semibold bg-blue-500/5 px-2 py-1 rounded border border-blue-500/10">
                          <div className="flex items-center gap-1">
                            <Briefcase className="h-3.5 w-3.5" />
                            <span>Precio Distribuidor (5+ pzs):</span>
                          </div>
                          <span>${prod.precio3.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Existencias y Botón Agregar */}
                  <div className="mt-5 pt-3 border-t border-slate-900/60 flex items-center justify-between gap-3">
                    <span className="text-[10px] text-slate-500 font-medium">
                      Stock: {prod.stock > 0 ? `${prod.stock} unidades` : 'Consultar existencia'}
                    </span>
                    <button 
                      onClick={() => addToCart(prod)}
                      className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs px-4 py-2.5 shadow transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Añadir al Carrito
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}

          {/* Banner Beneficios B2B */}
          <div className="bg-gradient-to-r from-blue-950/40 via-blue-900/10 to-transparent border border-blue-900/30 rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 mt-12 text-left relative overflow-hidden">
            <div className="space-y-4 max-w-2xl">
              <span className="bg-blue-600/20 text-blue-400 border border-blue-700/30 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                PROGRAMA DE DISTRIBUIDORES
              </span>
              <h4 className="text-2xl md:text-3xl font-extrabold text-white">¿Eres comerciante, integrador o empresa?</h4>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                Regístrate y adquiere un perfil de distribuidor autorizado. VertexERP te permite cotizar lotes mayoristas, congelar inventario por 48 horas y gozar de crédito integrado con pagarés financieros automatizados.
              </p>
            </div>
            <a 
              href="#contacto"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-6 py-3.5 text-sm font-bold shadow-lg shadow-blue-500/20 transition-all flex-shrink-0"
            >
              Registrar Empresa CRM
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>

        </div>
      </section>

      {/* Plans & Pricing Section */}
      <section id="precios" className="py-24 px-6 max-w-6xl mx-auto w-full space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Planes a tu Medida</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base">
            Elige el plan ideal para tu empresa y habilita módulos adicionales conforme scales tus operaciones.
          </p>

          <div className="inline-flex items-center space-x-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl mt-4">
            <button 
              onClick={() => setBillingPeriod('monthly')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${billingPeriod === 'monthly' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Pago Mensual
            </button>
            <button 
              onClick={() => setBillingPeriod('annual')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${billingPeriod === 'annual' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Pago Anual
              <span className="text-[9px] bg-emerald-500 text-slate-950 px-1.5 py-0.5 rounded font-black">-20%</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Plan Básico */}
          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-8 hover:border-slate-800 transition-all flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <span className="text-xs text-blue-400 font-bold uppercase tracking-wider">Startup</span>
                <h4 className="text-2xl font-bold text-white mt-1">Plan Básico</h4>
                <p className="text-slate-500 text-xs mt-2">Para pequeños comercios y profesionales.</p>
              </div>

              <div className="flex items-baseline gap-1 text-white">
                <span className="text-2xl font-medium">$</span>
                <span className="text-5xl font-black">{billingPeriod === 'monthly' ? '990' : '790'}</span>
                <span className="text-slate-500 text-xs font-medium">MXN / mes</span>
              </div>

              <hr className="border-slate-900" />

              <ul className="space-y-3 text-slate-400 text-xs">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2.5 text-blue-500 flex-shrink-0" /> Acceso Superadmin y Roles Base</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2.5 text-blue-500 flex-shrink-0" /> CRM de Clientes básico</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2.5 text-blue-500 flex-shrink-0" /> Control de Cotizaciones</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2.5 text-blue-500 flex-shrink-0" /> Soporte por Correo</li>
              </ul>
            </div>
            <Link 
              href="/login" 
              className="w-full inline-flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800/80 py-3 text-sm font-bold text-white hover:bg-slate-800 transition-all mt-8"
            >
              Comenzar Startup
            </Link>
          </div>

          {/* Plan Pro */}
          <div className="bg-slate-950 border-2 border-blue-600 rounded-2xl p-8 hover:border-blue-500 transition-all flex flex-col justify-between relative shadow-2xl shadow-blue-500/5">
            <div className="absolute top-[-14px] right-8 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow">
              Más Popular
            </div>

            <div className="space-y-6">
              <div>
                <span className="text-xs text-blue-400 font-bold uppercase tracking-wider">Crecimiento</span>
                <h4 className="text-2xl font-bold text-white mt-1">Plan Profesional</h4>
                <p className="text-slate-500 text-xs mt-2">Para empresas comerciales en expansión.</p>
              </div>

              <div className="flex items-baseline gap-1 text-white">
                <span className="text-2xl font-medium">$</span>
                <span className="text-5xl font-black">{billingPeriod === 'monthly' ? '2,490' : '1,990'}</span>
                <span className="text-slate-500 text-xs font-medium">MXN / mes</span>
              </div>

              <hr className="border-slate-900" />

              <ul className="space-y-3 text-slate-350 text-xs">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2.5 text-blue-500 flex-shrink-0" /> CRM Avanzado con Referencias</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2.5 text-blue-500 flex-shrink-0" /> Inventario Multialmacén y Kardex</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2.5 text-blue-500 flex-shrink-0" /> Pagarés y Cálculo de Interés Diario</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2.5 text-blue-500 flex-shrink-0" /> Punto de Venta POS + E-commerce</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2.5 text-blue-500 flex-shrink-0" /> Soporte Telefónico Preferente</li>
              </ul>
            </div>
            <Link 
              href="/login" 
              className="w-full inline-flex items-center justify-center rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-8"
            >
              Comenzar Plan Pro
            </Link>
          </div>

          {/* Plan Corporativo */}
          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-8 hover:border-slate-800 transition-all flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <span className="text-xs text-blue-400 font-bold uppercase tracking-wider">Enterprise</span>
                <h4 className="text-2xl font-bold text-white mt-1">Plan Corporativo</h4>
                <p className="text-slate-500 text-xs mt-2">Para corporativos con alta cobranza.</p>
              </div>

              <div className="flex items-baseline gap-1 text-white">
                <span className="text-2xl font-medium">$</span>
                <span className="text-5xl font-black">{billingPeriod === 'monthly' ? '4,990' : '3,990'}</span>
                <span className="text-slate-500 text-xs font-medium">MXN / mes</span>
              </div>

              <hr className="border-slate-900" />

              <ul className="space-y-3 text-slate-400 text-xs">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2.5 text-blue-500 flex-shrink-0" /> Todo lo incluido en el Plan Pro</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2.5 text-blue-500 flex-shrink-0" /> Cobranza Satelital con Geolocalización</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2.5 text-blue-500 flex-shrink-0" /> Timbrado Fiscal SAT CFDI 4.0 Ilimitado</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2.5 text-blue-500 flex-shrink-0" /> IA predictiva de morosidad (Abacus)</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2.5 text-blue-500 flex-shrink-0" /> API Abierta y Servidor Dedicado</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2.5 text-blue-500 flex-shrink-0" /> Soporte 24/7 y Gestor de Cuenta</li>
              </ul>
            </div>
            <Link 
              href="/login" 
              className="w-full inline-flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800/80 py-3 text-sm font-bold text-white hover:bg-slate-800 transition-all mt-8"
            >
              Comenzar Corporativo
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive FAQ Accordion Section */}
      <section id="faq" className="py-24 bg-slate-900/20 border-t border-slate-900 px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Preguntas Frecuentes</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              Resolvemos tus dudas sobre despliegue, cumplimiento fiscal y funcionamiento técnico del ERP.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isExpanded = expandedFaq === index;
              return (
                <div 
                  key={index} 
                  className="bg-slate-950 border border-slate-900 rounded-xl overflow-hidden transition-all duration-300"
                >
                  <button 
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-slate-200 hover:text-white transition-colors"
                  >
                    <span className="pr-4">{faq.q}</span>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-500 flex-shrink-0" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-1 text-slate-400 text-xs md:text-sm leading-relaxed border-t border-slate-900/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-24 px-6 max-w-5xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-left">
          <div className="inline-flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-full px-3 py-1 text-xs text-blue-400 font-semibold shadow-inner">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Consultores B2B Listos</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Hablemos de tu Proyecto</h2>
          <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
            Completa el formulario de contacto para recibir una demostración guiada del sistema de marca blanca o asesoramiento directo para conectar tus Sellos Digitales del SAT.
          </p>

          <div className="space-y-4 text-xs md:text-sm text-slate-350 pt-4">
            <div className="flex items-center space-x-3.5">
              <div className="h-9 w-9 rounded-lg bg-blue-600/10 border border-blue-900/30 flex items-center justify-center text-blue-400">
                <Phone className="h-4 w-4" />
              </div>
              <span>+52 (55) 8526 9410</span>
            </div>
            <div className="flex items-center space-x-3.5">
              <div className="h-9 w-9 rounded-lg bg-blue-600/10 border border-blue-900/30 flex items-center justify-center text-blue-400">
                <Mail className="h-4 w-4" />
              </div>
              <span>soporte@vertexerp.com</span>
            </div>
            <div className="flex items-center space-x-3.5">
              <div className="h-9 w-9 rounded-lg bg-blue-600/10 border border-blue-900/30 flex items-center justify-center text-blue-400">
                <MapPin className="h-4 w-4" />
              </div>
              <span>CDMX, México</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6 md:p-8 relative shadow-2xl">
          {contactSubmitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
              <div className="h-16 w-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 animate-bounce">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-white">¡Solicitud Recibida!</h3>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                Hemos recibido tus datos con éxito. Tu consulta ha sido agregada a la lista de Prospectos del ERP de manera automática. Un consultor B2B te contactará en las próximas 2 horas.
              </p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Nombre Completo</label>
                <input 
                  type="text" 
                  value={contactForm.name} 
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  placeholder="Tu nombre..." 
                  className="w-full bg-slate-900/60 border border-slate-850 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-slate-650 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Correo Electrónico</label>
                  <input 
                    type="email" 
                    value={contactForm.email} 
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="ejemplo@correo.com" 
                    className="w-full bg-slate-900/60 border border-slate-850 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-slate-650 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Teléfono (WhatsApp)</label>
                  <input 
                    type="text" 
                    value={contactForm.phone} 
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    placeholder="+52..." 
                    className="w-full bg-slate-900/60 border border-slate-850 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-slate-650 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Nombre de la Empresa</label>
                <input 
                  type="text" 
                  value={contactForm.company} 
                  onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                  placeholder="Tu empresa..." 
                  className="w-full bg-slate-900/60 border border-slate-850 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-slate-650 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Detalles del Proyecto</label>
                <textarea 
                  rows={3} 
                  value={contactForm.message} 
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="Escribe tu consulta o requisitos del sistema de facturación/cobranza..." 
                  className="w-full bg-slate-900/60 border border-slate-850 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-slate-650 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={submittingContact}
                className="w-full inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 py-3.5 text-xs md:text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] focus:outline-none"
              >
                {submittingContact ? 'Registrando Prospecto...' : 'Solicitar Demostración Comercial'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900/80 py-12 px-6 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 mb-8 text-left">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 bg-blue-600 rounded flex items-center justify-center text-white">
                <Building2 className="h-3.5 w-3.5" />
              </div>
              <span className="font-extrabold text-white text-base">VertexERP</span>
            </div>
            <p className="text-slate-500 max-w-xs text-[11px]">
              El primer ecosistema de facturación, almacenes e intereses moratorios diseñado como marca blanca.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-[11px]">
            <div className="space-y-2.5">
              <span className="block text-slate-300 font-bold uppercase tracking-wider">Soluciones</span>
              <a href="#soluciones" className="block hover:text-white transition-colors">CRM Clientes</a>
              <a href="#soluciones" className="block hover:text-white transition-colors">Facturación SAT</a>
              <a href="#soluciones" className="block hover:text-white transition-colors">Intereses Moratorios</a>
            </div>
            <div className="space-y-2.5">
              <span className="block text-slate-300 font-bold uppercase tracking-wider">Enlaces</span>
              <a href="/login" className="block hover:text-white transition-colors">Iniciar Sesión</a>
              <a href="#precios" className="block hover:text-white transition-colors">Planes Corporativos</a>
              <a href="#contacto" className="block hover:text-white transition-colors">Soporte Técnico</a>
            </div>
          </div>
        </div>

        <hr className="border-slate-900/40 mb-8" />

        <p>© 2026 VertexERP. Todos los derechos reservados. Aurum Clean Code Compliant.</p>
      </footer>

      {/* ========================================================================= */}
      {/* SHOPPING CART SIDEBAR DRAWER */}
      {/* ========================================================================= */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div 
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md md:max-w-lg bg-slate-900 border-l border-slate-800 flex flex-col shadow-2xl relative">
              {/* Header */}
              <div className="p-6 border-b border-slate-850 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <ShoppingCart className="h-5 w-5 text-emerald-400" />
                  <h2 className="text-lg font-black text-white">Carrito Comercial</h2>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="h-8 w-8 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-20 text-slate-500">
                    <ShoppingCart className="h-12 w-12 stroke-[1] text-slate-600 animate-pulse" />
                    <p className="font-bold text-slate-400">Tu carrito está vacío</p>
                    <p className="text-xs max-w-[240px]">Agrega productos del catálogo para realizar compras o cotizaciones.</p>
                  </div>
                ) : (
                  cart.map((item) => {
                    const { precio, tier } = getProductPriceAndTier(item.producto, item.cantidad);
                    return (
                      <div 
                        key={item.producto.id}
                        className="bg-slate-950/50 border border-slate-850 rounded-xl p-3 flex gap-3 items-center justify-between"
                      >
                        {/* Detalle */}
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded bg-slate-900 border border-slate-850 flex items-center justify-center text-slate-500 overflow-hidden flex-shrink-0">
                            {item.producto.imagen ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={item.producto.imagen} alt={item.producto.nombre} className="object-cover w-full h-full" />
                            ) : (
                              <Store className="h-6 w-6 stroke-[1.5]" />
                            )}
                          </div>
                          <div className="text-left">
                            <span className="block text-xs font-bold text-white line-clamp-1">{item.producto.nombre}</span>
                            <span className="block text-[10px] text-slate-500">Cod: {item.producto.codigo}</span>
                            
                            {/* Visualización del precio dinámico por cantidad */}
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="text-[11px] font-black text-white">
                                ${precio.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                              </span>
                              <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded ${
                                tier.includes('Distribuidor') 
                                  ? 'bg-blue-500/25 text-blue-400 border border-blue-400/25' 
                                  : tier.includes('Mayorista') 
                                    ? 'bg-emerald-500/25 text-emerald-400 border border-emerald-400/25'
                                    : 'bg-slate-800 text-slate-400'
                              }`}>
                                {tier.split(' ')[1] || 'Público'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Controles cantidad */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center bg-slate-950 border border-slate-850 rounded-lg p-0.5">
                            <button 
                              onClick={() => updateCartQty(item.producto.id, -1)}
                              className="h-6 w-6 rounded hover:bg-slate-800 flex items-center justify-center text-slate-400"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-white">{item.cantidad}</span>
                            <button 
                              onClick={() => updateCartQty(item.producto.id, 1)}
                              className="h-6 w-6 rounded hover:bg-slate-800 flex items-center justify-center text-slate-400"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.producto.id)}
                            className="h-7 w-7 text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 rounded flex items-center justify-center transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Totales y Acciones */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-slate-850 bg-slate-950/40 space-y-4 text-left">
                  <div className="space-y-2 text-xs text-slate-400">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-semibold text-white">
                        ${subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Impuestos (16% IVA):</span>
                      <span className="font-semibold text-white">
                        ${iva.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <hr className="border-slate-850" />
                    <div className="flex justify-between text-sm">
                      <span className="font-bold text-white">Total:</span>
                      <span className="font-black text-emerald-400 text-lg">
                        ${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {/* Doble Botonera: B2C y B2B */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button 
                      onClick={() => {
                        setCheckoutMode('b2c');
                        setCheckoutSuccess(null);
                      }}
                      className="w-full inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs py-3.5 shadow-md shadow-emerald-950/20 transition-all hover:scale-[1.02]"
                    >
                      Comprar Ahora
                    </button>
                    <button 
                      onClick={() => {
                        setCheckoutMode('b2b');
                        setCheckoutSuccess(null);
                      }}
                      className="w-full inline-flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-bold text-xs py-3.5 transition-all hover:scale-[1.02]"
                    >
                      Solicitar Cotización
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CHECKOUT POPUP MODAL (B2C & B2B) */}
      {/* ========================================================================= */}
      {checkoutMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setCheckoutMode(null)}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative z-10 text-left">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-850">
              <div className="flex items-center space-x-2">
                {checkoutMode === 'b2c' ? (
                  <>
                    <ShoppingCart className="h-5 w-5 text-emerald-400" />
                    <h3 className="text-lg font-black text-white">Checkout Pago Express</h3>
                  </>
                ) : (
                  <>
                    <Briefcase className="h-5 w-5 text-blue-400" />
                    <h3 className="text-lg font-black text-white">Cotización Comercial B2B</h3>
                  </>
                )}
              </div>
              <button 
                onClick={() => setCheckoutMode(null)}
                className="h-8 w-8 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Success Overlay */}
            {checkoutSuccess ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="h-16 w-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 animate-bounce">
                  <FileCheck2 className="h-8 w-8" />
                </div>
                {checkoutSuccess.isB2B ? (
                  <>
                    <h4 className="text-xl font-bold text-white">¡Cotización Registrada con Éxito!</h4>
                    <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-sm">
                      Se ha generado tu solicitud y se ha creado un **Lead Prospecto** en el CRM de VertexERP. Un consultor se pondrá en contacto a la brevedad.
                    </p>
                  </>
                ) : (
                  <>
                    <h4 className="text-xl font-bold text-white">¡Pedido ERP Registrado!</h4>
                    <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-sm">
                      Tu pedido se ha insertado nativamente en el sistema de ventas con el Folio: <br />
                      <span className="font-mono text-base font-black text-emerald-400 bg-slate-950 px-3 py-1 rounded border border-slate-800 inline-block mt-2">
                        {checkoutSuccess.folio}
                      </span>
                    </p>
                  </>
                )}
                <button 
                  onClick={() => setCheckoutMode(null)}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                >
                  Volver al Catálogo
                </button>
              </div>
            ) : (
              // Formulario Checkout
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Nombre Completo</label>
                  <input 
                    type="text" 
                    value={checkoutForm.nombre}
                    onChange={(e) => setCheckoutForm({...checkoutForm, nombre: e.target.value})}
                    placeholder="Tu nombre o contacto..."
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs md:text-sm text-white placeholder-slate-700 focus:outline-none focus:border-blue-500 transition-all"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Correo Electrónico</label>
                    <input 
                      type="email" 
                      value={checkoutForm.email}
                      onChange={(e) => setCheckoutForm({...checkoutForm, email: e.target.value})}
                      placeholder="correo@ejemplo.com"
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs md:text-sm text-white placeholder-slate-700 focus:outline-none focus:border-blue-500 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">WhatsApp / Teléfono</label>
                    <input 
                      type="text" 
                      value={checkoutForm.telefono}
                      onChange={(e) => setCheckoutForm({...checkoutForm, telefono: e.target.value})}
                      placeholder="442..."
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs md:text-sm text-white placeholder-slate-700 focus:outline-none focus:border-blue-500 transition-all"
                      required
                    />
                  </div>
                </div>

                {checkoutMode === 'b2b' && (
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Nombre de la Empresa</label>
                    <input 
                      type="text" 
                      value={checkoutForm.empresa}
                      onChange={(e) => setCheckoutForm({...checkoutForm, empresa: e.target.value})}
                      placeholder="Empresa SA de CV..."
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs md:text-sm text-white placeholder-slate-700 focus:outline-none focus:border-blue-500 transition-all"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Dirección de Entrega</label>
                  <input 
                    type="text" 
                    value={checkoutForm.direccion}
                    onChange={(e) => setCheckoutForm({...checkoutForm, direccion: e.target.value})}
                    placeholder="Calle, Número, Colonia, CP..."
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs md:text-sm text-white placeholder-slate-700 focus:outline-none focus:border-blue-500 transition-all"
                    required
                  />
                </div>

                {checkoutMode === 'b2c' && (
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Método de Pago</label>
                    <select
                      value={checkoutForm.metodoPago}
                      onChange={(e) => setCheckoutForm({...checkoutForm, metodoPago: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs md:text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                    >
                      <option value="Tarjeta de Crédito">Tarjeta de Crédito / Débito (Stripe)</option>
                      <option value="PayPal">PayPal</option>
                      <option value="MercadoPago">MercadoPago</option>
                      <option value="Transferencia SPEI">Transferencia Bancaria SPEI</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Comentarios / Especificaciones</label>
                  <textarea 
                    rows={2}
                    value={checkoutForm.notas}
                    onChange={(e) => setCheckoutForm({...checkoutForm, notas: e.target.value})}
                    placeholder="Requerimientos de facturación, empaque..."
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2 text-xs md:text-sm text-white placeholder-slate-700 focus:outline-none focus:border-blue-500 transition-all resize-none"
                  />
                </div>

                <div className="pt-4 border-t border-slate-850 flex items-center justify-between text-xs text-slate-400">
                  <span>Productos: {cart.reduce((a, b) => a + b.cantidad, 0)} pzas</span>
                  <span className="font-bold text-emerald-400 text-sm">
                    Monto total: ${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <button 
                  type="submit" 
                  disabled={submittingCheckout}
                  className="w-full inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-blue-800 text-white font-bold text-xs py-3.5 shadow-lg shadow-blue-500/25 transition-all focus:outline-none"
                >
                  {submittingCheckout ? 'Procesando en ERP...' : checkoutMode === 'b2c' ? 'Confirmar Compra' : 'Enviar Cotización'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* WHATSAPP WIDGET */}
      {/* ========================================================================= */}
      <div className="fixed bottom-6 right-6 z-40 group">
        <a 
          href="https://wa.me/525585269410?text=Hola%20VertexERP,%20me%20gustar%C3%ADa%20solicitar%20asesor%C3%ADa%20comercial%20para%20mi%20negocio." 
          target="_blank" 
          rel="noopener noreferrer"
          className="h-14 w-14 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-slate-950 shadow-2xl shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all relative"
        >
          <MessageSquare className="h-6 w-6 fill-slate-950 stroke-[1.5]" />
          <span className="absolute -top-1 -left-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        </a>
      </div>

    </div>
  );
}
