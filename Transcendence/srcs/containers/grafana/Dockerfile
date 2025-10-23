FROM grafana/grafana:10.1.0

# Cambiar a root temporalmente para configurar archivos
USER root

# Instalar dependencias adicionales si es necesario
RUN apk add --no-cache ca-certificates

# Crear directorios
RUN mkdir -p /etc/grafana/certs
RUN mkdir -p /etc/grafana/provisioning/datasources
RUN mkdir -p /etc/grafana/provisioning/dashboards

# Copiar configuración
COPY ./volume-grafana/grafana.ini /etc/grafana/grafana.ini
COPY ./volume-grafana/provisioning/ /etc/grafana/provisioning/
COPY ./volume-grafana/dashboards/ /var/lib/grafana/dashboards/
# Copy certificates directly from local directory
COPY ./certs/ /etc/grafana/certs/

# Set correct permissions for certificates
RUN chmod 644 /etc/grafana/certs/grafana.crt /etc/grafana/certs/ca.crt && \
    chmod 600 /etc/grafana/certs/grafana.key

# Ajustar permisos correctamente
RUN chmod 644 /etc/grafana/grafana.ini && \
    chmod -R 755 /etc/grafana/provisioning && \
    chown -R 472:472 /etc/grafana /var/lib/grafana

# La imagen base ya tiene el usuario grafana con UID/GID 472
RUN chown -R 472:472 /etc/grafana /var/lib/grafana
RUN chmod -R 755 /etc/grafana

# Volver al usuario grafana
USER 472

EXPOSE 3001

CMD ["grafana-server", \
     "--homepath=/usr/share/grafana", \
     "--config=/etc/grafana/grafana.ini"]