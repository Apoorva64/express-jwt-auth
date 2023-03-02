#!/bin/bash

# This script is used to start the application
# generate ssh keys
# check if the keys folder exists
if [ ! -d "keys" ]; then
    mkdir keys
fi
chmod 700 keys
# check if keys exist
if [ ! -f "keys/keypair.pem" ]; then
  echo "Generating keys"
  openssl genrsa -out keys/keypair.pem 2048
fi

if [ ! -f "keys/publickey.crt" ]; then
  echo "Generating public key"
  openssl rsa -in keys/keypair.pem -pubout -out keys/publickey.crt
fi

if [ ! -f "keys/pkcs8.key" ]; then
  echo "Generating pkcs8 key"
  openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in keys/keypair.pem -out keys/pkcs8.key
fi

# start the application
yarn prod