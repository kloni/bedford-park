#!/bin/bash 

DOCKER_REPO=docker-repo.dxdev.ibm.com
TEST_DIR=$(pwd)

echo Download test image
docker pull ${DOCKER_REPO}/prod-stockholm-docker:latest
echo Change access rights to test script
chmod 777 ./start-ut.sh
docker run --name chrome-ut -v ${TEST_DIR}':/mnt/test' --entrypoint=/mnt/test/start-ut.sh docker-repo.dxdev.ibm.com/prod-stockholm-docker:latest 
docker rm chrome-ut
