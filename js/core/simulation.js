// simulation.js

import {
  THREE,
  OrbitControls,
  EffectComposer,
  RenderPass,
  UnrealBloomPass,
} from "./dependencies.js";
import {
  G,
  MIN_DISTANCE_FROM_STAR,
  calculateOrbitalRadius,
  calculateOrbitalVelocity,
} from "./math.js";
import {
  INITIAL_VELOCITY_FACTOR_MULTIPLIER,
  PLANET_RADIUS_MULTIPLIER,
  ASTEROID_COUNT_MULTIPLIER,
  NEBULA_PARTICLE_COUNT_MULTIPLIER,
  MIN_DISTANCE_MULTIPLIER,
  STAR_COLORS,
  PLANET_COLORS,
  MOON_COLOR,
  ASTEROID_COLOR,
  NEBULA_COLOR,
  SHOW_RINGS,
  ENABLE_BLOOM,
} from "./config.js";

// Variables and constants
let scene, camera, renderer, controls, composer;
const celestialBodies = [];
const INITIAL_VELOCITY_FACTOR = 0.1 * INITIAL_VELOCITY_FACTOR_MULTIPLIER; // Adjusted initial velocity

const MAX_PLANETS = 10;
const MOON_COUNT_RANGE = [0, 5];
const ASTEROID_COUNT = 200 * ASTEROID_COUNT_MULTIPLIER;
const NEBULA_PARTICLE_COUNT = 4000 * NEBULA_PARTICLE_COUNT_MULTIPLIER;
const ORBITAL_PERIODS = [
  0.0005, 0.0004, 0.0003, 0.0002, 0.00015, 0.0001, 0.00008, 0.00005, 0.00003,
  0.00001,
];
const PLANET_RADIUS = [
  0.05, 0.07, 0.09, 0.11, 0.13, 0.15, 0.17, 0.19, 0.21, 0.23,
].map((radius) => radius * PLANET_RADIUS_MULTIPLIER);

// Create a material with optional parameters
function createMaterial(color, options = {}) {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness: options.roughness || 0.8,
    metalness: options.metalness || 0.3,
    ...options,
  });
}

// Create stars with realistic properties
function createStar(type, radius, mass) {
  const color = STAR_COLORS[type] || STAR_COLORS.mainSequence;
  const emissiveColor = color;
  const intensity = type === "mainSequence" ? 1.5 : 0.8;

  const geometry = new THREE.SphereGeometry(radius, 64, 64);
  return new THREE.Mesh(
    geometry,
    createMaterial(color, {
      emissive: emissiveColor,
      emissiveIntensity: intensity,
    })
  );
}

// Create planets with realistic properties
function createPlanet(type, radius) {
  const textureURL = `https://example.com/${type}_texture.jpg`; // Placeholder URL for different textures
  const geometry = new THREE.SphereGeometry(radius, 64, 64);
  const texture = new THREE.TextureLoader().load(textureURL);
  return new THREE.Mesh(
    geometry,
    createMaterial(PLANET_COLORS[type] || 0xffffff, {
      map: texture,
      bumpMap: texture,
      bumpScale: 0.05,
    })
  );
}

// Create moons with realistic properties
function createMoon(radius) {
  return new THREE.Mesh(
    new THREE.SphereGeometry(radius, 32, 32),
    createMaterial(MOON_COLOR, {
      bumpMap: new THREE.TextureLoader().load(
        "https://example.com/moon_texture.jpg"
      ),
      bumpScale: 0.02,
    })
  );
}

// Create rings with realistic properties
function createRing(innerRadius, outerRadius) {
  const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);
  return new THREE.Mesh(
    geometry,
    createMaterial(0xaaaaaa, {
      side: THREE.DoubleSide,
      opacity: 0.6,
      transparent: true,
    })
  ).rotateX(Math.PI / 2);
}

// Create asteroids with realistic properties
function createAsteroid() {
  const geometry = new THREE.IcosahedronGeometry(
    Math.random() * 0.03 + 0.01,
    1
  );
  return new THREE.Mesh(geometry, createMaterial(ASTEROID_COLOR)).position.set(
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 20
  );
}

// Create nebula with realistic properties
function createNebula() {
  const particles = new THREE.BufferGeometry();
  const positions = new Float32Array(NEBULA_PARTICLE_COUNT * 3);

  for (let i = 0; i < positions.length; i += 3) {
    positions[i] = (Math.random() - 0.5) * 30;
    positions[i + 1] = (Math.random() - 0.5) * 30;
    positions[i + 2] = (Math.random() - 0.5) * 30;
  }

  particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  return new THREE.Points(
    particles,
    createMaterial(NEBULA_COLOR, { size: 0.2, transparent: true, opacity: 0.6 })
  );
}

// Add lighting to the scene
function addLighting() {
  scene.add(new THREE.AmbientLight(0x404040));
  const sunLight = new THREE.PointLight(0xffffff, 2.0, 100);
  sunLight.position.set(0, 0, 0);
  scene.add(sunLight);

  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 500;
}

