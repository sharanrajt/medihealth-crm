# Vercel Deployment Guide for MediHealthCRM

This guide walks you through building and deploying your MediHealthCRM application to Vercel.

## Prerequisites

- [Vercel account](https://vercel.com/signup)
- [Node.js](https://nodejs.org/) version 18 or higher
- [Git](https://git-scm.com/) installed
- Tambo AI API key (for production)

## Quick Deployment

### Option 1: Deploy with Vercel Button (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/medihealth-crm&project-name=medihealth-crm&repository-name=medihealth-crm)

1. Click the "Deploy with Vercel" button above
2. Sign in to your Vercel account
3. Configure your project settings
4. Add environment variables (see below)
5. Click "Deploy"

### Option 2: Manual Deployment

1. **Push to GitHub/GitLab/Bitbucket**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/medihealth-crm.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in and click "New Project"
   - Import your repository
   - Configure settings and deploy

## Environment Variables Setup

### Required Environment Variables

Add these environment variables in your Vercel project settings:

```
NEXT_PUBLIC_TAMBO_API_KEY=your_tambo_api_key_here
```

### How to Get Your Tambo API Key

1. Visit [tambo.co/cli-auth](https://tambo.co/cli-auth)
2. Sign up or log in to your Tambo account
3. Generate an API key
4. Add it to your Vercel environment variables

### Adding Environment Variables in Vercel

1. Go to your project in Vercel dashboard
2. Click on "Settings" → "Environment Variables"
3. Add the following:
   - **Key**: `NEXT_PUBLIC_TAMBO_API_KEY`
   - **Value**: Your Tambo API key
   - **Environment**: Production (and Preview if needed)
4. Click "Add" and redeploy your project

## Build Configuration

### Next.js Configuration

The project uses a basic `next.config.ts` file. For optimal Vercel deployment, you may want to add these configurations:

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable strict mode for better development experience
  reactStrictMode: true,
  
  // Optimize images for production
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  
  // Enable compression
  compress: true,
  
  // Configure headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

### Tailwind CSS Configuration

The project uses Tailwind CSS 4. Ensure your `tailwind.config.ts` is properly configured:

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
    },
  },
  plugins: [],
};

export default config;
```

## Build Process

### Local Build Test

Before deploying, test your build locally:

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Test the production build
npm run start
```

### Vercel Build Settings

Vercel automatically detects Next.js projects and uses these build settings:

- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

These are automatically configured, but you can customize them in your project settings if needed.

## Deployment Steps

### 1. Prepare for Production

Ensure your application is ready for production:

```bash
# Run linting
npm run lint

# Run type checking
npx tsc --noEmit

# Test build
npm run build
```

### 2. Configure Vercel Project

In your Vercel dashboard:

1. **Project Name**: `medihealth-crm`
2. **Framework Preset**: `Next.js` (auto-detected)
3. **Root Directory**: `/` (project root)
4. **Build Command**: `npm run build`
5. **Output Directory**: `.next`
6. **Install Command**: `npm install`

### 3. Add Environment Variables

Add these environment variables in Vercel:

| Key | Value | Environment |
|-----|-------|-------------|
| `NEXT_PUBLIC_TAMBO_API_KEY` | Your Tambo API key | Production, Preview |

### 4. Deploy

1. Click "Deploy" in your Vercel dashboard
2. Wait for the build to complete
3. Your application will be deployed with a unique URL

## Post-Deployment

### Verify Deployment

1. Visit your deployed URL
2. Check that the application loads correctly
3. Test the AI chat functionality
4. Verify all CRM modules work as expected

### Custom Domain (Optional)

To add a custom domain:

1. Go to your project settings in Vercel
2. Click "Domains"
3. Add your custom domain
4. Configure DNS settings as instructed
5. Wait for DNS propagation

### SSL Certificate

Vercel automatically provides SSL certificates for all deployments:
- Custom domains: Automatic SSL
- Vercel domains: `https://your-project.vercel.app`

## Monitoring and Maintenance

### Performance Monitoring

1. **Vercel Analytics**: Built-in performance monitoring
2. **Error Tracking**: Check Vercel logs for any issues
3. **Performance**: Monitor page load times and optimize as needed

### Updates and Redeployment

To update your application:

1. Make changes to your code
2. Commit and push to your repository
3. Vercel automatically detects changes and deploys
4. Monitor the deployment in your Vercel dashboard

### Environment Variable Updates

To update environment variables:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Edit or add new variables
4. Redeploy your project

## Troubleshooting

### Common Issues

**Build Failures:**
- Check Node.js version compatibility
- Verify all dependencies are installed
- Check for TypeScript errors

**Environment Variables Not Working:**
- Ensure variables are added to the correct environment
- Verify variable names match exactly
- Redeploy after adding variables

**Tambo AI Not Working:**
- Verify API key is correct
- Check browser console for errors
- Ensure internet connectivity

**Performance Issues:**
- Check Vercel analytics for slow pages
- Optimize images and assets
- Review bundle size

### Getting Help

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tambo AI Documentation](https://tambo.co/docs)
- [GitHub Issues](https://github.com/yourusername/medihealth-crm/issues)

## Security Considerations

### API Key Security

- Never commit API keys to your repository
- Use environment variables for all sensitive data
- Regularly rotate API keys
- Monitor API usage in your Tambo dashboard

### Content Security

- Vercel provides automatic security headers
- Consider adding additional security headers in `next.config.ts`
- Regularly update dependencies

## Cost Optimization

### Free Tier Benefits

Vercel offers generous free tiers:
- 100GB bandwidth per month
- 1,000 serverless function executions per day
- 100GB storage per month

### Monitoring Usage

1. Check your Vercel dashboard for usage metrics
2. Monitor API calls to Tambo AI
3. Optimize images and assets to reduce bandwidth

### Scaling Up

If you need more resources:
1. Upgrade your Vercel plan
2. Consider caching strategies
3. Optimize your application code

## Conclusion

Your MediHealthCRM application is now deployed to Vercel and ready for production use! The combination of Next.js, Tambo AI, and Vercel provides a powerful, scalable, and performant healthcare management system.

Remember to:
- Monitor your application performance
- Keep dependencies updated
- Regularly check your Tambo AI usage
- Maintain security best practices

For any issues or questions, refer to the documentation links provided or reach out to the respective support teams.