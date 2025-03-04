# Use an official Node.js runtime as a base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose port 5000 for the backend
EXPOSE 5000

# Define the command to start the server
CMD ["node", "server.js"]