// Create rim indicators
function createRimIndicators(orbitRadius) {
  const innerRim = new THREE.Mesh(
    new THREE.RingGeometry(orbitRadius - 0.02, orbitRadius - 0.01, 64),
    new THREE.MeshBasicMaterial({
      color: 0xff0000,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
    })
  ).rotateX(Math.PI / 2);

  const outerRim = new THREE.Mesh(
    new THREE.RingGeometry(orbitRadius + 0.01, orbitRadius + 0.02, 64),
    new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
    })
  ).rotateX(Math.PI / 2);

  return [innerRim, outerRim];
}

// Initialize the scene
function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  if (ENABLE_BLOOM) {
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    );
    composer.addPass(bloomPass);
  }

  const centralStar = createStar("mainSequence", 2, 1.0);
  scene.add(centralStar);
  celestialBodies.push({
    mesh: centralStar,
    mass: 1.0,
    orbitRadius: 0,
    revolutionSpeed: 0,
    velocity: new THREE.Vector3(0, 0, 0),
    angle: 0,
    moons: [],
  });

  const otherStarCount = Math.floor(Math.random() * 2) + 1;
  for (let i = 0; i < otherStarCount; i++) {
    const starType =
      Object.keys(STAR_COLORS)[
        Math.floor(Math.random() * Object.keys(STAR_COLORS).length)
      ];
    const starMass = Math.random() * 1 + 0.5;
    const star = createStar(starType, 0.5, starMass);
    let distance;
    do {
      distance = Math.random() * 10 + 5;
    } while (distance < MIN_DISTANCE_FROM_STAR * MIN_DISTANCE_MULTIPLIER);
    star.position.set(
      Math.random() * 2 * distance - distance,
      0,
      Math.random() * 2 * distance - distance
    );
    scene.add(star);
    celestialBodies.push({
      mesh: star,
      mass: starMass,
      orbitRadius: distance,
      revolutionSpeed: Math.random() * 0.001 + 0.0005,
      velocity: new THREE.Vector3(0, Math.sqrt((G * starMass) / distance), 0),
      angle: Math.random() * Math.PI * 2,
      moons: [],
    });
  }

  for (let i = 0; i < MAX_PLANETS; i++) {
    const radius = PLANET_RADIUS[i % PLANET_RADIUS.length];
    const planetType =
      Object.keys(PLANET_COLORS)[
        Math.floor(Math.random() * Object.keys(PLANET_COLORS).length)
      ];
    const planet = createPlanet(planetType, radius);
    const orbitRadius = calculateOrbitalRadius(i);
    const velocity = calculateOrbitalVelocity(
      celestialBodies[0].mass,
      orbitRadius
    );
    if (orbitRadius >= MIN_DISTANCE_FROM_STAR * MIN_DISTANCE_MULTIPLIER) {
      planet.position.set(orbitRadius, 0, 0);
      scene.add(planet);
      celestialBodies.push({
        mesh: planet,
        orbitRadius: orbitRadius,
        revolutionSpeed: ORBITAL_PERIODS[i % ORBITAL_PERIODS.length],
        velocity: new THREE.Vector3(0, velocity * INITIAL_VELOCITY_FACTOR, 0),
        angle: Math.random() * Math.PI * 2,
        moons: [],
      });

      if (SHOW_RINGS && Math.random() > 0.5) {
        planet.add(
          createRing(radius * 1.5, radius * 1.5 + Math.random() * 0.1)
        );
      }

      const numMoons =
        Math.floor(
          Math.random() * (MOON_COUNT_RANGE[1] - MOON_COUNT_RANGE[0] + 1)
        ) + MOON_COUNT_RANGE[0];
      for (let j = 0; j < numMoons; j++) {
        const moon = createMoon(Math.random() * 0.03 + 0.01);
        const distance = Math.random() * 0.3 + 0.1;
        moon.position.set(
          distance * Math.cos(Math.random() * Math.PI * 2),
          0,
          distance * Math.sin(Math.random() * Math.PI * 2)
        );
        planet.add(moon);
        celestialBodies[i].moons.push({
          mesh: moon,
          distance: distance,
          speed: Math.random() * 0.003 + 0.001,
          angle: Math.random() * Math.PI * 2,
        });
      }

      const [innerRim, outerRim] = createRimIndicators(orbitRadius);
      scene.add(innerRim);
      scene.add(outerRim);
    }
  }

  for (let i = 0; i < ASTEROID_COUNT; i++) {
    scene.add(createAsteroid());
  }

  scene.add(createNebula());
  addLighting();

  controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 0.01;
  controls.maxDistance = 300;
  controls.enablePan = true;
  controls.enableZoom = true;

  camera.position.z = 20;
}

// Update positions based on time and velocities
function updatePlanetPositions(time) {
  celestialBodies.forEach(
    ({ mesh, orbitRadius, revolutionSpeed, angle, velocity, moons }) => {
      const orbitAngle = time * revolutionSpeed + angle;
      mesh.position.set(
        Math.cos(orbitAngle) * orbitRadius,
        0,
        Math.sin(orbitAngle) * orbitRadius
      );
      mesh.rotation.y += 0.001;

      moons.forEach(({ mesh: moon, distance, speed, angle }) => {
        const moonOrbitAngle = time * speed + angle;
        moon.position.set(
          Math.cos(moonOrbitAngle) * distance,
          0,
          Math.sin(moonOrbitAngle) * distance
        );
      });
    }
  );
}

function animate(time) {
  requestAnimationFrame(animate);
  updatePlanetPositions(time / 1000);
  controls.update();
  composer.render();
}

init();
animate();
