import { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes } from 'react';

export type Variant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger' | 'success';
export type Size = 'sm' | 'md' | 'lg';

export interface BaseProps {
  className?: string;
  children?: ReactNode;
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  isLoading?: boolean;
}

export interface CardProps extends BaseProps {
  title?: string;
  footer?: ReactNode;
  noPadding?: boolean;
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: ReactNode;
}

export interface BadgeProps extends BaseProps {
  variant?: Variant;
}

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'error' | 'info';
}
