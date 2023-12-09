import {
  EquirectangularReflectionMapping,
  Event,
  MeshPhysicalMaterial,
  Object3D,
  PointLight,
} from "three";
import { createCube } from "./cube";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import modernBuildingsHDR from "../assets/modern_buildings_2_1k.hdr";
import { createDayNightDivider } from "./dayNightDivider";

type Cubes = Object3D<Event> & {
  tick(activeIndex: number, time: number): void;
};

function createCubeBoxs(dayPercentage: number) {
  const hdrEquirect = new RGBELoader().load(modernBuildingsHDR, () => {
    hdrEquirect.mapping = EquirectangularReflectionMapping;
  });

  const cubeMaterialConfig = {
    roughness: 0.2,
    transmission: 0.9,
    thickness: 1,
    envMap: hdrEquirect,
  };
  const materialDay = new MeshPhysicalMaterial({
    ...cubeMaterialConfig,
    emissive: 0x775303,
  });
  const materialNight = new MeshPhysicalMaterial({
    ...cubeMaterialConfig,
    emissive: 0x001999,
  });
  const materialActive = new MeshPhysicalMaterial({
    ...cubeMaterialConfig,
    emissive: 0x00bfff,
  });

  const cubeSize = 1;
  const cubeboxs: Object3D<Event>[] = [];
  const cubesTotal = 20;
  const cubeWrapperDistance = 1.45;
  for (let index = 0; index < cubesTotal; index++) {
    const cube = createCube(
      index * 5 > dayPercentage ? materialNight : materialDay
    );
    const cubeLight = new PointLight(0xffffff, 0.2);
    cube.add(cubeLight);

    const cubeWrapper = new Object3D();
    cubeWrapper.position.x =
      (index - cubesTotal / 2) * cubeWrapperDistance + cubeSize;
    cubeWrapper.add(cube);
    cubeboxs.push(cubeWrapper);
  }
  const cubesObject = new Object3D() as Cubes;
  cubeboxs.forEach((item) => {
    cubesObject.add(item);
  });

  // Divider
  const bar = createDayNightDivider(
    dayPercentage,
    cubesTotal,
    cubeWrapperDistance,
    cubeSize
  );
  cubesObject.add(bar);

  const activeCubeHeight = cubeSize * 1.8;
  const activeLight = new PointLight(0xffffff, 1);
  cubesObject.tick = (activeIndex: number, time: number) => {
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
        cube.material = i * 5 > dayPercentage ? materialNight : materialDay;
        cubebox.position.y = 0;
        cube.remove(activeLight);
      }
    });
  };

  return cubesObject as Cubes;
}

export { createCubeBoxs };
