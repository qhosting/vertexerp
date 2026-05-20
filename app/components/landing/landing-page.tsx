'use client';

import { useState } from 'react';
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
  Layers,
  Wrench,
  ChevronDown,
  ChevronUp,
  Activity,
  Calendar,
  Lock,
  ArrowUpRight
} from 'lucide-react';

export function CorporateLandingPage() {
  const [contactForm, setContactForm] = useState({ name: '', email: '', company: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactForm.name && contactForm.email && contactForm.message) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setContactForm({ name: '', email: '', company: '', phone: '', message: '' });
      }, 4000);
    }
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

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
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-slate-950/80 border-b border-slate-900/80 px-6 py-4 flex items-center justify-between transition-all">
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
          <a href="#inicio" className="hover:text-white transition-colors relative after:absolute after:bottom-[-22px] after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-blue-500 after:transition-all">Inicio</a>
          <a href="#soluciones" className="hover:text-white transition-colors relative after:absolute after:bottom-[-22px] after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-blue-500 after:transition-all">Módulos</a>
          <a href="#precios" className="hover:text-white transition-colors relative after:absolute after:bottom-[-22px] after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-blue-500 after:transition-all">Precios</a>
          <a href="#faq" className="hover:text-white transition-colors relative after:absolute after:bottom-[-22px] after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-blue-500 after:transition-all">Faq</a>
          <a href="#contacto" className="hover:text-white transition-colors relative after:absolute after:bottom-[-22px] after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-blue-500 after:transition-all">Contacto</a>
        </nav>

        <div className="flex items-center space-x-3">
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
            <Link 
              href="/login" 
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-white px-7 py-3.5 text-base font-bold text-slate-950 shadow-md hover:bg-slate-100 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Comenzar Operaciones
            </Link>
            <a 
              href="#soluciones" 
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800/80 px-7 py-3.5 text-base font-bold text-slate-300 transition-all"
            >
              Ver Catálogo de Módulos
            </a>
          </div>
        </div>

        {/* Dashboard Preview mockup */}
        <div className="mt-16 max-w-5xl w-full border border-slate-900 bg-slate-950/40 rounded-2xl p-4 shadow-2xl relative z-10 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-transparent rounded-2xl pointer-events-none" />
          <div className="flex items-center space-x-2 border-b border-slate-900 pb-3 mb-4">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span className="text-[11px] text-slate-600 font-mono pl-4">VertexERP Web Portal (Secure Session)</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-2">
            <div className="bg-slate-900/40 border border-slate-850 rounded-xl p-4 text-left">
              <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Clientes Totales</span>
              <p className="text-xl font-bold mt-1 text-white">4,812</p>
              <span className="text-emerald-500 text-[10px] font-semibold flex items-center mt-1">
                <Activity className="h-3 w-3 mr-1" /> +12.4% este mes
              </span>
            </div>
            <div className="bg-slate-900/40 border border-slate-850 rounded-xl p-4 text-left">
              <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Pagarés Activos</span>
              <p className="text-xl font-bold mt-1 text-white">12,450</p>
              <span className="text-blue-400 text-[10px] font-semibold flex items-center mt-1">
                <CheckCircle className="h-3 w-3 mr-1" /> 99.8% conciliados
              </span>
            </div>
            <div className="bg-slate-900/40 border border-slate-850 rounded-xl p-4 text-left">
              <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Timbrado SAT</span>
              <p className="text-xl font-bold mt-1 text-white">CFDI 4.0</p>
              <span className="text-emerald-500 text-[10px] font-semibold flex items-center mt-1">
                <ShieldCheck className="h-3 w-3 mr-1" /> API Contpaqi Activa
              </span>
            </div>
            <div className="bg-slate-900/40 border border-slate-850 rounded-xl p-4 text-left">
              <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Morosidad Prevista</span>
              <p className="text-xl font-bold mt-1 text-white">1.45%</p>
              <span className="text-purple-400 text-[10px] font-semibold flex items-center mt-1">
                <BrainCircuit className="h-3 w-3 mr-1" /> Inteligencia Artificial
              </span>
            </div>
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

          {/* SME Retail Addons highlighted block */}
          <div className="bg-gradient-to-r from-blue-600/15 via-indigo-600/10 to-transparent border border-blue-900/40 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 mt-12">
            <div className="space-y-3 max-w-xl text-left">
              <div className="inline-flex items-center space-x-1 bg-blue-950 text-blue-400 border border-blue-800 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                PYMES COMERCIALIZACIÓN
              </div>
              <h4 className="text-2xl font-bold text-white">Punto de Venta (POS) y E-commerce Integrados</h4>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                Incrementa tus canales de venta minoristas de inmediato. Habilita una caja registradora web rápida (POS) con corte diario y conecta una tienda en línea (E-commerce) sincronizada automáticamente con el inventario del ERP.
              </p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <div className="flex-1 md:flex-none bg-slate-950/60 border border-slate-900 rounded-xl p-4 flex items-center space-x-3">
                <Store className="h-5 w-5 text-emerald-400" />
                <div>
                  <span className="block text-xs font-bold text-white">Caja POS</span>
                  <span className="text-[10px] text-slate-500">Arqueos Rápidos</span>
                </div>
              </div>
              <div className="flex-1 md:flex-none bg-slate-950/60 border border-slate-900 rounded-xl p-4 flex items-center space-x-3">
                <Globe className="h-5 w-5 text-blue-400" />
                <div>
                  <span className="block text-xs font-bold text-white">E-commerce</span>
                  <span className="text-[10px] text-slate-500">Stripe & PayPal</span>
                </div>
              </div>
            </div>
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
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
              <div className="h-16 w-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 animate-bounce">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-white">¡Solicitud Recibida!</h3>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                Hemos recibido tus datos con éxito. Un consultor B2B de VertexERP te contactará en las próximas 2 horas.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
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
                className="w-full inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-500 py-3.5 text-xs md:text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] focus:outline-none"
              >
                Solicitar Demostración Comercial
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
    </div>
  );
}
