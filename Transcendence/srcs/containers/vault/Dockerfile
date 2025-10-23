FROM nginx:1.24.0

WORKDIR /opt/

RUN apt-get update && apt-get install -y gnupg curl wget
RUN wget https://apt.releases.hashicorp.com/gpg -O /tmp/hashicorp.gpg && \
    gpg --dearmor < /tmp/hashicorp.gpg > /usr/share/keyrings/hashicorp-archive-keyring.gpg
RUN gpg --no-default-keyring --keyring /usr/share/keyrings/hashicorp-archive-keyring.gpg --fingerprint
RUN CODENAME=$(grep VERSION_CODENAME /etc/os-release | cut -d= -f2) && \
    echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $CODENAME main" > /etc/apt/sources.list.d/hashicorp.list
RUN apt update -y && apt install vault -y

RUN mkdir -p vault/config
COPY conf/vault.hcl /opt/vault/config/vault.hcl
COPY conf/vault-policy.hcl /opt/vault/config/vault-policy.hcl
COPY certs/ /opt/vault/certs/
COPY certs/ca.crt /usr/local/share/ca-certificates/ca.crt
RUN update-ca-certificates
#RUN rm /opt/vault/tls/tls.crt && rm /opt/vault/tls/tls.key
COPY start.sh /opt/start.sh
RUN chmod +x /opt/start.sh
#COPY conf/tls/vault/vault.crt /opt/vault/tls/
#COPY conf/tls/vault/vault.crt /usr/local/share/ca-certificates/
#COPY conf/tls/vault/vault.key /opt/vault/tls/

#COPY ./certs/ /etc/nginx/certs/

ENV VAULT_API_ADDR=https://localhost:8200
ENV VAULT_ADDR=https://localhost:8200
ENV VAULT_CACERT=/opt/vault/certs/ca.crt

EXPOSE  8200

ENTRYPOINT ["/opt/start.sh"]