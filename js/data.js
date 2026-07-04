/* ==========================================================================
   PRESTON SCHEEL — SITE CONTENT
   This is the only file you need to touch to update the site.
   See HOW-TO-ADD-WORK.md for step-by-step instructions.
   ========================================================================== */

window.SITE = {
  name: "Preston Scheel",
  role: "Photographer & Videographer",
  // Shown in the hero, under your name.
  heroLines: ["PRESTON", "SCHEEL"],
  heroTag: "Photography & Video — Automotive · People · Places",
  email: "prestonscheel@gmail.com",
  instagram: "https://www.instagram.com/",   // ← put your handle URL here
  linkedin: "https://www.linkedin.com/",     // ← put your profile URL here
  // Short intro shown on the home page.
  blurb:
    "I make images that move — classic Porsches at dusk, first looks on wedding mornings, and cities catching their last light. Every frame is built with intent.",
  // About page copy. Each string is a paragraph — edit freely.
  about: [
    "I'm Preston Scheel, a photographer and videographer with a soft spot for anything with a great silhouette — vintage sports cars, city skylines, and the people (and dogs) in between.",
    "My work spans automotive campaigns and collector-car photography, lifestyle and portrait sessions, and short-form video for brands and social. Whether it's a light-painted Porsche 356 or a couple's first look, I chase the same thing: honest light and a frame worth keeping.",
    "Available for commissions, campaigns, and collaborations — if you have a car, a brand, or a story that deserves better pictures, let's talk.",
  ],
  services: ["Automotive", "Portraits & Lifestyle", "Weddings & Events", "Brand Content", "Short-Form Video", "City & Landscape"],
};

/* --------------------------------------------------------------------------
   CATEGORIES — key must match the "cat" field on each work below.
   -------------------------------------------------------------------------- */
window.CATEGORIES = {
  automotive: "Automotive",
  people: "People & Animals",
  places: "City & Landscape",
};

/* --------------------------------------------------------------------------
   PHOTOS — to add a new one:
   1. Export two JPEGs: max 1920px into assets/img/lg/, max 960px into assets/img/md/
      (same filename in both folders, lowercase-with-dashes, e.g. "porsche-911-31.jpg")
   2. Add a line here: { slug: "porsche-911-31", title: "Porsche 911", cat: "automotive", w: 1920, h: 1280 }
      w/h are the pixel dimensions of the LG file (used to prevent layout shift).
   Items appear in the grid in the order listed.
   -------------------------------------------------------------------------- */
window.WORKS = [
  { slug: "green-porsche-911-light-1", title: "Porsche 993 — Studio Light", cat: "automotive", w: 1920, h: 1280 },
  { slug: "sny2743",                  title: "Ferrari F355 Spider",        cat: "automotive", w: 1280, h: 1920 },
  { slug: "0100-sny08550",            title: "First Look",                 cat: "people",     w: 1280, h: 1920 },
  { slug: "porsche-356-246",          title: "Porsche 356",                cat: "automotive", w: 1920, h: 1280 },
  { slug: "sny5734",                  title: "Chicago at Sunset",          cat: "places",     w: 1280, h: 1920 },
  { slug: "356-light-painting-3",     title: "Porsche 356 — Light Painting", cat: "automotive", w: 1920, h: 1280 },
  { slug: "930-turbo-3",              title: "Porsche 930 Turbo",          cat: "automotive", w: 1536, h: 1920 },
  { slug: "pilot-62",                 title: "Pilot",                      cat: "people",     w: 1279, h: 1920 },
  { slug: "audi-r8-1",                title: "Audi R8",                    cat: "automotive", w: 1920, h: 1280 },
  { slug: "triumph-137",              title: "Triumph",                    cat: "automotive", w: 1280, h: 1920 },
  { slug: "0024-sny09170",            title: "Golden Gate Bridge",         cat: "places",     w: 1280, h: 1920 },
  { slug: "healey-hotrod-19",         title: "Healey Hotrod",              cat: "automotive", w: 1920, h: 1280 },
  { slug: "giulietta-sprint-164",     title: "Alfa Romeo Giulietta Sprint", cat: "automotive", w: 1920, h: 1280 },
  { slug: "chris-kayla-archie-11",    title: "Chris, Kayla & Archie",      cat: "people",     w: 1280, h: 1920 },
  { slug: "porsche-911-17",           title: "Porsche 911",                cat: "automotive", w: 1920, h: 1280 },
  { slug: "bmw-m3-45",                title: "BMW M3",                     cat: "automotive", w: 1280, h: 1920 },
  { slug: "flying-spur-069",          title: "Bentley Flying Spur",        cat: "automotive", w: 1920, h: 1279 },
  { slug: "30f7f180-c821-4b07-83e4-e2ad9eca42ab", title: "Tulips on the Avenue", cat: "places", w: 1283, h: 1920 },
  { slug: "porsche-356-65",           title: "Porsche 356",                cat: "automotive", w: 1920, h: 1280 },
  { slug: "xc40-recharge-1",          title: "Volvo XC40 Recharge",        cat: "automotive", w: 1536, h: 1920 },
  { slug: "sny03681-edited",          title: "The Announcement",           cat: "people",     w: 1280, h: 1920 },
  { slug: "360-modena-45",            title: "Ferrari 360 Modena",         cat: "automotive", w: 1920, h: 1280 },
  { slug: "audi-r8-7",                title: "Audi R8",                    cat: "automotive", w: 1280, h: 1920 },
  { slug: "porsche-911-129",          title: "Porsche 911",                cat: "automotive", w: 1920, h: 1280 },
  { slug: "0013-sny08445",            title: "Pacific Coast",              cat: "places",     w: 1280, h: 1920 },
  { slug: "mazda-porter-cab-177",     title: "Mazda Porter Cab",           cat: "automotive", w: 1920, h: 1279 },
  { slug: "964-c4-68",                title: "Porsche 964 Carrera 4",      cat: "automotive", w: 1920, h: 1280 },
  { slug: "0002-sny06149",            title: "The Rings",                  cat: "people",     w: 1280, h: 1920 },
  { slug: "triumph-6",                title: "Triumph",                    cat: "automotive", w: 1920, h: 1280 },
  { slug: "green-porsche-911-light-3", title: "Porsche 993 — Studio Light II", cat: "automotive", w: 1080, h: 1920 },
  { slug: "porsche-356-247",          title: "Porsche 356",                cat: "automotive", w: 1920, h: 1280 },
  { slug: "ariya-beach-6",            title: "Nissan Ariya",               cat: "automotive", w: 1920, h: 1536 },
  { slug: "bat-bmw-cafe-racer-201",   title: "BMW Café Racer",             cat: "automotive", w: 1920, h: 1280 },
  { slug: "sl63-gray-16",             title: "Mercedes-AMG SL 63",         cat: "automotive", w: 1920, h: 1280 },
  { slug: "triumph-37",               title: "Triumph",                    cat: "automotive", w: 1920, h: 1280 },
  { slug: "model-x-1",                title: "Tesla Model X",              cat: "automotive", w: 1439, h: 1920 },
  { slug: "porsche-911-270",          title: "Porsche 911",                cat: "automotive", w: 1920, h: 1280 },
  { slug: "sny9899",                  title: "Fiat 124 Spider",            cat: "automotive", w: 1920, h: 1280 },
  { slug: "healey-hotrod-10",         title: "Healey Hotrod",              cat: "automotive", w: 1920, h: 1280 },
  { slug: "xc40-recharge-6",          title: "Volvo XC40 Recharge",        cat: "automotive", w: 1920, h: 1280 },
  { slug: "triumph-16",               title: "Triumph",                    cat: "automotive", w: 1920, h: 1280 },
  { slug: "sny2717",                  title: "Ferrari F355 Spider",        cat: "automotive", w: 1920, h: 1280 },
  { slug: "porsche-356-55",           title: "Porsche 356",                cat: "automotive", w: 1920, h: 1280 },
  { slug: "sl63-gray-14",             title: "Mercedes-AMG SL 63",         cat: "automotive", w: 1920, h: 1280 },
  { slug: "bmw-m3-8",                 title: "BMW M3",                     cat: "automotive", w: 1920, h: 1280 },
  { slug: "turbo-cab-7",              title: "Porsche 911 Turbo Cabriolet", cat: "automotive", w: 1920, h: 1280 },
  { slug: "porsche-911-brgreen-015",  title: "Porsche 911 — British Racing Green", cat: "automotive", w: 1920, h: 1279 },
];

