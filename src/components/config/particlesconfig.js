const particlesConfig = {
  background: {
    color: {
      value: "#0a0a23", // Dark blue shade for a more professional look
    },
  },
  fpsLimit: 60,
  interactivity: {
    detectsOn: "canvas",
    events: {
      onClick: {
        enable: false,
        mode: [],
      },
      onHover: {
        enable: true,
        mode: [],
      },
      resize: true,
    },
    modes: {
      bubble: {
        distance: 200,
        duration: 2,
        size: 6,
        opacity: 0.8,
      },
      push: {
        particles_nb: 4,
      },
      repulse: {
        distance: 200,
        duration: 0.4,
      },
    },
  },
  particles: {
    color: {
      value: ["#0078D7", "#5A0FC8", "#2D89EF"], // MLSC-inspired colors (Microsoft Blue & Purples)
    },
    links: {
      color: "#ffffff",
      distance: 120,
      enable: true,
      opacity: 0.6,
      width: 1.2,
    },
    collisions: {
      enable: false,
    },
    move: {
      direction: "none",
      enable: true,
      outMode: "bounce",
      random: false,
      speed: 1,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        value_area: 900,
      },
      value: 100,
    },
    opacity: {
      value: 0.7,
    },
    shape: {
      type: "circle", // Changed to circle for a modern and minimal effect
    },
    size: {
      random: true,
      value: 4,
    },
  },
  detectRetina: true,
};

export default particlesConfig;
