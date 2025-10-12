FROM mcr.microsoft.com/vscode/devcontainers/base:ubuntu-24.04

# Set up personal apt repository
RUN echo "deb [trusted=yes] https://khaledjalloul.github.io/debian-repository unstable main" \
    | tee /etc/apt/sources.list.d/khaledjalloul.list

# Install essentials
RUN apt update
RUN apt install -y \
    # Personal CLI
    khaled-cli \
    # NodeJS
    nodejs \
    npm \
    # Git
    git-lfs

USER vscode

WORKDIR /workspace/personal-manager
