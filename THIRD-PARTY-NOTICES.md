# Third-party notices

Cargo is [MIT licensed](LICENSE) — **except for the files listed here.** Each one
is a port or adaptation of someone else's work and keeps its original licence.

If you are reusing part of Cargo, this is the file that matters. MIT covers the
application; it does not override anything below.

> **Note on the two Shadertoy shaders.** They are CC BY-NC-SA 3.0, which is not
> an OSI open-source licence: it forbids commercial use and requires derivatives
> to carry the same terms. Cargo as a whole is therefore *source-available* for
> commercial purposes rather than fully open source. If you need a cleanly
> MIT-only build, delete `src/lib/shaders/ether.ts` and
> `src/lib/shaders/rainbow-warp.ts` and their entries in the shader registry.

## Shaders

Source files live in `src/lib/shaders/`. Each carries its attribution in a header
comment, and the Shader Gradient Lab's code export emits the same attribution.

### Neat — `src/lib/shaders/neat-gradient.ts`, `src/lib/shaders/brush.ts`

| | |
|---|---|
| **Original** | Neat |
| **Author** | FireCMS |
| **Source** | https://github.com/FireCMSco/neat |
| **Licence** | MIT + Commons Clause |

`neat-gradient.ts` is a faithful port: the uniforms, noise, colour functions and
vertex/fragment mains are copied from Neat's `lib/src/NeatGradient.ts`, with the
mechanical changes needed to run on Cargo's three.js-free WebGL2 runtime
(GLSL ES 1.0 → ES 3.00, three.js auto-attributes removed, speed folded into
time). `brush.ts` ports Neat's additive sprite mouse-trail.

**On the Commons Clause.** MIT permits use, modification and distribution. The
Commons Clause removes the right to *sell* a product whose value derives
substantially from the software — which also means Neat is not open source in
the OSI sense. Cargo is free and non-commercial, so this is satisfied. If you
fork Cargo commercially, this file is your problem to solve.

### "Rainbow" — `src/lib/shaders/rainbow-warp.ts`

| | |
|---|---|
| **Original** | "Rainbow" |
| **Author** | Shadertoy contributor |
| **Source** | https://www.shadertoy.com/view/Ws3SRn |
| **Licence** | CC BY-NC-SA 3.0 |

The procedural `spectral_colour` wavelength→RGB table and the eight-iteration
domain-warp loop are a faithful port, with a standard Shadertoy → WebGL2 ES 3.00
translation and Cargo's shared curated tail (hue / saturation / brightness /
grain).

### "Ether" — `src/lib/shaders/ether.ts`

| | |
|---|---|
| **Original** | "Ether" |
| **Author** | nimitz |
| **Source** | https://www.shadertoy.com/view/MsjSW3 |
| **Licence** | CC BY-NC-SA 3.0 |

The `map()` / `mainImage()` body is verbatim, with the same Shadertoy → WebGL2
ES 3.00 translation. The inner `vec3 p` (which shadows the outer `vec2 p` in the
original) is renamed `rp` for ES 3.00 clarity; the maths is unchanged.

### Noise functions — inside `src/lib/shaders/neat-gradient.ts`

The simplex and classic Perlin noise implementations carried inside the Neat
port are the widely-redistributed Ashima Arts / Stefan Gustavson implementations
(MIT). They are kept verbatim inside the Neat port so its structure stays
byte-faithful to upstream.

## Fonts

No font binaries ship in the current tree or in the built site. All three faces
are fetched at build time by `next/font/google` (see `src/app/layout.tsx`) and
served from Cargo's own origin, so there is no third-party request at runtime.

Git history is the exception, and it is deliberate. The three General Sans
`.woff2` files described below were removed from the working tree in
`f027de2`, but that commit removes them from the tip, not from history — the
blobs remain reachable in earlier commits. That history is being kept rather
than rewritten, so this section describes the shipped artefact, not every
object in the repository.

| Face | Role | Designer | Licence |
|---|---|---|---|
| Manrope | Body and headings (`--font-sans`) | Mikhail Sharanda | SIL Open Font License 1.1 |
| Instrument Serif | The italic editorial accent (`--font-serif`) | Instrument | SIL Open Font License 1.1 |
| IBM Plex Mono | Workshop labels (`--font-mono`) | IBM | SIL Open Font License 1.1 |

**Why not General Sans.** Cargo previously self-hosted General Sans (Fontshare /
Indian Type Foundry) and committed the `.woff2` files. The ITF Free Font License
permits free personal and commercial *use*, but clause 02 forbids the fonts
being "distributed, duplicated, loaned, resold or licensed in any way …
including … uploading them in a public server". A public Git repository is
exactly that, so the files were removed from the shipped tree and the built
site. They remain in git history, as noted above. General Sans remains a fine
choice for a private project — download it from Fontshare directly.

The Moodboard Library still *recommends* General Sans as part of a type pairing.
Naming a font as a suggestion is not distributing it, and Cargo does not load it.

## Text animations

`src/lib/text-animations.ts`

99 of the 146 entries are derived from **Text Animation Patterns**
("100 Text Animations") by **川合卓也 (Takuya Kawai) / KAWAI DESIGN** —
https://kawai-text-animation.pages.dev/. Cargo's set follows that collection's
animation names and membership closely, and Cargo's
pick-several-and-copy-one-bundle interaction follows the same model.

Those entries previously carried a `kw-` prefix; they now share the project's
single `ta-` namespace. The four that would have collided with an existing
entry are suffixed `-chars`, which is what actually distinguishes them — the
derived versions animate per character, the originals animate the whole line.
The rename removes a marker, not the debt: the debt is recorded here.

That site carries no licence grant. Its terms of service govern use of the
website only, and the work is © 2026 KAWAI DESIGN. Cargo's use is therefore
**by credit, not by permission** — see the open item below.

Note on the underlying effects: many of these are long-standing, widely
republished CSS effects rather than anyone's original invention. A large share
of the names and motions (bounce, flash, pulse, rubberBand, shakeX, shakeY,
swing, tada, jello, wobble, zoomIn, the slideIn/flipIn families) come from
**Animate.css** by **Daniel Eden** — https://animate.style/. Cargo's values are
re-timed adaptations rather than copies: `ta-jello`, for example, carries
Animate.css's distinctive halving-skew progression but shifted one keyframe
earlier with opacity added. Animate.css v4 is under the **Hippocratic License
2.1**, which — like the Commons Clause above — is an ethical-source licence and
not OSI open source. Later names in the set (`slit-in-vertical`,
`tracking-expand`, `focus-in`, the `roll-in-*` family) follow the conventions of
**Animista** — https://animista.net/.

## Open item

**Permission for the text-animation set.** Kawai's collection is credited above
and on the About page, but credit is not a licence. Permission is being sought
from KAWAI DESIGN via the contact form at https://kawai-official.pages.dev/.
This item stays open until there is an answer, and should be updated with the
outcome either way.

The `kw-` prefix has been dropped, so Cargo no longer advertises the set as a
one-to-one derivation. Note that the catalogue still lists the derived entries
as a contiguous block ahead of the originals, which is the remaining structural
echo of the source ordering.

