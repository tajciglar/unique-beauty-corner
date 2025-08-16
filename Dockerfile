# Use an official Node.js runtime as a parent image
FROM node:18-alpine as build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 3001 for the dev server
EXPOSE 3000

# Run the development server
CMD ["npm", "run", "dev"]
