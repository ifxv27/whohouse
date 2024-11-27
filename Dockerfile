# Use Node.js Alpine image for a smaller footprint
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies required for node-gyp
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies with platform-specific considerations
RUN npm install --platform=linux --arch=x64 --libc=musl && \
    npm install @rollup/rollup-linux-x64-musl

# Copy project files
COPY . .

# Expose port 5173 (Vite's default port)
EXPOSE 5173

# Start the development server, binding to all interfaces
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
