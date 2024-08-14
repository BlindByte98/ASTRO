// config.js

// Default multipliers
const G_multiplier = 1;
const MIN_DISTANCE_MULTIPLIER = 1;
const INITIAL_VELOCITY_FACTOR_MULTIPLIER = 1;
const PLANET_RADIUS_MULTIPLIER = 1;
const ASTEROID_COUNT_MULTIPLIER = 1;
const NEBULA_PARTICLE_COUNT_MULTIPLIER = 1;

// Default colors
const STAR_COLORS = {
  mainSequence: 0xffff00,
  redGiant: 0xff4500,
  whiteDwarf: 0xffffff,
  blueGiant: 0x1e90ff,
  supergiant: 0xff6347,
};

const PLANET_COLORS = {
  terrestrial: 0x00ff00,
  gasGiant: 0x0000ff,
  iceGiant: 0x00ffff,
  dwarfPlanet: 0x888888,
};

const MOON_COLOR = 0x888888;
const ASTEROID_COLOR = 0x888888;
const NEBULA_COLOR = 0xaaaaaa;

// Boolean flags
const SHOW_RINGS = true;
const ENABLE_BLOOM = true;

// Export configuration
export {
  G_multiplier,
  MIN_DISTANCE_MULTIPLIER,
  INITIAL_VELOCITY_FACTOR_MULTIPLIER,
  PLANET_RADIUS_MULTIPLIER,
  ASTEROID_COUNT_MULTIPLIER,
  NEBULA_PARTICLE_COUNT_MULTIPLIER,
  STAR_COLORS,
  PLANET_COLORS,
  MOON_COLOR,
  ASTEROID_COLOR,
  NEBULA_COLOR,
  SHOW_RINGS,
  ENABLE_BLOOM,
};
