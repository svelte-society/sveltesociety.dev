# Use Node 22 as the base image
FROM node:22-alpine
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Set working directory
WORKDIR /sites/www

COPY . .

# Install LiteFS
COPY --from=flyio/litefs:0.5 /usr/local/bin/litefs /usr/local/bin/litefs

# Install dependencies
RUN pnpm install

# Copy the rest of the application
COPY . .

COPY sites/www/litefs.yml /etc/litefs.yml

# Build the application
RUN pnpm run build:www

# Expose the port the app runs on
EXPOSE 4173

# Install Packages that we need
RUN apk add ca-certificates fuse3 sqlite

ENTRYPOINT litefs mount