import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const dotX    = useMotionValue(-100);
  const dotY    = useMotionValue(-100);

  const springX = useSpring(cursorX, { damping: 25, stiffness: 300 });
  const springY = useSpring(cursorY, { damping: 25, stiffness: 300 });

  const hovering = useRef(false);

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;

    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      dotX.set(e.clientX);
      dotY.set(e.clientY);
    };

    const over = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      hovering.current = !!(el.closest('a, button, [role="button"], input, textarea, select, label'));
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
    };
  }, []);

  return (
    <>
      {/* Ring */}
      <motion.div
        style={{ x: springX, y: springY, translateX: '-50%', translateY: '-50%' }}
        className="fixed top-0 left-0 pointer-events-none z-[9998] mix-blend-difference"
      >
        <motion.div
          animate={{ scale: hovering.current ? 1.8 : 1 }}
          transition={{ type: 'spring', damping: 20 }}
          style={{
            width: 32, height: 32,
            borderRadius: '50%',
            border: '1.5px solid rgba(129,140,248,0.8)',
          }}
        />
      </motion.div>

      {/* Dot */}
      <motion.div
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%' }}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
      >
        <div style={{
          width: 5, height: 5,
          borderRadius: '50%',
          background: 'var(--accent)',
        }} />
      </motion.div>
    </>
  );
}
