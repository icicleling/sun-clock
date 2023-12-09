import { Color, Scene } from "three";

function createScene() {
  const scene = new Scene();
  const bgColor = new Color(0x262626);
  scene.background = bgColor;

  return scene;
}

export { createScene };
