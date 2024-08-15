FROM ubuntu:24.04

# Install core dependencies
RUN apt-get update && apt-get install -y \
    curl \
    sudo \
    build-essential \
    wget \
    gnupg \
    ca-certificates \
    apt-transport-https \
    xvfb \
    && rm -rf /var/lib/apt/lists/*

# Set up the display
ENV DISPLAY :99

# Install Node 22, https://github.com/nodesource/distributions?tab=readme-ov-file#installation-instructions-deb
RUN curl -fsSL https://deb.nodesource.com/setup_22.x -o nodesource_setup.sh
RUN sudo -E bash nodesource_setup.sh
RUN sudo apt-get install -y nodejs


# Set up the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on
EXPOSE 3030

# Start the application
CMD ["npm", "start"]