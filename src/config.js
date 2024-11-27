// API configuration
export const API_CONFIG = {
  // This will be updated with your Railway URL
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://whohouse-production.up.railway.app'  // Railway URL
    : 'http://localhost:3001',  // Local development
};
