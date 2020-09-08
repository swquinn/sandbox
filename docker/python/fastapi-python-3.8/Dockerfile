FROM python:3.8-slim-buster
LABEL maintainer="Sean Quinn"

# Update, upgrade, and add packages
RUN apt update && apt upgrade -y \
 && apt install --no-install-recommends --no-install-suggests -y \
        curl \
        iputils-ping \
        procps \
 # Install Poetry
 && curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | POETRY_HOME=/opt/poetry python \
 && cd /usr/local/bin \
 && ln -s /opt/poetry/bin/poetry \
 && poetry config virtualenvs.create false \
 && pip install --no-cache-dir fastapi uvicorn

WORKDIR /
