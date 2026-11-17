/**
 * Ayurzenix Engine - Diagnostics & Observability
 * production-grade AI health monitoring
 */

export interface AiHealthReport {
  status: 'online' | 'degraded' | 'offline';
  latency?: number;
  model: string;
  timestamp: string;
  error?: string;
  correlationId?: string;
}

export const checkAiHealth = async (adminEmail?: string): Promise<AiHealthReport> => {
  try {
    const response = await fetch('/api/admin/ai-diagnostic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: adminEmail || 'observer@ayurzenix.in' })
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        status: 'offline',
        model: data.modelUsed || 'unknown',
        timestamp: new Date().toISOString(),
        error: data.error || 'System transport error'
      };
    }

    if (data.success) {
      return {
        status: 'online',
        latency: data.latency,
        model: data.modelUsed,
        timestamp: data.timestamp
      };
    }

    return {
      status: 'degraded',
      model: data.modelUsed || 'unknown',
      timestamp: new Date().toISOString(),
      error: data.error
    };
  } catch (error: any) {
    return {
      status: 'offline',
      model: 'N/A',
      timestamp: new Date().toISOString(),
      error: error.message
    };
  }
};

export const getDiagnosticInsights = (report: AiHealthReport) => {
  if (report.status === 'online') {
    if (report.latency && report.latency > 5000) {
      return {
        severity: 'warning',
        message: 'Intelligence latency is high. Responses may feel slow.',
        action: 'Check connectivity or consider switching to a faster model.'
      };
    }
    return {
      severity: 'success',
      message: 'Veda Intelligence Engine is operating optimally.',
      action: 'No action required.'
    };
  }

  if (report.status === 'degraded') {
    return {
      severity: 'error',
      message: `Intelligence is degraded: ${report.error}`,
      action: 'Verify API Quota or Admin Panel AI Overrides.'
    };
  }

  return {
    severity: 'error',
    message: `Intelligence is OFFLINE: ${report.error}`,
    action: 'MANDATORY: Check Ayurzenix Secrets or .env configuration.'
  };
};
