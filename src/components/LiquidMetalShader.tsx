import React, { useEffect, useRef } from 'react';
import { ShaderMount, liquidMetalFragmentShader } from '@paper-design/shaders';

interface LiquidMetalShaderProps {
  className?: string;
  colorShift?: number;
  repetition?: number;
  softness?: number;
  distortion?: number;
  opacity?: number;
  angle?: number;
  scale?: number;
}

export const LiquidMetalShader: React.FC<LiquidMetalShaderProps> = ({
  className,
  colorShift = 0.3,
  repetition = 1.5,
  softness = 0.5,
  distortion = 0,
  opacity = 0.6,
  angle = 100,
  scale = 1.5
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shaderRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Cleanup previous instance if it exists
    if (shaderRef.current) {
      try {
        if (typeof shaderRef.current.dispose === 'function') shaderRef.current.dispose();
        else if (typeof shaderRef.current.destroy === 'function') shaderRef.current.destroy();
      } catch (e) {
        // Ignore cleanup errors
      }
    }

    try {
      shaderRef.current = new ShaderMount(
        containerRef.current,
        liquidMetalFragmentShader,
        {
          u_repetition: repetition,
          u_softness: softness,
          u_shiftRed: colorShift,
          u_shiftBlue: colorShift,
          u_distortion: distortion,
          u_contour: 0,
          u_angle: angle,
          u_scale: scale,
          u_shape: 1,
          u_offsetX: 0.1,
          u_offsetY: -0.1
        },
        undefined,
        opacity
      );
    } catch (err) {
      console.error('Failed to initialize Liquid Metal Shader:', err);
    }

    return () => {
      if (shaderRef.current) {
        try {
          if (typeof shaderRef.current.dispose === 'function') shaderRef.current.dispose();
          else if (typeof shaderRef.current.destroy === 'function') shaderRef.current.destroy();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, [repetition, softness, colorShift, distortion, opacity, angle, scale]);

  return <div ref={containerRef} className={className} style={{ borderRadius: 'inherit' }} />;
};
