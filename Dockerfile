FROM node:20-alpine

LABEL org.opencontainers.image.title="ReverseEngineerEverything"
LABEL org.opencontainers.image.description="Open-source reverse engineering framework for security researchers"
LABEL org.opencontainers.image.source="https://github.com/Ankitajainkuniya/ReverseEngineerEverything"

WORKDIR /app

# Install REE globally
RUN npm install -g ree

# Create directory for APK analysis
WORKDIR /workspace

ENTRYPOINT ["ree"]
CMD ["--help"]
