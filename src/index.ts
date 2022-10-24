import * as THREE from "three";
import WoodTexture from "./assets/wood_texture.jpg";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import modernBuildingsHDR from "./assets/modern_buildings_2_1k.hdr";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { getSunCalc } from "./suncalc-utils";
import Stats from "three/examples/jsm/libs/stats.module";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

const stats = Stats();
document.body.appendChild(stats.dom);

const hdrEquirect = new RGBELoader().load(modernBuildingsHDR, () => {
  hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;
});

const start = (position: GeolocationPosition) => {
  let suncalcValues = getSunCalc(position);

  const canvas = document.querySelector("#canvas");
  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  // Camera
  const ratio = window.innerWidth / window.innerHeight;
  const n = 9.5;
  const camera = new THREE.OrthographicCamera(
    -n * ratio,
    n * ratio,
    n,
    -n,
    1,
    100
  );
  camera.position.set(6, 8, 30);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.update();

  // Scene
  const scene = new THREE.Scene();
  const bgColor = new THREE.Color(0x262626);
  scene.background = bgColor;
  const light = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(light);

  // Cubes
  const cubeMaterialConfig = {
    roughness: 0.2,
    transmission: 0.9,
    thickness: 1,
    envMap: hdrEquirect,
  };

  const materialDay = new THREE.MeshPhysicalMaterial({
    ...cubeMaterialConfig,
    emissive: 0x775303,
  });
  const materialNight = new THREE.MeshPhysicalMaterial({
    ...cubeMaterialConfig,
    emissive: 0x001999,
  });
  const materialActive = new THREE.MeshPhysicalMaterial({
    ...cubeMaterialConfig,
    emissive: 0x00bfff,
  });

  const cubeSize = 1;
  const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
  const cubeboxs: THREE.Object3D<THREE.Event>[] = [];
  const cubesTotal = 20;
  const cubeWrapperDistance = 1.45;
  for (let index = 0; index < cubesTotal; index++) {
    const cube = new THREE.Mesh(
      cubeGeometry,
      index * 5 > suncalcValues.dayPercentage ? materialNight : materialDay
    );
    const cubeLight = new THREE.PointLight(0xffffff, 0.2);
    cube.add(cubeLight);
    cube.name = "cube";

    const cubeWrapper = new THREE.Object3D();
    cubeWrapper.position.x =
      (index - cubesTotal / 2) * cubeWrapperDistance + cubeSize;
    cubeWrapper.add(cube);
    cubeboxs.push(cubeWrapper);
  }
  const cubesObject = new THREE.Object3D();
  cubeboxs.forEach((item) => {
    cubesObject.add(item);
  });

  // Bar
  const bar = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.1, 4),
    new THREE.MeshPhongMaterial()
  );
  bar.position.y = -0.5;
  bar.position.x =
    (Math.floor(suncalcValues.dayPercentage / 5) - cubesTotal / 2) *
      cubeWrapperDistance +
    cubeSize * 1.75;
  cubesObject.add(bar);

  scene.add(cubesObject);

  // Board
  const boardTexture = new THREE.TextureLoader().load(WoodTexture);
  const boardGeometry = new THREE.BoxGeometry(30, 1, 6);
  const boardMaterial = new THREE.MeshPhongMaterial({ map: boardTexture });
  const boardMesh = new THREE.Mesh(boardGeometry, boardMaterial);
  boardMesh.position.set(0, -1, 0);
  scene.add(boardMesh);

  // Post processing
  const renderScene = new RenderPass(scene, camera);
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(canvas.clientWidth, canvas.clientHeight),
    0.15,
    0,
    0
  );
  const composer = new EffectComposer(renderer);
  composer.addPass(renderScene);
  composer.addPass(bloomPass);

  // Render
  const activeCubeHeight = cubeSize * 1.8;
  const activeLight = new THREE.PointLight(0xffffff, 1);
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

    cubeboxs.forEach((cubebox, i) => {
      const cube = cubebox.getObjectByName("cube") as THREE.Mesh<
        THREE.BoxGeometry,
        THREE.MeshPhysicalMaterial
      >;
      if (activeIndex === i) {
        if (cubebox.position.y < activeCubeHeight) {
          cubebox.position.y += 0.01;
        } else {
          cubebox.position.y = activeCubeHeight;
          cubebox.rotation.y = time * 0.001;
          cube.material = materialActive;
          cube.rotation.x = -54.7 * (Math.PI / 180);
          cube.rotation.y = 45 * (Math.PI / 180);
          cube.add(activeLight);
        }
        return;
      }
      if (cube.material !== materialActive) return;
      if (cubebox.position.y > 0) {
        cubebox.position.y -= 0.01;
        cubebox.rotation.y = 0;
        cube.rotation.x = 0;
        cube.rotation.y = 0;
      } else {
        cube.material =
          i * 5 > suncalcValues.dayPercentage ? materialNight : materialDay;
        cubebox.position.y = 0;
        cube.remove(activeLight);
      }
    });

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
