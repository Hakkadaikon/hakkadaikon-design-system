import React, { useState, useEffect, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes, InputHTMLAttributes, createContext, useContext, useRef } from 'react';
import { 
  Loader2, Check, X, 
  AlertCircle, Info, ChevronDown, Copy, Terminal,
  Upload, Calendar, ChevronRight, ChevronLeft, MoreHorizontal,
  Menu, Search, Home, MoreVertical, Trash2
} from 'lucide-react';
import { ButtonProps, InputProps, CardProps, BadgeProps, Variant, Size, ToastMessage } from '../types';

// --- TOAST CONTEXT ---

interface ToastContextType {
  addToast: (msg: Omit<ToastMessage, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (msg: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { ...msg, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div 
            key={toast.id}
            className={`
              pointer-events-auto min-w-[300px] bg-white border-2 border-hakka-dark shadow-game p-4 flex items-start gap-3
              animate-[bounce-sm_0.3s_ease-out]
            `}
          >
             <div className={`p-1 rounded-full border-2 border-hakka-dark shrink-0 ${
               toast.type === 'success' ? 'bg-hakka-success' : toast.type === 'error' ? 'bg-red-400' : 'bg-hakka-blue'
             }`}>
               {toast.type === 'success' ? <Check size={14} /> : toast.type === 'error' ? <AlertCircle size={14} /> : <Info size={14} />}
             </div>
             <div className="flex-1">
               <h4 className="font-bold font-pixel uppercase leading-none mb-1">{toast.title}</h4>
               <p className="text-xs font-mono opacity-80">{toast.description}</p>
             </div>
             <button onClick={() => removeToast(toast.id)} className="hover:bg-gray-100 rounded">
               <X size={14} />
             </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};


// --- UTILS ---
const getVariantClasses = (variant: Variant = 'primary') => {
  switch (variant) {
    case 'primary': return 'bg-hakka-primary text-hakka-dark hover:bg-hakka-primary/90';
    case 'secondary': return 'bg-white text-hakka-dark hover:bg-gray-50';
    case 'accent': return 'bg-hakka-accent text-hakka-dark hover:bg-yellow-300';
    case 'danger': return 'bg-red-400 text-white hover:bg-red-500';
    case 'success': return 'bg-hakka-success text-hakka-dark hover:bg-green-400';
    case 'ghost': return 'bg-transparent border-transparent shadow-none !border-b-0 hover:bg-hakka-dark/5 p-0';
    default: return 'bg-hakka-primary text-hakka-dark';
  }
};

const getSizeClasses = (size: Size = 'md') => {
  switch (size) {
    case 'sm': return 'px-3 py-1 text-sm h-9';
    case 'md': return 'px-5 py-2 text-base h-12';
    case 'lg': return 'px-8 py-3 text-lg h-16';
    default: return 'px-5 py-2 text-base';
  }
};

// --- BASIC ELEMENTS ---

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  children, 
  isLoading, 
  icon,
  ...props 
}) => {
  const isGhost = variant === 'ghost';
  
  return (
    <button 
      className={`
        relative font-bold border-2 border-hakka-dark rounded-lg transition-all duration-75
        flex items-center justify-center gap-2
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
        uppercase tracking-wide font-pixel select-none
        ${!isGhost 
          ? 'shadow-[0_4px_0_0_#2d3436] active:shadow-[0_0_0_0_#2d3436] active:translate-y-1' 
          : 'hover:-translate-y-0.5 active:translate-y-0'}
        ${getVariantClasses(variant)}
        ${getSizeClasses(size)}
        ${className}
      `}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!isLoading && icon}
      {children}
    </button>
  );
};

export const Link: React.FC<{ href: string; children: ReactNode; className?: string }> = ({ href, children, className = '' }) => {
  return (
    <a 
      href={href} 
      className={`
        text-hakka-primary font-bold font-mono underline decoration-2 underline-offset-4 
        hover:text-hakka-dark hover:bg-hakka-accent px-1 rounded transition-colors
        ${className}
      `}
    >
      {children}
    </a>
  );
};

