import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  error?: string;
  className?: string;
  multiline?: boolean;
  rows?: number;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement & HTMLTextAreaElement, InputProps>(
  ({ label, error, className, disabled, onFocus, onBlur, value, multiline, rows = 4, leftIcon, rightIcon, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value && value.toString().length > 0;

    const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setIsFocused(true);
      if (onFocus) onFocus(e as any);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setIsFocused(false);
      if (onBlur) onBlur(e as any);
    };

    return (
      <div className={cn("relative w-full group", className)}>
        <div
          className={cn(
            "relative flex items-center w-full rounded-2xl border bg-white transition-all duration-200",
            error
              ? "border-red-500 ring-4 ring-red-500/10"
              : isFocused
              ? "border-slate-800"
              : "border-slate-200 hover:border-slate-300",
            disabled && "bg-gray-100/50 border-gray-100 cursor-not-allowed",
            multiline ? "pt-5 pb-2 px-1 items-start" : "min-h-[56px] pt-3 pb-1 px-1"
          )}
        >
          {leftIcon && (
            <div className="pl-4 pr-1 text-gray-400 group-focus-within:text-slate-800 transition-colors">
              {leftIcon}
            </div>
          )}

          <div className="relative flex-1">
            {/* Floating Label */}
            <motion.label
              initial={false}
              animate={{
                top: (isFocused || hasValue) ? -23 : 2,
                left: (isFocused || hasValue) ? -4 : (leftIcon ? 1 : 4),
                scale: (isFocused || hasValue) ? 0.75 : 1,
              }}
              className={cn(
                "absolute transition-colors duration-200 pointer-events-none select-none font-bold origin-left",
                (isFocused || hasValue) ? "px-1.5 bg-white z-10" : "text-sm",
                error ? "text-red-500" : isFocused ? "text-slate-800" : "text-gray-400 font-medium",
                disabled && "text-gray-300"
              )}
            >
              {label}
            </motion.label>

            {multiline ? (
              <textarea
                ref={ref}
                disabled={disabled}
                rows={rows}
                className={cn(
                  "w-full px-4 text-sm font-medium bg-transparent border-none outline-none text-slate-900 placeholder-transparent resize-none",
                  disabled && "text-gray-400"
                )}
                onFocus={handleFocus}
                onBlur={handleBlur}
                value={value}
                {...props}
              />
            ) : (
              <input
                ref={ref}
                disabled={disabled}
                className={cn(
                  "w-full px-4 text-sm font-medium bg-transparent border-none outline-none text-slate-900 placeholder-transparent",
                  disabled && "text-gray-400"
                )}
                onFocus={handleFocus}
                onBlur={handleBlur}
                value={value}
                {...props}
              />
            )}
          </div>

          {rightIcon && (
            <div className="pr-4 pl-1 text-gray-400 group-focus-within:text-slate-800 transition-colors">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <p className="mt-1.5 ml-2 text-[10px] font-bold text-red-500 italic uppercase tracking-wider">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
