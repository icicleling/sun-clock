import { BoxGeometry, Mesh, MeshPhysicalMaterial } from "three";

function createCube(meterial: MeshPhysicalMaterial) {
  const size = 1;
  const geometry = new BoxGeometry(size, size, size);
  const cube = new Mesh(geometry, meterial);
  cube.name = "cube";

  return cube;
}

export { createCube };
