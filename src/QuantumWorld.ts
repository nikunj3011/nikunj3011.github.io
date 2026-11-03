import * as THREE from 'three';

export type QuantumMode = 'electron' | 'photon' | 'qubit' | 'entangled';
export interface QuantumSettings {
  phase: number;
  measurement: number;
  outcome: number;
}

/** Conceptual visualizations, not an atomic or quantum-hardware simulator. */
export function createQuantumWorld(
  world: THREE.Group,
  random: () => number,
  mobile: boolean,
  mode: QuantumMode,
  settings: { current: QuantumSettings },
) {
  const group = new THREE.Group();
  group.position.set(4.5, 0.8, -2);
  world.add(group);
  const ink = '#1b5963';
  const gold = '#bb7428';
  const normal = () =>
    Math.sqrt(-2 * Math.log(Math.max(random(), 0.00001))) * Math.cos(random() * Math.PI * 2);
  const sphere = new THREE.SphereGeometry(1, 40, 28);
  const core = new THREE.Mesh(
    sphere,
    new THREE.MeshStandardMaterial({ color: '#d59b3f', metalness: 0.45, roughness: 0.28 }),
  );
  core.scale.setScalar(0.3);
  group.add(core);
  const key = new THREE.DirectionalLight('#ffffff', 2.8);
  key.position.set(-4, 7, 9);
  world.add(key);
  world.add(new THREE.HemisphereLight('#ffffff', '#4b747a', 1.8));

  // A breathing translucent isosurface: wave amplitude has structure, not an orbit.
  const shell = new THREE.Mesh(
    new THREE.SphereGeometry(2.35, 80, 56),
    new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
      uniforms: {
        time: { value: 0 },
        phase: { value: 0 },
        mode: { value: mode === 'electron' ? 0 : mode === 'photon' ? 1 : 2 },
      },
      vertexShader: `varying vec3 n; varying vec3 p; uniform float time; uniform float phase; uniform float mode;
   void main(){vec3 q=position; float a=atan(q.y,q.x);float wave=sin(a*3.+time*.2+phase)*.13+cos(q.y*2.-time*.14)*.07;
   q*=1.+wave; if(mode<.5){q.x*=1.18; q.y*=.87;} n=normalize(normalMatrix*normal);p=q; gl_Position=projectionMatrix*modelViewMatrix*vec4(q,1.);}`,
      fragmentShader: `varying vec3 n;varying vec3 p;uniform float time;uniform float phase;
   void main(){float fresnel=pow(1.-abs(n.z),2.3);float light=dot(n,normalize(vec3(-.5,.8,1.)))*.5+.5;
   float wave=sin(length(p.xy)*9.-time*.4+phase)*.5+.5; vec3 c=mix(vec3(.40,.64,.68),vec3(.07,.23,.28),fresnel);
   c=mix(c,vec3(.96,.97,.97),light*.27);gl_FragColor=vec4(c,.17+fresnel*.57+wave*.045);}`,
    }),
  );
  group.add(shell);
  const outline = new THREE.Mesh(
    new THREE.SphereGeometry(2.36, 48, 32),
    new THREE.MeshBasicMaterial({
      color: '#28555f',
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.08,
    }),
  );
  group.add(outline);

  const count = mobile ? 650 : 1900;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const photonX: number[] = [];
  for (let i = 0; i < count; i++) {
    let x: number, y: number, z: number;
    if (mode === 'electron') {
      // Rejection sampling of a two-lobed, p-like density proportional to x² exp(-r²).
      do {
        x = normal() * 1.2;
      } while (random() > Math.min(1, (x * x) / 2));
      y = normal() * 0.65;
      z = normal() * 0.65;
    } else if (mode === 'photon') {
      let sample: number;
      do {
        sample = (random() - 0.5) * 5.5;
      } while (random() > Math.cos(sample * 4) ** 2 * Math.exp((-sample * sample) / 5));
      photonX.push(sample);
      x = sample;
      y = (random() - 0.5) * 3.8;
      z = -1.2 + normal() * 0.035;
    } else {
      const theta = random() * Math.PI * 2;
      const radius = 2.25;
      x = Math.cos(theta) * radius;
      y = Math.sin(theta) * radius;
      z = normal() * 0.04;
    }
    if (mode === 'entangled') {
      x = (i % 2 ? 1.55 : -1.55) + normal() * 0.38;
      y = normal() * 0.65;
      z = normal() * 0.38;
    }
    positions.set([x, y, z], i * 3);
    const color = new THREE.Color(i % 5 === 0 ? gold : ink);
    colors.set([color.r, color.g, color.b], i * 3);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const cloud = new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      size: mobile ? 0.043 : 0.032,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
    }),
  );
  group.add(cloud);

  const detection = new THREE.Mesh(
    new THREE.SphereGeometry(0.11, 20, 14),
    new THREE.MeshBasicMaterial({ color: '#c46c17', transparent: true, opacity: 0 }),
  );
  group.add(detection);
  const halo = new THREE.Mesh(
    new THREE.RingGeometry(0.19, 0.205, 48),
    new THREE.MeshBasicMaterial({
      color: '#c46c17',
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  group.add(halo);

  let field: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial> | undefined;
  let stateVector: THREE.ArrowHelper | undefined;
  if (mode === 'photon') {
    core.visible = false;
    field = new THREE.Mesh(
      new THREE.PlaneGeometry(7, 5),
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        uniforms: { time: { value: 0 } },
        vertexShader: `varying vec2 uvp;void main(){uvp=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
        fragmentShader: `varying vec2 uvp;uniform float time;void main(){vec2 p=(uvp-.5)*7.;float a=sin(length(p-vec2(-.55,1.5))*12.-time);float b=sin(length(p-vec2(.55,1.5))*12.-time);float intensity=pow((a+b)*.5,2.);float fade=1.-smoothstep(2.,4.,length(p));gl_FragColor=vec4(.10,.35,.42,intensity*fade*.36);}`,
      }),
    );
    field.position.z = -1.5;
    group.add(field);
  }
  if (mode === 'qubit') {
    core.scale.setScalar(0.12);
    for (const tilt of [0, Math.PI / 2]) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(2.25, 0.009, 4, 128),
        new THREE.MeshBasicMaterial({ color: ink, transparent: true, opacity: 0.48 }),
      );
      ring.rotation.x = tilt;
      group.add(ring);
    }
    stateVector = new THREE.ArrowHelper(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(),
      2.15,
      '#b96e1f',
      0.22,
      0.11,
    );
    group.add(stateVector);
  }
  const partner = detection.clone();
  partner.material = detection.material.clone();
  partner.visible = mode === 'entangled';
  group.add(partner);
  if (mode === 'entangled') {
    core.position.x = -1.55;
    shell.position.x = -1.55;
    shell.scale.setScalar(0.55);
    const secondCore = core.clone();
    secondCore.position.x = 1.55;
    group.add(secondCore);
    const secondShell = shell.clone();
    secondShell.position.x = 1.55;
    group.add(secondShell);
    outline.visible = false;
  }
  let seenMeasurement = settings.current.measurement;
  let flashAge = 5;
  return (time: number, delta: number) => {
    const { phase, measurement, outcome } = settings.current;
    shell.material.uniforms.time.value = time;
    shell.material.uniforms.phase.value = phase;
    shell.rotation.z = Math.sin(time * 0.09) * 0.15;
    outline.rotation.copy(shell.rotation);
    if (field) field.material.uniforms.time.value = time * 0.7;

    // Independent detection samples never imply a continuously known electron path.
    if (measurement !== seenMeasurement) {
      seenMeasurement = measurement;
      flashAge = 0;
      if (mode === 'entangled') {
        detection.position.set(-1.55, outcome === 0 ? 1.1 : -1.1, 0.6);
        partner.position.set(1.55, outcome === 0 ? 1.1 : -1.1, 0.6);
      } else if (mode === 'qubit') detection.position.set(0, outcome === 0 ? 2.25 : -2.25, 0);
      else {
        const index = Math.floor(random() * count);
        detection.position.fromArray(positions, index * 3);
        if (mode === 'photon') detection.position.x = photonX[index];
      }
      halo.position.copy(detection.position);
    }
    flashAge += delta;
    const flash = Math.max(0, 1 - flashAge / 1.8);
    detection.material.opacity = flash;
    partner.material.opacity = flash;
    halo.material.opacity = flash * 0.85;
    halo.scale.setScalar(1 + (1 - flash) * 3);
    cloud.material.opacity = 0.68 - flash * 0.38;
    if (stateVector) {
      const direction =
        flash > 0.2
          ? new THREE.Vector3(0, outcome === 0 ? 1 : -1, 0)
          : new THREE.Vector3(0, Math.cos(phase), -Math.sin(phase));
      stateVector.setDirection(direction.normalize());
    }
  };
}
