
# 🚀 Sistema ERP Completo - Gestión Integral de Negocio

![Version](https://img.shields.io/badge/version-3.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.2.28-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue.svg)
![Prisma](https://img.shields.io/badge/Prisma-6.7.0-2D3748.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg)

Un sistema ERP moderno y completo desarrollado con **Next.js 14**, **TypeScript**, **Prisma** y **PostgreSQL**. Diseñado para pequeñas y medianas empresas que necesitan una solución integral para gestionar ventas, cobranza, inventario, garantías y más.

## ✨ Características Principales

### 📊 **FASE 1 - Gestión de Pedidos y Ventas** ✅
- **Gestión de Pedidos**: Creación, seguimiento y conversión a ventas
- **Sistema de Ventas**: Facturación completa con múltiples precios
- **Sistema de Pagarés**: Gestión automática de pagos a plazos
- **Cálculo de Intereses**: Automático por mora con configuración flexible
- **Control de Inventario**: Actualización automática por ventas

### 💰 **FASE 2 - Crédito y Garantías** ✅
- **Notas de Cargo**: Por intereses, gastos administrativos y comisiones
- **Notas de Crédito**: Devoluciones con afectación automática de inventario
- **Reestructuras de Crédito**: Modificación de términos de pago
- **Sistema de Garantías**: Gestión completa desde reclamo hasta resolución
- **Auditoría Completa**: Registro de todos los cambios y movimientos

### 📈 **FASE 3 - Analytics y Reportes** ✅
- **Dashboard Avanzado**: Gráficos interactivos con métricas en tiempo real
- **Sistema de Reportes**: Ventas, cobranza, inventario con exportación CSV
- **Integraciones Externas**: Webhooks, APIs, sincronización
- **Configuración Avanzada**: Personalización completa del sistema
- **Análisis Predictivo**: Tendencias y alertas automatizadas

## 🏗️ Arquitectura del Sistema

```
├── /app                          # Aplicación Next.js 14 (App Router)
│   ├── /app                      # Rutas principales
│   │   ├── /(dashboard)          # Dashboard y módulos principales
│   │   │   ├── /clientes         # Gestión de clientes
│   │   │   ├── /productos        # Catálogo de productos
│   │   │   ├── /pedidos          # Sistema de pedidos
│   │   │   ├── /ventas           # Gestión de ventas
│   │   │   ├── /pagares          # Control de pagarés
│   │   │   ├── /notas-cargo      # Notas de cargo
│   │   │   ├── /notas-credito    # Notas de crédito
│   │   │   ├── /reestructuras    # Reestructuras de crédito
│   │   │   ├── /garantias        # Sistema de garantías
│   │   │   ├── /reportes         # Sistema de reportes
│   │   │   └── /configuracion    # Configuraciones del sistema
│   │   └── /api                  # API Routes
│   │       ├── /auth             # Autenticación (NextAuth)
│   │       ├── /clientes         # CRUD clientes
│   │       ├── /productos        # CRUD productos
│   │       ├── /pedidos          # Gestión de pedidos
│   │       ├── /ventas           # Gestión de ventas
│   │       ├── /pagares          # Control de pagarés
│   │       ├── /notas-cargo      # Notas de cargo
│   │       ├── /notas-credito    # Notas de crédito
│   │       ├── /reestructuras    # Reestructuras
│   │       ├── /garantias        # Garantías
│   │       ├── /reportes         # Sistema de reportes
│   │       ├── /dashboard        # Analytics y métricas
│   │       └── /integraciones    # APIs externas y webhooks
│   ├── /components               # Componentes reutilizables
│   │   ├── /ui                   # Componentes Shadcn/UI
│   │   ├── /navigation           # Navegación (sidebar, header)
│   │   └── /forms                # Formularios especializados
│   ├── /lib                      # Librerías y utilidades
│   │   ├── auth.ts               # Configuración NextAuth
│   │   ├── utils.ts              # Utilidades generales
│   │   └── types.ts              # Tipos TypeScript
│   ├── /prisma                   # Configuración de base de datos
│   │   ├── schema.prisma         # Esquema de la base de datos
│   │   └── /migrations           # Migraciones automáticas
│   └── /public                   # Archivos estáticos
```

## 📦 Tecnologías Utilizadas

### **Frontend**
- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework CSS utilitario
- **Shadcn/UI** - Componentes UI modernos
- **Recharts** - Gráficos interactivos
- **React Hook Form** - Gestión de formularios
- **Zustand** - State management ligero

### **Backend**
- **Next.js API Routes** - API RESTful
- **Prisma ORM** - ORM moderno para TypeSQL
- **PostgreSQL** - Base de datos relacional
- **NextAuth.js** - Sistema de autenticación
- **bcryptjs** - Hashing de contraseñas

### **Herramientas de Desarrollo**
- **ESLint** - Linting de código
- **Prettier** - Formateo de código
- **TypeScript** - Análisis estático
- **Prisma Studio** - Administrador de BD visual

## 🗄️ Modelo de Base de Datos

### **Entidades Principales**

#### **Usuarios y Autenticación**
```sql
User (usuarios del sistema)
├── id, name, firstName, lastName
├── email, password, role
├── isActive, sucursal
└── Relaciones: Account, Session

Account (cuentas OAuth)
Session (sesiones activas)
```

#### **Gestión Comercial**
```sql
Cliente (clientes)
├── codigoCliente, nombre, contacto
├── direccion, telefono, email
├── saldoActual, limiteCredito
└── Relaciones: Ventas, Pagos, Reestructuras

Producto (catálogo)
├── codigo, nombre, descripcion
├── precio1-5, precioCompra
├── stock, stockMinimo, stockMaximo
└── Relaciones: Movimientos, Ventas, Garantias

Pedido → Venta (flujo comercial)
├── folio, cliente, vendedor
├── detalles (productos)
└── conversion automática
```

#### **Sistema Financiero**
```sql
Venta (facturas)
├── folio, cliente, total
├── sistema de pagarés integrado
└── Relaciones: Pagares, Pagos, Notas

Pagare (pagarés automáticos)
├── numeroPago, monto, fechaVencimiento
├── intereses automáticos por mora
└── aplicación de pagos

NotaCargo / NotaCredito
├── conceptos predefinidos
├── aplicación automática de saldos
└── afectación de inventario
```

#### **Control de Garantías**
```sql
Garantia
├── producto, fechaCompra, tipoGarantia
├── reclamos, diagnostico, solución
├── reemplazos con inventario
└── seguimiento completo
```

### **Características de la BD**
- ✅ **40+ tablas** con relaciones optimizadas
- ✅ **Integridad referencial** completa
- ✅ **Índices optimizados** para consultas rápidas
- ✅ **Triggers automáticos** para cálculos
- ✅ **Auditoría completa** de cambios
- ✅ **Soft deletes** para preservar historia

## 🚀 Instalación y Configuración

### **Prerequisitos**
- Node.js 18+ 
- PostgreSQL 14+
- Yarn o npm

### **1. Clonar el Repositorio**
```bash
git clone https://github.com/tu-usuario/sistema-erp-completo.git
cd sistema-erp-completo/app
```

### **2. Instalar Dependencias**
```bash
yarn install
# o
npm install
```

### **3. Configurar Variables de Entorno**
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar variables necesarias
DATABASE_URL="postgresql://usuario:password@localhost:5432/erp_db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secret-key-seguro"
```

### **4. Configurar Base de Datos**
```bash
# Generar cliente Prisma
npx prisma generate

# Aplicar esquema a la base de datos
npx prisma db push

# Ejecutar seeds iniciales (opcional)
npx prisma db seed
```

### **5. Ejecutar en Desarrollo**
```bash
yarn dev
# o
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### **6. Usuario por Defecto**
```
Email: admin@erp.com
Password: admin123
Role: SUPERADMIN
```

## 📋 Funcionalidades Detalladas

### **🛒 Sistema de Ventas**
- **Pedidos**: Cotizaciones que se convierten en ventas
- **Múltiples Precios**: Hasta 5 precios por producto
- **Facturación**: Generación automática de folios
- **Pagarés**: Sistema automático de pagos a plazos
- **Inventario**: Actualización automática por ventas

### **💳 Sistema de Cobranza**
- **Cálculo de Intereses**: Automático por días vencidos
- **Aplicación de Pagos**: A capital e intereses
- **Recordatorios**: Notificaciones automáticas
- **Reestructuras**: Modificación de términos
- **Reportes**: Cartera vencida, eficiencia de cobranza

### **📦 Gestión de Inventario**
- **Control de Stock**: Mínimos, máximos, alertas
- **Movimientos**: Entradas, salidas, ajustes
- **Valoración**: Costo promedio, PEPS
- **Reportes**: Stock crítico, rotación, valuación

### **🔧 Sistema de Garantías**
- **Registro**: Por producto y tipo de garantía
- **Reclamos**: Workflow completo de atención
- **Reemplazos**: Con afectación automática de inventario
- **Seguimiento**: Técnico, costos, resolución

### **📊 Reportes y Analytics**
- **Dashboard**: Métricas en tiempo real
- **Reportes**: Ventas, cobranza, inventario (PDF/CSV)
- **Gráficos**: Tendencias, comparativas, proyecciones
- **Alertas**: Stock bajo, pagos vencidos, garantías

### **⚙️ Configuración Avanzada**
- **Marca Blanca**: Logo, colores, información empresarial
- **Parámetros**: IVA, intereses, días gracia
- **Integraciones**: APIs externas, webhooks
- **Usuarios**: Roles y permisos granulares

## 🔐 Sistema de Roles y Permisos

| Rol | Permisos |
|-----|----------|
| **SUPERADMIN** | Acceso total al sistema, configuraciones |
| **ADMIN** | Gestión de usuarios, configuraciones básicas |
| **VENTAS** | Pedidos, ventas, clientes, productos (lectura) |
| **GESTOR** | Cobranza, pagos, reestructuras, reportes |
| **ANALISTA** | Reportes, consultas, dashboard |
| **CLIENTE** | Portal limitado (futuro) |

## 🔌 APIs y Integraciones

### **APIs REST Disponibles**
- `GET/POST /api/clientes` - Gestión de clientes
- `GET/POST /api/productos` - Catálogo de productos
- `GET/POST /api/pedidos` - Sistema de pedidos
- `GET/POST /api/ventas` - Gestión de ventas
- `GET/POST /api/pagares` - Control de pagarés
- `GET/POST /api/notas-cargo` - Notas de cargo
- `GET/POST /api/notas-credito` - Notas de crédito
- `GET/POST /api/reestructuras` - Reestructuras de crédito
- `GET/POST /api/garantias` - Sistema de garantías
- `GET /api/reportes/*` - Sistema de reportes
- `GET /api/dashboard/analytics` - Métricas y análisis

### **Webhooks**
- `POST /api/integraciones/webhooks?tipo=pago` - Pagos externos
- `POST /api/integraciones/webhooks?tipo=inventario` - Actualizaciones
- `POST /api/integraciones/webhooks?tipo=facturacion` - Facturación electrónica

### **Integraciones Soportadas**
- **OpenPay** - Procesamiento de pagos
- **Facturación Electrónica** - PACs certificados
- **Contabilidad** - Exportación de asientos
- **E-commerce** - Sincronización de productos

## 📈 Roadmap y Futuras Mejoras

### **Próximas Funcionalidades**
- [ ] **Módulo de Compras**: Proveedores, órdenes de compra, recepción
- [ ] **CRM Avanzado**: Pipeline de ventas, seguimiento de oportunidades
- [ ] **Portal de Clientes**: Consulta de saldos, estado de cuenta
- [ ] **App Móvil**: Para cobradores y vendedores
- [ ] **Facturación Electrónica**: Integración completa con SAT
- [ ] **Business Intelligence**: Dashboard ejecutivo avanzado
- [ ] **Multi-sucursal**: Gestión de múltiples ubicaciones
- [ ] **Multi-moneda**: Soporte para diferentes divisas

### **Mejoras Técnicas**
- [ ] **Tests Automatizados**: Unit, integration, e2e
- [ ] **Docker**: Containerización completa
- [ ] **CI/CD**: Pipeline de despliegue automatizado
- [ ] **Monitoring**: Logs, métricas, alertas
- [ ] **Performance**: Caché, optimización de consultas
- [ ] **Security**: Auditoría de seguridad, penetration testing

## 🛠️ Guía para Desarrolladores

### **Estructura de Códigos**
- **Convenciones**: Camelcase para JS/TS, kebab-case para archivos
- **Componentes**: Un componente por archivo, exports nombrados
- **APIs**: Estructura RESTful con validación de tipos
- **Base de Datos**: Migraciones automáticas con Prisma

### **Comandos Útiles**
```bash
# Desarrollo
yarn dev                    # Servidor de desarrollo
yarn build                  # Build de producción
yarn start                  # Servidor de producción

# Base de Datos
npx prisma generate        # Generar cliente Prisma
npx prisma db push         # Aplicar cambios de esquema
npx prisma studio          # Abrir Prisma Studio
npx prisma db seed         # Ejecutar seeds

# Calidad de Código
yarn lint                  # Ejecutar ESLint
yarn format               # Formatear con Prettier
yarn type-check           # Verificar tipos TypeScript
```

### **Guías de Contribución**
1. **Fork** el repositorio
2. **Crear branch** para nueva funcionalidad
3. **Implementar** con tests correspondientes
4. **Commit** con mensajes descriptivos
5. **Pull Request** con descripción detallada

## 📚 Documentación Adicional

- [**API Reference**](./docs/API.md) - Documentación completa de APIs
- [**Database Schema**](./docs/DATABASE.md) - Esquema y relaciones de BD
- [**User Manual**](./docs/USER_MANUAL.md) - Manual de usuario final
- [**Deployment Guide**](./docs/DEPLOYMENT.md) - Guía de despliegue
- [**Changelog**](./docs/CHANGELOG.md) - Historial de cambios

## 📄 Licencia

Este proyecto está licenciado bajo la [Licencia MIT](LICENSE) - vea el archivo LICENSE para detalles.

## 🤝 Soporte y Comunidad

- **Issues**: [GitHub Issues](https://github.com/tu-usuario/sistema-erp-completo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/tu-usuario/sistema-erp-completo/discussions)
- **Email**: soporte@sistema-erp.com
- **Discord**: [Servidor de Discord](https://discord.gg/sistema-erp)

## ⭐ Agradecimientos

Desarrollado con ❤️ utilizando las mejores prácticas de desarrollo moderno.

**¿Te gusta este proyecto?** ¡Dale una ⭐ en GitHub y ayuda a otros a encontrarlo!

---

> 💡 **¿Necesitas ayuda?** Revisa nuestra [documentación completa](./docs/) o abre un [issue en GitHub](https://github.com/tu-usuario/sistema-erp-completo/issues).

