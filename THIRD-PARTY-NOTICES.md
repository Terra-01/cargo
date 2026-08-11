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

*Pending — see the open item at the bottom of this file.*

## Text animations

*Pending — see the open item at the bottom of this file.*

## Open items

These must be resolved before the repository is made public:

1. **Fonts.** The self-hosted General Sans files were removed: Fontshare's ITF
   Free Font License (clause 02) forbids "uploading them in a public server",
   which a public repo is. Replacement is an SIL Open Font License face, which
   permits bundling and redistribution. This section gets its entry once the
   replacement lands.
2. **Text animations.** 99 of the 146 entries in `src/lib/text-animations.ts`
   carry a `kw-` prefix, and the About page credits "a collection of a hundred
   handmade animations from Kawai Text Animation". The source and its licence
   need confirming so the credit here can be accurate and the terms checked.
