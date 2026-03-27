import React from 'react';

const Input = ({
    label,
    error,
    icon: Icon,
    className = '',
    containerClassName = '',
    ...props
}) => {
    return (
        <div className={`space-y-1 ${containerClassName}`}>
            {label && (
                <label className="block text-sm font-medium text-slate-700">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-slate-400" />
                    </div>
                )}
                <input
                    className={`
            block w-full rounded-xl border-slate-200 bg-slate-50 focus:border-indigo-500 focus:ring-indigo-500/20 sm:text-sm py-2.5 transition-all
            ${Icon ? 'pl-10' : 'pl-3'}
            ${error ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20' : ''}
            ${className}
          `}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-sm text-rose-600">{error}</p>
            )}
        </div>
    );
};

export default Input;
