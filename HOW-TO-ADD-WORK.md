# How to update your portfolio

Everything you'd normally edit lives in **one file: `js/data.js`**. No build step — save the file, refresh the browser.

## Add a photo

1. Export **two JPEGs** of the image:
   - Large (lightbox): longest side **1920px**, into `assets/img/lg/`
   - Medium (grid): longest side **960px**, into `assets/img/md/`
   - Use the **same lowercase-with-dashes filename** in both folders, e.g. `porsche-911-31.jpg`.

   On a Mac you can do both in Terminal from wherever the original is:

   ```
   sips -Z 1920 -s format jpeg -s formatOptions 72 "Original.jpg" --out site/assets/img/lg/porsche-911-31.jpg
   sips -Z 960  -s format jpeg -s formatOptions 70 "Original.jpg" --out site/assets/img/md/porsche-911-31.jpg
   ```

2. Open `js/data.js` and add a line to the `WORKS` array (order in the array = order on the page):

   ```js
   { slug: "porsche-911-31", title: "Porsche 911", cat: "automotive", w: 1920, h: 1280 },
   ```

   - `slug` — the filename without `.jpg`
   - `cat` — one of the keys in `CATEGORIES` (`automotive`, `people`, `places`)
   - `w` / `h` — pixel size of the **lg** file (prevents layout jumping while images load)

## Add a video

**Local file:**
1. Drop an H.264 `.mp4` into `assets/video/` (aim for under ~30MB; 1080p or 720p is plenty).
2. Add a poster frame JPEG next to it (a still from the video).
3. Add an entry to the `FILMS` array in `js/data.js`:

   ```js
   { type: "video", src: "assets/video/my-video.mp4", poster: "assets/video/my-video-poster.jpg",
     title: "My Video", caption: "...", cat: "automotive", vertical: true },
   ```

To convert a `.mov` on a Mac without installing anything:

```
avconvert --preset Preset1280x720 --source "MyVideo.mov" --output site/assets/video/my-video.mp4
```

**YouTube video:** no download needed — just grab the video ID from the share URL
(`youtu.be/qUy0frM-kdU` → id is `qUy0frM-kdU`) and add an entry:

```js
{ type: "youtube", id: "qUy0frM-kdU", title: "My Video", caption: "...", cat: "automotive" },
```

Omit `vertical: true` for normal 16:9 YouTube uploads; include it for 9:16 Shorts.

## Add a new category

Add a key to `CATEGORIES` in `js/data.js`:

```js
window.CATEGORIES = {
  automotive: "Automotive",
  people: "People & Animals",
  places: "City & Landscape",
  aerial: "Aerial",          // ← new
};
```

Then use `cat: "aerial"` on works. The filter button appears automatically.

Films work the same way, via `FILM_CATEGORIES` and the `cat` field on `FILMS` entries. Films
without a `cat` only show up under "All".

## Edit text, email, and social links

All in `SITE` at the top of `js/data.js` — bio paragraphs (`about`), home-page intro (`blurb`),
hero tagline, email, and Instagram/LinkedIn URLs (currently placeholders — put your real
profile URLs there).

## Change the hero image

In `index.html`, search for `hero-media` and swap the `src` to any file in `assets/img/lg/`.
Also update the matching `<link rel="preload" ...>` in the `<head>`.

## Publishing

The `site/` folder is a fully static site — host it anywhere (Netlify, Vercel, GitHub Pages,
Cloudflare Pages). Drag-and-dropping the `site/` folder into Netlify is the fastest route.
