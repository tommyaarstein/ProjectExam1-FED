import { renderHeader } from "../components/header.js";
import { renderFooter } from "../components/footer.js";

const completedOrder = sessionStorage.getItem("completedOrder");

if (!completedOrder) {
  window.location.replace("../index.html");
} else {
  renderHeader("../");
  renderFooter("../");
}
