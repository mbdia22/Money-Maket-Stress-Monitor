'use client';

interface StressPanelProps {
    title: string;
    subtitle: string;
    value: number;
    unit?: string;
    status: 'normal' | 'warning' | 'critical' | 'info';
    statusLabel: string;
    description?: string;
    children?: React.ReactNode;
}

export default function StressPanel({
    title,
    subtitle,
    value,
    unit = 'bps',
    status,
    statusLabel,
    description,
    children
}: StressPanelProps) {
    return (
        <div className="terminal-panel h-full flex flex-col">
            <div className="mb-4">
                <h3 className="terminal-panel-header terminal-glow">{title}</h3>
                <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider leading-relaxed">
                    {subtitle}
                </p>
            </div>

            {children || (
                <div className="flex-1 flex flex-col justify-center">
                    <div className={`spread-value status-${status} terminal-glow text-center mb-2`}>
                        {value > 0 ? '+' : ''}{value.toFixed(2)}
                    </div>
                    <div className="spread-label text-center mb-4">{unit}</div>
                </div>
            )}

            <div className={`status-box status-${status}`}>
                {statusLabel}
            </div>

            {description && (
                <p className="text-[9px] text-[var(--text-tertiary)] mt-3 leading-relaxed">
                    {description}
                </p>
            )}
        </div>
    );
}
