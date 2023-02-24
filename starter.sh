#!/bin/bash

# This script is used to start the application
# generate ssh keys

openssl genrsa -out keys/keypair.pem 2048
openssl rsa -in keys/keypair.pem -pubout -out keys/publickey.crt
openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in keys/keypair.pem -out keys/pkcs8.key

# start the application
yarn prod