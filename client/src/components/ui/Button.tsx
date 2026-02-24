import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'team-a' | 'team-b' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

// Colors from original device.js:
//   button default: #2D2F50, hover: #414364, text: light gray (200) = #C8C8C8
//   primary action: gold #E0AD42 with dark navy text
const variantClasses: Record<string, string> = {
  primary:
    'bg-game-gold hover:brightness-110 text-game-navy font-bold shadow-lg',
  secondary:
    'bg-game-navy-mid hover:bg-game-navy-hover text-[#C8C8C8] border border-[#414364]',
  danger:
    'bg-[#B9373B] hover:bg-[#CD4B4F] text-[#F1ECC2] font-bold',
  'team-a':
    'bg-[#97BDC9] hover:brightness-110 text-game-navy font-bold',
  'team-b':
    'bg-[#DF6B50] hover:brightness-110 text-[#F1ECC2] font-bold',
  ghost:
    'bg-transparent hover:bg-[#2D2F50] text-[#C8C8C8] border border-[#414364]',
};

const sizeClasses: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-base rounded-xl',
  lg: 'px-8 py-3.5 text-lg rounded-xl',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  disabled,
  ...rest
}) => {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        transition-all duration-150
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};
