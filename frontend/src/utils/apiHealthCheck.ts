import axios from 'axios';

/**
 * Utility to check the health of the API connection
 * and diagnose common connection issues
 */
export async function checkApiHealth(apiUrl: string): Promise<{
  isAvailable: boolean;
  message: string;
  details?: string;
}> {
  try {
    // Try to connect to the API root or a health check endpoint
    const response = await axios.get(`${apiUrl}/health-check/`, {
      timeout: 5000, // 5 second timeout
      headers: { 'Accept': 'application/json' },
    });
    
    if (response.status >= 200 && response.status < 300) {
      return {
        isAvailable: true,
        message: 'Connected to API successfully',
        details: `Status: ${response.status}, API version: ${response.data?.version || 'unknown'}`
      };
    } else {
      return {
        isAvailable: false,
        message: `API returned unexpected status: ${response.status}`,
        details: response.statusText
      };
    }
  } catch (error: any) {
    if (error.code === 'ECONNREFUSED') {
      return {
        isAvailable: false,
        message: 'Connection refused. Is the Django server running?',
        details: 'Make sure your Django server is running with: python manage.py runserver'
      };
    } else if (error.code === 'ECONNABORTED') {
      return {
        isAvailable: false,
        message: 'Connection timed out',
        details: 'The API server took too long to respond'
      };
    } else if (error.response?.status === 404) {
      // If health-check fails, try the root API endpoint
      try {
        const rootResponse = await axios.get(apiUrl, { timeout: 5000 });
        if (rootResponse.status >= 200 && rootResponse.status < 300) {
          return {
            isAvailable: true,
            message: 'Connected to API root successfully',
            details: 'Health check endpoint not found, but API root is accessible'
          };
        }
      } catch (rootError) {
        // If root endpoint also fails, return original error
      }
      
      return {
        isAvailable: false,
        message: 'API health check endpoint not found',
        details: 'The API is running but health-check endpoint is not implemented'
      };
    } else if (error.response) {
      return {
        isAvailable: false,
        message: `API error: ${error.response.status}`,
        details: error.response.data?.message || error.message
      };
    } else {
      return {
        isAvailable: false,
        message: 'Network error when connecting to API',
        details: `${error.message}. Check if CORS is enabled on your Django server.`
      };
    }
  }
}

/**
 * Utility to check if the API is available and provide user-friendly guidance
 */
export async function getApiConnectionStatus(): Promise<string> {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
  
  try {
    const health = await checkApiHealth(apiUrl);
    if (health.isAvailable) {
      return `✅ API Connection: ${health.message}`;
    } else {
      return `❌ API Connection: ${health.message}\n${health.details || ''}`;
    }
  } catch (error) {
    return '❌ API Connection: Unable to check API health';
  }
}
