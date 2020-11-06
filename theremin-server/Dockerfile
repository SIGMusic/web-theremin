# Pull in the official lightweight version of Node 14.
FROM node:14-slim

# Create and change to the app directory.
WORKDIR /app

COPY package.json .
COPY yarn.lock .

# Install production dependencies.
RUN yarn install --production

# Copy local codebase into the container image
COPY . .

# Compile.
RUN yarn build

# Remove unused src directory
RUN rm -rf src/

# Start the api server
CMD [ "yarn", "start" ]
