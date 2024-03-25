# Use the official Node.js image as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /wakana/App/Todoapp/next

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application code to the container
COPY . .

# Expose the port on which the application will run
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "start"]

