export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'gradient' | 'solid';
}

export const Card: React.FC<CardProps & { children: React.ReactNode }> = ({
  variant = 'glass',
  className = '',
  children,
  ...props
}) => {
  const variants = {
    glass: 'backdrop-blur-xl bg-white/10 border border-white/20',
    gradient: 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/20',
    solid: 'bg-slate-800 border border-slate-700',
  };

  return (
    <div
      className={`rounded-2xl p-6 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
