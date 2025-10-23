FROM nginx:1.24.0

USER root
RUN apt update
RUN apt install vim -y && apt install git -y
RUN apt-get install bison build-essential ca-certificates curl dh-autoreconf doxygen \
  flex gawk git iputils-ping libcurl4-gnutls-dev libexpat1-dev libgeoip-dev liblmdb-dev \
  libpcre3-dev libpcre2-dev libpcre++-dev libssl-dev libtool libxml2 libxml2-dev libyajl-dev locales \
  lua5.3-dev pkg-config wget zlib1g-dev libxslt-dev libgd-dev -y


WORKDIR /opt/
RUN git clone https://github.com/SpiderLabs/ModSecurity-nginx
RUN wget http://nginx.org/download/nginx-1.24.0.tar.gz && tar -xzf nginx-1.24.0.tar.gz
RUN git clone https://github.com/SpiderLabs/ModSecurity

WORKDIR /usr/local/
RUN git clone --branch v4.0.0 https://github.com/coreruleset/coreruleset.git
RUN mv coreruleset owasp-crs
RUN mv owasp-crs/rules/RESPONSE-999-EXCLUSION-RULES-AFTER-CRS.conf.example owasp-crs/rules/RESPONSE-999-EXCLUSION-RULES-AFTER-CRS.conf
RUN rm owasp-crs/crs-setup.conf.example
RUN rm owasp-crs/rules/REQUEST-900-EXCLUSION-RULES-BEFORE-CRS.conf.example

WORKDIR /opt/ModSecurity
RUN git submodule init && git submodule update
RUN ./build.sh && ./configure
RUN  make && make install


WORKDIR /opt/nginx-1.24.0

RUN  ./configure \
	    --prefix=/etc/nginx --sbin-path=/usr/sbin/nginx --modules-path=/usr/lib/nginx/modules \
	--conf-path=/etc/nginx/nginx.conf --error-log-path=/var/log/nginx/error.log \
	--http-log-path=/var/log/nginx/access.log --pid-path=/var/run/nginx.pid \
	--lock-path=/var/run/nginx.lock --http-client-body-temp-path=/var/cache/nginx/client_temp \
	--http-proxy-temp-path=/var/cache/nginx/proxy_temp --http-fastcgi-temp-path=/var/cache/nginx/fastcgi_temp \
	--http-uwsgi-temp-path=/var/cache/nginx/uwsgi_temp --http-scgi-temp-path=/var/cache/nginx/scgi_temp \
	--user=nginx --group=nginx --with-compat --with-file-aio --with-threads --with-http_addition_module \
	--with-http_auth_request_module --with-http_dav_module --with-http_flv_module --with-http_gunzip_module \
	--with-http_gzip_static_module --with-http_mp4_module --with-http_random_index_module \
	--with-http_realip_module --with-http_secure_link_module --with-http_slice_module \
	--with-http_ssl_module --with-http_stub_status_module --with-http_sub_module \
	--with-http_v2_module --with-mail --with-mail_ssl_module --with-stream \
	--with-stream_realip_module --with-stream_ssl_module --with-stream_ssl_preread_module \
	--with-cc-opt='-g -O2 -ffile-prefix-map=/data/builder/debuild/nginx-1.24.0/debian/debuild-base/nginx-1.24.0=. -fstack-protector-strong -Wformat -Werror=format-security -Wp,-D_FORTIFY_SOURCE=2 -fPIC' --with-ld-opt='-Wl,-z,relro -Wl,-z,now -Wl,--as-needed -pie' \
	--add-dynamic-module=../ModSecurity-nginx \
 	&& make && make install
RUN make modules
RUN mkdir -p /etc/nginx/modules
RUN cp objs/ngx_http_modsecurity_module.so /etc/nginx/modules

WORKDIR /opt/
RUN mkdir -p /etc/nginx/modsec/
RUN mkdir -p /var/log/modsecurity/
RUN mkdir -p /var/cache/modsecurity/
RUN touch /var/log/modsecurity/audit.log

RUN mkdir /etc/nginx/tls
COPY conf/tls/nginx/nginx.crt /etc/nginx/tls
COPY conf/tls/nginx/nginx.key /etc/nginx/tls
COPY certs/ /etc/nginx/certs/
COPY conf/nginx.conf /etc/nginx/
COPY conf/owasp-crs/crs-setup.conf /usr/local/owasp-crs/
COPY conf/owasp-crs/1000-CUSTOME-BLOCKS.conf /usr/local/owasp-crs/rules/
COPY conf/owasp-crs/REQUEST-900-EXCLUSION-RULES-BEFORE-CRS.conf /usr/local/owasp-crs/rules/
COPY conf/owasp-crs/REQUEST-920-PROTOCOL-ENFORCEMENT.conf /usr/local/owasp-crs/rules/
# COPY conf/owasp-crs/REQUEST-945-APPLICATION-ATTACK-DDOS.conf /usr/local/owasp-crs/rules/

RUN cp /opt/ModSecurity/unicode.mapping /etc/nginx/modsec
RUN mv /opt/ModSecurity/modsecurity.conf-recommended  /opt/ModSecurity/modsecurity.conf && cp /opt/ModSecurity/modsecurity.conf /etc/nginx/modsec
COPY conf/modsecurity.conf /etc/nginx/modsec/modsecurity.conf
COPY conf/tls/nginx/nginx.crt /usr/local/share/ca-certificates/

EXPOSE  8443

ENTRYPOINT ["nginx", "-g", "daemon off;"]