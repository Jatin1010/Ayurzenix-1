export const canAccessFeature = (
    featureId: string, 
    requiredPrice: number,
    userData: any
): { canAccess: boolean, requiresPayment: boolean, missingAmount: number } => {
    
    // For now, allow free if requiredPrice is 0
    if (requiredPrice === 0) return { canAccess: true, requiresPayment: false, missingAmount: 0 };
    
    const balance = userData?.wallet_balance || 0;
    
    if (balance >= requiredPrice) {
        return { canAccess: true, requiresPayment: false, missingAmount: 0 };
    }
    
    return {
        canAccess: false,
        requiresPayment: true,
        missingAmount: requiredPrice - balance
    };
};
