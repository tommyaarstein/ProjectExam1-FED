export function setupPasswordToggles() {
  const toggleButtons = document.querySelectorAll("[data-password-toggle]");

  toggleButtons.forEach((button) => {
    const inputId = button.dataset.passwordToggle;
    const passwordInput = document.querySelector(`#${inputId}`);
    const icon = button.querySelector("img");

    if (!passwordInput || !icon) {
      return;
    }

    button.addEventListener("click", () => {
      const passwordIsHidden = passwordInput.type === "password";

      passwordInput.type = passwordIsHidden ? "text" : "password";
      icon.src = passwordIsHidden
        ? button.dataset.hideIcon
        : button.dataset.showIcon;

      button.setAttribute("aria-pressed", String(passwordIsHidden));
      button.setAttribute(
        "aria-label",
        passwordIsHidden ? "Hide password" : "Show password",
      );
    });
  });
}
