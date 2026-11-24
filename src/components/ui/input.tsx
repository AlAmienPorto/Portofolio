import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

function Input({ ref, className, type, ...props }: InputProps & { ref?: React.RefObject<HTMLInputElement | null> }) {
  const radius = 150 // Slightly larger radius for a softer glow
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const gradientRef = React.useRef(null)
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 })

  useGSAP(() => {
    gsap.set(gradientRef.current, {
      background: `radial-gradient(${radius}px circle at ${mousePosition.x}px ${mousePosition.y}px, var(--accent), transparent 80%)`,
      opacity: 0,
    })
  }, { scope: containerRef })

  function handleMouseMove(e: React.MouseEvent) {
    if (!containerRef.current) return

    const { left, top } = containerRef.current.getBoundingClientRect()
    const x = e.clientX - left
    const y = e.clientY - top

    setMousePosition({ x, y })

    // Smoothly track mouse position without changing opacity
    gsap.to(gradientRef.current, {
      background: `radial-gradient(${radius}px circle at ${x}px ${y}px, var(--accent), transparent 80%)`,
      duration: 0.4,
      ease: "power2.out",
    })
  }

  function handleMouseEnter(e: React.MouseEvent) {
    if (!containerRef.current) return

    const { left, top } = containerRef.current.getBoundingClientRect()
    const x = e.clientX - left
    const y = e.clientY - top

    setMousePosition({ x, y })
    
    // Set position instantly, then smoothly fade in
    gsap.set(gradientRef.current, {
      background: `radial-gradient(${radius}px circle at ${x}px ${y}px, var(--accent), transparent 80%)`,
    })

    gsap.to(gradientRef.current, {
      opacity: 1,
      duration: 0.5,
      ease: "power2.out",
    })
  }

  function handleMouseLeave() {
    // Smoothly fade out
    gsap.to(gradientRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
    })
  }

  return (
    <div
      ref={containerRef}
      className="group/input rounded-lg p-[2px] transition duration-300 relative"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={gradientRef}
        className="absolute inset-0 rounded-lg"
      />

      <input
        type={type}
        className={cn(
          `relative z-10 flex h-12 w-full rounded-xl border-none px-4 py-3 text-sm font-medium transition duration-400 group-hover/input:shadow-none file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-[2px] focus-visible:ring-[var(--accent)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50`,
          className,
        )}
        ref={ref}
        {...props}
        style={{
          backgroundColor: "var(--surface)",
          color: "var(--fg)",
          ...(props.style || {}),
        }}
      />
    </div>
  )
}
Input.displayName = 'Input'

export { Input }
