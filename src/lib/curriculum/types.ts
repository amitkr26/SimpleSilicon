// src/lib/curriculum/types.ts
//
// Data model for SimpleSilicon's independently authored VLSI curriculum.
//
// Design notes (provenance):
// - Every lesson, example, exercise and quiz in this curriculum is original
//   writing produced for SimpleSilicon from general, publicly documented
//   technical knowledge (IEEE/AMBA specifications, vendor tool documentation,
//   standard textbooks and university course topics). No lesson text,
//   question bank, diagram or module ordering is copied from any other
//   platform.
// - See `src/lib/curriculum/PROVENANCE.md` for the source/licence ledger.

export type PathLevel = "Beginner" | "Intermediate" | "Advanced" | "All levels";

export type PathCategory = "foundations" | "backend" | "tools-career";

export interface LessonSection {
  /** Short section heading shown in the lesson body. */
  heading: string;
  /** Paragraphs of original explanatory prose. */
  body: string[];
}

export interface WorkedExample {
  title: string;
  /** Optional code / command / waveform snippet. */
  code?: string;
  /** Language hint for syntax styling (display only). */
  language?: string;
  /** Original walkthrough of what the example shows and why. */
  explanation: string[];
}

export interface Exercise {
  prompt: string;
  hint: string;
  /** Worked solution, revealed on demand. */
  solution: string;
}

export interface KnowledgeCheck {
  question: string;
  options: string[];
  /** Index into `options` of the correct answer. */
  answerIndex: number;
  explanation: string;
}

export interface Module {
  slug: string;
  title: string;
  /** One-line summary used on path and module listings. */
  summary: string;
  /** Estimated reading time in minutes. */
  minutes: number;
  /** Original learning objectives for this module. */
  objectives: string[];
  sections: LessonSection[];
  example?: WorkedExample;
  exercise?: Exercise;
  /** Short original knowledge-check quiz. */
  checks: KnowledgeCheck[];
}

export interface CurriculumPath {
  slug: string;
  title: string;
  level: PathLevel;
  category: PathCategory;
  /** One-line summary used on listings. */
  summary: string;
  /** Why this path exists and what a learner can do after it. */
  outcomes: string[];
  /** Slugs of paths that should be completed first. */
  prerequisites: string[];
  tools: string[];
  modules: Module[];
}
