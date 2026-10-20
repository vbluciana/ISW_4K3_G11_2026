FROM cloudflare/cloudflared:latest AS cloudflared

FROM alpine:3.21

RUN apk add --no-cache ca-certificates

COPY --from=cloudflared /usr/local/bin/cloudflared /usr/local/bin/cloudflared
COPY scripts/cloudflared-start.sh /usr/local/bin/cloudflared-start

RUN sed -i 's/\r$//' /usr/local/bin/cloudflared-start && chmod +x /usr/local/bin/cloudflared-start

ENTRYPOINT ["/usr/local/bin/cloudflared-start"]
