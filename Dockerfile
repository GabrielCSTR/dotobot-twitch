# Estágio de build
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Instale o Chrome no estágio de build
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      nodejs \
      npm

# Defina a variável de ambiente para o caminho do Chrome
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV SERVICE_PATH=/usr/bin/google-chrome
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_NO_SANDBOX=true

# Copia package.json e package-lock.json
COPY package*.json ./

RUN npm install

RUN npm install puppeteer@13.5.0

# Copia o restante do código
COPY . .

# Compila o projeto TypeScript
RUN npm run build

# Estágio de produção
FROM node:18-alpine as production

# Instale o Chrome no estágio de build
# Instale o Chrome no estágio de build
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      nodejs \
      npm

# Defina a variável de ambiente para o caminho do Chrome
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV SERVICE_PATH=/usr/bin/google-chrome
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_NO_SANDBOX=true

WORKDIR /usr/src/app

# Copia os artefatos do build da etapa anterior
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Expor a porta que a aplicação irá rodar
EXPOSE 9139

# Comando para rodar a aplicação
CMD ["node", "dist/index.js", "google-chrome-stable"]
