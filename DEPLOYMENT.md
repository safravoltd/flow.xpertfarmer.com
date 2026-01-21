# XpertFarmer Admin Dashboard - Deployment Guide

## Pre-Deployment Checklist

- [ ] All environment variables are configured
- [ ] Dependencies are installed and updated
- [ ] Application builds successfully locally
- [ ] Login flow works with test credentials
- [ ] All CRUD operations tested in each module
- [ ] API endpoints are accessible from deployment environment
- [ ] Database migrations are completed on backend
- [ ] SSL certificates are valid (for HTTPS)

## Local Build Test

Before deploying, test the production build locally:

```bash
# Build the application
npm run build

# Start the production server
npm run start

# Visit http://localhost:3000 and test
```

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the optimal choice for Next.js applications with automatic optimizations.

#### Setup Steps:

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial XpertFarmer admin dashboard"
git push origin main
```

2. **Connect to Vercel**
- Go to https://vercel.com/new
- Select your repository
- Import project

3. **Configure Environment Variables**
In Vercel dashboard, add:
```
NEXTAUTH_SECRET=<generate-with-openssl>
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://api.xpertfarmer.com
```

4. **Deploy**
- Vercel auto-deploys on push
- Monitor deployment in Vercel dashboard

#### Generate NEXTAUTH_SECRET for Production:
```bash
openssl rand -base64 32
```

### Option 2: Self-Hosted (Docker)

For Docker containerization:

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "run", "start"]
```

Build and run:
```bash
docker build -t xpertfarmer-admin .
docker run -p 3000:3000 \
  -e NEXTAUTH_SECRET=<secret> \
  -e NEXTAUTH_URL=https://yourdomain.com \
  -e NEXT_PUBLIC_API_URL=https://api.xpertfarmer.com \
  xpertfarmer-admin
```

### Option 3: Traditional Linux Server (Ubuntu)

#### Install Dependencies:
```bash
# Install Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install nginx
sudo apt-get install -y nginx
```

#### Deploy Application:
```bash
# Clone repository
git clone <repository-url> /var/www/xpertfarmer-admin
cd /var/www/xpertfarmer-admin

# Install dependencies
npm install

# Build application
npm run build

# Create .env.production with environment variables
echo "NEXTAUTH_SECRET=<secret>" >> .env.production
echo "NEXTAUTH_URL=https://yourdomain.com" >> .env.production
echo "NEXT_PUBLIC_API_URL=https://api.xpertfarmer.com" >> .env.production

# Start with PM2
pm2 start "npm start" --name xpertfarmer-admin
pm2 save
pm2 startup
```

#### Configure Nginx:
```nginx
# /etc/nginx/sites-available/xpertfarmer-admin
server {
    listen 80;
    server_name yourdomain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/xpertfarmer-admin /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Setup SSL with Let's Encrypt:
```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot certonly --standalone -d yourdomain.com
```

### Option 4: AWS Deployment

#### Using AWS Elastic Beanstalk:

1. **Prepare for EB**
```bash
# Install EB CLI
pip install awsebcli

# Initialize EB application
eb init -p node.js-20 xpertfarmer-admin
```

2. **Create environment**
```bash
eb create production
```

3. **Configure environment variables**
```bash
eb setenv \
  NEXTAUTH_SECRET=<secret> \
  NEXTAUTH_URL=https://yourdomain.com \
  NEXT_PUBLIC_API_URL=https://api.xpertfarmer.com
```

4. **Deploy**
```bash
npm run build
eb deploy
```

## Post-Deployment Verification

After deployment, verify everything works:

```bash
# Test login endpoint
curl -X POST https://yourdomain.com/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Test dashboard access
curl https://yourdomain.com/dashboard

# Check health
curl https://yourdomain.com/api/auth/session
```

## Monitoring & Maintenance

### Set Up Monitoring

1. **Error Tracking**: Use Sentry
```bash
npm install @sentry/nextjs
```

2. **Performance Monitoring**: Enable Next.js analytics
- Vercel provides built-in analytics
- Monitor Core Web Vitals

3. **Log Aggregation**: Use cloud logging
- Vercel Logs: Automatic for Vercel deployments
- CloudWatch: For AWS deployments
- ELK Stack: For self-hosted

### Regular Maintenance

```bash
# Weekly: Update dependencies
npm update

# Monthly: Audit security
npm audit
npm audit fix

# Quarterly: Major version updates
npm outdated
# Review and test major version updates

# Always: Monitor error rates and performance
# Check deployment dashboard for issues
```

## Scaling Considerations

### Horizontal Scaling (Multiple Instances)

For high traffic, scale horizontally:
- Deploy multiple instances behind load balancer
- Use session store (Redis/Database) instead of in-memory
- Ensure API is load-balanced

### Database Optimization

- Add indexes on frequently queried columns
- Enable query caching
- Implement pagination for large datasets
- Monitor slow queries

### CDN Setup

For static assets:
```bash
# Use Next.js Image Optimization with CDN
# Configure Cloudflare or CloudFront
# Add cache headers to static files
```

## Rollback Procedures

### Vercel Rollback
```bash
# Go to Vercel dashboard
# Navigate to Deployments
# Click on previous deployment
# Click "Redeploy"
```

### Self-Hosted Rollback
```bash
# Using Git
git revert <commit-hash>
npm run build
pm2 restart xpertfarmer-admin

# Using PM2
pm2 restart xpertfarmer-admin
pm2 logs xpertfarmer-admin
```

## Performance Optimization

### Build Optimization
```bash
# Analyze bundle size
npm install --save-dev @next/bundle-analyzer

# Configure in next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
module.exports = withBundleAnalyzer({})

# Run analysis
ANALYZE=true npm run build
```

### Runtime Optimization
- Enable compression: `next.config.js`
- Optimize images: Use next/image
- Code splitting: Automatic with Next.js
- Caching: Configure headers in `next.config.js`

## Security Checklist

- [ ] HTTPS enabled on all endpoints
- [ ] NEXTAUTH_SECRET is strong and unique
- [ ] Environment variables are not in version control
- [ ] API endpoint is behind authentication
- [ ] CORS is properly configured
- [ ] Security headers are set (Nginx example provided)
- [ ] Regular security audits scheduled
- [ ] Dependency vulnerabilities monitored
- [ ] Rate limiting implemented
- [ ] SQL injection prevention (Zod validation in place)

## Troubleshooting Deployments

### Application won't start
```bash
# Check logs
npm start

# Check environment variables
echo $NEXTAUTH_SECRET
echo $NEXT_PUBLIC_API_URL

# Check dependencies
npm install

# Clear build cache
rm -rf .next
npm run build
```

### API connection errors
- Verify API endpoint is accessible from deployment server
- Check firewall rules
- Verify API credentials/tokens
- Test API directly with curl

### High memory usage
- Check for memory leaks in components
- Monitor with `pm2 monit`
- Increase server memory
- Enable caching strategies

### Slow page loads
- Check network waterfall in DevTools
- Enable compression
- Optimize images
- Implement caching headers

## Support Contacts

- **Deployment Issues**: Contact your hosting provider
- **Next.js Support**: https://nextjs.org/support
- **API Issues**: Contact XpertFarmer API team
- **Security Issues**: Report to security@xpertfarmer.com

## Deployment Timeline

- **Pre-deployment testing**: 1-2 days
- **Initial deployment**: 1 hour
- **Post-deployment monitoring**: 24 hours (continuous)
- **Performance optimization**: Ongoing

---

**Last Updated**: January 2026  
**Maintained By**: XpertFarmer Development Team
