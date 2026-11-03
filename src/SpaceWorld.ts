import * as THREE from 'three';

export function createSpaceWorld(world: THREE.Group, random: () => number, mobile: boolean) {
  const starsGeometry = new THREE.BufferGeometry();
  const count = mobile ? 500 : 1500;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++)
    positions.set([(random() - 0.5) * 45, (random() - 0.5) * 28, -5 - random() * 25], i * 3);
  starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const stars = new THREE.Points(
    starsGeometry,
    new THREE.PointsMaterial({
      color: '#d0dcff',
      size: 0.035,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
    }),
  );
  world.add(stars);
  const group = new THREE.Group();
  group.position.set(4.5, 0.8, -2);
  group.rotation.z = -0.35 - random() * 0.2;
  world.add(group);
  const planet = new THREE.Mesh(
    new THREE.SphereGeometry(2.1, 64, 48),
    new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 }, seed: { value: random() * 10 } },
      vertexShader: `varying vec3 p;varying vec3 n;void main(){p=position;n=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
      fragmentShader: `varying vec3 p;varying vec3 n;uniform float time;uniform float seed;
   void main(){float bands=sin(p.y*15.+sin(p.x*3.+seed+time*.03)*1.3+sin(p.z*4.));vec3 c=mix(vec3(.07,.14,.32),vec3(.35,.55,.85),bands*.5+.5);float light=max(dot(n,normalize(vec3(-.7,.5,1.))),0.);float rim=pow(1.-max(n.z,0.),3.);gl_FragColor=vec4(c*(.2+light*.8)+vec3(.14,.25,.5)*rim,1.);}`,
    }),
  );
  group.add(planet);
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(2.8, 3.8, 160),
    new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
      vertexShader: `varying vec3 p;void main(){p=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
      fragmentShader: `varying vec3 p;void main(){float r=length(p.xy);float line=sin(r*100.)*.5+.5;float edge=smoothstep(2.8,2.95,r)*(1.-smoothstep(3.65,3.8,r));gl_FragColor=vec4(mix(vec3(.35,.45,.7),vec3(.9,.82,.73),line),edge*(.25+line*.45));}`,
    }),
  );
  ring.rotation.x = 1.15;
  group.add(ring);
  const meteor = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3(1.2, 0.4, 0)]),
    new THREE.LineBasicMaterial({ color: '#a7caff', transparent: true, opacity: 0.6 }),
  );
  world.add(meteor);
  const phase = random() * 16;
  return (time: number) => {
    planet.material.uniforms.time.value = time;
    planet.rotation.y = time * 0.04;
    group.rotation.y = Math.sin(time * 0.06) * 0.1;
    stars.rotation.y = time * 0.003;
    const t = (time * 0.6 + phase) % 20;
    meteor.position.set(10 - t, 6 - t * 0.35, -5);
    meteor.material.opacity = t < 12 ? 0.55 : 0;
  };
}
