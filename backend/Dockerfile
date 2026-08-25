# Use the official Node.js image with Alpine Linux for a lightweight footprint
FROM node:20-alpine

# Create and set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker caching
COPY package*.json ./

# Install dependencies (including devDependencies required for TypeScript execution)
RUN npm install

# Copy the remaining application files
COPY . .

# Expose the application port (defaults to 5000 as configured in the backend)
EXPOSE 5000

# Start the backend server using the start script (ts-node src/server.ts)
CMD ["npm", "start"]
