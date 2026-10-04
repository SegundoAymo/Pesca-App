// Holds the waiting app update so the Home screen can offer it.
let apply = null;

export function setUpdate(fn) {
  apply = fn;
  document.dispatchEvent(new CustomEvent('kit:update'));
}

export function getUpdate() {
  return apply;
}
