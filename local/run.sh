#!/bin/bash

set -e

SCRIPT_DIR_FULL_PATH="$PWD/$(dirname $0)"

rm -rf dist cdk.out

npm run build:dev

npm run cdk:synth -- \
    --no-staging \
    --context awsEndpoint=http://host.docker.internal:8000 \
              dynamoTableArn=arn:aws:dynamodb:us-east-1:123456789012:table/todos-local \
              dynamoTableName=todos-local

npm run build:dev:watch &
PIDS[0]=$!

docker-compose -f $SCRIPT_DIR_FULL_PATH/docker-compose.yml up &
PIDS[1]=$!

trap "kill ${PIDS[*]}" SIGINT

wait
