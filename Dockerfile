# ── Etapa 1: Build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /usr/app_aaee_mgb

# Instala primero solo las dependencias (mejor uso de caché)
COPY package*.json ./
RUN npm ci --only=production

# ── Etapa 2: Imagen final (más ligera) ──────────────────────────────────────
FROM node:20-alpine

WORKDIR /usr/app_aaee_mgb

# Copia dependencias producción desde la etapa builder
COPY --from=builder /usr/app_aaee_mgb/node_modules ./node_modules

# Copia el código fuente
COPY mgb/ ./mgb/

# Variables de entorno por defecto (se sobreescriben en docker-compose o EC2)
ENV NODE_ENV=production \
    PORT=3000 \
    DB_HOST=db \
    DB_PORT=3306 \
    DB_USER=root \
    DB_PASSWORD=root \
    DB_NAME=concesionario_mgb

EXPOSE 3000

# Usuario no-root por seguridad
USER node

CMD ["node", "mgb/index.js"]
