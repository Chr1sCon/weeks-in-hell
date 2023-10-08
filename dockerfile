# Use Node.js image
FROM node:14

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Set file permissions (this won't affect mounted volumes)
RUN chmod 644 /usr/src/app/data/appState.json

# Expose the port the app runs on
EXPOSE 3002

# Command to run the app
CMD ["npm", "start"]
