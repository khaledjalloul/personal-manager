FROM mcr.microsoft.com/vscode/devcontainers/base:ubuntu-24.04

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -

RUN apt update
RUN apt install -y nodejs

USER vscode