export const Divider: React.FC<{ label?: string }> = ({ label }) => {
  if (label) {
    return (
      <div className="relative flex items-center w-full my-8 group">
        <div className="flex-grow border-t-4 border-hakka-dark border-dotted opacity-30 group-hover:opacity-100 transition-opacity"></div>
        <span className="flex-shrink-0 mx-4 text-hakka-dark font-pixel text-xl uppercase tracking-widest bg-hakka-accent px-4 py-1 border-2 border-hakka-dark rounded shadow-game-sm transform -rotate-2 group-hover:rotate-0 transition-transform duration-300">
          {label}
        </span>
        <div className="flex-grow border-t-4 border-hakka-dark border-dotted opacity-30 group-hover:opacity-100 transition-opacity"></div>
      </div>
    );
  }
  return <hr className="border-t-4 border-hakka-dark/20 border-dotted my-6 w-full" />;
};

export const Badge: React.FC<BadgeProps> = ({ variant = 'primary', children, className = '' }) => {
  const variantStyles = {
    primary: 'bg-hakka-primary text-hakka-dark',
    secondary: 'bg-white text-hakka-dark',
    accent: 'bg-hakka-accent text-hakka-dark',
    success: 'bg-hakka-success text-hakka-dark',
    danger: 'bg-red-400 text-white',
    ghost: 'bg-gray-200 text-hakka-dark border-dashed',
  };

  return (
    <span className={`
      inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border-2 border-hakka-dark
      font-mono uppercase tracking-tighter shadow-[2px_2px_0_#2d3436]
      ${variantStyles[variant as keyof typeof variantStyles] || variantStyles.primary}
      ${className}
    `}>
      {children}
    </span>
  );
};

// --- FORM ELEMENTS ---

export const Input: React.FC<InputProps> = ({ label, error, helperText, icon, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-sm font-bold text-hakka-dark ml-1 font-mono uppercase flex justify-between">
        {label}
        {props.required && <span className="text-red-500 text-xs">*</span>}
      </label>}
      <div className="relative group">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-hakka-dark pointer-events-none opacity-50 group-focus-within:opacity-100 transition-opacity">
            {icon}
          </div>
        )}
        <input 
          className={`
            w-full bg-white border-2 border-hakka-dark rounded px-4 py-3
            text-hakka-dark placeholder-hakka-dark/30 font-bold font-mono outline-none
            transition-all duration-200
            focus:border-hakka-primary focus:shadow-game-sm focus:translate-x-1 focus:-translate-y-1
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-500 bg-red-50' : ''}
          `}
          {...props}
        />
      </div>
      {error && <span className="text-xs font-bold text-red-500 ml-1 flex items-center gap-1 animate-pulse"><AlertCircle size={12}/>{error}</span>}
      {!error && helperText && <span className="text-xs text-hakka-dark/60 ml-1 font-mono">{helperText}</span>}
    </div>
  );
};

export const Slider: React.FC<InputHTMLAttributes<HTMLInputElement> & { label?: string }> = ({ label, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <label className="text-sm font-bold text-hakka-dark ml-1 font-mono uppercase">{label}</label>}
      <input
        type="range"
        className="
          w-full h-4 bg-gray-200 rounded-full appearance-none border-2 border-hakka-dark cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
          [&::-webkit-slider-thumb]:bg-hakka-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-hakka-dark
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-game-sm
        "
        {...props}
      />
    </div>
  );
};

export const DatePicker: React.FC<InputHTMLAttributes<HTMLInputElement> & { label?: string }> = ({ label, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-sm font-bold text-hakka-dark ml-1 font-mono uppercase">{label}</label>}
      <div className="relative">
        <input 
          type="date" 
          className="
            w-full bg-white border-2 border-hakka-dark rounded px-4 py-3
            text-hakka-dark font-bold font-mono outline-none uppercase
            focus:border-hakka-primary focus:shadow-game-sm
          "
          {...props}
        />
        <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-hakka-dark/50" size={18} />
      </div>
    </div>
  );
};

