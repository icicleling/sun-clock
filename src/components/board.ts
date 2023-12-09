import { BoxGeometry, Mesh, MeshPhongMaterial, TextureLoader } from "three";
import WoodTexture from "../assets/wood_texture.jpg";

function createBoard() {
  const texture = new TextureLoader().load(WoodTexture);
  const geometry = new BoxGeometry(30, 1, 6);
  const material = new MeshPhongMaterial({ map: texture });
  const board = new Mesh(geometry, material);
  board.position.set(0, -1, 0);

  return board;
}

export { createBoard };
