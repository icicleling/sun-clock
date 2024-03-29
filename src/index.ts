import * as THREE from "three";
import { getSunCalc } from "./suncalc-utils";
import Stats from "three/examples/jsm/libs/stats.module";
import { createScene } from "./components/scene";
import { createCamera } from "./systems/camera";
import { createControls } from "./systems/controls";
import { createCubeBoxs } from "./components/cubeboxs";
import { createBoard } from "./components/board";
import { createComposer } from "./systems/composer";
import { createRenderer } from "./systems/renderer";
import { screenResize } from "./systems/screenResize";
import { fullscreen } from "./systems/fullscreen";

const stats = Stats();
document.body.appendChild(stats.dom);

const start = (position: GeolocationPosition) => {
  let suncalcValues = getSunCalc(position);

  const scene = createScene();
  const cubeboxs = createCubeBoxs(suncalcValues.dayPercentage);
  const board = createBoard();
  const light = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(cubeboxs, board, light);

  const camera = createCamera();

  const renderer = createRenderer();
  const controls = createControls(camera, renderer.domElement);
  const composer = createComposer(renderer, scene, camera);
  screenResize(camera, renderer, composer);
  fullscreen();

  let last = 0;
  let activeIndex: number | undefined = undefined;
  const render = (time: number) => {
    stats.update();
    if (!last || time - last >= 60 * 1000) {
      last = time;
      suncalcValues = getSunCalc(position);
      const currentPercentage =
        suncalcValues.currentPercentage >= 0
          ? suncalcValues.currentPercentage
          : 100 + suncalcValues.currentPercentage;
      activeIndex = Number((currentPercentage / 5).toFixed(0));
    }

    cubeboxs.tick(activeIndex, time);

    controls.update();
    composer.render();
    requestAnimationFrame(render);
  };
  requestAnimationFrame(render);
};

const loadingEl = document.querySelector("#loading") as HTMLElement;
navigator.geolocation.getCurrentPosition(
  (position) => {
    loadingEl.hidden = true;
    start(position);
  },
  () => {
    loadingEl.innerHTML =
      "Failed to get location. Please refresh and try again.";
  },
  { timeout: 15 * 1000, maximumAge: 60 * 60 * 1000, enableHighAccuracy: false }
);
