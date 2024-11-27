// API configuration
export const API_CONFIG = {
  // This will be updated with your Railway URL
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'YOUR_RAILWAY_URL_HERE'  // We'll update this with your Railway URL
    : 'http://localhost:3001',  // Local development
};
