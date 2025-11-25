'use client';

interface SpreadMonitorProps {
    spreads: {
        [key: string]: number;
    };
    statuses: {
        [key: string]: string;
    };
}

export default function SpreadMonitor({ spreads, statuses }: SpreadMonitorProps) {
    const spreadConfig = [
        { key: 'EFFR-IORB', label: 'RESERVE DEMAND', description: 'EFFR - IORB' },
        { key: 'SOFR-EFFR', label: 'FHLB REPO DEMAND', description: 'SOFR - EFFR' },
        { key: 'TGCR-RRP', label: 'PRIVATE REPO DEMAND', description: 'TGCR - RRP' },
        { key: 'GCF-TGCR', label: 'DEALER BALANCE SHEET', description: 'GCF - TGCR' },
    ];

    const getStatus = (key: string, value: number): 'normal' | 'warning' | 'critical' => {
        if (key === 'EFFR-IORB') {
            if (value > 0) return 'critical'; // Scarcity
            if (value < -5) return 'warning'; // Too much abundance
            return 'normal';
        }
        if (key === 'GCF-TGCR') {
            if (value > 5) return 'critical'; // Inflexible balance sheets
            if (value > 2) return 'warning';
            return 'normal';
        }
        return 'normal';
    };

    return (
        <div className="terminal-panel">
            <h3 className="terminal-panel-header terminal-glow mb-4">KEY MONEY MARKET SPREADS</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {spreadConfig.map(({ key, label, description }) => {
                    const value = spreads[key] || 0;
                    const status = getStatus(key, value);
                    const statusText = statuses[`${key}-Status`] || 'NORMAL';

                    return (
                        <div key={key} className="border border-[var(--border-default)] p-4">
                            <div className="spread-label mb-2">{label}</div>
                            <div className="text-[10px] text-[var(--text-tertiary)] mb-3">{description}</div>

                            <div className={`spread-value status-${status} terminal-glow mb-2`}>
                                {value > 0 ? '+' : ''}{value.toFixed(2)}
                            </div>
                            <div className="spread-label mb-3">bps</div>

                            <div className={`status-box status-${status} text-[9px] py-1`}>
                                {statusText}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
