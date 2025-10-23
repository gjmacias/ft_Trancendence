#!/bin/bash
# generar_$CERTS_DIR_con_CA.sh

set -e

# Colores ANSI
AZUL='\033[1;34m'
GRIS="\033[0;37m"
VERDE="\033[1;32m"
RESET="\033[0m"


MAIN_DIR="srcs"
# Ruta al directorio de contenedores
CONTAINER_DIR="$MAIN_DIR/containers"

# Directorio de salida de certificados
CERTS_DIR="$MAIN_DIR/certs"

DAYS_VALID=365

mkdir -p $CERTS_DIR/CA

echo -e  "${AZUL}📦 Detectando contenedores en '$CONTAINER_DIR'...${RESET}"
SERVICIOS=($(ls -1 "$CONTAINER_DIR" | grep -v '^\.' | sort))

# Crear CA (si no existe ya)
if [ ! -f $CERTS_DIR/CA/ca.key ]; then
  openssl genrsa -out $CERTS_DIR/CA/ca.key 4096
  openssl req -x509 -new -nodes -key $CERTS_DIR/CA/ca.key -sha256 -days $DAYS_VALID \
    -subj "/C=ES/ST=Barcelona/L=Barcelona/O=42/OU=Transcendence/CN=Transcendence/" \
    -out $CERTS_DIR/CA/ca.crt
  echo -e  "✅ CA generada en $CERTS_DIR/CA"
else
  echo -e  "📄 CA ya existe. Usando existente."
fi

# Crear certificados firmados por la CA
for SERVICIO in "${SERVICIOS[@]}"; do
  echo -e  "${GRIS}🔧 Generando certificado para $SERVICIO...${RESET}"

  mkdir -p $CERTS_DIR/$SERVICIO

  # Clave privada
  openssl genrsa -out $CERTS_DIR/$SERVICIO/$SERVICIO.key 2048

  # Crear archivo de configuración temporal con SAN
  cat > $CERTS_DIR/$SERVICIO/$SERVICIO.conf <<EOF
[req]
distinguished_name = req_distinguished_name
req_extensions = v3_req
prompt = no

[req_distinguished_name]
CN = $SERVICIO

[v3_req]
keyUsage = critical, digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth, clientAuth
subjectAltName = @alt_names

[alt_names]
DNS.1 = $SERVICIO
DNS.2 = localhost
DNS.3 = 127.0.0.1
EOF

  # Agregar SAN específicos para servicios críticos
  case $SERVICIO in
    "elasticsearch")
      echo "DNS.4 = es01" >> $CERTS_DIR/$SERVICIO/$SERVICIO.conf
      echo "DNS.5 = elasticsearch.transcendence.local" >> $CERTS_DIR/$SERVICIO/$SERVICIO.conf
      echo "IP.1 = 127.0.0.1" >> $CERTS_DIR/$SERVICIO/$SERVICIO.conf
      ;;
    "kibana")
      echo "DNS.4 = kibana.transcendence.local" >> $CERTS_DIR/$SERVICIO/$SERVICIO.conf
      echo "IP.1 = 127.0.0.1" >> $CERTS_DIR/$SERVICIO/$SERVICIO.conf
      ;;
  esac

  # CSR con extensiones
  openssl req -new -key $CERTS_DIR/$SERVICIO/$SERVICIO.key \
    -config $CERTS_DIR/$SERVICIO/$SERVICIO.conf \
    -out $CERTS_DIR/$SERVICIO/$SERVICIO.csr

  # Certificado firmado por la CA con extensiones
  openssl x509 -req -in $CERTS_DIR/$SERVICIO/$SERVICIO.csr \
    -CA $CERTS_DIR/CA/ca.crt -CAkey $CERTS_DIR/CA/ca.key -CAcreateserial \
    -out $CERTS_DIR/$SERVICIO/$SERVICIO.crt -days $DAYS_VALID -sha256 \
    -extensions v3_req -extfile $CERTS_DIR/$SERVICIO/$SERVICIO.conf

  # Limpiar archivo temporal
  rm $CERTS_DIR/$SERVICIO/$SERVICIO.conf

  # Copiar el CA a cada contenedor (para que confíe en otros)
  cp $CERTS_DIR/CA/ca.crt $CERTS_DIR/$SERVICIO/

  echo -e  "✅ Certificado para $SERVICIO creado y firmado por la CA con SAN."
done

for SERVICIO in "${SERVICIOS[@]}"; do
	DEST="./$MAIN_DIR/containers/$SERVICIO/certs"
	SRC="./$MAIN_DIR/certs/$SERVICIO"

	if [ ! -d "$DEST" ]; then
		mkdir $DEST
	fi
	cp -r "$SRC/"* "$DEST/"
done

echo -e  "${VERDE}Todos los certificados generados exitosamente en '$CERTS_DIR'${RESET}"
