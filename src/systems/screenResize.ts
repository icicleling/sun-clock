import { OrthographicCamera, WebGLRenderer } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { cameraFrustumSize } from "./camera";

function screenResize(
  camera: OrthographicCamera,
  renderer: WebGLRenderer,
  composer: EffectComposer
) {
  window.addEventListener("resize", () => {
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    const ratio = sizes.width / sizes.height;

    camera.left = -cameraFrustumSize * ratio;
    camera.right = cameraFrustumSize * ratio;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    composer.setSize(sizes.width, sizes.height);
    composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
}

export { screenResize };
