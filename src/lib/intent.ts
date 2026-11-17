export const saveIntent = (featureId: string, planId: string, inputData: any) => {
    localStorage.setItem('funnel_intent', JSON.stringify({ featureId, planId, inputData, timestamp: Date.now() }));
};

export const getAndClearIntent = () => {
    const intent = localStorage.getItem('funnel_intent');
    localStorage.removeItem('funnel_intent');
    return intent ? JSON.parse(intent) : null;
};
