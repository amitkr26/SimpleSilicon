// src/lib/content-status.ts
//
// Active-site visibility switch for the legacy curriculum sections.
//
// The 15 learning paths / 150 modules / STA question bank that this app was
// growing around carry titles, orderings and URL slugs whose independent
// provenance could not be verified against the third-party "SiliconPath"
// platform. Rather than delete the data (history + source must stay intact
// for review), these sections are hidden behind this flag until the content is
// independently rewritten.
//
// ponytail: flip to `true` ONLY after the learning-path, module and STA content
// has been independently redeveloped and reviewed. The page files render their
// full content unchanged below (see the `*Inner` components); this flag is the
// only switch between "public" and "temporarily unavailable".
export const CURRICULUM_SECTIONS_AVAILABLE = false;