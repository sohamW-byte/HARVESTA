'use client';

import { motion, AnimatePresence as FramerAnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export function AnimatePresence({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <FramerAnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 15 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </FramerAnimatePresence>
  );
}
