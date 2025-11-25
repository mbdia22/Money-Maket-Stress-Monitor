'use client';

interface MetricCardProps {
    title: string;
    value: number;
    unit?: string;
    status: 'success' | 'warning' | 'error' | 'info';
    statusLabel: string;
    change?: number;
    description?: string;
}

export default function MetricCard({
    title,
    value,
    unit = 'bps',
    status,
    statusLabel,
    change,
    description
}: MetricCardProps) {
    const statusClasses = {
        success: 'text-success',
        warning: 'text-warning',
        error: 'text-error',
        info: 'text-info'
    };

    const badgeClasses = {
        success: 'status-success',
        warning: 'status-warning',
        error: 'status-error',
        info: 'status-info'
    };

    return (
        <div className="metric-card">
            <div className="metric-label">{title}</div>

            <div className={`metric-value ${statusClasses[status]}`}>
                {value > 0 ? '+' : ''}{value.toFixed(2)}
                <span className="text-sm ml-1 font-normal text-[var(--text-secondary)]">{unit}</span>
            </div>

            {change !== undefined && (
                <div className={`metric-change ${change >= 0 ? 'text-success' : 'text-error'}`}>
                    {change >= 0 ? '↑' : '↓'} {Math.abs(change).toFixed(2)} from yesterday
                </div>
            )}

            <div className={`status-badge ${badgeClasses[status]} mt-3`}>
                {statusLabel}
            </div>

            {description && (
                <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed">
                    {description}
                </p>
            )}
        </div>
    );
}
