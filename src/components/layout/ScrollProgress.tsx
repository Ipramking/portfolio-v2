import { useScroll, motion } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      style={{
        scaleX: scrollYProgress,
        transformOrigin: 'left',
        position: 'fixed',
        top: 0, left: 0, right: 0,
        height: 2,
        background: 'linear-gradient(90deg, var(--accent-dim), var(--accent2), var(--accent3))',
        zIndex: 9997,
      }}
    />
  );
}
