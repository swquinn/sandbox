include .env
export $(shell sed 's/=.*//' .env)

#: The path to this Makefile.
MAKEFILE_PATH := $(abspath $(lastword $(MAKEFILE_LIST)))

#: The root directory of the project, also the directory that the
#: Makefile is in.
ROOT_DIR := $(dir $(MAKEFILE_PATH))

owner := $(shell whoami)

group := $(shell id -gn)

### <summary>
### </summary>
default: help

### <summary>
### </summary>
.PHONY: .fix-permissions
.fix-permissions:
	@chown -R $(owner):$(group) $(ROOT_DIR)

### <summary>
### Displays a help screen and listing of commands that can be run through Make.
### </summary>
.PHONY: help
help:
	@echo "Usage make [COMMAND]"
	@echo ""
	@echo "Usage Examples"
	@echo ""
	@echo "    Build Docker images for your environment:"
	@echo "    $$ make build"
	@echo ""
	@echo ""
	@echo "Commands"
	@echo "  build                 Build Docker images."
	@echo "  clean                 Clean Docker images, containers, clear warmed files."
	@echo "  start                 Starts all service containers."
	@echo "  status                Show the status of all containers."
	@echo "  stop                  Stops and removes all service containers, "
	@echo "                        networks, images, and volumes."
	@echo ""


### <summary>
### </summary>
.PHONY: build
build:
	## Build all docker images.
	@/bin/sh ./docker/php/symfony-php-7.4/setup.sh
	@/bin/sh ./docker/python/fastapi-python-3.8/setup.sh
	@/bin/sh ./docker/nginx/nginx-fastapi-python-3.8/setup.sh
	@/bin/sh ./docker/nginx/nginx-symfony-php-7.4/setup.sh
	@docker-compose build

### <summary>
### </summary>
.PHONY: clean
clean:
	@docker system prune -f
	@docker volume prune -f
	@php ./app-symfony/bin/console cache:clear
	@php ./app-symfony/bin/console cache:warmup
	@rm -rf .coverage/


### <summary>
### An alias for "help".
### </summary>
.PHONY: list
list: help


.PHONY: logs
logs:
	@docker-compose logs -f


### Rebuild all images.
###
### Stops all of the running containers, if any are running, and then issues the
### build command, finally it cleans up any dangling Docker containers, images,
### and clears the PHP cache.
.PHONY: rebuild
rebuild: stop build clean

.PHONY: shell.cdn
shell.cdn:
	@docker exec -it cdn /bin/bash

.PHONY: shell.fastapi
shell.fastapi:
	@docker exec -it app_fastapi /bin/bash

.PHONY: shell.symfony
shell.symfony:
	@docker exec -it app_symfony /bin/sh


### <summary>
### </summary>
.PHONY: start
start:
	@docker-compose \
		-f $(ROOT_DIR)/docker-compose.yml \
		up -d app_symfony haproxy


### <summary>
### </summary>
.PHONY: start.debug
start.debug:
	@docker-compose \
		-f $(ROOT_DIR)/docker-compose.yml \
		up app_symfony haproxy


### <summary>
### </summary>
.PHONY: status
status:
	@docker-compose \
		-f $(ROOT_DIR)/docker-compose.yml \
		ps


### <summary>
### </summary>
.PHONY: stop
stop:
	@echo "> Stopping services..."
	@docker-compose \
		-f $(ROOT_DIR)/docker-compose.yml \
		down


### Catch all. Do nothing if we haven't matched at target
%:
	@:
