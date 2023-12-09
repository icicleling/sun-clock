import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

function createControls(
  camera: THREE.OrthographicCamera,
  element: HTMLCanvasElement
) {
  const controls = new OrbitControls(camera, element);
  controls.update();

  return controls;
}

export { createControls };
