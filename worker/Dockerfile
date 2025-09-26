
FROM rust:1.71 as builder
WORKDIR /app
COPY Cargo.toml Cargo.lock ./
COPY src ./src
RUN cargo build --release

FROM debian:buster-slim
COPY --from=builder /app/target/release/apply_worker /usr/local/bin/apply_worker
CMD ["/usr/local/bin/apply_worker"]
