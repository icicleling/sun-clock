import { OrthographicCamera } from "three";

const cameraFrustumSize = 9.5;
function createCamera() {
  const ratio = window.innerWidth / window.innerHeight;
  const camera = new OrthographicCamera(
    -cameraFrustumSize * ratio,
    cameraFrustumSize * ratio,
    cameraFrustumSize,
    -cameraFrustumSize,
    1,
    100
  );
  camera.position.set(6, 8, 30);

  return camera;
}

export { createCamera, cameraFrustumSize };
