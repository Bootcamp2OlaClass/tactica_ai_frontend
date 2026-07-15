# Start with a computer that already has Node.js installed
FROM node:20

# Create and enter the working directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project
COPY . .

# The Next.js development server listens on port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"].