export const FileUpload: React.FC<{ label?: string }> = ({ label }) => {
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm font-bold text-hakka-dark ml-1 font-mono uppercase">{label}</label>}
      <div className="border-4 border-dashed border-hakka-dark/30 rounded-lg p-8 text-center hover:bg-hakka-light hover:border-hakka-primary transition-colors cursor-pointer group">
        <Upload className="mx-auto text-hakka-dark/50 group-hover:text-hakka-primary mb-2 transition-colors" size={32} />
        <p className="font-pixel text-xl text-hakka-dark uppercase">Drop file here</p>
        <p className="font-mono text-xs text-hakka-dark/50">or click to browse</p>
        <input type="file" className="hidden" />
      </div>
    </div>
  );
};

export const Textarea: React.FC<TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string, error?: string }> = ({ label, error, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-sm font-bold text-hakka-dark ml-1 font-mono uppercase">{label}</label>}
      <textarea 
        className={`
          w-full bg-white border-2 border-hakka-dark rounded px-4 py-3 min-h-[100px]
          text-hakka-dark placeholder-hakka-dark/30 font-bold font-mono outline-none
          transition-all duration-200
          focus:border-hakka-primary focus:shadow-game-sm focus:translate-x-1 focus:-translate-y-1
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error ? 'border-red-500 bg-red-50' : ''}
        `}
        {...props}
      />
      {error && <span className="text-xs font-bold text-red-500 ml-1 flex items-center gap-1"><AlertCircle size={12}/>{error}</span>}
    </div>
  );
};

export const Select: React.FC<SelectHTMLAttributes<HTMLSelectElement> & { label?: string, options: {value: string, label: string}[] }> = ({ label, options, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-sm font-bold text-hakka-dark ml-1 font-mono uppercase">{label}</label>}
      <div className="relative group">
        <select 
          className={`
            w-full bg-white border-2 border-hakka-dark rounded px-4 py-3 appearance-none
            text-hakka-dark font-bold font-mono outline-none
            transition-all duration-200
            focus:border-hakka-primary focus:shadow-game-sm focus:translate-x-1 focus:-translate-y-1
            disabled:bg-gray-100 disabled:cursor-not-allowed
            cursor-pointer
          `}
          {...props}
        >
          {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-hakka-dark transition-transform group-focus-within:rotate-180">
          <ChevronDown size={20} strokeWidth={3} />
        </div>
      </div>
    </div>
  );
};

export const Switch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; label?: string }> = ({ checked, onChange, label }) => {
  return (
    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onChange(!checked)}>
      <div className={`
        w-14 h-8 border-2 border-hakka-dark rounded-full relative transition-colors duration-200 shadow-game-sm group-active:shadow-none group-active:translate-x-[2px] group-active:translate-y-[2px]
        ${checked ? 'bg-hakka-success' : 'bg-gray-200'}
      `}>
        <div className={`
          absolute top-0.5 left-0.5 w-6 h-6 bg-white border-2 border-hakka-dark rounded-full transition-transform duration-200 flex items-center justify-center
          ${checked ? 'translate-x-6' : 'translate-x-0'}
        `}>
           {checked && <div className="w-1.5 h-1.5 bg-hakka-dark rounded-full" />}
        </div>
      </div>
      {label && <span className="font-bold text-hakka-dark select-none font-mono group-hover:text-hakka-primary transition-colors">{label}</span>}
    </div>
  );
};

export const Checkbox: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; label?: string }> = ({ checked, onChange, label }) => {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none group">
      <div className={`
        w-6 h-6 border-2 border-hakka-dark flex items-center justify-center transition-all rounded-sm relative
        ${checked ? 'bg-hakka-primary shadow-game-sm -translate-y-0.5' : 'bg-white hover:bg-gray-50'}
      `}>
        {checked && <Check size={16} strokeWidth={3} className="text-hakka-dark" />}
      </div>
      {label && <span className="font-bold text-hakka-dark font-mono group-hover:underline decoration-2 decoration-hakka-primary underline-offset-4">{label}</span>}
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="hidden" />
    </label>
  );
};

