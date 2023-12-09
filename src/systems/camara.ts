import { OrthographicCamera } from "three";

function createCamara() {
  const ratio = window.innerWidth / window.innerHeight;
  const n = 9.5;
  const camera = new OrthographicCamera(-n * ratio, n * ratio, n, -n, 1, 100);
  camera.position.set(6, 8, 30);

  return camera;
}

export { createCamara };
