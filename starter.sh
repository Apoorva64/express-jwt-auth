#!/bin/bash

# This script is used to start the application
# generate ssh keys

ssh-keygen -t rsa -b 2048 -m PEM -f keys/rsa.key -N ""
openssl rsa -in keys/rsa.key -pubout -outform PEM -out keys/rsa.key.pub

# start the application
yarn prod