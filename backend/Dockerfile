# Use the official Node.js image with Alpine Linux for a lightweight footprint
FROM node:20-alpine

# Create and set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker caching
COPY package*.json ./

# Install dependencies (only production dependencies for a lighter footprint)
RUN npm install --omit=dev

# Copy the remaining application files
COPY . .

# Expose the application port (defaults to 5000 as configured in the backend)
EXPOSE 5000

# Start the backend server using the start script (tsx src/server.ts)
CMD ["npm", "start"]
