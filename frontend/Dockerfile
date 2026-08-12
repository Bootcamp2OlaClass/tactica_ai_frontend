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

# Build the production bundle
RUN npm run build

EXPOSE 3000

# Start the production server (local dev overrides this command in
# compose.yaml to run `npm run dev` instead)
CMD ["npm", "run", "start"]