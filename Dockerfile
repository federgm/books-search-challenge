# Stage 1: Build
FROM node:22.18-alpine AS build

# Install tini for proper init handling
RUN apk add --no-cache tini

WORKDIR /app

# Copy package files and install deps (including dev for TS compiler)
COPY package*.json ./
RUN npm install

# Copy the rest of your source code
COPY . .

# Build your TypeScript code to JavaScript (assuming "build" script runs tsc)
RUN npm run build

# Stage 2: Run
FROM node:22.18-alpine

# Install tini in the final image
RUN apk add --no-cache tini

WORKDIR /app

# Copy only necessary files from build stage
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# Use tini as the init system to handle signals properly
ENTRYPOINT ["/sbin/tini", "--"]

# Run the compiled JS output (adjust path if needed)
CMD ["node", "dist/index.js"]
