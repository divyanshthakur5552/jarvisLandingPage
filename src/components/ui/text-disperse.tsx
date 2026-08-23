'use client';

import { useState, useEffect, useRef } from 'react';
import type { JSX, ComponentProps } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Transform {
  x: number;
  y: number;
  rotationZ: number;
}

const transforms: Transform[] = [
  { x: -0.8, y: -0.6, rotationZ: -29 },
  { x: -0.4, y: -0.5, rotationZ: -15 },
  { x: 0.6, y: 0.4, rotationZ: 25 },
  { x: 0.8, y: -0.3, rotationZ: -20 },
  { x: -0.1, y: 0.55, rotationZ: 3 },
  { x: 0, y: -0.1, rotationZ: 9 },
  { x: 0, y: 0.15, rotationZ: -12 },
  { x: 0, y: 0.15, rotationZ: -17 },
  { x: 0, y: -0.65, rotationZ: 9 },
  { x: 0.1, y: 0.4, rotationZ: 12 },
  { x: 0, y: -0.15, rotationZ: -9 },
  { x: 0.2, y: 0.15, rotationZ: 12 },
  { x: 0.8, y: 0.6, rotationZ: 20 },
];

type TextDisperseProps = ComponentProps<'div'> & {
  /** children should be string (max 13 chars) */
  children: string;
  onHover?: (isActive: boolean) => void;
};

export function TextDisperse({
  children,
  onHover,
  className,
  ...props
}: Omit<TextDisperseProps, 'onMouseEnter' | 'onMouseLeave'>) {
  const [isAnimated, setIsAnimated] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '200px 0px 0px 0px' // Trigger 200px before the element enters viewport
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const splitWord = (word: string) => {
    let chars: JSX.Element[] = [];
    word.split('').forEach((char, i) => {
      chars.push(
        <motion.span
          custom={i}
          variants={{
            initial: (i: number) => ({
              x: transforms[i].x + 'em',
              y: transforms[i].y + 'em',
              rotateZ: transforms[i].rotationZ,
              transition: { duration: 0 },
              zIndex: 1,
            }),
            inView: {
              x: 0,
              y: 0,
              rotateZ: 0,
              transition: { duration: 0.75, ease: [0.33, 1, 0.68, 1], delay: i * 0.1 },
              zIndex: 0,
            },
            hover: (i: number) => ({
              x: transforms[i].x + 'em',
              y: transforms[i].y + 'em',
              rotateZ: transforms[i].rotationZ,
              transition: { duration: 0.75, ease: [0.33, 1, 0.68, 1] },
              zIndex: 1,
            }),
            normal: {
              x: 0,
              y: 0,
              rotateZ: 0,
              transition: { duration: 0.75, ease: [0.33, 1, 0.68, 1] },
              zIndex: 0,
            },
          }}
          initial="initial"
          animate={
            !isInView 
              ? "initial" 
              : isAnimated 
                ? "hover" 
                : "normal"
          }
          key={char + i}
        >
          {char}
        </motion.span>,
      );
    });
    return chars;
  };

  const manageMouseEnter = () => {
    onHover?.(true);
    setIsAnimated(true);
  };

  const manageMouseLeave = () => {
    onHover?.(false);
    setIsAnimated(false);
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex cursor-pointer justify-between text-[6vw] data-[index='4']:inline-flex data-[index='5']:right-[-40px] data-[index='5']:inline-flex",
        className,
      )}
      onMouseEnter={manageMouseEnter}
      onMouseLeave={manageMouseLeave}
      {...props}
    >
      {splitWord(children)}
    </div>
  );
}