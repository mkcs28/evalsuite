# Self-hosting Satoshi (optional)

By default the site loads Satoshi from Fontshare's CDN (see `src/app/layout.tsx`).
Satoshi is free to use under the Fontshare licence; check the licence before redistributing.

To self-host instead:

1. Download Satoshi from https://www.fontshare.com/fonts/satoshi and copy
   `Satoshi-Regular.woff2`, `Satoshi-Medium.woff2`, `Satoshi-Bold.woff2` and
   `Satoshi-Black.woff2` into this folder.
2. Remove the three Fontshare `<link>` tags from `src/app/layout.tsx`.
3. Add to `src/app/globals.css`:

```css
@font-face {
  font-family: "Satoshi";
  src: url("/fonts/Satoshi-Regular.woff2") format("woff2");
  font-weight: 400;
  font-display: swap;
}
@font-face {
  font-family: "Satoshi";
  src: url("/fonts/Satoshi-Medium.woff2") format("woff2");
  font-weight: 500;
  font-display: swap;
}
@font-face {
  font-family: "Satoshi";
  src: url("/fonts/Satoshi-Bold.woff2") format("woff2");
  font-weight: 700;
  font-display: swap;
}
@font-face {
  font-family: "Satoshi";
  src: url("/fonts/Satoshi-Black.woff2") format("woff2");
  font-weight: 900;
  font-display: swap;
}
```

Satoshi ships in weights 300, 400, 500, 700 and 900; there is no 600 or 800 cut.
