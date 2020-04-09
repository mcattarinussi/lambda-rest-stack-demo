FROM python:3.8-alpine

RUN apk add --no-cache --virtual builddeps curl gcc musl-dev && \
    # Install docker client (cli only!)
    curl -L https://download.docker.com/linux/static/stable/x86_64/docker-19.03.8.tgz | tar -xz -C /tmp && \
    mv /tmp/docker/docker /usr/local/bin/ && \
    # Install aws-sam-cli
    pip --no-cache-dir install aws-sam-cli && \
    # Cleanup
    apk del builddeps curl gcc && \
    rm -rf /tmp/* && \
    rm -rf /var/cache/apk/*

RUN	adduser -s /bin/bash samcli --disabled-password && \
    echo 'samcli ALL=(ALL) NOPASSWD:ALL' >>/etc/sudoers

USER samcli

EXPOSE 3000

ENTRYPOINT [ "sam" ]
