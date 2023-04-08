import { InformationCircleIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

type AlertProps = {
  mode: 'info' | 'success' | 'error' | 'loading';
  title?: string;
  subtitle?: string;
  className?: string;
  children?: React.ReactNode;
};

export default ({ mode, title, subtitle, className, children }: AlertProps) => {
  let icon;

  switch (mode) {
    case 'info':
      icon = <InformationCircleIcon className="w-8 h-8" />;
      break;
    case 'loading':
      icon = <ClockIcon className="w-8 h-8" />;
      break;
    case 'success':
      icon = <CheckCircleIcon className="w-8 h-8" />;
      break;
    case 'error':
      icon = <XCircleIcon className="w-8 h-8" />;
      break;
    default:
      icon = null;
  }

  return (
    <div
      className={clsx(className, 'flex items-center px-4 py-3 rounded', 'items-center', 'gap-4', {
        'bg-blue-100 border border-blue-400 text-blue-700': mode === 'info' || mode === 'loading',
        'bg-green-100 border border-green-400 text-green-700': mode === 'success',
        'bg-red-100 border border-red-400 text-red-700': mode === 'error',
      })}
      role="alert"
    >
      {icon}
      <div className="block sm:inline">
        {title && <h3 className="font-bold">{title}</h3>}
        {subtitle && <span className="text-xs">{subtitle}</span>}
      </div>
      {children}
    </div>
  );
};
