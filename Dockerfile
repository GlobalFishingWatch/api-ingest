################################################################################
# Base dependencies
################################################################################
FROM node:12-alpine AS build

# Setup the project directory
RUN apk update && apk add git && mkdir -p /opt/project
WORKDIR /opt/project

# Setup default command
CMD ["npm", "start"]

# Force environment to production
ENV NODE_ENV=production

# Setup application dependencies
COPY package*.json /opt/project/
RUN npm --unsafe-perm install --only production

# Setup the application code
COPY tslint.json /opt/project/
COPY tsconfig.json /opt/project/
COPY src /opt/project/src
RUN npm update auth-middleware
RUN npm run build

################################################################################
# Development environment
################################################################################
FROM build AS development
RUN apk add --update \
  python \
  curl \
  which \
  bash
RUN curl -sSL https://sdk.cloud.google.com | bash
ENV PATH $PATH:/root/google-cloud-sdk/bin
RUN  gcloud config set core/disable_usage_reporting true && \
  gcloud config set component_manager/disable_update_check true && \
  gcloud config set metrics/environment github_docker_image

# Overwrite environment to development
ENV NODE_ENV=development
COPY index.js /opt/project/

# Setup development dependencies
RUN npm --unsafe-perm install --only development

