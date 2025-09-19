
# 🚀 Sistema ERP Completo - Gestión Integral de Negocio v4.0

![Version](https://img.shields.io/badge/version-4.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.2.28-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue.svg)
![Prisma](https://img.shields.io/badge/Prisma-6.7.0-2D3748.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg)

Un sistema ERP moderno y completo desarrollado con **Next.js 14**, **TypeScript**, **Prisma** y **PostgreSQL**. Diseñado para pequeñas y medianas empresas que necesitan una solución integral para gestionar ventas, cobranza, inventario, compras, automatización y más.

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

### 🤖 **FASE 4 - Automatización y Tecnologías Avanzadas** ✅ **NUEVO**
- **Módulo de Compras**: Gestión de proveedores, órdenes de compra y recepción de mercancía
- **Sistema de Automatización**: Workflows, tareas programadas y reglas de negocio
- **Auditoría y Seguridad**: Logs completos, eventos de seguridad y control de cambios
- **Facturación Electrónica**: Integración con PACs, timbrado automático y CFDI
- **Business Intelligence**: Análisis avanzado con IA, predicciones y dashboards ejecutivos
- **Sistema de Backup**: Respaldos automáticos y gestión de recuperación
- **Sincronización Avanzada**: Integración en tiempo real con sistemas externos

## 🏗️ Arquitectura del Sistema (Actualizada v4.0)

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
│   │   │   ├── /configuracion    # Configuraciones del sistema
│   │   │   └── --- NUEVOS MÓDULOS FASE 4 ---
│   │   │   ├── /compras          # 🆕 Gestión de compras y proveedores
│   │   │   ├── /automatizacion   # 🆕 Workflows y automatización
│   │   │   ├── /auditoria        # 🆕 Auditoría y seguridad
│   │   │   ├── /facturacion-electronica # 🆕 CFDI y PACs
│   │   │   └── /business-intelligence   # 🆕 BI y análisis avanzado
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
│   │       ├── /integraciones    # APIs externas y webhooks
│   │       └── --- NUEVAS APIs FASE 4 ---
│   │       ├── /compras          # 🆕 APIs de compras
│   │       ├── /automatizacion   # 🆕 APIs de automatización
│   │       ├── /auditoria        # 🆕 APIs de auditoría
│   │       ├── /facturacion      # 🆕 APIs de facturación electrónica
│   │       ├── /business-intelligence # 🆕 APIs de BI
│   │       └── /sistema          # 🆕 APIs de sistema (backup, sync)
│   ├── /components               # Componentes reutilizables
│   │   ├── /ui                   # Componentes Shadcn/UI
│   │   ├── /navigation           # Navegación (sidebar actualizado)
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

## 🆕 Nuevas Funcionalidades FASE 4

### **🛒 Módulo de Compras**
- **Gestión de Proveedores**: Catálogo completo con condiciones comerciales
- **Órdenes de Compra**: Creación, seguimiento y confirmación
- **Recepción de Mercancía**: Control de entradas y actualización automática de inventario
- **Reportes de Compras**: Análisis de proveedores y performance

### **🤖 Sistema de Automatización Avanzada**
- **Workflows Automáticos**: Reglas de negocio basadas en eventos
- **Tareas Programadas**: Ejecución automática de procesos
- **Notificaciones Inteligentes**: Alertas por email, SMS y push
- **Mantenimiento Automático**: Limpieza de datos y optimización

### **🔍 Auditoría y Seguridad**
- **Logs Completos**: Registro de todas las actividades del sistema
- **Eventos de Seguridad**: Monitoreo de accesos y amenazas
- **Control de Cambios**: Seguimiento detallado de modificaciones
- **Análisis de Patrones**: Detección de anomalías y comportamientos

### **📄 Facturación Electrónica (CFDI)**
- **Integración con PACs**: Timbrado automático de facturas
- **Gestión de Certificados**: Manejo de CSD y vigencias
- **Cumplimiento SAT**: Reportes y cancelaciones automáticas
- **APIs Robustas**: Integración completa con sistemas de facturación

### **📊 Business Intelligence Avanzado**
- **Dashboards Ejecutivos**: Métricas de negocio en tiempo real
- **Análisis Predictivo**: Predicciones basadas en Machine Learning
- **Segmentación de Clientes**: Análisis RFM y comportamiento
- **Reportes Inteligentes**: Generación automática con insights

### **💾 Sistema de Backup y Sincronización**
- **Backups Automáticos**: Respaldos programados con compresión
- **Sincronización Externa**: Integración con servicios cloud
- **Recuperación de Datos**: Herramientas de restauración
- **Monitoreo de Estado**: Alertas y notificaciones de backup

## 🔌 APIs y Integraciones (Actualizadas v4.0)

### **APIs REST Disponibles**
#### Gestión Básica (FASES 1-3)
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

#### 🆕 Nuevas APIs FASE 4
- `GET/POST /api/compras/proveedores` - Gestión de proveedores
- `GET/POST /api/compras/ordenes` - Órdenes de compra
- `GET/POST /api/compras/recepciones` - Recepción de mercancía
- `GET/POST /api/automatizacion/workflows` - Workflows automáticos
- `GET/POST /api/automatizacion/tasks` - Tareas programadas
- `GET/POST /api/automatizacion/notifications` - Reglas de notificación
- `GET/POST /api/auditoria/logs` - Logs de auditoría
- `GET/POST /api/auditoria/security` - Eventos de seguridad
- `GET/POST /api/auditoria/changes` - Control de cambios
- `GET/POST /api/facturacion/facturas` - Facturas electrónicas
- `GET/POST /api/facturacion/pac` - Gestión de PACs
- `GET/POST /api/business-intelligence/analytics` - Análisis BI
- `GET/POST /api/sistema/backup` - Sistema de backups
- `GET/POST /api/sistema/sincronizacion` - Sincronización externa

### **🆕 Webhooks Avanzados**
- `POST /api/integraciones/webhooks?tipo=pago` - Pagos externos
- `POST /api/integraciones/webhooks?tipo=inventario` - Actualizaciones
- `POST /api/integraciones/webhooks?tipo=facturacion` - Facturación electrónica
- `POST /api/integraciones/webhooks?tipo=compras` - Notificaciones de compras
- `POST /api/integraciones/webhooks?tipo=backup` - Estados de backup

### **🆕 Integraciones Soportadas**
- **OpenPay** - Procesamiento de pagos (Configurado)
- **PACs Certificados** - Timbrado de CFDI
- **Contabilidad** - Exportación de asientos
- **E-commerce** - Sincronización de productos
- **Cloud Storage** - Backups automáticos
- **Sistemas CRM** - Sincronización de clientes
- **APIs de Proveedores** - Actualización de precios e inventario

## 📊 Métricas del Sistema v4.0

- **📁 Archivos**: 85+ archivos de código
- **📄 Páginas**: 15 módulos principales
- **🔗 APIs**: 35+ endpoints REST
- **🗄️ Tablas BD**: 50+ tablas optimizadas
- **🧩 Componentes**: 100+ componentes React
- **⚙️ Workflows**: 20+ procesos automatizados
- **📈 Reportes**: 25+ tipos de reportes
- **🔐 Roles**: 6 niveles de permisos
- **🌍 Idiomas**: Español (principal)

## 🚀 Instalación y Configuración (v4.0)

### **Prerequisitos**
- Node.js 18+ 
- PostgreSQL 14+
- Yarn o npm
- Certificados SAT (para facturación electrónica)
- Cuenta PAC (opcional)

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

# Variables básicas
DATABASE_URL="postgresql://usuario:password@localhost:5432/erp_db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secret-key-seguro"

# 🆕 Nuevas variables FASE 4
# Facturación Electrónica
PAC_URL="https://api.tu-pac.com"
PAC_USER="tu-usuario-pac"
PAC_PASSWORD="tu-password-pac"
CSD_CERTIFICATE_PATH="/path/to/certificate.cer"
CSD_PRIVATE_KEY_PATH="/path/to/private.key"
CSD_PASSWORD="password-del-certificado"

# OpenPay (ya configurado)
OPENPAY_MERCHANT_ID="valor-disponible"
OPENPAY_PRIVATE_KEY="valor-disponible"
OPENPAY_PUBLIC_KEY="valor-disponible"

# Cloud Storage para Backups
CLOUD_STORAGE_URL="https://storage.cloud.com"
CLOUD_STORAGE_ACCESS_KEY="tu-access-key"
CLOUD_STORAGE_SECRET_KEY="tu-secret-key"
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

## 📋 Funcionalidades Detalladas (v4.0)

### **🛒 Sistema de Ventas y Compras**
- **Pedidos y Órdenes**: Cotizaciones que se convierten en ventas/compras
- **Múltiples Precios**: Hasta 5 precios por producto y negociación con proveedores
- **Facturación Electrónica**: Generación automática de CFDI válidos
- **Pagarés**: Sistema automático de pagos a plazos
- **Inventario Inteligente**: Actualización automática por ventas y recepciones

### **💳 Sistema de Cobranza Avanzado**
- **Cálculo de Intereses**: Automático por días vencidos
- **Aplicación de Pagos**: A capital e intereses con integración OpenPay
- **Recordatorios Automáticos**: Notificaciones por email, SMS y WhatsApp
- **Reestructuras Inteligentes**: Modificación de términos con análisis de riesgo
- **Reportes Predictivos**: Cartera vencida y proyecciones de cobranza

### **📦 Gestión de Inventario e Compras**
- **Control de Stock**: Mínimos, máximos, alertas automáticas
- **Movimientos Auditables**: Entradas, salidas, ajustes con trazabilidad
- **Valoración Avanzada**: Costo promedio, PEPS, UEPS
- **Gestión de Proveedores**: Evaluación, performance y términos comerciales
- **Órdenes de Compra**: Workflow completo hasta recepción

### **🔧 Sistema de Garantías**
- **Registro Automático**: Por producto y tipo de garantía
- **Reclamos Digitalizados**: Workflow completo de atención
- **Reemplazos Inteligentes**: Con afectación automática de inventario
- **Seguimiento Completo**: Técnico, costos, resolución y satisfacción

### **📊 Reportes y Business Intelligence**
- **Dashboard Ejecutivo**: Métricas en tiempo real con KPIs
- **Reportes Inteligentes**: Ventas, cobranza, inventario (PDF/Excel)
- **Análisis Predictivo**: Tendencias, comparativas, proyecciones ML
- **Segmentación de Clientes**: Análisis RFM y comportamiento
- **Alertas Proactivas**: Stock bajo, pagos vencidos, garantías

### **🤖 Automatización Avanzada**
- **Workflows Inteligentes**: Procesos automáticos basados en eventos
- **Tareas Programadas**: Backups, reportes, sincronizaciones
- **Notificaciones Multicanal**: Email, SMS, Push, WhatsApp
- **Mantenimiento Automático**: Limpieza de datos y optimización
- **Reglas de Negocio**: Configurables sin programación

### **🔐 Auditoría y Seguridad**
- **Logs Completos**: Registro de todas las actividades
- **Eventos de Seguridad**: Monitoreo de accesos y amenazas
- **Control de Cambios**: Antes/después de modificaciones
- **Análisis Forense**: Investigación de incidentes
- **Cumplimiento Normativo**: Trazabilidad completa

### **⚙️ Configuración Avanzada**
- **Marca Blanca**: Logo, colores, información empresarial
- **Parámetros Dinámicos**: IVA, intereses, días gracia
- **Integraciones Múltiples**: APIs externas, webhooks, sincronización
- **Usuarios y Roles**: Permisos granulares y jerarquías
- **Multi-ubicación**: Soporte para múltiples sucursales

## 🔐 Sistema de Roles y Permisos (Actualizado v4.0)

| Rol | Permisos | Nuevos Módulos FASE 4 |
|-----|----------|----------------------|
| **SUPERADMIN** | Acceso total, configuraciones críticas | ✅ Todos los módulos, Backup, Auditoría |
| **ADMIN** | Gestión usuarios, configuraciones básicas | ✅ Compras, Automatización, Reportes BI |
| **VENTAS** | Pedidos, ventas, clientes, productos (lectura) | ❌ Solo consulta de reportes básicos |
| **GESTOR** | Cobranza, pagos, reestructuras, reportes | ✅ Auditoría de cobranza, Workflows |
| **ANALISTA** | Reportes, consultas, dashboard | ✅ Business Intelligence, Analytics |
| **COMPRAS** | 🆕 Proveedores, órdenes, recepciones | ✅ Módulo completo de compras |

## 📈 Roadmap Futuro (Próximas Fases)

### **FASE 5 - Movilidad y Experiencia**
- [ ] **App Móvil Nativa**: iOS y Android para cobradores y vendedores
- [ ] **PWA Avanzada**: Funcionalidad completa offline
- [ ] **Portal de Clientes**: Self-service para consultas y pagos
- [ ] **Experiencia de Usuario**: UI/UX mejorada con animaciones

### **FASE 6 - Inteligencia y Escalabilidad**
- [ ] **IA Avanzada**: Chatbots, reconocimiento de voz, procesamiento de documentos
- [ ] **Multi-empresa**: Gestión de múltiples empresas desde una instancia
- [ ] **Multi-moneda**: Soporte completo para divisas internacionales
- [ ] **Blockchain**: Trazabilidad inmutable y contratos inteligentes

### **FASE 7 - Ecosistema Completo**
- [ ] **Marketplace**: Plataforma de terceros y extensiones
- [ ] **API Gateway**: Gestión avanzada de APIs y rate limiting
- [ ] **Microservicios**: Arquitectura distribuida para escalabilidad
- [ ] **Edge Computing**: Procesamiento distribuido global

## 🛠️ Guía para Desarrolladores (v4.0)

### **Estructura de Códigos Actualizada**
- **Convenciones**: Camelcase para JS/TS, kebab-case para archivos
- **Componentes**: Un componente por archivo, exports nombrados
- **APIs**: Estructura RESTful con validación de tipos y OpenAPI
- **Base de Datos**: Migraciones automáticas con Prisma, auditoría
- **Seguridad**: Validación en cliente y servidor, sanitización

### **Comandos Útiles (v4.0)**
```bash
# Desarrollo
yarn dev                    # Servidor de desarrollo
yarn build                  # Build de producción
yarn start                  # Servidor de producción
yarn test                   # Tests automatizados (próximamente)

# Base de Datos
npx prisma generate        # Generar cliente Prisma
npx prisma db push         # Aplicar cambios de esquema
npx prisma studio          # Abrir Prisma Studio
npx prisma db seed         # Ejecutar seeds

# 🆕 Nuevos comandos FASE 4
yarn backup:create         # Crear backup manual
yarn backup:restore        # Restaurar desde backup
yarn audit:export         # Exportar logs de auditoría
yarn sync:all             # Sincronizar todos los servicios
yarn workflow:test        # Probar workflows

# Calidad de Código
yarn lint                  # Ejecutar ESLint
yarn format               # Formatear con Prettier
yarn type-check           # Verificar tipos TypeScript
yarn security:scan       # Escaneo de seguridad (próximamente)
```

### **🆕 Testing y Quality Assurance (v4.0)**
```bash
# Tests (en desarrollo)
yarn test:unit            # Tests unitarios
yarn test:integration     # Tests de integración
yarn test:e2e             # Tests end-to-end
yarn test:performance     # Tests de rendimiento

# Análisis de Código
yarn analyze:bundle       # Análisis del bundle
yarn analyze:deps        # Análisis de dependencias
yarn analyze:security     # Análisis de seguridad
```

## 📚 Documentación Adicional (Actualizada v4.0)

- [**API Reference v4.0**](./API_REFERENCE_v4.md) - Documentación completa de APIs incluyendo FASE 4
- [**Database Schema v4.0**](./DATABASE_SCHEMA_v4.md) - Esquema completo con nuevas tablas
- [**User Manual v4.0**](./USER_MANUAL_v4.md) - Manual completo para usuarios finales
- [**Deployment Guide v4.0**](./DEPLOYMENT_GUIDE_v4.md) - Guía de despliegue para producción
- [**Security Guide v4.0**](./SECURITY_GUIDE_v4.md) - Guía de seguridad y mejores prácticas
- [**Integration Guide v4.0**](./INTEGRATION_GUIDE_v4.md) - Guía de integraciones externas
- [**Backup & Recovery Guide**](./BACKUP_RECOVERY_GUIDE.md) - Guía de respaldos y recuperación
- [**Automation Handbook**](./AUTOMATION_HANDBOOK.md) - Manual de automatización y workflows
- [**Business Intelligence Guide**](./BI_GUIDE.md) - Guía de análisis y reportes avanzados
- [**Changelog v4.0**](./CHANGELOG_v4.md) - Historial detallado de cambios

## 🚀 Importación a Otra Cuenta DeepAgent

### **Resumen de Archivos Creados en FASE 4**
```
📁 /app/compras/page.tsx                    # Módulo de compras
📁 /app/automatizacion/page.tsx             # Sistema de automatización  
📁 /app/auditoria/page.tsx                  # Auditoría y seguridad
📁 /app/facturacion-electronica/page.tsx    # Facturación electrónica
📁 /app/business-intelligence/page.tsx      # Business Intelligence

📁 /api/compras/                            # APIs de compras (3 archivos)
📁 /api/automatizacion/                     # APIs de automatización (3 archivos)  
📁 /api/auditoria/                         # APIs de auditoría (3 archivos)
📁 /api/sistema/                           # APIs de sistema (2 archivos)

📁 /components/navigation/sidebar.tsx       # Navegación actualizada
```

### **Instrucciones de Continuación**
1. **Copiar todos los archivos** del directorio `/home/ubuntu/sistema_erp_completo/`
2. **Instalar dependencias** con `yarn install`
3. **Configurar variables** de entorno (especialmente FASE 4)
4. **Ejecutar migraciones** de base de datos
5. **Probar funcionalidades** nuevas paso a paso
6. **Configurar integraciones** externas (PAC, OpenPay, etc.)

## 📄 Licencia

Este proyecto está licenciado bajo la [Licencia MIT](LICENSE) - vea el archivo LICENSE para detalles.

## 🤝 Soporte y Comunidad

- **Issues**: [GitHub Issues](https://github.com/tu-usuario/sistema-erp-completo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/tu-usuario/sistema-erp-completo/discussions)
- **Email**: soporte@sistema-erp.com
- **Discord**: [Servidor de Discord](https://discord.gg/sistema-erp)

## ⭐ Agradecimientos

Desarrollado con ❤️ utilizando las mejores prácticas de desarrollo moderno.

**Sistema ERP Completo v4.0** - La solución más completa para la gestión empresarial.

---

> 💡 **¿Necesitas ayuda?** Revisa nuestra [documentación completa v4.0](./docs/) o abre un [issue en GitHub](https://github.com/tu-usuario/sistema-erp-completo/issues).

> 🚀 **¿Listo para producción?** Sigue nuestra [guía de despliegue v4.0](./DEPLOYMENT_GUIDE_v4.md) para configurar tu entorno.