export const Radio: React.FC<{ checked: boolean; onChange: () => void; label?: string; name?: string }> = ({ checked, onChange, label, name }) => {
  const id = React.useId();

  return (
    <div className="flex items-center gap-3">
      <input
        type="radio"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <label
        htmlFor={id}
        className="flex items-center gap-3 cursor-pointer select-none"
      >
        <div className={`
          w-6 h-6 border-2 border-hakka-dark rounded-full flex items-center justify-center
          ${checked ? 'bg-white shadow-game-sm ring-2 ring-hakka-primary ring-offset-1' : 'bg-white hover:bg-gray-50'}
        `}>
          {checked && <div className="w-3 h-3 bg-hakka-dark rounded-full" />}
        </div>
        {label && <span className="font-bold text-hakka-dark font-mono">{label}</span>}
      </label>
    </div>
  );
};

// --- DATA DISPLAY ---

export const Card: React.FC<CardProps> = ({ title, children, footer, className = '', noPadding }) => {
  return (
    <div className={`
      bg-white border-2 border-hakka-dark shadow-game flex flex-col relative overflow-hidden group hover:shadow-game-lg transition-shadow duration-300
      ${className}
    `}>
      {title && (
        <div className="bg-hakka-light border-b-2 border-hakka-dark px-4 py-2 flex items-center justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-pattern-dots opacity-20"></div>
          <h3 className="font-pixel text-xl text-hakka-dark uppercase tracking-widest relative z-10 flex items-center gap-2">
            <span className="w-2 h-2 bg-hakka-primary rounded-full animate-pulse"></span>
            {title}
          </h3>
          <div className="flex gap-1 relative z-10">
             <div className="w-2 h-2 rounded-full border border-hakka-dark bg-red-400"></div>
             <div className="w-2 h-2 rounded-full border border-hakka-dark bg-yellow-400"></div>
             <div className="w-2 h-2 rounded-full border border-hakka-dark bg-green-400"></div>
          </div>
        </div>
      )}
      <div className={`flex-grow ${noPadding ? '' : 'p-6'}`}>
        {children}
      </div>
      {footer && (
        <div className="bg-gray-50 border-t-2 border-hakka-dark px-6 py-4">
          {footer}
        </div>
      )}
    </div>
  );
};

export const Avatar: React.FC<{ src?: string; initials?: string; size?: 'sm' | 'md' | 'lg' }> = ({ src, initials = 'FP', size = 'md' }) => {
  const sizeClass = size === 'sm' ? 'w-10 h-10 text-xs' : size === 'lg' ? 'w-24 h-24 text-3xl' : 'w-14 h-14 text-xl';
  const [imgError, setImgError] = useState(false);
  
  return (
    <div className={`
      ${sizeClass} rounded-full border-2 border-hakka-dark bg-hakka-accent overflow-hidden shadow-game-sm flex items-center justify-center font-bold text-hakka-dark relative shrink-0 group
    `}>
      {src && !imgError ? (
        <img 
          src={src} 
          alt="avatar" 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="font-pixel">{initials}</span>
      )}
      <div className="absolute inset-0 ring-inset ring-2 ring-black/10 rounded-full"></div>
    </div>
  );
};

