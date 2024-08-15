FROM --platform=linux/amd64 node:20@sha256:1ae9ba874435551280e95c8a8e74adf8a48d72b564bf9dfe4718231f2144c88f

ENV LANG en_US.UTF-8

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
    inotify-tools \
    && rm -rf /var/lib/apt/lists/*

# Install redis-server
RUN apt-get update && apt-get install -y redis-server

# Install latest chrome dev package and fonts to support major charsets (Chinese, Japanese, Arabic, Hebrew, Thai and a few others)
# Note: this installs the necessary libs to make the bundled version of Chrome that Puppeteer
# installs, work.
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/googlechrome-linux-keyring.gpg \
    && sh -c 'echo "deb [arch=amd64 signed-by=/usr/share/keyrings/googlechrome-linux-keyring.gpg] https://dl-ssl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-khmeros fonts-kacst fonts-freefont-ttf libxss1 dbus dbus-x11 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Install PM2 globally
RUN npm install -g pm2

# # Install Puppeteer globally
RUN npm install -g puppeteer

# Create a user with name 'app' and group that will be used to run the app
RUN groupadd -r app && useradd -rm -g app -G audio,video app

USER app

# Set up the working directory
WORKDIR /home/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on
EXPOSE 3030

# Give app user access to all the project folders
RUN chown -R app:app /home/app
RUN chmod -R 777 /home/app

# Start dbus and redis-server as root, but run the app as the 'app' user
USER root
CMD service dbus start && service redis-server start && su - app -c "pm2-runtime start ecosystem.config.js"