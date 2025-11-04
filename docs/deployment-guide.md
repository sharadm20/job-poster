# Deployment Guide for AI Job Applier

This guide explains how to deploy the AI Job Applier system to various environments.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Docker Deployment](#docker-deployment)
- [Kubernetes Deployment](#kubernetes-deployment)
- [Cloud Deployment](#cloud-deployment)
- [Monitoring and Logging](#monitoring-and-logging)
- [Scaling](#scaling)

## Prerequisites

Before deploying, ensure you have:

- Docker and Docker Compose (for containerized deployment)
- Kubernetes cluster (for K8s deployment)
- Cloud provider account (AWS, GCP, Azure, etc.)
- Domain name (optional, for production)
- SSL certificate (optional, for HTTPS)
- Database instance (MongoDB)
- Redis instance (for caching and queues)

## Environment Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# JWT Secret (use a strong, random secret in production)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# MongoDB Connection
MONGODB_URI=mongodb://user:password@mongodb-host:27017/ai-job-applier

# Redis Connection (for caching and queues)
REDIS_URL=redis://redis-host:6379

# Node Environment
NODE_ENV=production

# Logging Level
LOG_LEVEL=info

# Service Ports (only if not using Docker networking)
USER_SERVICE_PORT=3001
AUTH_SERVICE_PORT=3002
JOB_DISCOVERY_SERVICE_PORT=3003
API_GATEWAY_PORT=8080
```

### Security Considerations

- Never commit secrets to version control
- Use environment variables or secret management systems
- Use different secrets for each environment
- Rotate secrets regularly
- Use HTTPS in production

## Docker Deployment

### 1. Build Docker Images

Build all service images:

```bash
npm run docker:build
```

Or build individual services:

```bash
docker build -f apps/user-service/Dockerfile -t ai-job-applier/user-service .
docker build -f apps/auth-service/Dockerfile -t ai-job-applier/auth-service .
docker build -f apps/job-discovery-service/Dockerfile -t ai-job-applier/job-discovery-service .
docker build -f apps/api-gateway/Dockerfile -t ai-job-applier/api-gateway .
```

### 2. Deploy with Docker Compose

Deploy all services with Docker Compose:

```bash
npm run docker:up
```

Or manually:

```bash
docker-compose -f docker/compose/docker-compose.yml up -d
```

### 3. Verify Deployment

Check if all services are running:

```bash
docker ps
```

Check service logs:

```bash
docker logs ai-job-applier-api-gateway
docker logs ai-job-applier-user-service
docker logs ai-job-applier-auth-service
docker logs ai-job-applier-job-discovery-service
```

### 4. Stop Services

To stop all services:

```bash
npm run docker:down
```

## Kubernetes Deployment

### 1. Prerequisites

- Kubernetes cluster (minikube, kind, or cloud provider)
- kubectl configured

### 2. Create Kubernetes Manifests

Create the following Kubernetes manifests in `k8s/` directory:

#### Namespace
```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: ai-job-applier
```

#### Secrets
```yaml
# k8s/secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: ai-job-applier-secrets
  namespace: ai-job-applier
type: Opaque
data:
  jwt-secret: <base64-encoded-jwt-secret>
  mongodb-uri: <base64-encoded-mongodb-uri>
```

#### Services
```yaml
# k8s/services.yaml
---
apiVersion: v1
kind: Service
metadata:
  name: api-gateway
  namespace: ai-job-applier
spec:
  selector:
    app: api-gateway
  ports:
    - protocol: TCP
      port: 8080
      targetPort: 8080
  type: LoadBalancer
---
apiVersion: v1
kind: Service
metadata:
  name: user-service
  namespace: ai-job-applier
spec:
  selector:
    app: user-service
  ports:
    - protocol: TCP
      port: 3000
      targetPort: 3000
  type: ClusterIP
---
apiVersion: v1
kind: Service
metadata:
  name: auth-service
  namespace: ai-job-applier
spec:
  selector:
    app: auth-service
  ports:
    - protocol: TCP
      port: 3000
      targetPort: 3000
  type: ClusterIP
---
apiVersion: v1
kind: Service
metadata:
  name: job-discovery-service
  namespace: ai-job-applier
spec:
  selector:
    app: job-discovery-service
  ports:
    - protocol: TCP
      port: 3000
      targetPort: 3000
  type: ClusterIP
```

#### Deployments
```yaml
# k8s/deployments.yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-gateway
  namespace: ai-job-applier
spec:
  replicas: 2
  selector:
    matchLabels:
      app: api-gateway
  template:
    metadata:
      labels:
        app: api-gateway
    spec:
      containers:
      - name: api-gateway
        image: ai-job-applier/api-gateway:latest
        ports:
        - containerPort: 8080
        env:
        - name: USER_SERVICE_URL
          value: "http://user-service:3000"
        - name: AUTH_SERVICE_URL
          value: "http://auth-service:3000"
        - name: JOB_DISCOVERY_SERVICE_URL
          value: "http://job-discovery-service:3000"
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: ai-job-applier-secrets
              key: jwt-secret
---
# Similar deployments for user-service, auth-service, and job-discovery-service
```

### 3. Deploy to Kubernetes

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/services.yaml
kubectl apply -f k8s/deployments.yaml
```

### 4. Verify Deployment

```bash
kubectl get pods -n ai-job-applier
kubectl get services -n ai-job-applier
kubectl logs -n ai-job-applier deployment/api-gateway
```

## Cloud Deployment

### AWS Deployment

#### ECS with Fargate

1. Create an ECS cluster
2. Create task definitions for each service
3. Deploy services to the cluster
4. Configure Application Load Balancer

#### EKS (Elastic Kubernetes Service)

Deploy using the Kubernetes manifests above to EKS.

### Google Cloud Platform

#### Google Kubernetes Engine (GKE)

Deploy using the Kubernetes manifests to GKE.

#### Cloud Run

Deploy individual services as Cloud Run services.

### Azure

#### Azure Kubernetes Service (AKS)

Deploy using the Kubernetes manifests to AKS.

## Monitoring and Logging

### Application Logs

All services write logs in JSON format. Access logs using:

```bash
docker logs <container-name>
kubectl logs -n ai-job-applier deployment/<deployment-name>
```

### Health Checks

Services expose health check endpoints:
- `GET /health` - Returns service status

### Metrics

Consider implementing Prometheus metrics in each service for:
- Request latency
- Error rates
- Throughput
- Database connection pools

### Logging Best Practices

- Log in JSON format
- Include request IDs for tracing
- Log at appropriate levels (debug, info, warn, error)
- Don't log sensitive information

## Scaling

### Horizontal Scaling

The microservices architecture supports horizontal scaling:

- API Gateway: Scale based on traffic
- User Service: Scale based on user management operations
- Auth Service: Scale based on authentication requests
- Job Discovery Service: Scale based on scraping load

### Auto-Scaling

Configure auto-scaling based on metrics:

#### Kubernetes HPA (Horizontal Pod Autoscaler)
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-gateway-hpa
  namespace: ai-job-applier
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-gateway
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## Rollbacks

### Docker Compose Rollback

To rollback to a previous version:

```bash
# Pull previous image version
docker-compose pull
# Recreate containers with previous images
docker-compose up -d --no-deps --force-recreate <service-name>
```

### Kubernetes Rollback

```bash
# Rollback to previous deployment
kubectl rollout undo -n ai-job-applier deployment/<deployment-name>

# Check rollout status
kubectl rollout status -n ai-job-applier deployment/<deployment-name>
```

## Backup and Recovery

### Database Backup

Regularly backup your MongoDB database:

```bash
# Create backup
mongodump --uri="mongodb://user:password@host:port/database" --out=backup/

# Restore backup
mongorestore --uri="mongodb://user:password@host:port/database" backup/
```

## Troubleshooting

### Common Issues

1. **Service Discovery Issues**
   - Ensure service names match in API Gateway configuration
   - Check Docker network connectivity

2. **Database Connection Issues**
   - Verify MONGODB_URI is correct
   - Check network connectivity to MongoDB

3. **Authentication Issues**
   - Ensure JWT_SECRET is consistent across services
   - Verify token format and structure

4. **Performance Issues**
   - Monitor resource usage
   - Consider adding caching layers
   - Optimize database queries

For additional troubleshooting, check the logs of each service and verify your environment configuration.