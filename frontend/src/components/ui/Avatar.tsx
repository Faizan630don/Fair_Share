interface AvatarProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Avatar({ name, size = 'md', className = '' }: AvatarProps) {
  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const initial = name ? name[0].toUpperCase() : '?';

  return (
    <div className={`rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold ${sizeClasses[size]} ${className}`}>
      {initial}
    </div>
  );
}
