export function renderFooter(pathPrefix = "./") {
    const footer = document.querySelector("#site-footer");

    if (!footer) {
        return;
    }

    footer.innerHTML = `
        <div class="site-footer__inner">
        <div class="site-footer__brand" id="about-ting">
            <a class="site-footer__logo" href="${pathPrefix}index.html">TING</a>
            <p class="site-footer__tagline">Everyday things worth finding.</p>
        </div>

        <nav class="site-footer__navigation" aria-label="Footer navigation">
            <a href="${pathPrefix}index.html">Home</a>
            <a href="${pathPrefix}pages/login.html">Account</a>
            <a href="${pathPrefix}pages/cart.html">Cart</a>
        </nav>

        <p class="site-footer__copyright">&copy; 2026 TING AS</p>
    </div>
  `;
}