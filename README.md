# ASTRO

---

## 🌟 Overview

ASTRO is a cutting-edge 3D procedural star system simulation that offers a realistic and immersive exploration of celestial mechanics. Developed using [Three.js](https://threejs.org/), ASTRO combines high-fidelity visuals with detailed physics and astrophysical modeling to create a scientifically accurate simulation of star systems.

![ax](https://github.com/user-attachments/assets/bab92f5d-ce84-4a7e-9a58-efdc3c963384)

---

## 📑 Table of Contents

1. [🚀 Live Demo](#-live-demo)
2. [📝 Changelog](#-changelog)
3. [✨ Features](#-features)
    - [Realistic Simulation](#realistic-simulation)
    - [Detailed Physical Properties](#detailed-physical-properties)
    - [Immersive Visuals](#immersive-visuals)
    - [Accurate Center of Mass](#accurate-center-of-mass)
    - [Supported Objects](#supported-objects)
4. [🚀 Installation](#-installation)
5. [📖 Usage](#-usage)
6. [⚙️ Configuration](#-configuration)
7. [🤝 Contributing](#-contributing)
8. [📝 License](#-license)
9. [🙏 Acknowledgments](#-acknowledgments)
10. [📬 Contact](#-contact)

---

## 🚀 Live Demo

Experience the simulation in action by visiting the [Live Demo](https://blindbyte98.github.io/ASTRO/). The project and demo were tested and developed on a semi-modern Windows desktop PC using the Google Chrome browser.

---

## 📝 Changelog

Check out the [Changelog](https://github.com/BlindByte98/ASTRO/blob/main/CHANGELOG.md) for updates.

---

## ✨ Features

### Realistic Simulation

- **Celestial Bodies**: Models a range of star types and planetary systems with scientifically accurate properties.
- **Star Systems**: Simulates single and multi-star systems with realistic mass distributions. Stars are dynamically positioned based on their mass and gravitational influence.
- **Planets and Moons**: Generates planets and moons with realistic sizes, orbits, and rotational properties. Each object’s velocity and position are calculated to ensure stable, physically accurate interactions.
- **Orbital Mechanics**: Uses Newtonian gravity and elliptical orbits to model planetary and moon trajectories. Advanced orbital dynamics include accurate velocities and escape velocities to prevent unrealistic spiraling.
- **Asteroids and Nebulae**: Incorporates asteroid fields and nebulae with procedurally generated particles for added realism.
- **Dynamic Rings**: Supports the creation of ring systems around planets with realistic textures and dynamic indicators.

![binary](https://github.com/user-attachments/assets/3b86d9a1-54a6-46e5-9aee-583ab5f1387c)

### Detailed Physical Properties

- **Mass and Gravity**: Celestial bodies are assigned realistic masses and gravitational constants, affecting their interactions and orbital behavior.
- **Size and Scale**: Objects are scaled based on real astronomical measurements, ensuring accurate relative sizes and distances.
- **Velocity and Acceleration**: Implements realistic velocities for objects, preventing issues like spiraling into the central star. Velocity calculations account for gravitational forces and initial placements.
- **Spin and Rotation**: Incorporates dynamic spin rates and rotational properties for stars, planets, and moons, based on astrophysical data.

![Star](https://github.com/user-attachments/assets/e89861b2-ca49-488f-bb69-94c1d203a887)

### Immersive Visuals

- **Textures and Materials**: Applies detailed textures and realistic materials to celestial objects, enhancing visual fidelity.
- **Lighting**: Utilizes ambient and point lighting to simulate natural illumination, including effects like star brightness and planetary shadows.
- **Post-Processing Effects**: Includes bloom and other post-processing effects for a more cinematic and immersive experience.
- **Interactive Exploration**: Provides intuitive camera controls for an immersive user experience, allowing users to explore the simulation from various angles.

![Star2](https://github.com/user-attachments/assets/a58e340f-cfb0-46c7-a52f-fbea3d475961)

### Accurate Center of Mass

- **System Dynamics**: Calculates the center of mass for multi-star systems, ensuring that all bodies orbit realistically around this central point.

![star3](https://github.com/user-attachments/assets/7cd97547-dbeb-4292-a618-e31908c48e15)

### Supported Objects

ASTRO currently supports a variety of celestial objects, each with unique characteristics and behaviors:

- **Stars**:
  - **Main Sequence**: The most common type of star, including stars like our Sun.
  - **Red Giant**: Large, aging stars with expanded outer layers.
  - **White Dwarf**: Dense, compact remnants of medium-sized stars.
  - **Blue Giant**: Massive, hot stars with high luminosity.
  - **Supergiant**: Extremely large and luminous stars, often in the final stages of their evolution.

![Starx](https://github.com/user-attachments/assets/97fc1c02-3615-4be5-b600-0bfaee4a3440)

- **Planets**:
  - **Terrestrial Planets**: Rocky planets similar to Earth, with solid surfaces.
  - **Gas Giants**: Large planets with thick gaseous atmospheres, like Jupiter.
  - **Ice Giants**: Planets with icy compositions, such as Uranus and Neptune.
  - **Dwarf Planets**: Small planetary bodies that do not dominate their orbits, like Pluto.

![moon](https://github.com/user-attachments/assets/b7ef23a6-9976-491f-9b52-1efe91ac84fe)

- **Moons**:
  - **Rocky Moons**: Moons with solid surfaces, similar to Earth's Moon.
  - **Icy Moons**: Moons with significant ice coverage, like Europa.

- **Asteroids**:
  - **Asteroid Belts**: Collections of rocky bodies, varying in size, orbiting a star.

- **Nebulae**:
  - **Nebula Particles**: Clouds of gas and dust particles that add depth and realism to the star system.

- **Rings**:
  - **Planetary Rings**: Rings composed of dust, rock, and ice that orbit around planets.

---

## 🚀 Installation

To run ASTRO locally, follow these steps:

1. **Clone the Repository**:

    ```bash
    git clone https://github.com/BlindByte98/ASTRO
    ```

2. **Navigate to the Project Directory**:

    ```bash
    cd ASTRO
    ```

3. **Open the `index.html` File**:

    Open the `index.html` file in your web browser to view the simulation. Alternatively, serve it locally using a simple HTTP server.

    ```bash
    npx http-server
    ```

4. **Access the Simulation**:

    Open your browser and go to `http://localhost:8080` (or the port specified by your HTTP server).

---

## 📖 Usage

Explore the star system with interactive controls, observe celestial dynamics, and adjust simulation settings for a personalized experience.

---

## ⚙️ Configuration

Modify simulation parameters in the `index.html` file to adjust star types, planetary properties, and orbital mechanics.

---

## 🤝 Contributing

We welcome and value contributions to the **ASTRO** simulation. To ensure our project’s quality and consistency, please adhere to the following principles:

### Contribution Principles

As the original creator of **ASTRO**, I, BlindByte, value contributions that align with these core principles:

- **Scientific Accuracy:** Ensure all updates are based on established physics and astrophysics to maintain the simulation's scientific integrity.
- **Realism:** Enhance the authentic portrayal of celestial mechanics and astronomical phenomena for a true-to-life experience.
- **Immersiveness:** Enrich the simulation’s depth and beauty, creating a captivating representation of the universe.
- **Focus on Physics:** Prioritize accurate physical simulations, reflecting realistic dynamics and interactions among celestial bodies.

By adhering to these principles, you help make **ASTRO** a premier tool for both educational and research purposes. Thank you for your contributions!

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **[Three.js](https://threejs.org/)**: For providing the powerful 3D rendering library.
- **[OrbitControls](https://threejs.org/examples/#orbitcontrols)**: For interactive camera controls.

---

## 📬 Contact

This software was created by **BlindByte**. Connect with me:

- **Website**: [www.BlindByte.me](https://www.blindbyte.me)
- **Twitter / X**: [@BlindByte](https://twitter.com/BlindByte)

For questions or further information, feel free to reach out via the above links.

---
