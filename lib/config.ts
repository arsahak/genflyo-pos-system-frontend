/**
 * Application Configuration
 * Centralized config for the POS frontend
 */

export const config = {
  // API Configuration
  api: {
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
    timeout: 30000, // 30 seconds
  },

  // App Information
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'GenFlyo POS System',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  },

  // Feature Flags
  features: {
    enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    enableDebug: process.env.NEXT_PUBLIC_ENABLE_DEBUG === 'true',
  },

  // Environment
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

// Log configuration in development
if (config.isDevelopment) {
  console.log('🔧 App Configuration:', {
    apiBaseURL: config.api.baseURL,
    appName: config.app.name,
    environment: process.env.NODE_ENV,
  });
}

export default config;

