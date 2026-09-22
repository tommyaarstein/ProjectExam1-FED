import { renderHeader } from "../components/header.js";
import { renderFooter } from "../components/footer.js";
import { setupPasswordToggles } from "../components/passwordToggle.js";
import { registerUser } from "../api/auth.js";

renderHeader("../");
renderFooter("../");
setupPasswordToggles();

const registerForm = document.querySelector("#register-form");
const registerStatus = document.querySelector("#register-status");
const confirmPasswordInput = document.querySelector(
  "#register-confirm-password",
);
const submitButton = registerForm.querySelector("button[type='submit']");

function showStatus(message) {
  registerStatus.textContent = message;
  registerStatus.hidden = false;
}

confirmPasswordInput.addEventListener("input", function () {
  confirmPasswordInput.setCustomValidity("");
});

registerForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  registerStatus.hidden = true;

  const formData = new FormData(registerForm);

  const name = formData.get("name").trim();
  const email = formData.get("email").trim();
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  if (password !== confirmPassword) {
    confirmPasswordInput.setCustomValidity("Passwords do not match.");
    confirmPasswordInput.reportValidity();
    showStatus("Passwords do not match.");
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Creating account...";

  try {
    await registerUser({
      name,
      email,
      password,
    });

    sessionStorage.setItem("registeredEmail", email);
    window.location.href = "./login.html?registered=true";
  } catch (error) {
    console.error(error);

    const errorMessage =
      error.message === "Profile already exists"
        ? "Name or email already exists."
        : error.message;

    showStatus(errorMessage);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Create account";
  }
});
