import { LEARNING_PATHS } from "../lib/academy/all-paths";
import { VIDEO_COURSES, videoCoursesForAcademy } from "../lib/video-references";
import { CURRICULUM_SECTIONS_AVAILABLE } from "../lib/content-status";
import { designTokens } from "../styles/design-tokens";

const ACADEMY_TRACK_SLUGS = [
  "digital-logic",
  "verilog",
  "systemverilog",
  "uvm",
  "rtl-design",
  "physical-design",
  "interview-prep",
];

// Routes that must remain part of the public site while curriculum sections
// are hidden behind the content-status flag.
const ACTIVE_ROUTES = [
  "/",
  "/about",
  "/academy",
  "/learn/video-courses",
  "/resources",
];

describe("SimpleSilicon Curriculum & Architecture Integrity", () => {
  test("contains exactly 15 learning paths", () => {
    expect(LEARNING_PATHS.length).toBe(15);
  });

  test("each learning path has unique slug and valid metadata", () => {
    const slugs = new Set<string>();
    LEARNING_PATHS.forEach((path) => {
      expect(slugs.has(path.slug)).toBe(false);
      slugs.add(path.slug);
      expect(path.title).toBeTruthy();
      expect(path.description).toBeTruthy();
      expect(["foundations", "backend", "tools-career"]).toContain(path.category);
      expect(["Beginner", "Intermediate", "Advanced", "All levels"]).toContain(path.level);
      expect(path.modules.length).toBeGreaterThan(0);
      expect(path.moduleCount).toBe(path.modules.length);

      // Verify each module within the path
      const moduleSlugs = new Set<string>();
      path.modules.forEach((mod) => {
        expect(moduleSlugs.has(mod.slug)).toBe(false);
        moduleSlugs.add(mod.slug);
        expect(mod.title).toBeTruthy();
        expect(mod.duration).toBeTruthy();
      });
    });
  });

  test("active public routes are the un-flagged surfaces only", () => {
    expect(CURRICULUM_SECTIONS_AVAILABLE).toBe(false);
    ACTIVE_ROUTES.forEach((route) => {
      expect(route.startsWith("/")).toBe(true);
      expect(route === "/" || route.startsWith("/about") || route.startsWith("/academy") || route.startsWith("/learn/video-courses") || route.startsWith("/resources")).toBe(true);
    });
  });

  test("video course references are well-formed and map to real paths", () => {
    const pathSlugs = new Set(LEARNING_PATHS.map((p) => p.slug));
    expect(VIDEO_COURSES.length).toBeGreaterThanOrEqual(70);

    VIDEO_COURSES.forEach((c) => {
      expect(c.title).toBeTruthy();
      expect(c.institute).toBeTruthy();
      expect(c.paths.every((p) => pathSlugs.has(p))).toBe(true);
      if (c.source === "nptel") {
        expect(c.id).toMatch(/^\d{9}$/);
        expect(c.url).toMatch(/^https:\/\/nptel\.ac\.in\/courses\/\d{9}$/);
      } else {
        expect(c.url).toMatch(/^https:\/\/www\.youtube\.com\/playlist\?list=[A-Za-z0-9_-]{20,}$/);
      }
    });
  });

  test("every academy track maps to embedded video references and all tags are valid", () => {
    ACADEMY_TRACK_SLUGS.forEach((slug) => {
      const refs = videoCoursesForAcademy(slug);
      expect(refs.length).toBeGreaterThan(0); // every track has at least one embedded source
      refs.forEach((c) => {
        expect(c.academy).toContain(slug);
      });
    });

    VIDEO_COURSES.forEach((c) => {
      if (c.academy) {
        c.academy.forEach((slug) => {
          expect(ACADEMY_TRACK_SLUGS).toContain(slug);
        });
      }
    });
  });

  test("design tokens define semantic restrained technical palette", () => {
    expect(designTokens.color.bg).toBe("#F8FAFC");
    expect(designTokens.color.text).toBe("#0F172A");
    expect(designTokens.color.primary).toBe("#2563EB");
    expect(designTokens.color.success).toBe("#059669");
    expect(designTokens.color.danger).toBe("#DC2626");
    expect(designTokens.radius.lg).toBe("8px");
  });
});
