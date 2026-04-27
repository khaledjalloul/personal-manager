FROM mcr.microsoft.com/vscode/devcontainers/base:ubuntu-24.04

# Install essentials
RUN apt update
RUN apt install -y \
    # NodeJS
    nodejs \
    npm

USER vscode

WORKDIR /workspace/personal-manager
