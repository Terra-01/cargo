import type { ShaderProgram } from './shader-types';
import { neatGradientProgram } from './shaders/neat-gradient';
import { rainbowWarpProgram } from './shaders/rainbow-warp';
import { etherProgram } from './shaders/ether';

// Registry — order is the picker order.
export const shaderPrograms: ShaderProgram[] = [
  neatGradientProgram,
  rainbowWarpProgram,
  etherProgram,
];

export function getProgramById(id: string): ShaderProgram | undefined {
  return shaderPrograms.find((p) => p.id === id);
}
