FROM node:16-bullseye-slim

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV CHROME_PATH=/usr/bin/chromium
ENV DEBIAN_FRONTEND=noninteractive

RUN apt update -qq \
    && apt install -qq -y --no-install-recommends \
      curl \
      git \
      gnupg \
      libgconf-2-4 \
      libxss1 \
      libxtst6 \
      python \
      g++ \
      build-essential \
      chromium \
      chromium-sandbox \
      dumb-init \
      fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst \
      redis-server \
      xvfb \
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf /src/*.deb

# Install PM2 globally && delete npm cache 
RUN npm install -g pm2 && npm cache clean --force

# Add `app` user and group
RUN groupadd -r app && useradd -rm -g app -G audio,video app

WORKDIR /home/app

# Give app user access to all the project folders
RUN chown -R app:app /home/app
RUN chmod -R 777 /home/app

# Expose the port your app runs on
EXPOSE 3030