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
  MapPin
} from 'lucide-react';

export function CorporateLandingPage() {
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactForm.name && contactForm.email && contactForm.message) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setContactForm({ name: '', email: '', message: '' });
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Building2 className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            VertexERP
          </span>
        </div>

        <nav className="hidden md:flex space-x-8 text-sm font-medium text-slate-400">
          <a href="#inicio" className="hover:text-white transition-colors">Inicio</a>
          <a href="#soluciones" className="hover:text-white transition-colors">Soluciones</a>
          <a href="#contacto" className="hover:text-white transition-colors">Contacto</a>
        </nav>

        <div>
          <Link 
            href="/login" 
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950 transition-all hover:scale-[1.02]"
          >
            Ingresar al ERP
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-20 pb-16 relative overflow-hidden">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-full px-4 py-1.5 text-xs text-blue-400 font-medium mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Módulos de Negocio Habilitados y Activos</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Gestión inteligente para tu <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">empresa o comercio</span>
          </h1>

          <p className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
            Plataforma omnicanal para optimizar inventarios, ventas a crédito y cobranza con geolocalización satelital en tiempo real.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6">
            <Link 
              href="/login" 
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-base font-semibold text-slate-950 shadow-md hover:bg-slate-100 transition-all hover:scale-[1.02]"
            >
              Comenzar Operaciones
            </Link>
            <a 
              href="#soluciones" 
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 px-6 py-3 text-base font-semibold text-slate-300 hover:bg-slate-800 transition-all"
            >
              Conocer Soluciones
            </a>
          </div>
        </div>
      </section>

      {/* Solutions / Features Section */}
      <section id="soluciones" className="py-20 bg-slate-900/40 border-y border-slate-900 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Nuestra Tecnología Integrada</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              Descubre los módulos y addons listos para optimizar tu cadena comercial y control financiero.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 hover:border-slate-700 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-12 w-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
                  <Database className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-white">Inventario Dinámico</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Control absoluto de almacén, múltiples precios base, lotes, caducidades e inyección automática a e-commerce.
                </p>
              </div>
              <ul className="space-y-2 text-slate-300 text-xs pt-6">
                <li className="flex items-center"><CheckCircle className="h-3.5 w-3.5 mr-2 text-blue-500" /> Stock Máximos/Mínimos</li>
                <li className="flex items-center"><CheckCircle className="h-3.5 w-3.5 mr-2 text-blue-500" /> Movimientos de Kardex</li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 hover:border-slate-700 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-12 w-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
                  <Smartphone className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-white">Cobranza Satelital</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  App para gestores de campo con registro de abonos y geolocalización GPS mapeada directamente a sucursales.
                </p>
              </div>
              <ul className="space-y-2 text-slate-300 text-xs pt-6">
                <li className="flex items-center"><CheckCircle className="h-3.5 w-3.5 mr-2 text-blue-500" /> Validación de IMEI y Seguridad</li>
                <li className="flex items-center"><CheckCircle className="h-3.5 w-3.5 mr-2 text-blue-500" /> Amortización en Caliente</li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 hover:border-slate-700 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-12 w-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-white">Timbrado Oficial SAT</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Emisión nativa de facturas CFDI 4.0 y Recibos Electrónicos de Pago (REP) conectados a Contpaqi API local.
                </p>
              </div>
              <ul className="space-y-2 text-slate-300 text-xs pt-6">
                <li className="flex items-center"><CheckCircle className="h-3.5 w-3.5 mr-2 text-blue-500" /> Integración Contpaqi Premium</li>
                <li className="flex items-center"><CheckCircle className="h-3.5 w-3.5 mr-2 text-blue-500" /> Cumplimiento Fiscal Mexicano</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-20 px-6 max-w-5xl mx-auto w-full grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-white">¿Hablamos de tu Proyecto?</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Completa el formulario de contacto para recibir atención personalizada por parte de nuestro equipo comercial y de soporte técnico.
          </p>
          <div className="space-y-4 text-sm text-slate-300">
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-blue-400" />
              <span>+52 (55) 1234 5678</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-blue-400" />
              <span>contacto@vertexerp.com</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-blue-400" />
              <span>CDMX, México</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12">
              <div className="h-12 w-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-400">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">¡Mensaje Enviado!</h3>
              <p className="text-slate-400 text-xs">
                Hemos recibido tus datos con éxito. En breve un asesor te contactará.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre Completo</label>
                <input 
                  type="text" 
                  value={contactForm.name} 
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  placeholder="Tu nombre..." 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Correo Electrónico</label>
                <input 
                  type="email" 
                  value={contactForm.email} 
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="ejemplo@correo.com" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Mensaje o Consulta</label>
                <textarea 
                  rows={3} 
                  value={contactForm.message} 
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="¿Cómo te podemos ayudar?..." 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full inline-flex items-center justify-center rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-all focus:outline-none"
              >
                Enviar Mensaje
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-8 px-6 text-center text-xs text-slate-500 mt-auto">
        <p>© 2026 VertexERP. Todos los derechos reservados. Aurum Clean Code Compliant.</p>
      </footer>
    </div>
  );
}
