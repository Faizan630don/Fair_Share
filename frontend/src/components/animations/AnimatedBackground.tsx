import { useEffect, useRef } from 'react';

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animFrame: number;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove);

    const tick = () => {
      currentX += (mouseX - currentX) * 0.04;
      currentY += (mouseY - currentY) * 0.04;
      if (canvasRef.current) {
        canvasRef.current.style.setProperty('--mx', `${currentX}px`);
        canvasRef.current.style.setProperty('--my', `${currentY}px`);
      }
      animFrame = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  return (
    <div ref={canvasRef} className="animated-bg" aria-hidden="true">
      {/* Moving gradient blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      {/* Grid overlay */}
      <div className="bg-grid" />
      {/* Mouse radial glow */}
      <div className="mouse-glow" />
    </div>
  );
}
