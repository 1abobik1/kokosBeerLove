#!/bin/sh
# Enables the HTTPS server if certificates are mounted into /etc/nginx/ssl (see README, mkcert).
if [ -f /etc/nginx/ssl/localhost.pem ] && [ -f /etc/nginx/ssl/localhost-key.pem ]; then
    cp /etc/nginx/https.conf.disabled /etc/nginx/conf.d/https.conf
    echo "40-enable-https.sh: certificates found, HTTPS is enabled on port 443"
else
    rm -f /etc/nginx/conf.d/https.conf
    echo "40-enable-https.sh: no certificates in /etc/nginx/ssl, serving HTTP only"
fi
