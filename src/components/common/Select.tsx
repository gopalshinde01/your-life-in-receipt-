import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
}

export const Select: React.FC<SelectProps> = ({
  id,
  label,
  options,
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

      <div className="relative">
        <select
          id={id}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={ariaDescribedBy}
          aria-required={required}
          className={`w-full px-3.5 py-2.5 rounded-lg bg-neutral-800/80 border text-neutral-100 appearance-none transition-colors min-h-[44px]
            ${error 
              ? 'border-red-500 focus:border-red-400 focus-visible:ring-2 focus-visible:ring-red-500' 
              : 'border-neutral-700 hover:border-neutral-600 focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500'
            }
            focus:outline-none ${className}`}
          {...props}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value} className="bg-neutral-800 text-neutral-100">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-neutral-400" aria-hidden="true">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {error ? (
        <p id={errorId} className="text-xs text-red-400 font-medium mt-0.5 flex items-center gap-1" role="alert">
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
