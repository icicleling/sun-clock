import { BoxGeometry, Mesh, MeshPhongMaterial } from "three";

function createDayNightDivider(
  dayPercentage: number,
  cubesTotal: number,
  cubeWrapperDistance: number,
  cubeSize: number
) {
  const divider = new Mesh(
    new BoxGeometry(0.1, 0.1, 4),
    new MeshPhongMaterial()
  );
  divider.position.y = -0.5;
  divider.position.x =
    (Math.floor(dayPercentage / 5) - cubesTotal / 2) * cubeWrapperDistance +
    cubeSize * 1.75;

  return divider;
}

export { createDayNightDivider };
