import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import DjangoDataFetcher from '@/components/django-integration/DjangoDataFetcher';
import { useDjangoApi } from '@/hooks/useDjangoApi';
import { getApiConnectionStatus } from '@/utils/apiHealthCheck';

const DjangoIntegration = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { loading, error, fetchData } = useDjangoApi<any>();
  const [healthStatus, setHealthStatus] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>('Checking API connection...');
  const [isMockApi, setIsMockApi] = useState<boolean>(import.meta.env.VITE_USE_MOCK_API === 'true' || import.meta.env.VITE_API_URL === 'MOCK');
  
  useEffect(() => {
    const checkConnection = async () => {
      const status = await getApiConnectionStatus();
      setConnectionStatus(status);
    };
    
    checkConnection();
  }, []);

  const checkApiHealth = async () => {
    const result = await fetchData('/health-check/');
    if (result) {
      setHealthStatus('Django API is available and healthy');
    } else {
      setHealthStatus('Django API health check failed');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Django Integration Examples</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>API Connection Status</CardTitle>
              <CardDescription>Check if the Django backend is reachable</CardDescription>
            </div>
            
            {isMockApi && (
              <Badge variant="secondary" className="ml-2 px-3 py-1">
                Mock API Mode
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <Alert variant={connectionStatus.includes('✅') ? 'default' : 'destructive'} className="mb-4">
                <AlertTitle>{isMockApi ? 'Using Mock API' : 'API Status'}</AlertTitle>
                <AlertDescription className="whitespace-pre-line">
                  {connectionStatus}
                  
                  {isMockApi && (
                    <div className="mt-2">
                      <p>The application is running in mock API mode, which means it's using simulated data instead of connecting to a real Django backend.</p>
                      <p className="mt-2">To connect to a real Django backend:</p>
                      <ol className="list-decimal ml-5 mt-1">
                        <li>Start your Django backend server</li>
                        <li>Update the .env file to use the Django API URL</li>
                        <li>Restart the frontend application</li>
                      </ol>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            </div>
            
            <div className="ml-4">
              <Button 
                onClick={checkApiHealth} 
                disabled={loading}
                variant="outline"
              >
                {loading ? 'Checking...' : 'Check API Health'}
              </Button>
            </div>
          </div>

          {healthStatus && (
            <div className={`mt-4 p-3 rounded-md ${healthStatus.includes('failed') ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
              {healthStatus}
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-800 rounded-md">
              Error connecting to API: {error}
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="auth">Authentication</TabsTrigger>
          <TabsTrigger value="data">Data Examples</TabsTrigger>
          <TabsTrigger value="tenants">Multi-Tenant</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Django Backend Integration</h2>
              <p>
                This frontend is integrated with the Django backend through:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>REST API connections via Axios</li>
                <li>JWT Token Authentication</li>
                <li>Django REST Framework compatible endpoints</li>
                <li>Multi-tenant support</li>
              </ul>
              
              <h3 className="text-lg font-semibold mt-6 mb-2">API Configuration</h3>
              <p>
                The API is configured to connect to <code className="bg-gray-100 px-2 py-1 rounded">{import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}</code>
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="auth" className="space-y-4">
          <DjangoDataFetcher 
            endpoint="/auth/profile/"
            title="User Profile" 
            description="Fetches the current user's profile from Django API (requires authentication)"
          />
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DjangoDataFetcher 
              endpoint="/products/"
              title="Products" 
              description="Fetches product data from Django API"
            />
            <DjangoDataFetcher 
              endpoint="/inventory/"
              title="Inventory" 
              description="Fetches inventory data from Django API"
            />
          </div>
        </TabsContent>

        <TabsContent value="tenants" className="space-y-4">
          <DjangoDataFetcher 
            endpoint="/tenants/"
            title="Available Tenants" 
            description="Fetches available tenants from Django API"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DjangoIntegration;
