
# Comunicaciones - Evolution API y LabsMobile SMS

## Funcionalidades Implementadas

### WhatsApp Business API (Evolution API)
- ✅ Envío de mensajes de texto
- ✅ Envío de archivos multimedia
- ✅ Estado de conexión de la instancia
- ✅ Obtención de contactos
- ✅ Integración desde módulo de clientes

### SMS LabsMobile
- ✅ Envío individual de SMS
- ✅ Envío masivo de SMS
- ✅ Programación de envíos
- ✅ Control de costos
- ✅ Plantillas de mensajes predefinidos

## Configuración

### 1. Evolution API (WhatsApp)

Primero necesitas tener una instancia de Evolution API ejecutándose. Puedes usar Docker:

```bash
# Clonar el repositorio de Evolution API
git clone https://github.com/EvolutionAPI/evolution-api.git
cd evolution-api

# Configurar con Docker Compose
docker-compose up -d
```

En tu archivo `.env`, configura:
```env
EVOLUTION_API_URL=http://localhost:8080
EVOLUTION_INSTANCE_NAME=mi-instancia
EVOLUTION_API_TOKEN=tu-token-aqui
```

### 2. LabsMobile SMS

Regístrate en [LabsMobile](https://www.labsmobile.com) y obtén tus credenciales.

En tu archivo `.env`, configura:
```env
LABSMOBILE_USERNAME=tu-usuario
LABSMOBILE_TOKEN=tu-token
```

## Uso

### Desde el módulo de Clientes:
1. Ve a la página de Clientes
2. Cada cliente con teléfono tendrá botones de WhatsApp (🟢) y SMS (🔵)
3. Utiliza "SMS Masivo" para enviar a múltiples clientes

### Desde el Centro de Comunicaciones:
1. Ve a la página "Comunicación" en el sidebar
2. Envío rápido para mensajes individuales
3. Acceso a herramientas de comunicación masiva
4. Estado de las APIs y configuración

## Plantillas de Mensajes

### WhatsApp:
- Recordatorio de pago con datos del cliente
- Confirmación de pagos recibidos
- Notificaciones de crédito aprobado
- Mensajes promocionales

### SMS:
- Mensajes cortos para recordatorios
- Confirmaciones rápidas
- Alertas importantes
- Promociones con límite de caracteres

## Variables Disponibles en Plantillas

- `[NOMBRE]` - Nombre del cliente
- `[SALDO]` - Saldo pendiente del cliente
- `[FECHA]` - Fecha actual o vencimiento
- `[MONTO]` - Monto específico

## API Endpoints

### WhatsApp:
- `POST /api/whatsapp/send` - Enviar mensaje
- `GET /api/whatsapp/status` - Estado de la instancia

### SMS:
- `POST /api/sms/send` - Enviar SMS individual
- `POST /api/sms/bulk` - Enviar SMS masivo

## Costos Estimados

### SMS LabsMobile:
- Nacional: ~$0.15 MXN por SMS
- Internacional: Varía según destino
- Mensajes largos se cobran por partes (160 caracteres c/u)

### WhatsApp Evolution API:
- Costos según el proveedor de hosting
- Sin costo por mensaje (solo infraestructura)

## Solución de Problemas

### WhatsApp no conecta:
1. Verificar que Evolution API esté ejecutándose
2. Revisar la configuración de tokens
3. Verificar el estado de la instancia en `/comunicacion`

### SMS no se envían:
1. Verificar credenciales de LabsMobile
2. Verificar saldo en la cuenta
3. Verificar formato de números (+52XXXXXXXXXX)

### Números de teléfono:
- Formato internacional: +52XXXXXXXXXX para México
- Remover espacios, guiones y paréntesis
- WhatsApp: Incluir código de país
- SMS: Incluir código de país

## Integración con n8n

Las funcionalidades están preparadas para integrarse con n8n mediante webhooks:

1. Configurar webhook en n8n
2. Agregar URL en variable `N8N_WEBHOOK_URL`
3. Los eventos de mensajes se enviarán automáticamente

## Seguridad

- Los tokens se almacenan en variables de entorno
- Las APIs requieren autenticación válida
- Los mensajes se registran en logs del servidor
- Validación de permisos por rol de usuario

## Próximas Mejoras

- [ ] Historial de mensajes enviados
- [ ] Reportes de entrega
- [ ] Templates personalizables por empresa
- [ ] Integración con calendario para envíos programados
- [ ] Respuestas automáticas
- [ ] Chatbot básico para consultas frecuentes