export const Chip: React.FC<{ label: string; onDelete?: () => void }> = ({ label, onDelete }) => (
  <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border-2 border-hakka-dark rounded-full font-mono text-sm shadow-[2px_2px_0_#2d3436]">
    {label}
    {onDelete && (
      <button onClick={onDelete} className="hover:bg-red-100 rounded-full p-0.5 text-hakka-dark ml-1">
        <X size={12} />
      </button>
    )}
  </span>
);

export const Table: React.FC<{ headers: string[]; data: any[][] }> = ({ headers, data }) => (
  <div className="w-full overflow-x-auto border-2 border-hakka-dark rounded shadow-game bg-white">
    <table className="w-full text-left font-mono">
      <thead className="bg-hakka-light border-b-2 border-hakka-dark text-hakka-dark uppercase font-pixel tracking-wide text-lg">
        <tr>
          {headers.map((h, i) => (
            <th key={i} className="px-4 py-3 border-r-2 border-hakka-dark last:border-r-0 whitespace-nowrap">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i} className="border-b-2 border-hakka-dark last:border-b-0 hover:bg-gray-50 transition-colors">
            {row.map((cell, j) => (
              <td key={j} className="px-4 py-3 border-r-2 border-hakka-dark/20 last:border-r-0">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const List: React.FC<{ items: ReactNode[] }> = ({ items }) => (
  <ul className="space-y-2">
    {items.map((item, i) => (
      <li key={i} className="flex items-center gap-3 p-3 bg-white border-2 border-hakka-dark shadow-[2px_2px_0_#ccc] hover:shadow-game-sm hover:-translate-y-0.5 transition-all">
        <div className="w-2 h-2 bg-hakka-primary rounded-full" />
        {item}
      </li>
    ))}
  </ul>
);

export const Accordion: React.FC<{ items: { title: string; content: ReactNode }[] }> = ({ items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  return (
    <div className="flex flex-col gap-2">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div key={idx} className="border-2 border-hakka-dark bg-white shadow-game-sm">
            <button 
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className={`w-full flex justify-between items-center p-4 font-pixel text-xl uppercase tracking-wide hover:bg-gray-50 transition-colors ${isOpen ? 'bg-hakka-light border-b-2 border-hakka-dark' : ''}`}
            >
              {item.title}
              <ChevronDown className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
              <div className="p-4 font-mono text-sm animate-[pulse-fast_0.2s_ease-out]">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const Carousel: React.FC<{ items: ReactNode[] }> = ({ items }) => {
  const [current, setCurrent] = useState(0);
  
  const next = () => setCurrent((c) => (c + 1) % items.length);
  const prev = () => setCurrent((c) => (c - 1 + items.length) % items.length);
  
  return (
    <div className="relative border-2 border-hakka-dark bg-hakka-dark p-1 shadow-game overflow-hidden group">
      <div className="relative bg-white border-2 border-hakka-dark h-64 flex items-center justify-center overflow-hidden">
        <div className="transition-all duration-300">
          {items[current]}
        </div>
      </div>
      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white border-2 border-hakka-dark p-2 hover:bg-hakka-primary shadow-game-sm active:translate-y-0 active:shadow-none transition-all">
        <ChevronLeft size={20} />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white border-2 border-hakka-dark p-2 hover:bg-hakka-primary shadow-game-sm active:translate-y-0 active:shadow-none transition-all">
        <ChevronRight size={20} />
      </button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {items.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 border-2 border-hakka-dark rounded-full ${i === current ? 'bg-hakka-primary scale-110' : 'bg-white hover:bg-gray-200'} transition-all`}
          />
        ))}
      </div>
    </div>
  );
};

export const ProgressBar: React.FC<{ value: number; max?: number; color?: string; label?: string }> = ({ value, max = 100, color = 'bg-hakka-success', label }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="w-full font-mono">
      {label && (
        <div className="flex justify-between mb-1 text-xs font-bold uppercase tracking-wider">
          <span className="bg-hakka-dark text-white px-1">{label}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="w-full h-8 border-2 border-hakka-dark bg-hakka-light relative p-1 shadow-inner">
        <div 
          className={`h-full border-r-2 border-hakka-dark transition-all duration-500 ease-out relative overflow-hidden ${color}`} 
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[move-bg_1s_linear_infinite]"></div>
        </div>
      </div>
    </div>
  );
};

// --- NAVIGATION ---

export const Breadcrumb: React.FC<{ items: { label: string; href: string }[] }> = ({ items }) => (
  <nav className="flex items-center gap-2 font-mono text-sm">
    {items.map((item, idx) => (
      <React.Fragment key={idx}>
        {idx > 0 && <ChevronRight size={14} className="text-hakka-dark/50" />}
        <a href={item.href} className={`hover:underline decoration-2 underline-offset-4 ${idx === items.length - 1 ? 'font-bold text-hakka-dark pointer-events-none' : 'text-hakka-primary'}`}>
          {item.label}
        </a>
      </React.Fragment>
    ))}
  </nav>
);

export const Pagination: React.FC<{ total: number; current: number; onChange: (p: number) => void }> = ({ total, current, onChange }) => (
  <div className="flex items-center gap-2 font-pixel">
    <Button size="sm" variant="secondary" disabled={current === 1} onClick={() => onChange(current - 1)}><ChevronLeft size={16}/></Button>
    {[...Array(total)].map((_, i) => {
      const page = i + 1;
      return (
        <button
          key={page}
          onClick={() => onChange(page)}
          className={`
            w-9 h-9 border-2 border-hakka-dark flex items-center justify-center text-lg
            ${current === page ? 'bg-hakka-primary text-hakka-dark shadow-game-sm -translate-y-1' : 'bg-white hover:bg-gray-100'}
            transition-all
          `}
        >
          {page}
        </button>
      );
    })}
    <Button size="sm" variant="secondary" disabled={current === total} onClick={() => onChange(current + 1)}><ChevronRight size={16}/></Button>
  </div>
);

export const Stepper: React.FC<{ steps: string[]; current: number }> = ({ steps, current }) => (
  <div className="flex items-center w-full">
    {steps.map((step, idx) => (
      <div key={idx} className="flex items-center flex-1 last:flex-none">
        <div className="relative">
          <div className={`
            w-8 h-8 rounded-full border-2 border-hakka-dark flex items-center justify-center font-bold font-mono z-10 relative
            ${idx <= current ? 'bg-hakka-success text-hakka-dark shadow-game-sm' : 'bg-white text-gray-400'}
          `}>
            {idx < current ? <Check size={16} /> : idx + 1}
          </div>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-mono font-bold uppercase tracking-wider">
            {step}
          </div>
        </div>
        {idx < steps.length - 1 && (
          <div className={`flex-1 h-1 border-y border-hakka-dark mx-2 ${idx < current ? 'bg-hakka-success' : 'bg-gray-200'}`} />
        )}
      </div>
    ))}
  </div>
);

export const MenuComp: React.FC<{ trigger: ReactNode; items: string[] }> = ({ trigger, items }) => (
  <div className="relative group inline-block">
    {trigger}
    <div className="absolute top-full left-0 mt-2 min-w-[160px] bg-white border-2 border-hakka-dark shadow-game-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-50 p-1">
      {items.map((item, i) => (
        <button key={i} className="w-full text-left px-4 py-2 hover:bg-hakka-accent font-mono text-sm border border-transparent hover:border-hakka-dark">
          {item}
        </button>
      ))}
    </div>
  </div>
);

export const Tabs: React.FC<{ tabs: string[]; activeTab: number; onChange: (index: number) => void }> = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="flex border-b-2 border-hakka-dark bg-hakka-light overflow-x-auto">
      {tabs.map((tab, index) => (
        <button
          key={tab}
          onClick={() => onChange(index)}
          className={`
            px-6 py-3 font-bold text-sm transition-all whitespace-nowrap font-pixel uppercase tracking-wider relative
            ${activeTab === index 
              ? 'text-hakka-primary bg-white border-x-2 border-t-2 border-hakka-dark -mb-[2px] z-10' 
              : 'text-hakka-dark/50 hover:bg-white/50 hover:text-hakka-dark border-transparent border-x-2 border-t-2'}
          `}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

// --- FEEDBACK & OVERLAYS ---

export const Alert: React.FC<{ title: string; children: ReactNode; variant?: 'info' | 'error' | 'success' }> = ({ title, children, variant = 'info' }) => {
  const styles = {
    info: { bg: 'bg-hakka-blue/10', border: 'border-hakka-blue', icon: 'text-hakka-blue', iconBg: 'bg-hakka-blue' },
    error: { bg: 'bg-red-50', border: 'border-red-500', icon: 'text-red-500', iconBg: 'bg-red-400' },
    success: { bg: 'bg-green-50', border: 'border-hakka-success', icon: 'text-green-600', iconBg: 'bg-hakka-success' },
  };
  
  const currentStyle = styles[variant];
  
  return (
    <div className={`flex items-start gap-4 p-4 border-l-8 border-y-2 border-r-2 ${currentStyle.border} ${currentStyle.bg} shadow-sm`}>
       <div className={`p-1 border-2 border-hakka-dark rounded-full shrink-0 bg-white ${currentStyle.icon}`}>
         <Info size={16} strokeWidth={3} />
       </div>
       <div>
         <h4 className={`font-pixel text-xl uppercase tracking-wide leading-none mb-1 ${currentStyle.icon}`}>{title}</h4>
         <div className="text-sm font-mono opacity-90 leading-relaxed">{children}</div>
       </div>
    </div>
  );
};

export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-hakka-dark/90 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg animate-[bounce-sm_0.3s_ease-out]">
        <div className="bg-white border-4 border-hakka-dark shadow-game-xl">
          <div className="bg-hakka-primary border-b-4 border-hakka-dark p-4 flex justify-between items-center bg-stripes">
             <h2 className="text-2xl font-pixel text-white uppercase drop-shadow-[2px_2px_0_#2d3436] tracking-widest bg-hakka-dark px-2">{title}</h2>
             <button onClick={onClose} className="bg-white border-2 border-hakka-dark p-1 hover:bg-red-400 hover:text-white transition-colors shadow-game-sm active:translate-y-0.5 active:shadow-none">
               <X size={20} />
             </button>
          </div>
          <div className="p-8 max-h-[70vh] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Drawer: React.FC<{ isOpen: boolean; onClose: () => void; children: ReactNode }> = ({ isOpen, onClose, children }) => {
  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-hakka-dark/50 z-[90] backdrop-blur-sm" onClick={onClose} />}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white border-l-4 border-hakka-dark z-[100] shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 border-b-2 border-hakka-dark flex justify-between items-center bg-hakka-light">
          <h3 className="font-pixel text-2xl uppercase">Settings</h3>
          <button onClick={onClose}><X /></button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </>
  );
};

export const Popover: React.FC<{ trigger: ReactNode; content: ReactNode }> = ({ trigger, content }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative inline-block">
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 p-4 bg-white border-2 border-hakka-dark shadow-game-lg z-50">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t-2 border-l-2 border-hakka-dark rotate-45"></div>
          {content}
        </div>
      )}
    </div>
  );
};

export const Tooltip: React.FC<{ content: string; children: ReactNode }> = ({ content, children }) => {
  return (
    <div className="relative inline-block group">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1 bg-hakka-dark text-white text-xs font-pixel tracking-widest z-40 border-2 border-white shadow-game whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {content}
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-hakka-dark"></div>
      </div>
    </div>
  );
};

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-gray-200 animate-pulse rounded border border-gray-300 ${className}`} />
);

export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizes = { sm: 16, md: 24, lg: 40 };
  return <Loader2 className="animate-spin text-hakka-primary" size={sizes[size]} />;
};

export const CodeBlock: React.FC<{ code: string }> = ({ code }) => {
  const { addToast } = useToast();
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    addToast({ title: 'COPIED!', description: 'Code copied to clipboard.', type: 'success' });
  };

  return (
    <div className="bg-hakka-dark text-hakka-light rounded-lg border-2 border-hakka-dark overflow-hidden font-mono text-sm shadow-inner mt-4">
      <div className="flex justify-between items-center px-4 py-2 bg-black/20 border-b border-white/10">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <button onClick={handleCopy} className="text-xs hover:text-white flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
          <Copy size={12} /> COPY
        </button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
};

// --- LAYOUT ---
export const Container: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`max-w-7xl mx-auto px-4 md:px-8 ${className}`}>{children}</div>
);

export const Grid: React.FC<{ children: ReactNode; cols?: number; gap?: number; className?: string }> = ({ children, cols = 3, gap = 6, className = '' }) => (
  <div className={`grid grid-cols-1 md:grid-cols-${cols} gap-${gap} ${className}`}>{children}</div>
);

export const Box: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white border-2 border-hakka-dark p-6 ${className}`}>{children}</div>
);