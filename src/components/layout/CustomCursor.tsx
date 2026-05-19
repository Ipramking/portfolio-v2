import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const [hovered, setHovered] = useState(false);

  // Ring follows with spring lag
  const ringX = useSpring(mouseX, { damping: 28, stiffness: 220, mass: 0.5 });
  const ringY = useSpring(mouseY, { damping: 28, stiffness: 220, mass: 0.5 });

  useEffect(() => {
    // Skip on touch devices
    if (window.matchMedia('(hover: none)').matches) return;

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      setHovered(!!el.closest('a, button, [role="button"], input, textarea, select, label'));
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
    };
  }, []);

  return (
    <>
      {/* Outer ring — spring-lagged, centered via CSS transform */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: ringX,
          y: ringY,
          pointerEvents: 'none',
          zIndex: 9998,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{
            scale: hovered ? 1.7 : 1,
            borderColor: hovered
              ? 'rgba(192,132,252,0.9)'
              : 'rgba(129,140,248,0.7)',
          }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: '1.5px solid rgba(129,140,248,0.7)',
          }}
        />
      </motion.div>

      {/* Inner dot — instant, no lag, centered via CSS transform */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: mouseX,
          y: mouseY,
          pointerEvents: 'none',
          zIndex: 9999,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{ scale: hovered ? 0 : 1 }}
          transition={{ duration: 0.15 }}
          style={{
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: 'var(--accent)',
          }}
        />
      </motion.div>
    </>
  );
}
