import React from 'react';

interface DashboardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Dashboard({ children, className = '' }: DashboardProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${className}`}>
      {children}
    </div>
  );
}

