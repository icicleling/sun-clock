function fullscreen() {
  const canvas = document.querySelector("#canvas");

  window.addEventListener("dblclick", () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else canvas.requestFullscreen();
  });
}

export { fullscreen };
