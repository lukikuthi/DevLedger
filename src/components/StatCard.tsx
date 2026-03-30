import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  variant?: 'default' | 'success' | 'warning' | 'destructive';
}

const variantClasses = {
  default: 'bg-card',
  success: 'bg-card border-success/20',
  warning: 'bg-card border-warning/20',
  destructive: 'bg-card border-destructive/20',
};

const iconVariantClasses = {
  default: 'bg-accent text-accent-foreground',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  destructive: 'bg-destructive/10 text-destructive',
};

const StatCard = ({ title, value, icon: Icon, trend, variant = 'default' }: StatCardProps) => (
  <div className={`${variantClasses[variant]} rounded-xl p-4 border border-border shadow-card`}>
    <div className="flex items-start justify-between mb-3">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconVariantClasses[variant]}`}>
        <Icon className="w-4 h-4" />
      </div>
      {trend && (
        <span className="text-xs font-medium text-muted-foreground">{trend}</span>
      )}
    </div>
    <p className="text-xl font-bold text-foreground">{value}</p>
    <p className="text-xs text-muted-foreground mt-0.5">{title}</p>
  </div>
);

export default StatCard;
