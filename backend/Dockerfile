FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN pnpm ci --only=production

# Copy source code
COPY . .

# Build TypeScript
RUN pnpm run build

# Expose port
EXPOSE 3001

# Start the application
CMD ["pnpm", "start"] 