FROM prom/prometheus:v2.45.0

# Cambiar a root temporalmente para configurar archivos
USER root

# Crear directorios necesarios
RUN mkdir -p /prometheus
RUN mkdir -p /etc/prometheus/certs/prometheus
RUN mkdir -p /etc/prometheus/rules

# Copiar configuración
COPY ./volume-prometheus/ /etc/prometheus/
COPY ./certs/ /etc/prometheus/certs/prometheus/


# Ajustar permisos para que prometheus pueda leer todo
RUN chmod 644 /etc/prometheus/prometheus.yml /etc/prometheus/web.yml && \
    chmod -R 755 /etc/prometheus/rules && \
    find /etc/prometheus/certs/prometheus/ -name "*.crt" -exec chmod 644 {} \; && \
    find /etc/prometheus/certs/prometheus/ -name "*.key" -exec chmod 600 {} \; && \
    chown -R 65534:65534 /etc/prometheus /prometheus


# Volver al usuario prometheus
USER 65534

EXPOSE 9090

CMD ["--config.file=/etc/prometheus/prometheus.yml", \
     "--web.config.file=/etc/prometheus/web.yml", \
     "--storage.tsdb.path=/prometheus", \
     "--web.console.libraries=/etc/prometheus/console_libraries", \
     "--web.console.templates=/etc/prometheus/consoles", \
     "--storage.tsdb.retention.time=15d", \
     "--storage.tsdb.retention.size=1GB", \
     "--web.enable-lifecycle", \
     "--web.external-url=/prometheus", \
     "--web.route-prefix=/"]