FROM ghcr.io/cerbos/cerbos:0.10.0
COPY policies /policies
COPY config /config
ENTRYPOINT ["/cerbos"]
CMD ["server", "--config=/config/conf.docker.yaml"]