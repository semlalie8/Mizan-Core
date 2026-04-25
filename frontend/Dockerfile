FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Start the Vite development server
CMD ["npm", "run", "dev"]
