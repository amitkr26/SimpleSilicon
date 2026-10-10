// Original lesson content written for SimpleSilicon.
// Subject basis: general static timing analysis practice as described in
// standard reference texts and vendor tool documentation (PrimeTime,
// Tempus, OpenSTA). All wording below is original.
import type { CurriculumPath } from "../types";

export const STATIC_TIMING: CurriculumPath = {
  slug: "static-timing",
  title: "Static Timing Analysis",
  level: "Intermediate",
  category: "backend",
  summary:
    "How a timing tool proves a design meets its clock period without simulating: paths, slack, the setup/hold pair, clock modelling, and variation across corners.",
  outcomes: [
    "Identify the four basic timing path types and what each endpoint constrains.",
    "Compute setup and hold slack from arrival and required times and interpret the sign.",
    "Explain how clock latency, skew, jitter and uncertainty enter the timing equations.",
    "Describe what on-chip variation and multi-corner analysis protect against.",
    "Choose a concrete fix for a negative-slack report rather than guessing.",
  ],
  prerequisites: ["digital-logic", "rtl-verilog"],
  tools: ["Synopsys PrimeTime", "Cadence Tempus", "OpenSTA"],
  modules: [
    {
      slug: "paths-and-slack",
      title: "Timing Paths and Slack",
      summary:
        "What the tool actually analyses — four path types — and how a single number, slack, decides pass or fail.",
      minutes: 7,
      objectives: [
        "Classify a startpoint/endpoint pair into one of the four path types.",
        "Compute slack as required time minus arrival time.",
        "Interpret negative setup slack and negative hold slack correctly.",
      ],
      sections: [
        {
          heading: "The tool reasons about paths, not the whole design at once",
          body: [
            "Static timing analysis decomposes the circuit into paths, each beginning at a timing startpoint (a register clock pin, an input port, or a latch output) and ending at an endpoint (a register data pin, an output port, or a latch input). For every path it propagates delays through the logic and wires to compute an arrival time, then compares it against a required time derived from the clock and any constraints.",
            "Doing this for every path is what makes the analysis 'static' — it never needs to apply input vectors the way simulation does. That is both its power (complete over the timing graph) and its caveat (it relies on constraints being right, so a false path declared incorrectly is silently ignored).",
          ],
        },
        {
          heading: "The four path types",
          body: [
            "Register-to-register paths run from one flip-flop's clock pin to the next flip-flop's data pin; they are what your clock period must satisfy. Input-to-register paths start at an input port and must be met relative to the incoming clock. Register-to-output paths end at an output port. Register-to-latch paths involve time borrowing and are the subtlest of the four.",
            "Knowing which type a path is tells you which constraint governs it and which knob fixes it. A register-to-register failure is about your clock period and internal delay; an input-to-register failure is about the external interface budget; a register-to-output failure is about what you are handing to the outside world.",
          ],
        },
        {
          heading: "Slack is the whole verdict",
          body: [
            "Slack is required time minus arrival time. Positive slack means the signal arrived early — there is margin to spare. Negative slack means it arrived too late — the design does not meet the constraint on that path. The tool's summary is essentially a statement about the worst slack across all paths of each type.",
            "Setup slack and hold slack are separate questions that pull in opposite directions. Setup asks 'is it fast enough to arrive before the edge'; hold asks 'is it slow enough not to change right after the edge'. Making logic faster fixes setup and can break hold, which is why timing closure usually involves balancing the two rather than simply minimising delay everywhere.",
          ],
        },
      ],
      example: {
        title: "Computing setup slack by hand",
        language: "text",
        code: `Clock period            T    = 4.0 ns
Clock-to-Q of launch FF tcq  = 0.3 ns
Combinational delay     dmax = 3.4 ns
Setup time of capture FF tsu = 0.1 ns
(assume zero skew/uncertainty)

Arrival   = tcq + dmax        = 0.3 + 3.4 = 3.7 ns
Required  = T - tsu           = 4.0 - 0.1 = 3.9 ns
Setup slack = 3.9 - 3.7       = +0.2 ns   PASS (200 ps margin)

If dmax were 3.6 ns:
Slack = 3.9 - (0.3 + 3.6)     = 0.0 ns   (exactly marginal)
If dmax were 3.7 ns:
Slack = 3.9 - (0.3 + 3.7)     = -0.1 ns  FAIL`,
        explanation: [
          "Slack is a single subtraction, and its sign is the entire pass/fail verdict for that path.",
          "Note that the margin evaporated quickly: 100 ps of extra logic delay turned a comfortable path into a failing one, which is why signoff requires margin, not just a zero-slack result.",
        ],
      },
      exercise: {
        prompt:
          "A register-to-register path has arrival 2.6 ns against a 3.0 ns clock with setup time 0.05 ns and clock skew of 0.1 ns (capture clock arrives 0.1 ns late). Compute setup slack and say whether it passes.",
        hint: "Late-arriving capture clock *helps* setup; include skew as it affects required time.",
        solution:
          "Required = T - tsu + skew = 3.0 - 0.05 + 0.1 = 3.05 ns. Arrival = 2.6 ns. Slack = 3.05 - 2.6 = +0.45 ns — passes with margin. Because the capture clock arrives later, the capture flop's setup deadline is relaxed by that 0.1 ns, so skew that hurts hold here actually helps setup.",
      },
      checks: [
        {
          question: "What is slack in static timing analysis?",
          options: [
            "Required time minus arrival time; positive means margin, negative means violation.",
            "The clock period divided by the number of paths.",
            "The difference between worst and average path delay.",
            "The amount of clock skew between two flip-flops.",
          ],
          answerIndex: 0,
          explanation:
            "Slack directly measures margin. Its sign is the pass/fail verdict, and its magnitude tells you how much delay you can add or must remove.",
        },
        {
          question: "Why is the analysis called 'static'?",
          options: [
            "It reasons over the timing graph without applying input test vectors like simulation.",
            "It only analyses designs at rest.",
            "It uses a static clock that never changes.",
            "It requires no dynamic memory to run.",
          ],
          answerIndex: 0,
          explanation:
            "It propagates delays through every path structurally rather than exercising the design with stimulus, which is what allows complete coverage of the timing graph.",
        },
        {
          question: "Why can improving (shortening) logic delay break hold timing?",
          options: [
            "Hold requires the data to be stable long enough after the edge; faster data can arrive too soon relative to the capture edge.",
            "Shorter logic increases the clock period.",
            "Hold is only checked in simulation.",
            "Faster paths automatically fail setup.",
          ],
          answerIndex: 0,
          explanation:
            "Setup and hold pull in opposite directions: setup wants data early, hold wants it to persist. Reducing delay helps setup but moves data closer to violating hold.",
        },
      ],
    },

    {
      slug: "clock-modeling",
      title: "Clock Modelling: Latency, Skew, Jitter, Uncertainty",
      summary:
        "The clock is not a perfect abstraction — real clocks have delay, mismatch and noise, and each enters the timing equations differently.",
      minutes: 7,
      objectives: [
        "Distinguish ideal clock from propagated clock and when each is appropriate.",
        "Define skew versus jitter and say which is a design problem versus a noise problem.",
        "Explain how clock uncertainty and latency are modelled in constraints.",
      ],
      sections: [
        {
          heading: "Ideal versus propagated clocks",
          body: [
            "An ideal clock is modelled as arriving at every flip-flop at exactly the same instant with no tree delay — convenient for early floorplanning, but it hides the very effects that dominate real clock behaviour. A propagated clock uses the actual clock tree extracted from layout, so each flip-flop's clock pin sees its own latency and skew.",
            "Signoff must use propagated clocks, because skew is only known once the clock tree exists. Shifting to propagated clocks late in the flow is also why timing sometimes gets worse at that transition — the ideal-clock numbers were optimistic by exactly the skew that was missing.",
          ],
        },
        {
          heading: "Skew is systematic, jitter is noise",
          body: [
            "Skew is the difference in arrival time of the same clock edge at different flip-flops, caused by asymmetry in the clock tree. It is a design artefact: you can reduce it by better tree balancing, and it is deterministic for a given layout and conditions.",
            "Jitter is cycle-to-cycle variation in the clock's own period, arising from power-supply noise, oscillator instability and coupling. It is not something you fix by rebalancing the tree. Because both degrade margin, timing analysis accounts for them by widening the required window rather than pretending either is zero.",
          ],
        },
        {
          heading: "How constraints express the uncertainty",
          body: [
            "Clock latency is the time from the clock source to a given clock pin — added to both launch and capture paths, and largely cancelling for register-to-register paths unless the two are asymmetric. Clock uncertainty is a margin that bundles jitter and a portion of skew into the timing budget, shrinking the effective period.",
            "Getting this right is the quiet, high-leverage part of timing work. An uncertainty set too generously wastes performance; set too tight and you are signing off a design that will fail once real noise is present. It should reflect measured or datasheet jitter plus a justified design margin, not a round number copied from an older project.",
          ],
        },
      ],
      example: {
        title: "Effect of uncertainty on the setup budget",
        language: "tcl",
        code: `# Constraint: 3.0 ns clock with 0.10 ns uncertainty
create_clock -name core_clk -period 3.0 [get_ports clk]
set_clock_uncertainty -setup 0.10 [get_clocks core_clk]
set_clock_uncertainty -hold  0.05 [get_clocks core_clk]

# Effective setup budget:
#   required = period - uncertainty - tsu
#            = 3.00 - 0.10 - 0.05 = 2.85 ns of usable delay
#
# Hold budget uses the small hold uncertainty, so a design
# can pass hold and fail setup (or vice versa) on the same path.`,
        explanation: [
          "The 0.10 ns uncertainty is subtracted from the setup budget — you lose real operating range to cover jitter and skew.",
          "Setup and hold get separate uncertainty values because jitter and skew affect them differently; using one number for both is a common source of over- or under-constraint.",
        ],
      },
      exercise: {
        prompt:
          "Signoff reports large negative setup slack only after you switch from ideal to propagated clocks. Explain why, and say whether this indicates a clock-tree problem.",
        hint: "What did the ideal-clock model assume about clock arrival?",
        solution:
          "Ideal clocks assumed zero arrival difference at every flip-flop, so the analysis ignored clock-tree latency mismatch entirely. Propagated clocks expose the real per-pin latency and skew, so the effective launch-to-capture window shrinks and slack drops. This is not necessarily a clock-tree defect — it means the earlier numbers were optimistic. The next step is to inspect whether the skew is within budget; if it is, the design genuinely needs more logic delay margin, and if it is not, the tree needs rebalancing.",
      },
      checks: [
        {
          question: "What is the difference between clock skew and clock jitter?",
          options: [
            "Skew is the arrival-time difference between flip-flops; jitter is cycle-to-cycle variation of the clock period.",
            "Skew is random noise; jitter is a fixed design offset.",
            "They are two names for the same effect.",
            "Skew applies only to asynchronous designs.",
          ],
          answerIndex: 0,
          explanation:
            "Skew is spatial (across the tree, deterministic for a layout); jitter is temporal (period-to-period, noise-driven). They degrade timing through different mechanisms.",
        },
        {
          question: "Why must signoff timing use propagated rather than ideal clocks?",
          options: [
            "Only the real clock tree reveals the actual per-pin latency and skew.",
            "Ideal clocks cannot be represented in SDC.",
            "Propagated clocks make simulation run faster.",
            "Ideal clocks are illegal in static timing analysis.",
          ],
          answerIndex: 0,
          explanation:
            "Skew is a property of the implemented tree. Without propagating it, the analysis simply cannot see the effect that dominates clock behaviour in real silicon.",
        },
        {
          question: "What does set_clock_uncertainty -setup model?",
          options: [
            "A margin for jitter and skew that shrinks the usable setup window.",
            "The clock tree's physical latency.",
            "The flip-flop's setup time requirement.",
            "The oscillator's nominal frequency.",
          ],
          answerIndex: 0,
          explanation:
            "Uncertainty is a budget deduction applied to required time so the analysis tolerates real noise and mismatch instead of assuming a perfect clock.",
        },
      ],
    },

    {
      slug: "variation-and-corners",
      title: "Variation, Corners, and OCV",
      summary:
        "No two transistors are identical and no chip runs at one condition — how analysis across process, voltage and temperature keeps a design working in the field.",
      minutes: 8,
      objectives: [
        "Explain process, voltage and temperature variation and why corners exist.",
        "Distinguish setup analysis at the slow corner from hold analysis at the fast corner.",
        "Describe what on-chip variation is and why derating is applied.",
        "State why signoff must cover multiple modes, not one.",
      ],
      sections: [
        {
          heading: "PVT: the three axes that move delay",
          body: [
            "Process variation is the manufacturing spread between chips — transistors on the same die also vary, which is intra-die variation. Voltage changes drive strength: lower supply means slower devices. Temperature affects delay, though the direction depends on the dominant mechanism in the technology, so it is not safe to assume 'hotter is always slower'.",
            "Because delay moves along all three axes, a design verified at a single nominal condition proves very little. Corner analysis samples the extremes of the PVT space — typically a slow corner for setup and a fast corner for hold — because the worst case for each check often lives at different corners.",
          ],
        },
        {
          heading: "Setup and hold live at different corners",
          body: [
            "Setup wants the design to be fast enough, so its worst case is the slow corner: high temperature, low voltage, slow process. Hold wants data to persist, so its worst case is the fast corner: low temperature, high voltage, fast process. A design can be perfectly fine on setup at one corner and failing hold at another, which is why both must be closed and both at their own worst case.",
            "This is also why hold violations are considered particularly nasty: hold depends on the design's own delay relationships rather than on the clock period, so you cannot fix a hold violation by simply lowering the operating frequency. A chip that fails hold fails at any speed.",
          ],
        },
        {
          heading: "On-chip variation and derating",
          body: [
            "Even within a single die, the launching flip-flop and the capturing flip-flop are different physical devices with different process offsets. On-chip variation analysis accounts for this by applying derates that pessimistically separate the launch and capture paths — making one slower and the other faster than nominal simultaneously.",
            "Derating is a modelling choice with a real trade-off: too aggressive and you chase violations that cannot occur, wasting effort and performance; too conservative and you sign off a design that will fail. Modern flows refine this with advanced, distance-based derates rather than a single flat number, but the principle is the same — represent the spread honestly without exaggerating it.",
          ],
        },
      ],
      example: {
        title: "Which corner for which check",
        language: "text",
        code: `                        Worst case for
Corner        Temp   Vdd   Process     Check
-----------   ----   ---   -------     -----
Slow (SS)     high   low   slow        SETUP  (need speed)
Fast (FF)     low    high  fast        HOLD   (need delay)
Typical (TT)  room   nom   nominal     sanity / power

Signoff requires BOTH:
  setup closed @ slow corner
  hold  closed @ fast corner
plus whatever multi-mode cases exist (scan, low-power, etc.)`,
        explanation: [
          "Setup and hold worst cases are at opposite corners, so a single-corner result is never sufficient for signoff.",
          "A chip can pass setup comfortably and still fail hold at the fast corner — and because hold does not depend on clock period, that failure is not recoverable by slowing the clock.",
        ],
      },
      exercise: {
        prompt:
          "A chip fails hold timing only at the fast/low-temperature corner. Why will lowering the operating clock frequency not fix it, and what kinds of changes would?",
        hint: "Consider what hold depends on versus what setup depends on.",
        solution:
          "Hold checks that data is stable for a minimum time after the capture edge, which depends only on the design's own delay relationships (clock-to-q, datapath delay, hold requirement) — not on the clock period. Slowing the clock lengthens the period but leaves those same intra-cycle relationships untouched, so the violation persists at any frequency. Fixes must add delay on the offending path: insert hold buffers/ripple delay, slow the fastest path, adjust clock skew, or retime the logic so the capturing flop's data arrives later.",
      },
      checks: [
        {
          question: "Why is the slow corner the worst case for setup?",
          options: [
            "Slow process, high temperature and low voltage all lengthen delay, making arrival latest.",
            "Setup depends on clock period, which is longest at the slow corner.",
            "Slow corners have the most clock skew.",
            "Setup is only checked at typical conditions.",
          ],
          answerIndex: 0,
          explanation:
            "Setup fails when data arrives late, and every factor that slows devices pushes arrival later — so the slow corner is where setup margin is smallest.",
        },
        {
          question: "Why is a hold violation not fixable by lowering the clock frequency?",
          options: [
            "Hold depends on intra-cycle delay relationships, not on the clock period.",
            "Lower frequency makes hold worse in the tool's model.",
            "Hold is checked across clock cycles, not within one.",
            "Hold violations only appear in fast corners, which frequency does not affect.",
          ],
          answerIndex: 0,
          explanation:
            "Hold requires data to persist past the capture edge within the same cycle. Changing the period does not change clock-to-q or datapath delay, so the violation stands at any frequency.",
        },
        {
          question: "What does on-chip variation analysis model?",
          options: [
            "Differences between the launching and capturing devices on the same die.",
            "Differences between separate chips on a wafer only.",
            "Variation in the power supply only.",
            "Temperature changes over the chip's lifetime.",
          ],
          answerIndex: 0,
          explanation:
            "Intra-die variation means two adjacent flip-flops are not identical. Derates pessimistically separate their paths so the analysis reflects that spread.",
        },
      ],
    },

    {
      slug: "timing-closure",
      title: "Closing Timing: Reading a Report and Choosing a Fix",
      summary:
        "Turning a negative-slack report into a diagnosis, and matching the fix — sizing, buffering, restructuring, retiming — to the actual cause.",
      minutes: 8,
      objectives: [
        "Read a timing report to identify the critical path's start, end and bottleneck.",
        "Choose among sizing, buffering, restructuring and retiming for a given cause.",
        "Explain why over-constraining and false paths both distort results.",
        "Describe how to approach a design that will not close by iteration alone.",
      ],
      sections: [
        {
          heading: "Read before you optimise",
          body: [
            "The first thing a report tells you is which path is critical, and the second is where along that path the time actually goes. A path dominated by one deep combinational block needs a different fix than a path whose delay is spread thinly across many small gates. Guessing without reading produces churn — optimisations that move the bottleneck to the next path without closing timing overall.",
            "It is also worth checking whether the path is one you care about. If it is a genuinely false path — two domains that never communicate, or a mode that cannot be active in operation — the correct action is to constrain it accurately, not to optimise logic that is doing real work in the common case.",
          ],
        },
        {
          heading: "Match the fix to the cause",
          body: [
            "If the path is a handful of gates that are simply too slow, sizing them up trades area and power for delay. If the depth itself is the problem — too many logic levels in series — buffering will not save you; you need to restructure, pipeline or register across the path. Inserting a register stage adds a cycle of latency but converts a long path into two short ones, which is often the only way a very deep path ever closes.",
            "Retiming is a more automatic version of the same idea: it moves registers across combinational logic to balance delay, potentially recovering timing without changing functionality. Its cost is that it changes register positions, which can complicate debug and any logic that assumed specific register boundaries.",
          ],
        },
        {
          heading: "When iteration stops working",
          body: [
            "Timing closure by repeated 'optimise, re-run, repeat' has diminishing returns, because each fix can disturb other paths and expose a new critical path. If successive iterations are not converging, the problem is usually structural: the architecture has a critical path that no amount of gate-level tuning will fix.",
            "The productive response is to step back and ask whether the design's pipelining, arithmetic structure or control partitioning can be changed. Getting stuck at the tool level and forcing ever-more-aggressive optimisations typically costs area and power while buying little margin — recognising that point saves real time.",
          ],
        },
      ],
      example: {
        title: "Matching fix to report",
        language: "text",
        code: `Report says:
  Path A: 4 levels, worst slack -80 ps, dominated by a
          64-bit adder chain
  Path B: 11 levels, worst slack -250 ps, deep mux tree
          feeding a compare

Path A fix candidates:
  - size up the adder's final carry stages   (small win, cheap)
  - restructure carry chain / use faster adder architecture
  - NOT worth adding pipeline latency for 80 ps

Path B fix candidates:
  - sizing will barely help 11 levels
  - restructure the mux/compare, or register mid-way
  - structural change likely required`,
        explanation: [
          "The two paths have similar symptoms (negative slack) but different causes — one shallow-but-slow, one genuinely deep — so they need different fixes.",
          "Treating them identically (for example, blanket size-up) would waste area on Path B while barely moving it, and might close Path A at a reasonable cost.",
        ],
      },
      exercise: {
        prompt:
          "Your design has one path at -600 ps and ten paths at -50 ps. Describe your triage order and reasoning, and what you would check about the -600 ps path first.",
        hint: "The extreme path may not be a real constraint target.",
        solution:
          "First, check whether the -600 ps path is genuinely supposed to be timed — is it a false path, a multicycle path that is mis-constrained, or an unreachable mode? An extreme outlier is often a constraint problem rather than a logic problem, and fixing the constraint may clear it instantly. If it is real, it needs a structural fix (pipelining/restructuring). Only then move to the cluster of -50 ps paths, which are usually closable with sizing/buffering. Optimising the -50 ps cluster first would leave the outlier failing anyway.",
      },
      checks: [
        {
          question: "What should you determine first when a path shows negative slack?",
          options: [
            "Whether the path is genuinely timed or is false/mis-constrained, and where along it the delay is concentrated.",
            "Immediately size up every gate on the path.",
            "Lower the clock period to absorb it.",
            "Ignore it if fewer than ten paths fail.",
          ],
          answerIndex: 0,
          explanation:
            "A negative path may be a constraint error rather than a logic problem, and the delay distribution determines which fix applies. Skipping diagnosis leads to wasted optimisation.",
        },
        {
          question: "When is inserting a pipeline register the appropriate fix?",
          options: [
            "When the path is too deep for sizing or buffering to help, and added latency is acceptable.",
            "Whenever setup slack is negative, as a first resort.",
            "Only in combinational logic with no registers.",
            "It never helps; only resizing works.",
          ],
          answerIndex: 0,
          explanation:
            "Registering across a deep path splits one long delay into two short ones. It trades a cycle of latency for a large timing win — appropriate when depth, not gate strength, is the issue.",
        },
        {
          question: "Why might aggressive tool-driven optimisation fail to close timing?",
          options: [
            "Because the bottleneck is structural (architecture/pipelining) and gate-level tuning cannot fix it.",
            "Because tools cannot modify combinational logic.",
            "Because each run re-randomises the delays.",
            "Because sizing has no effect on delay.",
          ],
          answerIndex: 0,
          explanation:
            "If the architecture produces a critical path by design, optimising gates only shuffles the bottleneck. Recognising the structural cause prevents wasting area and power on ineffective tweaks.",
        },
      ],
    },
  ],
};
