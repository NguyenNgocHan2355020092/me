# Little Gem

React + Vite + TypeScript + Motion for React implementation of the Little Gem
Figma prototype. Start with `npm ci`, then `npm run dev`.

## Source and scope

- 23 UI frames: six screens and 17 transition states, each with its original ID.
- 27 original `NAVIGATE` edges; 10 clicks and 17 After Delay triggers.
- Every recorded transition is `SMART_ANIMATE`. Original durations and easing
  enums are retained verbatim in `src/design/transitions.json`.
- Original SVG assets are local files in `public/assets/figma`. Bona Nova SC and
  Montserrat are self-hosted under `public/assets/fonts` with their licenses.
- Palette, webname/reference graphics, and Interactive Login Flow are not pages.
- No full-frame screenshot appears in the application. Layout, text, inputs,
  buttons, clipping and animation are actual DOM elements.

## Architecture

`PrototypeController` owns navigation and timing. A transition updates a visual
target and locks further clicks. Motion animates the persistent paper, rollers,
divider and six content groups. Only after every animation finishes does the
controller commit the destination and start its After Delay timer. Generation
tokens prevent canceled animations and stale timers from advancing a new flow.

Login, Register and Recovery are independent page components. Form state lives
above the animated scene, so text values, password visibility and Remember me
survive navigation. Hidden or transitioning groups are inert. Icon state changes
are instant, matching `transition:null` in the audited CHANGE_TO reactions.

Stable screens await clicks, as in Figma. There is no invented autoplay at a
screen that has no After Delay reaction. The login/register and recovery-return
cycles can repeat indefinitely without reloading the application.

## Review and testing

```sh
npm test
npm run build
```

`?frame=48:3203&review=1` opens and freezes a specific frame for screenshot
comparison. Omit `review=1` to run its recorded After Delay transitions. Native
design size is 1728 x 1117. Smaller viewports scale the whole artboard uniformly;
the original design coordinates and aspect ratio remain unchanged.

Browser Back/Forward restores the visited frame without remounting form state.
Click navigation pushes an entry; automatic intermediate states replace the
entry. This browser-history behavior is an application adaptation, not an
invented Figma BACK interaction.

## Explicit fidelity limits

- No Dissolve, Move In or Slide In edge was found in the source data. They are
  **not added to the original flow**. `directionalEndpoints` provides reusable
  endpoint adapters, but they are not connected to the current scene renderer
  or presented as visually verified Figma transitions. A complete future effect
  needs its original type, direction, duration, easing and layer matching data.
- Smart Animate uses exact frame geometry, content opacity, clipping and easing
  enums. Figma does not expose native per-layer keyframe tracks here. Deep hidden
  layer matching within repeated `resetpass` groups is approximated by stable
  semantic groups; the visible paper/rollers and opacity states come from Figma.
- The standard cubic-bezier equivalents of EASE_OUT and EASE_IN_AND_OUT are used.
- `prefers-reduced-motion` makes movement instant but preserves After Delay.
- Input fields are usable local controls. Continue does not add validation that
  was absent in the prototype. Log in, Sign up CTA and social icons have no
  invented navigation or real authentication service.
- The original text `Create yournew password` is preserved, including the typo.

See `docs/prototype-implementation.md` for the mapping and QA record. The prior
raw source inventory and variant/empty reaction data remain available in docs
and src/design for inspection.
