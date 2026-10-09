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

# Expose backend port
EXPOSE 3000

# Start the backend server
CMD ["node", "server.js"]