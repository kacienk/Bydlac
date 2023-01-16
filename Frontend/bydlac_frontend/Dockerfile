FROM node:19.4.0 as base

# Set the working directory to /app inside the container
WORKDIR /app
# Copy app files
COPY . .

# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
RUN npm ci 
# Build the app
RUN npm run build
ARG REACT_APP_BACKEND_IP
ENV REACT_APP_BACKEND_IP $REACT_APP_BACKEND_IP

ARG REACT_APP_BACKEND_PORT
ENV REACT_APP_BACKEND_PORT $REACT_APP_BACKEND_PORT

ARG REACT_APP_GOOGLE_MAPS_API_KEY
ENV REACT_APP_GOOGLE_MAPS_API_KEY $REACT_APP_GOOGLE_MAPS_API_KEY

# Set the env to "production"
ENV NODE_ENV production
# Expose the port on which the app will be running (3000 is the default that `serve` uses)
EXPOSE 3000

# Start the app
# CMD [ "npx", "serve", "build" ]