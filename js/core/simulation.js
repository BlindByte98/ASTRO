import * as THREE from "https://cdn.skypack.dev/three@0.129.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/postprocessing/UnrealBloomPass.js";

let scene, camera, renderer, controls, composer;
const celestialBodies = [];
const G = 6.6743e-11; // Gravitational constant
const MIN_DISTANCE_FROM_STAR = 1.5; // Minimum distance from the central star to prevent overlapping
const INITIAL_VELOCITY_FACTOR = 0.1; // Factor to adjust initial velocity

// Constants
const STAR_TYPES = [
  "mainSequence",
  "redGiant",
  "whiteDwarf",
  "blueGiant",
  "supergiant",
];
const PLANET_TYPES = ["terrestrial", "gasGiant", "iceGiant", "dwarfPlanet"];
const MAX_PLANETS = 10;
const MOON_COUNT_RANGE = [0, 5];
const ASTEROID_COUNT = 200;
const NEBULA_PARTICLE_COUNT = 4000;
const ORBITAL_PERIODS = [
  0.0005, 0.0004, 0.0003, 0.0002, 0.00015, 0.0001, 0.00008, 0.00005, 0.00003,
  0.00001,
];
const PLANET_RADIUS = [
  0.05, 0.07, 0.09, 0.11, 0.13, 0.15, 0.17, 0.19, 0.21, 0.23,
];

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
  let color, emissiveColor, intensity;
  switch (type) {
    case "redGiant":
      color = 0xff4500;
      emissiveColor = 0xff6347;
      intensity = 0.8;
      break;
    case "whiteDwarf":
      color = 0xffffff;
      emissiveColor = 0xffffff;
      intensity = 1.5;
      break;
    case "blueGiant":
      color = 0x1e90ff;
      emissiveColor = 0x1e90ff;
      intensity = 1.2;
      break;
    case "supergiant":
      color = 0xff6347;
      emissiveColor = 0xff4500;
      intensity = 0.6;
      break;
    default:
      color = 0xffff00;
      emissiveColor = 0xffff00;
      intensity = 1.5;
      break;
  }
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
    createMaterial(0xffffff, {
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
    createMaterial(0x888888, {
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
  return new THREE.Mesh(geometry, createMaterial(0x888888)).position.set(
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
    createMaterial(0xaaaaaa, { size: 0.2, transparent: true, opacity: 0.6 })
  );
}

// Add lighting to the scene
function addLighting() {
  scene.add(new THREE.AmbientLight(0x404040));
  const sunLight = new THREE.PointLight(0xffffff, 2.0, 100);
  sunLight.position.set(0, 0, 0);
  scene.add(sunLight);

  // Add realistic shadows
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

// Calculate orbital radius based on gravitational parameters
function calculateOrbitalRadius(index) {
  return MIN_DISTANCE_FROM_STAR + index * 1.5;
}

// Calculate orbital velocity
function calculateOrbitalVelocity(mass, radius) {
  return Math.sqrt((G * mass) / radius);
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

  // Post-processing setup
  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5,
    0.4,
    0.85
  );
  composer.addPass(bloomPass);

  // Create central star
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

  // Create other stars
  const otherStarCount = Math.floor(Math.random() * 2) + 1; // 1 or 2 additional stars
  for (let i = 0; i < otherStarCount; i++) {
    const starType = STAR_TYPES[Math.floor(Math.random() * STAR_TYPES.length)];
    const starMass = Math.random() * 1 + 0.5; // Mass of the star
    const star = createStar(starType, 0.5, starMass);
    let distance;
    do {
      distance = Math.random() * 10 + 5;
    } while (distance < MIN_DISTANCE_FROM_STAR); // Ensure distance is valid
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
      velocity: new THREE.Vector3(0, Math.sqrt((G * starMass) / distance), 0), // Circular orbit velocity
      angle: Math.random() * Math.PI * 2,
      moons: [],
    });
  }

  // Create planets
  for (let i = 0; i < MAX_PLANETS; i++) {
    const radius = PLANET_RADIUS[i % PLANET_RADIUS.length];
    const planetType =
      PLANET_TYPES[Math.floor(Math.random() * PLANET_TYPES.length)];
    const planet = createPlanet(planetType, radius);
    const orbitRadius = calculateOrbitalRadius(i);
    const velocity = calculateOrbitalVelocity(
      celestialBodies[0].mass,
      orbitRadius
    );
    if (orbitRadius >= MIN_DISTANCE_FROM_STAR) {
      planet.position.set(orbitRadius, 0, 0); // Initial position
      scene.add(planet);
      celestialBodies.push({
        mesh: planet,
        orbitRadius: orbitRadius,
        revolutionSpeed: ORBITAL_PERIODS[i % ORBITAL_PERIODS.length],
        velocity: new THREE.Vector3(0, velocity * INITIAL_VELOCITY_FACTOR, 0), // Adjusted initial velocity
        angle: Math.random() * Math.PI * 2,
        moons: [],
      });

      if (Math.random() > 0.5) {
        // Randomly add rings
        planet.add(
          createRing(radius * 1.5, radius * 1.5 + Math.random() * 0.1)
        );
      }

      // Add moons
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

      // Add dynamic rim indicators
      const [innerRim, outerRim] = createRimIndicators(orbitRadius);
      scene.add(innerRim);
      scene.add(outerRim);
    }
  }

  // Add asteroids
  for (let i = 0; i < ASTEROID_COUNT; i++) {
    scene.add(createAsteroid());
  }

  // Add nebula
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