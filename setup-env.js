#!/usr/bin/env node

/**
 * Simple script to create .env.local file for connecting to live backend
 * Run: node setup-env.js
 */

const fs = require('fs');
const path = require('path');

const BACKEND_URL = 'https://genflyo-pos-system-backend.vercel.app/api';
const ENV_FILE = path.join(__dirname, '.env.local');

const envContent = `# ============================================
# BACKEND API CONFIGURATION
# ============================================
# Production Backend URL (Vercel)
NEXT_PUBLIC_API_URL=${BACKEND_URL}

# ============================================
# APPLICATION SETTINGS
# ============================================
NEXT_PUBLIC_APP_NAME=GenFlyo POS System
NEXT_PUBLIC_APP_VERSION=1.0.0

# ============================================
# FEATURES FLAGS (Optional)
# ============================================
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_DEBUG=false
`;

console.log('🔧 Setting up environment configuration...\n');

// Check if file already exists
if (fs.existsSync(ENV_FILE)) {
  console.log('⚠️  .env.local already exists!');
  console.log('📄 Current content:');
  console.log(fs.readFileSync(ENV_FILE, 'utf8'));
  console.log('\n❓ Do you want to overwrite it?');
  console.log('   Delete the file manually and run this script again.');
  process.exit(0);
}

// Create the file
try {
  fs.writeFileSync(ENV_FILE, envContent, 'utf8');
  console.log('✅ Successfully created .env.local');
  console.log(`📍 Location: ${ENV_FILE}`);
  console.log(`🌐 Backend URL: ${BACKEND_URL}\n`);
  console.log('📋 Next steps:');
  console.log('   1. Restart your dev server: npm run dev');
  console.log('   2. Refresh your browser (Ctrl+Shift+R)');
  console.log('   3. Try logging in with: admin@pos.com / admin123\n');
  console.log('🎉 You\'re all set!');
} catch (error) {
  console.error('❌ Error creating .env.local:', error.message);
  console.log('\n📝 Manual setup:');
  console.log('   Create a file named .env.local with this content:\n');
  console.log(envContent);
  process.exit(1);
}

