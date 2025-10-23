#!/bin/bash
MAIN_DIR="srcs"
CONTAINER_DIR="$MAIN_DIR/containers"
SERVICIOS=($(ls -1 "$CONTAINER_DIR" | grep -v '^\.' | sort))


rm -rf ./srcs/certs

for SERVICIO in "${SERVICIOS[@]}"; do
	rm -rf ./srcs/containers/$SERVICIO/certs
done