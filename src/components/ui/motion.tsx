"use client";

import { motion, type Variants, type HTMLMotionProps } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

export const staggerVariants: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08 } },
};

/* Scroll-triggered fade-up (once) */
export function FadeUp({
  children, className, delay = 0, ...props
}: HTMLMotionProps<"div"> & { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-72px" }}
      transition={{ duration: 0.55, ease: EASE, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/* Stagger wrapper — triggers children in sequence on scroll */
export function StaggerIn({
  children, className, ...props
}: HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-72px" }}
      variants={staggerVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/* Individual stagger child */
export function StaggerItem({
  children, className, ...props
}: HTMLMotionProps<"div">) {
  return (
    <motion.div variants={fadeUpVariants} className={className} {...props}>
      {children}
    </motion.div>
  );
}

/* Slide-in from bottom (for sheets / toasts) */
export function SlideUp({
  children, className, ...props
}: Omit<HTMLMotionProps<"div">, "initial" | "animate" | "exit" | "transition">) {
  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.38, ease: EASE }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/* Fade-in backdrop */
export function FadeIn({
  children, className, ...props
}: HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/* Cross-fade for swapped content (schedule tabs, etc) */
export function CrossFade({
  children, id, className,
}: { children: React.ReactNode; id: string | number; className?: string }) {
  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* Page-level step slide (checkout) */
export function StepSlide({
  children, stepKey, direction, className,
}: { children: React.ReactNode; stepKey: number; direction: number; className?: string }) {
  return (
    <motion.div
      key={stepKey}
      initial={{ opacity: 0, x: direction > 0 ? 48 : -48 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: direction > 0 ? -48 : 48 }}
      transition={{ duration: 0.35, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
