FROM mcr.microsoft.com/vscode/devcontainers/base:ubuntu-24.04

RUN echo "deb [trusted=yes] https://khaledjalloul.github.io/debian-repository unstable main" \
    | tee /etc/apt/sources.list.d/khaledjalloul.list

RUN apt update
RUN apt install -y \
    # Python
    python3.12 \
    python3-virtualenv \
    # C++
    cmake \
    clang-format \
    gdb \
    # Javascript
    nodejs \
    npm \
    # GUI support
    libxrandr2

USER vscode

RUN virtualenv /home/vscode/venv
ARG PIP=/home/vscode/venv/bin/pip
