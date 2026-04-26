import bus from "../utils/bus";

export default function useFlashMessage() {
  function setFlashMessage(msg, type) {
    bus.emit("flash", {
      mensagem: msg,
      type: type,
    });
  }

  return { setFlashMessage };
}
