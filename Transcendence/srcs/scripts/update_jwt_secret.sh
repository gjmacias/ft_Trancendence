#!/bin/bash

# Ruta al archivo .env
ENV_FILE="srcs/.env"

# Verifica si el archivo existe
if [ ! -f "$ENV_FILE" ]; then
	echo ".env no encontrado. Saliendo..."
	exit 1
fi

# Lista de claves que quieres generar
SECRETS=("INTERNAL_SECRET_BACKEND" "INTERNAL_SECRET_BLOCKCHAIN" "INTERNAL_SECRET_GAME" "INTERNAL_SECRET_MATCHMAKING" "INTERNAL_SECRET_TOURNAMENT" "INTERNAL_SECRET_CHAT" "JWT_2FA_SECRET" "JWT_SECRET")

# Recorre cada clave
for KEY in "${SECRETS[@]}"; do
	# Genera un nuevo secreto aleatorio
	NEW_SECRET=$(openssl rand -base64 48 | tr -d '\n ')
	ESCAPED_SECRET=$(printf '%s\n' "$NEW_SECRET" | sed -e 's/[\/&|\\]/\\&/g')

	# Busca y reemplaza, o añade si no existe
	if grep -q "^$KEY=" "$ENV_FILE"; then
		sed -i "s/^$KEY=.*/$KEY=\"$ESCAPED_SECRET\"/" "$ENV_FILE"
		echo "🔐 $KEY actualizado en .env"
	else
		echo "$KEY=\"$ESCAPED_SECRET\"" >> "$ENV_FILE"
		echo "➕ $KEY añadido a .env"
	fi
done

SPECIAL_SECRETS=("VAULT_TOKEN_ID")

for KEY in "${SPECIAL_SECRETS[@]}"; do
	# Genera un nuevo secreto aleatorio con solo caracteres alfanuméricos
	NEW_SECRET=$(tr -dc 'A-Za-z0-9' < /dev/urandom | head -c 48)

	# Busca y reemplaza, o añade si no existe
	if grep -q "^$KEY=" "$ENV_FILE"; then
		sed -i "s/^$KEY=.*/$KEY=\"$NEW_SECRET\"/" "$ENV_FILE"
		echo "🔐 $KEY actualizado en .env"
	else
		echo "$KEY=\"$NEW_SECRET\"" >> "$ENV_FILE"
		echo "➕ $KEY añadido a .env"
	fi
done
