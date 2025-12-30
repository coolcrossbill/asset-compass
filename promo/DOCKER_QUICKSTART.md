# 🐳 Docker Quick Start Guide

## Get Started in 30 Seconds

```bash
cd app/promo
docker-compose up -d
```

Visit: **http://localhost:8080**

That's it! 🎉

## What Just Happened?

Docker Compose just:
- ✅ Built a lightweight nginx container (~23MB)
- ✅ Copied your HTML/CSS/JS files into it
- ✅ Started the web server on port 8080
- ✅ Configured health checks and restart policies
- ✅ Enabled gzip compression and caching

## Common Commands

### Start the promo site
```bash
docker-compose up -d
```

### View logs
```bash
docker-compose logs -f
```

### Check status
```bash
docker-compose ps
```

### Stop the promo site
```bash
docker-compose down
```

### Rebuild after changes
```bash
docker-compose up -d --build
```

## Manual Docker Commands

If you prefer not to use docker-compose:

```bash
# Build
docker build -t asset-compass-promo .

# Run
docker run -d -p 8080:80 --name promo asset-compass-promo

# Stop
docker stop promo && docker rm promo
```

## Health Check

Check if the container is healthy:

```bash
curl http://localhost:8080/health
# Should return: healthy
```

Or via Docker:

```bash
docker ps
# Look for (healthy) in the STATUS column
```

## Port Configuration

By default, the site runs on **port 8080**. To change it, edit `docker-compose.yml`:

```yaml
ports:
  - "3000:80"  # Change 8080 to your preferred port
```

## Production Deployment

This Docker setup is production-ready! Deploy to:

- **AWS ECS/Fargate**
- **Google Cloud Run**
- **Azure Container Instances**
- **DigitalOcean App Platform**
- **Kubernetes**
- **Any Docker host**

### Example: Deploy to AWS ECS

```bash
# Build and tag
docker build -t asset-compass-promo .
docker tag asset-compass-promo:latest your-registry/asset-compass-promo:latest

# Push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-registry
docker push your-registry/asset-compass-promo:latest

# Deploy via ECS (use your task definition)
aws ecs update-service --cluster your-cluster --service promo --force-new-deployment
```

## Troubleshooting

### Port already in use?
```bash
# Change the port in docker-compose.yml or use:
docker-compose down
# Then edit ports in docker-compose.yml
docker-compose up -d
```

### Container won't start?
```bash
# Check logs
docker-compose logs

# Or for more detail
docker logs asset-compass-promo
```

### Need to update files?
```bash
# After editing HTML/CSS/JS files:
docker-compose down
docker-compose up -d --build
```

### Clean everything and start fresh
```bash
docker-compose down -v
docker system prune -a
docker-compose up -d --build
```

## Performance

The Docker setup includes:

- **Gzip compression** - Reduces bandwidth by ~70%
- **Static asset caching** - 1 year cache headers for CSS/JS
- **Health checks** - Automatic container recovery
- **Minimal image size** - Only ~23MB total

## Security

Nginx is configured with security headers:

- `X-Frame-Options: SAMEORIGIN` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `X-XSS-Protection: 1; mode=block` - XSS protection

## Need Help?

- 📖 Full documentation: See `README.md`
- 🐛 Issues: Check Docker logs with `docker-compose logs`
- 💬 Questions: Contact the development team

---

**Happy Dockering!** 🐳

