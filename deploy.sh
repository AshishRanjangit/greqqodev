#!/bin/bash

cd ~/greqqo/greqqodev
git pull origin dev
docker-compose up -d --build
