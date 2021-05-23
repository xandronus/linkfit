https://medium.com/responsetap-engineering/nextjs-https-for-a-local-dev-server-98bb441eabd7

openssl req -x509 -out localhost.crt -keyout localhost.key -days 365 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' -extensions EXT -config <(printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")

