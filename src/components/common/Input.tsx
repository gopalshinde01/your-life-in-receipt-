import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  id,
  label,
  error,
  helperText,
  required,
  className = '',
  ...props
}) => {
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;

  const ariaDescribedBy = [
    error ? errorId : null,
    helperText ? helperId : null,
  ].filter(Boolean).join(' ') || undefined;

  return (
    <div className="w-full flex flex-col gap-1.5">
      <div className="flex justify-between items-baseline">
        <label htmlFor={id} className="text-sm font-medium text-neutral-200">
          {label}
          {required && <span className="text-amber-500 ml-1" aria-hidden="true">*</span>}
        </label>
        {required && <span className="text-xs text-neutral-400 sr-only">(required)</span>}
      </div>

      <input
        id={id}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={ariaDescribedBy}
        aria-required={required}
        className={`w-full px-3.5 py-2.5 rounded-lg bg-neutral-800/80 border text-neutral-100 placeholder-neutral-500 transition-colors min-h-[44px]
          ${error 
            ? 'border-red-500 focus:border-red-400 focus-visible:ring-2 focus-visible:ring-red-500' 
            : 'border-neutral-700 hover:border-neutral-600 focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500'
          }
          focus:outline-none ${className}`}
        {...props}
      />

      {error ? (
        <p id={errorId} className="text-xs text-red-400 font-medium mt-0.5 flex items-center gap-1" role="alert">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-xs text-neutral-400 mt-0.5">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};
