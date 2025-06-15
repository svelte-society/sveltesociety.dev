# Step 1: Build the application
FROM oven/bun AS builder

# Set the working directory in the container
WORKDIR /app

# Copy all the application files to the container
COPY . .

# Run your build process
RUN bun i
RUN bun run --bun build

# Step 2: Create a smaller image for running the application
FROM oven/bun

# Set working directory for the second stage
WORKDIR /app

# Copy package.json and built files
COPY --from=builder /app/package.json .
COPY --from=builder /app/build ./build
# Copy migration files that are needed at runtime
COPY --from=builder /app/src/lib/server/db/migrations ./src/lib/server/db/migrations

# Install production dependencies only
RUN bun install --production

# Expose the port the application will run on
EXPOSE 3000

# Define start command
CMD ["bun", "./build"]