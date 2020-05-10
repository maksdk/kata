// @ts-check

import * as THREE from 'three';

const width = window.innerWidth;
const height = window.innerHeight;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 5);
camera.position.set(0, 0, 2);

const scene = new THREE.Scene();



const boxW = 1;
const boxH = 1;
const boxD = 1;
const geometry = new THREE.BoxGeometry(boxW, boxH, boxD);

const cubes = [
  makeInstance(geometry, 0x44aa88,  0),
  makeInstance(geometry, 0x8844aa, -2),
  makeInstance(geometry, 0xaa8844,  2),
];

{
  const color = 0xFFFFFF;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light);
}

function makeInstance(geometry, color, x) {
  const material = new THREE.MeshPhongMaterial({ color });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = x;
  scene.add(mesh);
  return mesh;
}

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const pixelRatio = window.devicePixelRatio;
  const width  = canvas.clientWidth  * pixelRatio | 0;
  const height = canvas.clientHeight * pixelRatio | 0;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

function render(time) {
  time *= 0.001;

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  cubes.forEach((cube, index) => {
    const speed = 1 + index * 0.1;
    const rot = time * speed;
    cube.rotation.x = rot;
    cube.rotation.z = rot;
  });

  renderer.render(scene, camera);
  // requestAnimationFrame(render);
}

requestAnimationFrame(render);

window.cubes = cubes;
