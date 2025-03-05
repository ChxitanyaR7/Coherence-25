import React, { useMemo, useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import particlesConfig from './config/particlesconfig';

const ParticlesComponent = () => {
    const options = useMemo(() => {
        return particlesConfig;
    }, []);

    const particlesInit = useCallback((engine) => {
        loadSlim(engine);
    }, []);

    return (
        <Particles
            init={particlesInit}
            options={options}
            style={{ position: 'fixed', width: '100%', height: '100%', zIndex: 0 }}
        />
    );
};

export default ParticlesComponent;