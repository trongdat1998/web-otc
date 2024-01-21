function create(msg, time = 2000) {
  let div = document.createElement("div");
  div.className = ["broker-tips-msg"].join(" ");
  div.innerHTML = msg;
  if (!window.document.querySelector("#broker-tips")) {
    createBox();
  }
  window.document.querySelector("#broker-tips").appendChild(div);
  setTimeout(() => {
    div.className = ["broker-tips-msg", "broker-tips-close"].join(" ");
    setTimeout(() => {
      div.className = ["broker-tips-msg", "broker-tips-close", "broker-tips-hide"].join(" ");
    }, 1000);
    setTimeout(() => {
      window.document.querySelector("#broker-tips").removeChild(div);
    }, 2000);
  }, time);
}

function createBox() {
  if (window.document.querySelector("#broker-tips")) return;
  let div = document.createElement("div");
  div.id = "broker-tips";
  div.className = "broker-tips color-primary-text";
  window.document.body.appendChild(div);
}
window.addEventListener("load", createBox, false);

function info(msg, t) {
  create(`<span class="Shadow2 bg-primary-main">${msg}</span>`, t);
}

function warn(msg, t) {
  create(`<span class="Shadow2 bg-secondary-main">${msg}</span>`, t);
}

function error(msg, t) {
  create(`<span class="Shadow2 bg-error-main">${msg}</span>`, t);
}

function success(msg, t) {
  create(`<span class="Shadow2 bg-success-main">${msg}</span>`, t);
}

export default {
  info,
  warn,
  error,
  success
};