# Docker para Portal Operativo - Transparencia Fiscal

Este documento proporciona instrucciones para construir y ejecutar la aplicación Next.js del Portal Operativo usando Docker para despliegue en producción.

## Archivos Creados

1. **`dockerfile`** - Dockerfile optimizado para producción con:
   - Multi-stage build para minimizar el tamaño de la imagen final
   - Usuario no-root para seguridad
   - Configuración de zona horaria (America/Mexico_City)
   - Health checks integrados
   - Labels de metadata para mejor gestión
   - Inclusión de archivo .env.production para configuración

2. **`.dockerignore`** - Archivo para excluir archivos innecesarios del build
3. **`.env.development`** - Variables de entorno para desarrollo
4. **`.env.production`** - Variables de entorno para producción

## Comandos Básicos

### Construir la imagen

```bash
# Desde el directorio fiscal-transparency-portal
docker build -t transparencia-fiscal-portal:latest .
```

### Ejecutar en modo desarrollo (con montaje de volumen)

```bash
docker run -d --rm \
  --name portal-operativo-dev \
  -p 3000:3000 \
  -v $(pwd):/app \
  -w /app \
  -e NODE_ENV=development \
  node:20-alpine \
  npm run dev
```

### Ejecutar en producción

```bash
# Construir la imagen primero
docker build -t transparencia-fiscal-portal:prod .

# Ejecutar el contenedor
docker run -d --rm \
  --name portal-operativo-prod \
  -p 3000:3000 \
  transparencia-fiscal-portal:prod
```

### Comandos útiles

```bash
# Ver logs del contenedor
docker logs portal-operativo-prod

# Ver estado del contenedor
docker ps -a --filter "name=portal-operativo"

# Detener el contenedor
docker stop portal-operativo-prod

# Eliminar la imagen
docker rmi transparencia-fiscal-portal:prod
```

## Variables de Entorno

La aplicación puede configurarse con las siguientes variables de entorno:

| Variable | Descripción | Valor por defecto | Requerido |
|----------|-------------|-------------------|-----------|
| `NODE_ENV` | Entorno de ejecución | `production` | Sí |
| `PORT` | Puerto de la aplicación | `3000` | No |
| `NEXT_PUBLIC_API_URL` | URL del backend API | `http://localhost:3001` | Sí |
| `NEXT_PUBLIC_APP_NAME` | Nombre de la aplicación | `Portal Operativo de Transparencia Fiscal` | No |
| `NEXT_PUBLIC_ENVIRONMENT` | Entorno (development/production) | `production` | No |

### Ejemplo con variables personalizadas

```bash
docker run -d --rm \
  --name portal-operativo \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e NEXT_PUBLIC_API_URL=https://app.administracionyfinanzas.morelos.gob.mx/transparencia-fiscal-api \
  transparencia-fiscal-portal:latest
```

## Integración con Docker Compose

Para ejecutar junto con el backend, crear un archivo `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  backend:
    build: ../transparencia-fiscal-api
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=sqlserver://192.168.105.14:1433;database=DB_Transparencia_Fiscal;user=usuing;password=PdJ*2025*7894;encrypt=false;trustServerCertificate=true
    restart: unless-stopped

  portal-operativo:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=http://backend:3001
    depends_on:
      - backend
    restart: unless-stopped
```

## Características del Dockerfile

### Seguridad
- Usuario no-root (`nextjs:nodejs`) para ejecutar la aplicación
- Permisos mínimos necesarios
- Health checks automáticos
- Exclusión de archivos sensibles mediante .dockerignore

### Optimización
- Multi-stage build para imagen final pequeña
- Cache de dependencias para builds más rápidos
- Solo archivos necesarios en la imagen final
- Build optimizado para producción

### Configuración
- Zona horaria configurada a America/Mexico_City
- Variables de entorno preconfiguradas
- Labels de metadata para mejor gestión de imágenes
- Inclusión de .env.production para configuración base

## Despliegue en Servidor Gubernamental

### Pasos para el equipo de soporte:

1. **Construir la imagen:**
   ```bash
   cd fiscal-transparency-portal
   docker build -t transparencia-fiscal-portal:1.0.0 .
   ```

2. **Guardar la imagen en archivo tar:**
   ```bash
   docker save -o transparencia-fiscal-portal_1.0.0.tar transparencia-fiscal-portal:1.0.0
   ```

3. **Transferir al servidor de producción:**
   - Copiar el archivo `.tar` al servidor
   - Copiar el archivo `.env.production` con las configuraciones correctas

4. **Cargar y ejecutar en el servidor:**
   ```bash
   # Cargar la imagen
   docker load -i transparencia-fiscal-portal_1.0.0.tar
   
   # Ejecutar el contenedor
   docker run -d \
     --name transparencia-fiscal-portal \
     -p 3000:3000 \
     --env-file .env.production \
     --restart unless-stopped \
     transparencia-fiscal-portal:1.0.0
   ```

### Configuración de Red y Proxy

Para producción gubernamental, se recomienda:
- Usar un proxy inverso (nginx o traefik)
- Configurar SSL/TLS
- Establecer políticas de red adecuadas
- Configurar balanceo de carga si es necesario

## Troubleshooting

### Problema: Error de permisos
```bash
# Si hay problemas de permisos con node_modules
docker run -d --rm \
  --name portal-operativo \
  -p 3000:3000 \
  -v $(pwd):/app \
  -w /app \
  node:20-alpine \
  sh -c "npm install && npm run dev"
```

### Problema: Puerto en uso
```bash
# Verificar qué proceso está usando el puerto
netstat -ano | findstr :3000

# Cambiar el puerto de exposición
docker run -d --rm --name portal-operativo -p 3002:3000 transparencia-fiscal-portal:latest
```

### Problema: Build falla por falta de memoria
```bash
# Aumentar memoria de Docker Desktop
# En Docker Desktop: Settings -> Resources -> Memory (mínimo 4GB)

# O usar build con menos memoria
docker build --memory 4g -t transparencia-fiscal-portal:latest .
```

### Problema: La aplicación no se conecta al backend
```bash
# Verificar que el backend esté corriendo
docker ps | grep transparencia-fiscal-api

# Verificar logs de conexión
docker logs portal-operativo-prod

# Probar conectividad desde el contenedor
docker exec portal-operativo-prod wget -O- http://backend:3001/health
```

## Mejores Prácticas para Producción Gubernamental

1. **Siempre usar tags específicos** en producción (ej: 1.0.0, 1.0.1)
2. **No almacenar secrets** en la imagen Docker - usar variables de entorno en tiempo de ejecución
3. **Usar .dockerignore** para excluir archivos innecesarios
4. **Monitorear logs** en producción con herramientas centralizadas
5. **Configurar health checks** para orquestadores como Kubernetes o Docker Swarm
6. **Implementar backup** de la imagen Docker en registro privado
7. **Documentar cambios** entre versiones
8. **Realizar pruebas de seguridad** periódicas

## Variables Críticas para Producción

Las siguientes variables DEBEN configurarse correctamente en producción:

```bash
# En archivo .env.production o como variables de entorno
NEXT_PUBLIC_API_URL=https://app.administracionyfinanzas.morelos.gob.mx/transparencia-fiscal-api
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

## Soporte

Para problemas o preguntas, consultar:
- Documentación del proyecto en `README.md`
- Archivo de configuración `.env.production`
- Equipo de desarrollo de Transparencia Fiscal
- Departamento de TI del Gobierno de Morelos
