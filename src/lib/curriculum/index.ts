// src/lib/curriculum/index.ts
//
// Aggregates SimpleSilicon's independently authored curriculum.
//
// Every path/module here is original SimpleSilicon content written from
// general, publicly documented technical sources. See PROVENANCE.md.

import type { CurriculumPath, Module } from "./types";
import { DIGITAL_LOGIC } from "./paths/digital-logic";
import { RTL_VERILOG } from "./paths/rtl-verilog";
import { STATIC_TIMING } from "./paths/static-timing";
import { VERIFICATION } from "./paths/verification";

export type { CurriculumPath, Module } from "./types";

/** All learning paths, ordered for display (prerequisites first). */
export const PATHS: CurriculumPath[] = [
  DIGITAL_LOGIC,
  RTL_VERILOG,
  VERIFICATION,
  STATIC_TIMING,
];

export function getPath(slug: string): CurriculumPath | undefined {
  return PATHS.find((p) => p.slug === slug);
}

export function getModule(pathSlug: string, moduleSlug: string): Module | undefined {
  return getPath(pathSlug)?.modules.find((m) => m.slug === moduleSlug);
}

/** Total number of modules across the whole curriculum. */
export const TOTAL_MODULES = PATHS.reduce((n, p) => n + p.modules.length, 0);

/** Slugs used by the video library and other cross-references. */
export const PATH_SLUGS = PATHS.map((p) => p.slug);