/* --------------------------------------------------------------------------
   FILM CATEGORIES — key must match the "cat" field on each film below.
   Films without a "cat" only show up under "All".
   -------------------------------------------------------------------------- */
window.FILM_CATEGORIES = {
  customer: "Customer Experiences",
  automotive: "Automotive",
};

/* --------------------------------------------------------------------------
   FILMS — two kinds of entries:

   Local video — drop an .mp4 (H.264, ideally under ~30MB) into assets/video/,
   add a poster JPEG next to it (a frame from the video), then:
   { type: "video", src: "assets/video/x.mp4", poster: "assets/video/x.jpg",
     title: "...", caption: "...", cat: "automotive", vertical: true }

   YouTube video — just the video ID from the share URL
   (youtu.be/**qUy0frM-kdU** or watch?v=**qUy0frM-kdU**):
   { type: "youtube", id: "qUy0frM-kdU", title: "...", caption: "...", cat: "automotive" }

   "vertical: true" renders a 9:16 frame (reels/stories); omit it for 16:9.
   -------------------------------------------------------------------------- */
window.FILMS = [
  {
    type: "video",
    src: "assets/video/mashup-2024.mp4",
    poster: "assets/video/mashup-2024-poster.jpg",
    title: "MashUp 2024",
    caption: "Event recap reel",
    vertical: true,
  },
  {
    type: "video",
    src: "assets/video/holiday-testimonials.mp4",
    poster: "assets/video/holiday-testimonials-poster.jpg",
    title: "Holiday Testimonials",
    caption: "Instagram story — customer stories",
    cat: "customer",
    vertical: true,
  },
  {
    type: "youtube",
    id: "qUy0frM-kdU",
    title: "Perilla Ramen Popup",
    caption: "Customer experience",
    cat: "customer",
  },
  {
    type: "youtube",
    id: "3IzNXROZck8",
    title: "Smoke Queen v1",
    caption: "Customer experience",
    cat: "customer",
  },
  {
    type: "youtube",
    id: "e9zGykJgoPQ",
    title: "TS 5hr Enduro",
    caption: "Automotive",
    cat: "automotive",
  },
  {
    type: "youtube",
    id: "46Aa1BpYXrc",
    title: "1959 Porsche 356A Tribute",
    caption: "The Autobarn Collection",
    cat: "automotive",
  },
  {
    type: "youtube",
    id: "OI0QqaioWeU",
    title: "1960 Alfa Giulietta Sprint",
    caption: "The Autobarn Collection",
    cat: "automotive",
  },
];
