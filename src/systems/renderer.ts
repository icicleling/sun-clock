import { WebGLRenderer } from "three";

function createRenderer() {
  const canvas = document.querySelector("#canvas");

  const renderer = new WebGLRenderer({ canvas });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  return renderer;
}

export { createRenderer };
