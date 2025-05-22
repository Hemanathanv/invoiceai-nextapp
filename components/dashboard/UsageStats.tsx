
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const UsageStats: React.FC = () => {
  const { usage, user } = useAuth();
  
  const uploadPercentage = Math.round((usage.uploadsUsed / usage.uploadsLimit) * 100);
  const extractionPercentage = Math.round((usage.extractionsUsed / usage.extractionsLimit) * 100);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Document Uploads</CardTitle>
          <CardDescription>
            {usage.uploadsUsed} of {usage.uploadsLimit} uploads used
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress value={uploadPercentage} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{uploadPercentage}% used</span>
              <span>{usage.uploadsLimit - usage.uploadsUsed} remaining</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Extractions</CardTitle>
          <CardDescription>
            {usage.extractionsUsed} of {usage.extractionsLimit} extractions used
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress value={extractionPercentage} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{extractionPercentage}% used</span>
              <span>{usage.extractionsLimit - usage.extractionsUsed} remaining</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsageStats;
