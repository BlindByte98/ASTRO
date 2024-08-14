// math.js

import { G_multiplier, MIN_DISTANCE_MULTIPLIER } from "./config.js";

// Gravitational constant
const G = 6.6743e-11 * G_multiplier;
const MIN_DISTANCE_FROM_STAR = 1.5 * MIN_DISTANCE_MULTIPLIER; // Minimum distance from the central star to prevent overlapping

// Calculate orbital radius based on index
function calculateOrbitalRadius(index) {
  return MIN_DISTANCE_FROM_STAR + index * 1.5 * MIN_DISTANCE_MULTIPLIER;
}

// Calculate orbital velocity
function calculateOrbitalVelocity(mass, radius) {
  return Math.sqrt((G * mass) / radius);
}

// Export constants and functions
export {
  G,
  MIN_DISTANCE_FROM_STAR,
  calculateOrbitalRadius,
  calculateOrbitalVelocity,
};
