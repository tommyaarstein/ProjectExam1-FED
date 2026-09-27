# AI Usage Log – TING Project Exam

## Tool used

ChatGPT / Codex by OpenAI

## About this log

This is my AI log for the Project Exam.

## Assignment brief and project scope

I used AI to:

- Go through the assignment brief and grading criteria.
- Check which pages and user stories were required.
- Discuss whether tablet styling were needed in addition to mobile and desktop.
- Check whether optional pages, such as About TING, were worth creating.
- Discuss which work still remained before the project could be submitted.

## Noroff API and authentication

I used AI to:

- Explain how the Noroff registration and login endpoints work.
- Confirm that registered accounts are stored by Noroff and not only in the
  local browser.
- Explain that the same Noroff account can be used across student projects
  using the same authentication API.
- Discuss what information should be stored after login.
- Explain how the access token, name and email could be stored in localStorage.
- Explain how long localStorage remains in the browser.
- Investigate why an access token existed while the product page still showed
  "Log in to purchase".
- Discuss error feedback for invalid login information.
- Discuss the API error shown when a profile name or email already exists.

## Login and registration forms

I used AI to:

- Review the login and registration HTML structure.
- Explain password visibility buttons.
- Discuss how the eye button changes the input between `password` and `text`.
- Review password confirmation logic.
- Discuss loading states and user-friendly error messages.
- Check that the authentication forms matched the Noroff API requirements.

## Product feed and carousel

I used AI to:

- Discuss product card sizing, spacing and the number of grid columns.
- Review the carousel layout and navigation.
- Discover during the final review that the carousel changed products without
  an animation.

## Specific product page

I used AI to:

- Discuss the placement of the image, tags, title, rating, share button, price,
  description and reviews.
- Explain CSS Grid areas and why elements using `grid-area` must be direct
  children of the grid container.
- Discuss how logged-in and logged-out purchase buttons should work.
- Review the rendering of ratings, reviews, tags and discounted prices.
- Review the dynamic HTML structure used for product information.
- Review missing product IDs, API errors and loading feedback.

## Web Share API

I used AI to:

- Explain what the Web Share API is.
- Discuss how `navigator.share()` opens the device or browser share menu.
- Discuss copying the product link as a fallback when the Share API is not
  available.
- Review success, cancellation and error feedback for the share action.

## CSS file organization

I used AI to:

- Review the original large stylesheet.
- Help divide the CSS into smaller files for shared styles and individual pages.
- Decide which rules belonged in variables, base, header, footer, home,
  authentication, product, cart, checkout, success and about files.
- Review the CSS imports after the files were separated.
- Find missing or misplaced home page styles after splitting the stylesheet.

## HTML and accessibility explanations

I asked AI to explain:

- `aria-live`
- `aria-atomic`
- `aria-current`
- Accessible labels
- Skip links
- `aside`
- `fieldset`
- `legend`
- `dl`
- `dt`
- `dd`
- Native browser validation
- Why semantic HTML should be used before adding ARIA
- How hidden loading, status and error messages are announced
- Why visible keyboard focus is important

AI also reviewed labels, input references, heading structure and navigation
landmarks throughout the project.

## Cart storage and cart logic

I used AI to:

- Discuss how the cart could be stored when the Noroff API does not provide a
  cart endpoint.
- Explain why product data could be requested again when the cart loads.
- Review increasing and decreasing quantity.
- Review removing one product.
- Review clearing the full cart.
- Calculate line totals, total price and savings.
- Explain that the cart is stored in one browser and is not connected to a
  specific Noroff account.
- Explain that other devices cannot see the cart, but different users sharing
  the same browser profile can access the same stored cart.


## Dynamic HTML and `innerHTML`

I used AI to:

- Review a larger block of markup used for dynamically rendered content.
- Review semantic structure, nesting, class names and accessibility.

Before moving the markup into a JavaScript template string, I wrote it in a
separate HTML file. This gave me better overview, syntax highlighting and made
it easier to check the structure before using it inside `innerHTML`.

## Checkout page

I used AI to:

- Review the delivery fields and payment method radio buttons.
- Calculate the checkout total.
- Explain how to pre-fill the email field from localStorage.

## Checkout CSS explanations

I asked AI to explain:

- Why mobile and desktop button classes can have shared base rules outside media
  queries.
- Why media queries should only contain the properties that change at a
  breakpoint.

## Searchable country field

I used AI to:

- Discuss how a user could type the beginning of a country name.
- Give me a list of countries.
- Validate that the entered country exists in the list.
- Explain why the appearance of the country suggestions is controlled by the
  browser and operating system.
- Discuss whether websites normally use APIs or local lists for country
  selectors.

## Postal code and city lookup

I asked AI:

- How websites automatically find a city from a postal code.
- Whether this normally requires an API.
- What the advantages and disadvantages would be.

I decided not to implement automatic postal code lookup because it were outside
the assignment brief and would introduce another external service for a small
convenience feature.

## Postal code and city lookup

I asked AI to create icons that could be used on the website that is not copyrighted by anyone and could be used freely.

## Responsive testing and visual review

I used AI to:

- Identify spacing, alignment and overflow problems.
- Check horizontal overflow at multiple viewport widths.
- Check the complete purchase flow in an isolated browser session.
- Verify the carousel, mobile menu and password visibility controls.
- Review loading, error and empty states.

## Code review and final audit

I used AI to:

- Run JavaScript syntax checks.
- Check local HTML paths.
- Check CSS imports and JavaScript imports.
- Check duplicate IDs.
- Check label references and ARIA references.
- Search for unfinished markers and debugging code.
- Check the browser console for errors.
- Compare the implemented functionality against the assignment user stories.
- Identify the missing carousel animation.