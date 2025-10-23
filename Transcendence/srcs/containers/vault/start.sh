#!/bin/bash

set -e
trap 'echo "An error occurred. Exiting..."' ERR

unset VAULT_DEV_ROOT_TOKEN_ID

openssl req -x509 -nodes -days 365 \
    -newkey rsa:2048 \
    -keyout /opt/vault/certs/vault.key \
    -out /opt/vault/certs/vault.crt \
    -subj "/CN=vault" \
    -addext "subjectAltName=DNS:vault,DNS:localhost,IP:127.0.0.1"

cp /opt/vault/certs/vault.crt /usr/local/share/ca-certificates/vault.crt
update-ca-certificates
export VAULT_CACERT=/opt/vault/certs/vault.crt

vault server -config=/opt/vault/config/vault.hcl &
VAULT_PID=$!

until curl -k --silent https://localhost:8200/v1/sys/health | grep '"initialized":false' > /dev/null; do
    echo "Waiting for Vault server to be ready..."
    sleep 2
done


vault operator init > init.txt

#export VAULT_SKIP_VERIFY=true > /dev/null 2>&1

cat init.txt

export ROOT_TOKEN=$(< init.txt grep "Initial Root Token:" | cut -d ':' -f2- | sed 's/^ *//') #> /dev/null 2>&1

echo "ROOT_TOKEN extracted: ${ROOT_TOKEN:0:10}..." # Only show first 10 chars for security

vault operator unseal "$(< init.txt grep 'Unseal Key 1:' | cut -d ':' -f2- | sed 's/^ *//')" #> /dev/null 2>&1
vault operator unseal "$(< init.txt grep 'Unseal Key 2:' | cut -d ':' -f2- | sed 's/^ *//')" #> /dev/null 2>&1
vault operator unseal "$(< init.txt grep 'Unseal Key 3:' | cut -d ':' -f2- | sed 's/^ *//')" #> /dev/null 2>&1

echo "Attempting to login with ROOT_TOKEN..."
vault login $ROOT_TOKEN

vault policy write vault-policy /opt/vault/config/vault-policy.hcl > /dev/null 2>&1
vault token create -id="$VAULT_TOKEN_ID" -policy="vault-policy" -orphan

#vault login $ROOT_TOKEN > /dev/null 2>&1

vault secrets enable -path=transcendence kv #> /dev/null 2>&1

vault policy write vault-policy /opt/vault/config/vault-policy.hcl #> /dev/null 2>&1

# Create a token with the vault-policy and capture the output


# Extract the token from the output (alternative to jq)

# Store all secrets in a single config path to match backend expectations

#Also store individual secrets for compatibility (if other services need them)
vault kv put transcendence/client-id-google client_id_google="$CLIENT_ID_GOOGLE" > /dev/null 2>&1
vault kv put transcendence/client-secret-google client_secret_google="$CLIENT_SECRET_GOOGLE" > /dev/null 2>&1
vault kv put transcendence/redirect-uri-google redirect_uri_google="$REDIRECT_URI_GOOGLE" > /dev/null 2>&1
vault kv put transcendence/client-id-42 client_id_42="$CLIENT_ID_42" > /dev/null 2>&1
vault kv put transcendence/client-secret-42 client_secret_42="$CLIENT_SECRET_42" > /dev/null 2>&1
vault kv put transcendence/redirect-uri-42 redirect_uri_42="$REDIRECT_URI_42" > /dev/null 2>&1

vault kv put transcendence/jwt-secret jwt_secret="$JWT_SECRET" > /dev/null 2>&1
vault kv put transcendence/jwt-2fa-secret jwt_2fa_secret="$JWT_2FA_SECRET" > /dev/null 2>&1
vault kv put transcendence/refresh-jwt-secret refresh_jwt_secret="$REFRESH_JWT_SECRET" > /dev/null 2>&1
vault kv put transcendence/internal-secret-game internal_secret_game="$INTERNAL_SECRET_GAME" > /dev/null 2>&1
vault kv put transcendence/internal-secret-chat internal_secret_chat="$INTERNAL_SECRET_CHAT" > /dev/null 2>&1
vault kv put transcendence/internal-secret-backend internal_secret_backend="$INTERNAL_SECRET_BACKEND" > /dev/null 2>&1
vault kv put transcendence/internal-secret-blockchain internal_secret_blockchain="$INTERNAL_SECRET_BLOCKCHAIN" > /dev/null 2>&1
vault kv put transcendence/internal-secret-matchmaking internal_secret_matchmaking="$INTERNAL_SECRET_MATCHMAKING" > /dev/null 2>&1
vault kv put transcendence/internal-secret-tournament internal_secret_tournament="$INTERNAL_SECRET_TOURNAMENT" > /dev/null 2>&1

#curl -H "X-Vault-Token: vault_token" https://vault:8200/v1/transcendence/client-id-42 -k

nginx -g "daemon off;"
