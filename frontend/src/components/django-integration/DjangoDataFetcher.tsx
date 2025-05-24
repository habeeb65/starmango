import { useState, useEffect } from 'react';
import { useDjangoApi } from '@/hooks/useDjangoApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

interface DataFetcherProps {
  endpoint: string;
  title: string;
  description: string;
}

const DjangoDataFetcher = ({ endpoint, title, description }: DataFetcherProps) => {
  const { data, loading, error, fetchData } = useDjangoApi<any>();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Fetch data when component mounts or refreshKey changes
    fetchData(endpoint);
  }, [endpoint, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <div className="rounded-md bg-slate-50 p-4">
            <pre className="text-sm overflow-auto max-h-96">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleRefresh} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh Data'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DjangoDataFetcher;
