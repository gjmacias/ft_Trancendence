ui = true

listener "tcp" {
  address       = "0.0.0.0:8200"
  tls_cert_file = "/opt/vault/certs/vault.crt"
  tls_key_file  = "/opt/vault/certs/vault.key"
  
  # For development only - remove in production
  tls_disable_client_certs = false
}

storage "file" {
  path = "/vault/file"
}

api_addr = "https://localhost:8200"
# cluster_addr = "https://localhost:8201"  #Por ahora no tiene cluster_addr
disable_mlock = true

# Telemetry for monitoring (optional)
telemetry {
  prometheus_retention_time = "30s"
  disable_hostname = true
}