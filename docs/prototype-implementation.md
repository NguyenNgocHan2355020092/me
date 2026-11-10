# Prototype mapping and validation

The implementation preserves the original 23 UI frame IDs and all 27 navigation
edges. The file's start point is Flow 1 / login (`1:4`). Frame geometry was refreshed
from Figma during implementation. Six high-fidelity design contexts and their
screenshots were retrieved for Login, Register and the four recovery screens.

## Animation and triggers

- Smart Animate: persistent DOM; interpolate paper left/top/width/height,
  paper background offset, left/right roller position, divider opacity and
  content group position/opacity using Motion for React.
- EASE_OUT: cubic-bezier(0, 0, 0.58, 1).
- EASE_IN_AND_OUT: cubic-bezier(0.42, 0, 0.58, 1).
- Original floating-point duration values are retained, not rounded for playback.
- After Delay starts only when the incoming animation settles.
- Clicks during animation cannot enqueue conflicting navigation.
- Browser history interrupts pending animation/timers with generation checks.
- Review mode freezes automatic advancement for each frame.
- Empty click reactions are intentionally inert.
- Eye and checkbox variants change immediately; form state stays mounted.

## Not claimed

The source contains no Dissolve, Move In or Slide In transition, and no native
Motion keyframes were returned for login. No extra timing, direction, autoplay,
validation rules or authentication outcomes have been invented. Generic effect
endpoint functions require explicit data and are not applied to this prototype.

The closest available reconstruction for unexposed deep Smart Animate matching
is interpolation of the measured paper/roller geometry plus crossfade of the
semantic content groups. This is labeled as an approximation rather than native
Figma keyframe equivalence. It matches the supplied recording's close/open/fade
sequence and the audited endpoint states.

## Automated checks

13 checks passed, covering every navigation edge, exact timing retention,
delayed scheduling, cancellation, six repeated register/login cycles, all 23
finite frame targets, six final content states, instant variants, review mode,
and refusal to invent missing effect duration/easing/direction.

Browser QA covers the forward recovery path, return-to-login path, registration
loop, persistent field state, password visibility, Remember me, Back/Forward,
and all 23 frozen frame views. Actual captures and image comparisons are recorded
in the workspace QA results; no screenshot is used as a runtime asset.
