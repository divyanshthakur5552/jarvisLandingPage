import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  href?: string;
}

export const AnimatedButton = ({ children, onClick, className, href }: AnimatedButtonProps) => {
  const Component = href ? "a" : "button";
  
  return (
    <Component
      href={href}
      onClick={onClick}
      className={cn(
        "relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium transition-all bg-white rounded hover:bg-white group outline outline-1 w-full",
        className
      )}
    >
      <span className="absolute bottom-0 left-0 w-8 h-8 bg-purple-600 transform rotate-45 -translate-x-4 translate-y-4 transition-all duration-500 ease-out group-hover:w-full group-hover:h-full group-hover:rotate-0 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:rounded-none"></span>
      <span className="relative w-full text-center text-black transition-colors duration-300 ease-in-out group-hover:text-black flex items-center justify-center gap-2 z-10">
        {children}
      </span>
    </Component>
  );
};