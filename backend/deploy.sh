#!/bin/bash

git pull origin shubham121224

docker-compose down

docker rmi kheloindore-node_app:latest

docker-compose up -d

echo ""
echo ""

echo "Deployment completed!"
