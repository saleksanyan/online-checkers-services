# Use Alpine Linux 3.20 as base image
FROM alpine:3.20 AS builder

# Set environment variables
ENV NODE_VERSION 20.14.0
ENV YARN_VERSION 1.22.22

# Install dependencies for building Node.js
RUN apk add --no-cache \
    vim \
    libstdc++ \
    curl \
    make \
    python3 \
    py-setuptools
    # Additional build dependencies based on your needs (check Node.js documentation)

    # Download and verify Node.js source code
RUN set -e && \
    curl -fsSL https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION.tar.xz -o node-source.tar.xz && \
    curl -fsSL https://nodejs.org/dist/v$NODE_VERSION/SHASUMS256.txt.asc -o node-source.tar.xz.asc && \
    gpg --batch --verify node-source.tar.xz.asc node-source.tar.xz && \
    gpgconf --kill all && \
    rm node-source.tar.xz.asc && \
    echo "$(sha256sum node-source.tar.xz | awk '{print $1}')" > node-source.tar.xz.sha256 && \
    diff node-source.tar.xz.sha256 SHASUMS256.txt || exit 1

# Build Node.js
RUN tar -xf node-source.tar.xz && \
    cd node-v$NODE_VERSION && \
    ./configure --prefix=/usr/local && \
    make -j$(getconf _NPROCESSORS_ONLN) V= && \
    make install && \
    cd .. && \
    rm -rf node-v$NODE_VERSION node-source.tar.xz

# Install Yarn dependencies (builder stage)
RUN apk add --no-cache curl gnupg && \
    curl -fsSL https://yarnpkg.com/downloads/$YARN_VERSION/yarn-v$YARN_VERSION.tar.gz -o yarn.tar.gz && \
    curl -fsSL https://yarnpkg.com/downloads/$YARN_VERSION/yarn-v$YARN_VERSION.tar.gz.asc -o yarn.tar.gz.asc && \
    gpg --batch --verify yarn.tar.gz.asc yarn.tar.gz && \
    gpgconf --kill all && \
    tar -xzf yarn.tar.gz && \
    cp -r yarn-v$YARN_VERSION/bin/* /usr/local/bin/ && \
    rm -rf yarn.tar.gz yarn.tar.gz.asc yarn-v$YARN_VERSION

# Final image (smaller, contains only application files)
FROM node:alpine AS final

# Set working directory
WORKDIR /app

# Copy package.json, yarn.lock, and your application code
COPY package*.json ./
COPY . .

RUN yarn add ts-node

# Install NestJS locally (final image)
RUN yarn install

# Copy docker-entrypoint.sh script and make it executable (optional)
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Set the entry point and default command (optional)
ENTRYPOINT ["docker-entrypoint.sh"] (optional)
CMD ["yarn", "start"] (optional)
