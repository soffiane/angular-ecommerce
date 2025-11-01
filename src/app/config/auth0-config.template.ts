import { AuthConfig } from '@auth0/auth0-angular';

// Rename this file to auth0-config.ts and fill in your Auth0 credentials
export const auth0Config: AuthConfig = {
    domain: 'YOUR_AUTH0_DOMAIN', // e.g., 'dev-xxx.us.auth0.com'
    clientId: 'YOUR_CLIENT_ID',
    authorizationParams: {
        redirect_uri: window.location.origin,
        audience: 'YOUR_API_IDENTIFIER', // Optional: Only if you have an API
        scope: 'openid profile email' // Default scopes
    },
    // Optional configurations
    cacheLocation: 'localstorage', // or 'memory'
    useRefreshTokens: true,
    httpInterceptor: {
        allowedList: [
            // Add your API endpoints that need authentication
            // e.g., { uri: 'https://api.your-server.com/*' }
            { uri: '*' } // Be more specific in production
        ]
    }
};