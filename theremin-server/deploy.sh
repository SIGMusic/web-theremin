#!/usr/bin/env bash
set -e
docker build -t sigmusicfa2020/theremin-server:latest .
docker run --rm -p 5000:5000 -it sigmusicfa2020/theremin-server:latest
