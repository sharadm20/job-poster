
FROM rust:1.71 as builder
WORKDIR /app
COPY Cargo.toml Cargo.lock ./
COPY src ./src
RUN cargo build --release

FROM debian:buster-slim
COPY --from=builder /app/target/release/ai_job_applier_backend /usr/local/bin/ai_job_applier_backend
CMD ["/usr/local/bin/ai_job_applier_backend"]
