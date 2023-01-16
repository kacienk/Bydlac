FROM node:19.4.0 as base

# Set the working directory to /app inside the container
WORKDIR /app
# Copy app files
COPY . .

FROM base AS build
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
RUN npm ci 
# Build the app
RUN npm run build

FROM base AS runtime
# Set the env to "production"
ENV NODE_ENV production
# Expose the port on which the app will be running (3000 is the default that `serve` uses)
EXPOSE 3000

# Start the app
CMD [ "npx", "serve", "build" ]