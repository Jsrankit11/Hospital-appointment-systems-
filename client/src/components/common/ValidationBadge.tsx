import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck, HelpCircle } from 'lucide-react';

export type ValidationStatus = 'VALID' | 'WARNING' | 'INVALID' | 'VERIFIED' | 'PENDING';

interface ValidationBadgeProps {
  status: ValidationStatus;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const ValidationBadge: React.FC<ValidationBadgeProps> = ({
  status,
  label,
  size = 'md',
  showIcon = true,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-semibold px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3 py-1.5 gap-2'
  };

  const config = {
    VALID: {
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      icon: CheckCircle2,
      defaultText: 'Valid / सही है'
    },
    VERIFIED: {
      bg: 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30',
      icon: ShieldCheck,
      defaultText: 'ABHA Verified'
    },
    WARNING: {
      bg: 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30',
      icon: AlertTriangle,
      defaultText: 'Warning / ध्यान दें'
    },
    INVALID: {
      bg: 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30',
      icon: XCircle,
      defaultText: 'Invalid / अमान्य'
    },
    PENDING: {
      bg: 'bg-slate-500/10 dark:bg-slate-500/20 text-slate-500 dark:text-slate-400 border-slate-500/30',
      icon: HelpCircle,
      defaultText: 'Checking...'
    }
  };

  const current = config[status] || config.PENDING;
  const IconComponent = current.icon;

  return (
    <span
      className={`inline-flex items-center rounded-full border transition-all duration-200 shadow-sm ${sizeClasses[size]} ${current.bg} ${className}`}
    >
      {showIcon && <IconComponent className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />}
      <span>{label || current.defaultText}</span>
    </span>
  );
};
