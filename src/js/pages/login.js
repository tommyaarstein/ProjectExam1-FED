import { renderHeader } from "../components/header.js";
import { renderFooter } from "../components/footer.js";
import { setupPasswordToggles } from "../components/passwordToggle.js";
import { loginUser } from "../api/auth.js";

renderHeader("../");
renderFooter("../");
setupPasswordToggles();

const loginForm = document.querySelector("#login-form");
const loginStatus = document.querySelector("#login-status");
const emailInput = document.querySelector("#login-email");
const submitButton = loginForm.querySelector("button[type='submit']");

function showStatus(message, type = "error") {
  loginStatus.textContent = message;
  loginStatus.dataset.type = type;
  loginStatus.hidden = false;
}

const urlParameters = new URLSearchParams(window.location.search);

if (urlParameters.get("registered") === "true") {
  const registeredEmail = sessionStorage.getItem("registeredEmail");

  if (registeredEmail) {
    emailInput.value = registeredEmail;
    sessionStorage.removeItem("registeredEmail");
  }

  showStatus("Account created. You can now log in.", "success");
}

loginForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  loginStatus.hidden = true;

  const formData = new FormData(loginForm);

  const email = formData.get("email").trim();
  const password = formData.get("password");

  submitButton.disabled = true;
  submitButton.textContent = "Logging in...";

  try {
    const user = await loginUser({
      email,
      password,
    });

    localStorage.setItem("accessToken", user.accessToken);
    localStorage.setItem("name", user.name);
    localStorage.setItem("email", user.email);

    window.location.href = "../index.html";
  } catch (error) {
    console.error(error);
    showStatus(error.message);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Log in";
  }
});
