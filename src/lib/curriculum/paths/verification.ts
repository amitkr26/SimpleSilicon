// Original lesson content written for SimpleSilicon.
// Subject basis: general verification practice described in the
// SystemVerilog (IEEE 1800) standard and standard industry methodology.
// All wording below is original.
import type { CurriculumPath } from "../types";

export const VERIFICATION: CurriculumPath = {
  slug: "verification",
  title: "Design Verification Fundamentals",
  level: "Beginner",
  category: "foundations",
  summary:
    "Why verification is a separate discipline from design, how a testbench evolves from directed tests to constrained-random with coverage, and how assertions pin down protocol behaviour.",
  outcomes: [
    "Explain the verification problem as an argument about completeness rather than a search for bugs.",
    "Structure a testbench around a driver, monitor, reference model and scoreboard.",
    "Distinguish code coverage from functional coverage and say why only one bounds your confidence.",
    "Write a simple assertion that checks a temporal property, not just a value.",
    "Choose between directed, random and assertion-based techniques for a given risk.",
  ],
  prerequisites: ["rtl-verilog"],
  tools: ["SystemVerilog", "VCS", "Verilator"],
  modules: [
    {
      slug: "verification-problem",
      title: "What Verification Is Actually For",
      summary:
        "Design asks 'does this implement the spec'; verification asks 'have we shown it does across everything the spec permits'. The second question is the harder one.",
      minutes: 6,
      objectives: [
        "State why passing all available tests is not the same as being correct.",
        "Describe the inputs to a verification plan and why it precedes coding.",
        "Explain the cost of a bug found after tapeout versus before.",
      ],
      sections: [
        {
          heading: "Correctness is a claim, not an observation",
          body: [
            "A design is correct if, for every input sequence the specification allows, it produces the specified output. That is a statement over an astronomical space of cases, and no finite set of tests can enumerate it. Verification therefore cannot prove correctness by testing alone; it builds an argument that the cases exercised were the risky ones, backed by a model of what should have happened.",
            "This reframing matters because it changes what good work looks like. Counting passing tests is meaningless. What matters is coverage of the specification's requirements, the quality of the reference against which results are compared, and an honest accounting of what has not been exercised.",
          ],
        },
        {
          heading: "Plan before you write",
          body: [
            "A verification plan enumerates the features, corner cases and failure modes the design must handle, and assigns each a way to be tested. Doing this first exposes ambiguous or missing requirements while they are cheap to fix — a spec question answered during planning costs a conversation; the same question found in silicon costs a respin.",
            "The plan is also your completeness measure. When someone asks how much is done, the answer is 'these planned items are covered, these are not', which is a far more useful statement than a bug count that trends downward for reasons that may have nothing to do with quality.",
          ],
        },
        {
          heading: "The economics of finding bugs early",
          body: [
            "The cost of a defect grows roughly multiplicatively as it travels from RTL, to a gate-level netlist, to a fabricated mask set. Debugging in simulation is cheap because you can re-run, instrument and inspect freely. Debugging after fabrication is expensive because you cannot easily see inside the chip and a fix means a new mask set.",
            "This is the entire business case for investing heavily in pre-silicon verification. It is not optimism about testing; it is arithmetic about the cost of being wrong later.",
          ],
        },
      ],
      example: {
        title: "From requirement to a checkable claim",
        language: "text",
        code: `Spec sentence:
  "A request must be acknowledged within 4 cycles."

Verification plan entry:
  Feature  : request/ack latency
  Required : ack delay <= 4 cycles, always
  Method   : monitor + assertion
  Corner   : back-to-back requests, reset during request
  Status   : NOT STARTED

Assertion (temporal, not a single value):
  ack_delay_ok : assert property (
      @(posedge clk) req |-> ##[1:4] ack
  );`,
        explanation: [
          "Turning a prose requirement into a plan entry with an explicit method and status is what makes completeness measurable.",
          "The assertion encodes the requirement as a temporal property — a window of allowed cycles — rather than a single-cycle sample, which is what makes it check the actual contract.",
        ],
      },
      exercise: {
        prompt:
          "Write a verification plan entry for the requirement 'the FIFO must never overflow'. State the method and at least two corner cases.",
        hint: "Think about what conditions would make overflow reachable and how you would observe it.",
        solution:
          "Feature: FIFO overflow protection. Required: `count < DEPTH` always, and write-when-full is rejected rather than silently accepted. Method: scoreboard tracking a model depth plus an immediate assertion on the full flag. Corners: (1) write accepted in the same cycle the read frees an entry, (2) simultaneous write and read at the empty/full boundary, (3) reset while full. Status tracks each corner independently so 'done' means all three were exercised.",
      },
      checks: [
        {
          question: "Why can testing alone never prove a design is correct?",
          options: [
            "The space of input sequences is effectively infinite, so no finite test set enumerates it.",
            "Simulators are too slow to run enough vectors.",
            "Assertions are required for proof and most testbenches lack them.",
            "Testing only checks timing, not functionality.",
          ],
          answerIndex: 0,
          explanation:
            "Correctness is a universal statement over all permitted inputs. Finite testing samples that space, so confidence must come from coverage and argument rather than enumeration.",
        },
        {
          question: "What is the main value of writing a verification plan before the testbench?",
          options: [
            "It exposes ambiguous or missing requirements while they are cheap to fix.",
            "It makes the simulator run faster.",
            "It eliminates the need for a reference model.",
            "It generates the testbench code automatically.",
          ],
          answerIndex: 0,
          explanation:
            "A plan surfaces spec questions during planning rather than during silicon debug, and it becomes the objective measure of completeness.",
        },
        {
          question: "Why does the cost of a defect grow as it moves later in the flow?",
          options: [
            "Later stages mean masks, fabrication and possible respin, which are far more expensive to redo than simulation.",
            "Later bugs are harder to write tests for.",
            "Simulators intentionally hide early bugs.",
            "Gate-level netlists contain more bugs than RTL.",
          ],
          answerIndex: 0,
          explanation:
            "Fixing in RTL is an edit and a re-run; fixing after fabrication means new masks and a respin. The multiplicative cost curve is the economic basis for heavy pre-silicon investment.",
        },
      ],
    },

    {
      slug: "testbench-architecture",
      title: "Testbench Architecture: Driver, Monitor, Scoreboard",
      summary:
        "The standard decomposition of a testbench into pieces that generate, observe and compare, and why separating them makes tests reusable.",
      minutes: 7,
      objectives: [
        "Name the roles of driver, monitor, reference model and scoreboard.",
        "Explain why separating stimulus from checking makes tests composable.",
        "Describe how a transaction-level interface simplifies reuse.",
      ],
      sections: [
        {
          heading: "Separate the pieces by responsibility",
          body: [
            "A driver converts high-level stimulus into the pin-level protocol the design expects. A monitor observes the same pins and reconstructs what actually happened. A reference model predicts what should have happened, and a scoreboard compares prediction against observation. Keeping these as separate components means you can swap the stimulus without touching the checking, or upgrade the protocol without rewriting the coverage.",
            "The benefit shows up when requirements change — and they always do. If stimulus generation and result checking are tangled together in one procedure, every spec change forces you to re-audit a monolith. If they are separate, the change is local.",
          ],
        },
        {
          heading: "Think in transactions, not signals",
          body: [
            "Driving and monitoring at the signal level ties your testbench to the exact wire protocol. Working at the transaction level — 'issue a write of value X to address Y' — lets the same test run against any implementation that honours the same transaction semantics.",
            "This indirection is what makes a verification environment portable across design revisions and, in a larger organisation, reusable across projects. The transaction is the contract between the test's intent and the protocol's mechanics.",
          ],
        },
        {
          heading: "The scoreboard is the specification",
          body: [
            "Whatever the scoreboard accepts, you are implicitly declaring correct. That makes it the single most important component to review — an overly permissive scoreboard produces a green run that means nothing.",
            "A strong scoreboard checks more than the headline value: ordering, boundary conditions, and the absence of events that must never occur. Treating it as an executable statement of the spec, rather than as a comparison helper, keeps the environment honest as the design evolves.",
          ],
        },
      ],
      example: {
        title: "Data flow through a simple verification environment",
        language: "text",
        code: `   test / sequence
        |  transaction-level request
        v
     driver -----> pins -----> [ DUT ]
        |                          |
        |                          v
        +---------------------> monitor
                                   |  observed transaction
                                   v
   reference model ------>  scoreboard  ---> pass / fail
      (predict)                 (compare)`,
        explanation: [
          "Stimulus flows down the left, observation flows up the right, and the comparison happens where the two meet — so neither side depends on the other's implementation.",
          "Because both driver and monitor speak transactions, the DUT's exact pin protocol is confined to those two components.",
        ],
      },
      exercise: {
        prompt:
          "Design a scoreboard for a small cache. Beyond matching read data, what two other properties should it check to avoid a false pass?",
        hint: "Consider ordering and events that must never happen.",
        solution:
          "(1) Ordering: a read issued after a write to the same address must return the newer value, so responses must be checked against issue order, not just matched pairwise. (2) Invariants: no response may arrive for a cancelled request, and the tag/valid state must never indicate a hit on a line that was invalidated. A scoreboard that only compares data bytes would pass while the cache silently violates coherence or returns responses out of order.",
      },
      checks: [
        {
          question: "What is the role of the monitor in a testbench?",
          options: [
            "Observe the design's pins and reconstruct the transactions that actually occurred.",
            "Generate stimulus for the design.",
            "Predict the correct output.",
            "Compile the testbench.",
          ],
          answerIndex: 0,
          explanation:
            "The monitor is the observational side: it sees only what the pins do and rebuilds transactions, which are then compared against the reference model's prediction.",
        },
        {
          question: "Why is working at the transaction level valuable?",
          options: [
            "It decouples test intent from pin-level protocol, making tests reusable across implementations.",
            "It makes simulation run faster than signal-level checking.",
            "It removes the need for a monitor.",
            "It guarantees the protocol is implemented correctly.",
          ],
          answerIndex: 0,
          explanation:
            "Transactions express intent ('write X to Y') independently of how the protocol encodes it on the wires, so the same test survives protocol changes.",
        },
        {
          question: "What does an overly permissive scoreboard cause?",
          options: [
            "A green test run that does not actually demonstrate correctness.",
            "The simulator to run out of memory.",
            "Assertions to fire spuriously.",
            "The driver to generate illegal stimulus.",
          ],
          answerIndex: 0,
          explanation:
            "Whatever the scoreboard accepts is defined as correct by the environment. A weak comparison makes 'pass' meaningless, which is worse than an obvious fail.",
        },
      ],
    },

    {
      slug: "coverage-and-assertions",
      title: "Coverage and Assertions: Measuring and Pinning Behaviour",
      summary:
        "How coverage tells you what you have actually exercised, and how assertions check relationships across time instead of single instants.",
      minutes: 8,
      objectives: [
        "Distinguish code coverage from functional coverage and interpret each correctly.",
        "Explain why 100% code coverage does not imply the design is verified.",
        "Write a simple concurrent assertion using a temporal operator.",
        "Describe an immediate versus a concurrent assertion.",
      ],
      sections: [
        {
          heading: "Code coverage is a smoke test, not a result",
          body: [
            "Code coverage — lines, branches, toggles — measures whether your stimulus reached parts of the RTL. It is genuinely useful for finding dead code and unexercised branches, but it says nothing about whether the design's *behaviour* was checked. You can toggle every line of a datapath and still never test the corner case that matters.",
            "Treating high code coverage as verification success is a well-known trap. It answers 'did we run this code', not 'did we check the requirement'. Both matter, but they are different questions and must be reported separately.",
          ],
        },
        {
          heading: "Functional coverage is the specification's scoreboard",
          body: [
            "Functional coverage is written by the verification engineer to reflect the specification: bins for each protocol state, each boundary value, each combination the spec calls out. It measures whether the intended behaviour space was exercised, which is exactly what determines how much your passing tests are worth.",
            "The discipline is that coverage points must trace to a requirement. Coverage written to make a number go up rather than to reflect the spec produces an impressive percentage that measures nothing you care about.",
          ],
        },
        {
          heading: "Assertions check across time",
          body: [
            "A plain `if` checks a value at one instant. Most interesting protocol rules are about relationships across cycles: a request must be followed by an ack within N cycles; a valid must not drop before ready; a reset must clear state within a cycle. These need temporal operators, which is what concurrent assertions provide.",
            "Assertions have a dual role: they fail loudly during simulation, and in many flows they are handed to formal tools or to hardware assertion monitors so the same property is checked continuously in the field. Writing a property once and checking it in several contexts is a large leverage win.",
          ],
        },
      ],
      example: {
        title: "A concurrent assertion for a ready/valid handshake",
        language: "systemverilog",
        code: `// Once valid is asserted it must stay asserted until ready:
// no "valid drop" without a transfer.
property p_valid_stable;
  @(posedge clk) disable iff (!rst_n)
    (valid && !ready) |=> valid;
endproperty

a_valid_stable : assert property (p_valid_stable)
  else $error("VALID dropped before READY -- protocol violation");

// Transfer must be acknowledged within 4 cycles of a request:
// temporal window, not a single sample.
property p_ack_latency;
  @(posedge clk) disable iff (!rst_n)
    req |-> ##[1:4] ack;
endproperty

a_ack_latency : assert property (p_ack_latency)
  else $error("No ACK within 4 cycles of REQ");`,
        explanation: [
          "`|=>` and `|->` with `##[1:4]` express a relationship across future cycles — something a single-cycle `if` fundamentally cannot state.",
          "`disable iff` handles reset cleanly, so the property is not spuriously violated while the design is out of reset.",
        ],
      },
      exercise: {
        prompt:
          "Your regression reports 98% line coverage and 60% functional coverage. Which number is more informative about verification completeness, and what should you do next?",
        hint: "One metric reflects the spec; the other reflects the RTL text.",
        solution:
          "Functional coverage at 60% is the informative number — it says 40% of the specified behaviour space was never exercised. High line coverage only shows the stimulus ran over most of the RTL. Next: inspect which functional bins are unhit, decide whether each traces to a real requirement (and if a bin is unreachable, either remove it or justify it), then write targeted or constrained-random tests to close the meaningful gaps rather than optimising line coverage further.",
      },
      checks: [
        {
          question: "Why is 100% code coverage not evidence that a design is verified?",
          options: [
            "It only shows the stimulus executed the RTL text, not that the specified behaviour was checked.",
            "Code coverage is measured only in gate-level simulation.",
            "Line coverage cannot be measured for clocked designs.",
            "It is always inflated by unreachable code.",
          ],
          answerIndex: 0,
          explanation:
            "Executing every line does not mean boundary conditions, protocol rules or corner cases were validated. Functional coverage tied to the spec is what speaks to completeness.",
        },
        {
          question: "What distinguishes a concurrent assertion from an immediate one?",
          options: [
            "A concurrent assertion evaluates a property over time across clock cycles; an immediate one checks a single instant.",
            "A concurrent assertion can only be used in formal verification.",
            "Immediate assertions cannot be used inside always blocks.",
            "There is no difference beyond syntax.",
          ],
          answerIndex: 0,
          explanation:
            "Concurrent assertions use temporal operators to describe behaviour across cycles, which is what lets them express protocol rules like 'ack within N cycles'.",
        },
        {
          question: "What is the right test for whether a functional coverage point is legitimate?",
          options: [
            "It should trace to a requirement in the specification.",
            "It should be easy to reach so the percentage stays high.",
            "It should cover every branch of the RTL.",
            "It should be added last, after tests pass.",
          ],
          answerIndex: 0,
          explanation:
            "Coverage points exist to measure the spec's behaviour space. Points added to inflate a metric measure nothing meaningful and can hide real gaps.",
        },
      ],
    },
  ],
};
