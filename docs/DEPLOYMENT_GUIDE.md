# ClariFi Deployment Guide

This guide provides comprehensive instructions for deploying the ClariFi application to production.

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Docker and Docker Compose (optional, for containerized deployment)
- SSL certificates for HTTPS
- Environment configuration files

## Local Development Setup

### 1. Clone and Install Dependencies

```bash
# Clone repository
git clone <repository-url>
cd clarifi

# Install dependencies
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### 2. Database Setup

```bash
# Create PostgreSQL database
createdb clarifi_dev

# Set up environment variables (see Configuration section)

# Run migrations
cd backend
npx prisma migrate dev --name initial
npx prisma generate
cd ..
```

### 3. Environment Configuration

Create `.env` files in both backend and frontend directories:

**backend/.env:**
```
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://user:password@localhost:5432/clarifi_dev

# Security
JWT_SECRET=your-secret-key-min-32-chars
REFRESH_TOKEN_SECRET=your-refresh-secret-min-32-chars
JWT_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# Frontend
FRONTEND_URL=http://localhost:3000

# Email (for password reset notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Logging
LOG_LEVEL=info
```

**frontend/.env.local:**
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### 4. Start Development Servers

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

Access application at `http://localhost:3000`

## Docker Deployment

### Build Docker Images

```bash
# Build all services
docker-compose build

# Or build individual services
docker build -t clarifi-backend -f docker/Dockerfile.backend .
docker build -t clarifi-frontend -f docker/Dockerfile.frontend .
```

### Run with Docker Compose

```bash
docker-compose up -d
```

### Database Migrations in Docker

```bash
docker-compose exec backend npx prisma migrate deploy
```

## Production Deployment

### 1. Prepare Production Environment

```bash
# Create production database
createdb clarifi_production

# Set up production environment variables
# Include all required variables from Configuration section
```

### 2. Build for Production

```bash
# Backend
cd backend
npm run build
NODE_ENV=production npm start

# Frontend
cd frontend
npm run build
NODE_ENV=production npm start
```

### 3. Database Migrations

```bash
cd backend
npx prisma migrate deploy
cd ..
```

### 4. Security Configuration

- Enable HTTPS with valid SSL certificates
- Set secure cookie flags in production
- Configure CORS properly
- Enable security headers (Helmet middleware is configured)
- Implement WAF (Web Application Firewall)

### 5. Monitoring and Logging

- Configure centralized logging (Sentry, DataDog, etc.)
- Set up error tracking
- Monitor application health
- Configure alerts for critical errors
- Use Winston for structured logging

### 6. Scaling

For high-traffic deployments:

```yaml
# docker-compose.prod.yml
services:
  backend:
    replicas: 3
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
  
  frontend:
    replicas: 2
```

## Deployment Checklist

- [ ] All environment variables configured
- [ ] Database backups enabled
- [ ] SSL certificates valid and installed
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Error handling tested
- [ ] Logging configured
- [ ] Monitoring setup
- [ ] Backup/recovery procedures documented
- [ ] Health check endpoints accessible
- [ ] Cache headers configured
- [ ] CDN setup (if applicable)

## Post-Deployment

### Verify Deployment

```bash
# Check health endpoints
curl https://your-domain.com/health
curl https://your-domain.com/api/health

# Verify database connection
# Check error logs
# Test critical workflows
```

### Backup Strategy

```bash
# Daily database backups
pg_dump clarifi_production > backup_$(date +%Y%m%d).sql

# Store backups offsite
# Test restore procedures regularly
```

### Maintenance

- Regular security updates
- Database optimization
- Log rotation
- Monitoring alert review
- Performance optimization

## Troubleshooting

### Common Issues

**Database Connection Failed**
- Verify DATABASE_URL is correct
- Check PostgreSQL is running
- Verify network connectivity

**Port Already in Use**
- Change PORT environment variable
- Kill existing process on port

**Certificate Issues**
- Verify SSL certificate path
- Check certificate expiration
- Regenerate if necessary

**Out of Memory**
- Increase Node.js memory limit
- Review application logs for leaks
- Increase server resources

## Rollback Procedure

```bash
# Keep previous version tagged
docker tag clarifi-backend:v1.0.1 clarifi-backend:latest
docker-compose down
docker-compose up -d
```

## Support

For deployment support, contact the DevOps team or refer to the main README.md
