# Step 1: Build the React application
FROM node:18.17 as build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Update browserslist db (optional)
RUN npx browserslist@latest --update-db

# Build the application
RUN npm run build

# Export the application to static files
RUN npm run export

# Step 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the exported static files to the Nginx HTML directory
COPY --from=build /app/out /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Run Nginx
CMD ["nginx", "-g", "daemon off;"]
