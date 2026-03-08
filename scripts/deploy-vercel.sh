#!/bin/bash

# MediHealthCRM Vercel Deployment Script
# This script automates the deployment process to Vercel

set -e

echo "🚀 Starting MediHealthCRM Vercel Deployment"
echo "=========================================="

# Check if required tools are installed
command -v git >/dev/null 2>&1 || { echo "❌ Git is required but not installed. Aborting." >&2; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ Node.js/npm is required but not installed. Aborting." >&2; exit 1; }

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found. Please create it with your Tambo API key."
    echo "Copy example.env.local to .env.local and add your NEXT_PUBLIC_TAMBO_API_KEY"
    exit 1
fi

# Check if Tambo API key is set
if ! grep -q "NEXT_PUBLIC_TAMBO_API_KEY=" .env.local; then
    echo "❌ NEXT_PUBLIC_TAMBO_API_KEY not found in .env.local"
    echo "Please add your Tambo API key to .env.local"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run linting
echo "🔍 Running linting..."
npm run lint

# Run type checking
echo "🔍 Running type checking..."
npx tsc --noEmit

# Build the application
echo "🔨 Building application..."
npm run build

# Check if Vercel CLI is installed
if command -v vercel >/dev/null 2>&1; then
    echo "✅ Vercel CLI found"
else
    echo "⚠️  Vercel CLI not found. Please install it:"
    echo "   npm install -g vercel"
    echo "   Or deploy manually via vercel.com"
    exit 1
fi

# Check if logged into Vercel
if ! vercel whoami >/dev/null 2>&1; then
    echo "🔐 Please log into Vercel:"
    vercel login
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel

echo ""
echo "✅ Deployment completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Check your Vercel dashboard for the deployment status"
echo "2. Verify your environment variables are set correctly"
echo "3. Test your deployed application"
echo ""
echo "🔗 Your application will be available at:"
echo "   https://your-project-name.vercel.app"
echo ""
echo "💡 Tip: You can also deploy to production with:"
echo "   vercel --prod"