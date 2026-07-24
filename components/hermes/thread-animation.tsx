"use client"

import { useEffect, useRef, useState } from "react"

interface ThreadAnimationProps {
  isActive: boolean
  fromElement?: HTMLElement | null
  toElement?: HTMLElement | null
}

export function ThreadAnimation({
  isActive,
  fromElement,
  toElement,
}: ThreadAnimationProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [path, setPath] = useState<string>("")

  useEffect(() => {
    if (!isActive || !fromElement || !toElement || !svgRef.current) {
      setPath("")
      return
    }

    const calculatePath = () => {
      const fromRect = fromElement.getBoundingClientRect()
      const toRect = toElement.getBoundingClientRect()

      const fromX = fromRect.left + fromRect.width / 2
      const fromY = fromRect.top + fromRect.height / 2

      const toX = toRect.left + toRect.width / 2
      const toY = toRect.top + toRect.height / 2

      // Create a smooth cubic bezier curve
      const controlX = (fromX + toX) / 2
      const controlY = fromY + (toY - fromY) * 0.3

      return `M ${fromX} ${fromY} Q ${controlX} ${controlY} ${toX} ${toY}`
    }

    const pathData = calculatePath()
    setPath(pathData)

    const handleResize = () => {
      const newPath = calculatePath()
      setPath(newPath)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [isActive, fromElement, toElement])

  if (!isActive || !path) return null

  return (
    <svg
      ref={svgRef}
      className="pointer-events-none fixed inset-0 z-40 h-screen w-screen"
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id="threadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#c9a574" stopOpacity="0" />
          <stop offset="50%" stopColor="#c9a574" stopOpacity="1" />
          <stop offset="100%" stopColor="#c9a574" stopOpacity="0" />
        </linearGradient>
        <style>{`
          @keyframes threadDraw {
            from {
              stroke-dashoffset: 1000;
            }
            to {
              stroke-dashoffset: 0;
            }
          }
          .thread-line {
            stroke: url(#threadGradient);
            stroke-width: 1;
            fill: none;
            stroke-linecap: round;
            stroke-dasharray: 1000;
            animation: threadDraw 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          }
        `}</style>
      </defs>
      <path d={path} className="thread-line" />
    </svg>
  )
}
