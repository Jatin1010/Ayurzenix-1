import React, { lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import FeatureLanding from './FeatureLanding';

const PaywallScreen = lazy(() => import('../screens/PaywallScreen'));

export const FeatureLandingWrapper = ({ userData }: { userData: any }) => {
    const { featureId } = useParams<{ featureId: string }>();
    return <FeatureLanding featureId={featureId || ''} />;
};

export const PaywallWrapper = ({ userData }: { userData: any }) => {
    return (
        <Suspense fallback={<div className="min-h-screen bg-ayur-bg flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-ayur-purple border-t-transparent rounded-full animate-spin" />
        </div>}>
            <PaywallScreen userData={userData} />
        </Suspense>
    );
};
