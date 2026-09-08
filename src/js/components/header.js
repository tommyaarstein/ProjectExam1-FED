export function renderHeader(pathPrefix = "./") {
    const header = document.querySelector("#site-header");

    if (!header) {
        return;
    }

    const currentPage = document.body.dataset.page;

    const homeActive = currentPage === "home"
        ? 'aria-current="page"'
        : "";

    header.innerHTML = `
        <div class="site-header__inner">
        <button class="site-header__menu-button" id="menu-button" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-navigation">
            <img src="${pathPrefix}assets/icons/24px/menu.png" alt="" width="24" height="24">
        </button>

        <a class="site-header__logo" href="${pathPrefix}index.html">TING</a>

        <nav class="site-header__desktop-nav" aria-label="Main navigation">
            <a href="${pathPrefix}index.html" ${homeActive}>Home</a>
            <a href="#about-ting">About TING</a>
        </nav>

        <div class="site-header__actions">
            <a class="site-header__icon-link" href="${pathPrefix}pages/login.html" aria-label="Account">
            <img src="${pathPrefix}assets/icons/24px/account.png" alt="" width="24" height="24">
            </a>

            <a class="site-header__icon-link" href="${pathPrefix}pages/cart.html" aria-label="Shopping cart">
            <img src="${pathPrefix}assets/icons/24px/shopping-bag.png" alt="" width="24" height="24">
            </a>
        </div>
        </div>

        <nav class="site-header__mobile-nav" id="mobile-navigation" aria-label="Mobile navigation" hidden>
        <a href="${pathPrefix}index.html" ${homeActive}>Home</a>
        <a href="#about-ting">About TING</a>
        </nav>
    `;

    const menuButton = header.querySelector("#menu-button");
    const mobileNavigation = header.querySelector("#mobile-navigation");

    menuButton.addEventListener("click", function () {
        const menuIsOpen = menuButton.getAttribute("aria-expanded") === "true";

        menuButton.setAttribute("aria-expanded", String(!menuIsOpen));
        menuButton.setAttribute("aria-label", menuIsOpen ? "Open menu" : "Close menu");

        mobileNavigation.hidden = menuIsOpen;
    });
}