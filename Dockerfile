# Use Node.js 22 base image
FROM node:22

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json .

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose Vite development server port
EXPOSE 5173

# Start Vite and allow external access
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]