// Original lesson content written for SimpleSilicon.
// Subject basis: the Verilog-2001/2005 IEEE 1364 standard and standard
// synthesizable-RTL practice. All wording below is original.
import type { CurriculumPath } from "../types";

export const RTL_VERILOG: CurriculumPath = {
  slug: "rtl-verilog",
  title: "RTL Design with Verilog",
  level: "Beginner",
  category: "foundations",
  summary:
    "What a hardware description language is really describing, the subset that synthesises cleanly, and the timing habits that keep your design correct once it runs at speed.",
  outcomes: [
    "Describe the hardware a Verilog continuous assignment and a clocked always block each infer.",
    "Write combinational logic with complete assignments that never infer an unintended latch.",
    "Choose between blocking and non-blocking assignment by intent, not by habit.",
    "Separate a design from its testbench and drive it with self-checking stimulus.",
    "Recognise the synthesisable subset and know what to avoid for portability.",
  ],
  prerequisites: ["digital-logic"],
  tools: ["Verilog", "Icarus Verilog", "Verilator"],
  modules: [
    {
      slug: "hdl-mental-model",
      title: "What a Verilog Module Actually Describes",
      summary:
        "Verilog does not describe a sequence of steps — it describes hardware that exists simultaneously. Building that mental model first prevents most beginner confusion.",
      minutes: 7,
      objectives: [
        "Explain why a module's code runs 'all at once' rather than top to bottom.",
        "Map a port declaration to a physical pin and a wire declaration to a net.",
        "Distinguish a simulation-time model from the hardware it is intended to become.",
      ],
      sections: [
        {
          heading: "Parallel, not sequential",
          body: [
            "The most common early mistake is reading a module as a program that executes line by line. It does not. Every continuous assignment and every always block in a module describes hardware that is present at the same time, reacting to its inputs continuously. Your source text is a description of a structure, not a recipe for an execution order.",
            "Order matters in your file only for readability. Two continuous assignments that both drive the same wire are a conflict regardless of which appears first, because in the resulting hardware there is no ordering — there is one net, and it cannot be two things at once.",
          ],
        },
        {
          heading: "Ports and nets are physical",
          body: [
            "Declaring an input or output creates a boundary of the module — a pin that a wire in the parent connects to. Declaring an internal `wire` creates a net: a connection with no storage of its own, only whatever its drivers produce. A `reg`, despite the name, is not a memory cell either; it is a variable that a procedural block drives, and if that block is clocked, the synthesiser will build a real register.",
            "Keeping the physical picture in mind resolves a lot of 'why does my simulation differ from my intent'. A wire that is never driven is high-impedance or unknown in simulation and unconnected in hardware. A reg whose procedural block never assigns it under some condition is holding state — usually a latch you did not mean to create.",
          ],
        },
        {
          heading: "Simulation is a model, not the artifact",
          body: [
            "Your simulator executes an idealised, zero-delay version of the description: wires settle instantly, every branch sees the same clock edge, and there is no skew. Real silicon has propagation delay, wire capacitance, and clocks that arrive at different flip-flops at slightly different times.",
            "This gap is exactly why the industry leans on static timing analysis rather than simulation alone to prove a design works. Simulation answers 'is the logic correct'; timing analysis answers 'does the logic settle in time'. You need both, and conflating them is how teams ship designs that pass every testbench and still fail on silicon.",
          ],
        },
      ],
      example: {
        title: "A minimal combinational module",
        language: "verilog",
        code: `module majority3 (
    input  wire a,
    input  wire b,
    input  wire c,
    output wire y
);
    // Continuous assignment: hardware that is always present.
    // This is NOT executed "top to bottom" -- it is a wire expression.
    assign y = (a & b) | (b & c) | (a & c);
endmodule`,
        explanation: [
          "The `assign` describes a gate structure: three ANDs feeding two ORs. All of it exists simultaneously and reacts to a, b, c continuously — there is no sequence.",
          "No `reg` is involved because the output is driven by a net expression, which is the cleanest way to write purely combinational logic.",
        ],
      },
      exercise: {
        prompt:
          "Rewrite the module above using an always block instead of a continuous assignment. What extra care must you take to avoid inferring a latch, and what does that tell you about combinational procedural code?",
        hint: "An always @(*) block must assign its output for every combination of inputs.",
        solution:
          "Use `always @(*) begin y = ...; end` with a full expression, or with if/case branches that include a default. The care required is completeness: if any input combination leaves y unassigned, synthesis builds a latch to hold it. This tells you that combinational procedural code must assign unconditionally on every path — which is precisely why a continuous `assign` is preferred for simple expressions, since it is complete by construction.",
      },
      checks: [
        {
          question: "What does a Verilog `assign` statement describe?",
          options: [
            "Hardware that is always present and continuously reflects its inputs.",
            "A line of code executed once when the module starts.",
            "A signal that updates only on a clock edge.",
            "A temporary variable that is discarded after use.",
          ],
          answerIndex: 0,
          explanation:
            "`assign` is a continuous assignment describing a net expression — combinational hardware that reacts immediately as its inputs change, with no notion of execution order.",
        },
        {
          question: "Why can two `assign` statements driving the same wire be a problem regardless of order?",
          options: [
            "In the resulting hardware there is a single net with no ordering, so multiple drivers conflict.",
            "Because Verilog always evaluates the last assignment first.",
            "Because wires can only be driven from procedural blocks.",
            "It is not a problem — later assignments simply override earlier ones.",
          ],
          answerIndex: 0,
          explanation:
            "Hardware has no sequential precedence. One net with two drivers resolves to a wired combination (or an X in simulation), which is a design error, not an ordering you can rely on.",
        },
        {
          question: "What is the main gap between a Verilog simulation and real silicon?",
          options: [
            "Simulation models zero-delay, ideal behaviour; silicon has delay, skew and physical effects.",
            "Simulation cannot handle modules with more than ten ports.",
            "Real hardware only executes the first always block.",
            "There is no meaningful gap; a passing simulation guarantees working silicon.",
          ],
          answerIndex: 0,
          explanation:
            "Simulation proves functional correctness under ideal timing. It cannot prove signals settle before the clock edge — that is the job of static timing analysis, which is why both are required.",
        },
      ],
    },

    {
      slug: "complete-combinational",
      title: "Combinational Logic Without Latches",
      summary:
        "Writing if/case logic that always produces a value, and understanding why 'incomplete assignment' is the most common structural bug in RTL.",
      minutes: 7,
      objectives: [
        "Write if and case branches with defaults so no latch is ever inferred.",
        "Explain how a missing else branch becomes a storage element.",
        "Use priority and casez/casex deliberately rather than by accident.",
      ],
      sections: [
        {
          heading: "Every path must produce a value",
          body: [
            "In a clocked always block, holding a value between cycles is the whole point, so an unassigned branch simply retains the previous register value. In a combinational always block, holding a value is never the intent — the output must be a function of the current inputs — so any branch that fails to assign becomes a latch.",
            "The rule that prevents this is mechanical: give every conditional a complete set of assignments, or establish a default at the top of the block before the conditionals. With a default already assigned, any branch that declines to override it still leaves a defined value.",
          ],
        },
        {
          heading: "Priority is implicit, so make it explicit",
          body: [
            "An if/else chain always implies priority: the first matching branch wins and later ones are ignored. That is usually fine, but it means the last else is doing real work as the catch-all. If you intend all cases to be treated equally — as in a decoded instruction — a case statement is the clearer expression of that intent.",
            "A `case` in which several items share one output can be written with comma-separated labels. A `case` that must ignore don't-care bits uses `casez`. The danger is `casex`, which also treats X as a wildcard: convenient in simulation, dangerous in synthesis because it can silently mask real mismatches.",
          ],
        },
        {
          heading: "Two habits worth building",
          body: [
            "First, put the default assignment at the top, before any if or case. It costs nothing and eliminates the entire class of latch bugs in one line. Second, run a lint tool or check your synthesis log for inferred latches on every change — they are easy to introduce and easy to miss in review.",
            "Neither habit is about style. An unintended latch changes your timing, breaks your static assumptions, and can hold stale state across operations that were supposed to be independent. It is a correctness defect, not a cosmetic one.",
          ],
        },
      ],
      example: {
        title: "Same decoder, latch-free and latching versions",
        language: "verilog",
        code: `// BUG: incomplete -> infers a LATCH on y
always @(*) begin
  case (sel)
    2'b00: y = a;
    2'b01: y = b;
    2'b10: y = c;
    // 2'b11 missing -> y holds previous value
  endcase
end

// CORRECT: default first, then override
always @(*) begin
  y = 1'b0;              // default: no latch possible
  case (sel)
    2'b00: y = a;
    2'b01: y = b;
    2'b10: y = c;
    // 2'b11 falls through to the default 0
  endcase
end`,
        explanation: [
          "In the buggy version, selecting 2'b11 leaves y unassigned, so synthesis must build a latch to remember its old value — state you never asked for.",
          "Assigning the default first guarantees every input combination drives y, so the block is purely combinational by construction.",
        ],
      },
      exercise: {
        prompt:
          "You write an if/else inside `always @(posedge clk)` and forget the else branch. Does this infer a latch? Explain why this differs from the same omission in a combinational block.",
        hint: "Consider what 'holding a value' means when a clock edge is involved.",
        solution:
          "No latch is inferred. In a clocked block, an unassigned branch means the register simply keeps its current value on that clock edge — which is exactly what a register is supposed to do. The omission only becomes a bug if you intended the register to change on that path. The same omission in a combinational block infers a latch, because there a held value is never intended.",
      },
      checks: [
        {
          question: "What is the most reliable way to prevent inferring a latch in a combinational always block?",
          options: [
            "Assign a default value at the top of the block before any conditional.",
            "Use blocking assignments everywhere.",
            "Add more inputs to the sensitivity list.",
            "Declare the output as a wire instead of a reg.",
          ],
          answerIndex: 0,
          explanation:
            "A default assignment guarantees every path drives the output, so no condition can leave it unassigned. Sensitivity lists and declarations do not address completeness.",
        },
        {
          question: "What does an if/else chain always imply about the branches?",
          options: [
            "Priority: the first matching branch wins and later ones are ignored.",
            "That all branches are evaluated and OR-ed together.",
            "That branches execute in parallel on different hardware.",
            "That the last branch has the highest priority.",
          ],
          answerIndex: 0,
          explanation:
            "An if/else chain is inherently prioritised — the final else is the catch-all. If you want no priority, use a case statement with distinct labels.",
        },
        {
          question: "Why can `casex` be dangerous in synthesised RTL?",
          options: [
            "It treats X as a wildcard, which can silently mask real mismatches.",
            "It cannot be synthesised at all.",
            "It is slower than case.",
            "It forces a latch to be inferred.",
          ],
          answerIndex: 0,
          explanation:
            "Because `casex` ignores X (and in simulation Z), a comparison can match on bits that are actually unknown, hiding an error rather than exposing it. `casez` handles don't-care input bits more explicitly.",
        },
      ],
    },

    {
      slug: "sequential-clocking",
      title: "Registers, Edges, and Blocking vs Non-blocking",
      summary:
        "How to write a proper clocked register, why the choice of assignment operator is a correctness decision, and the one rule that prevents race bugs.",
      minutes: 8,
      objectives: [
        "Write a synchronous register with correct reset behaviour.",
        "State the rule for when to use `<=` versus `=` and explain the race it prevents.",
        "Explain why mixing both operators in one clocked block is a defect.",
        "Describe edge detection and simple synchronous pipelining.",
      ],
      sections: [
        {
          heading: "Registers only change on the edge",
          body: [
            "A clocked always block triggers only on the rising (or falling) edge of the clock. Between edges, the register's output is stable no matter what its input does — this stability is what lets the rest of your logic settle before it is sampled again.",
            "Reset deserves the same care. An asynchronous reset takes effect immediately regardless of the clock; a synchronous reset is only honoured at an edge. Whichever you choose, apply it consistently across the design, because mixing them introduces subtle differences in how the design comes out of reset.",
          ],
        },
        {
          heading: "Non-blocking assignment is the race guard",
          body: [
            "When several registers read each other's outputs on the same clock edge, they must all sample the *old* values, not a mixture of old and newly-updated ones. Non-blocking assignment (`<=`) does exactly that: it schedules the update rather than applying it immediately, so every register in the block sees the pre-edge state.",
            "Blocking assignment (`=`) applies immediately, so a later statement can see the value that an earlier statement just wrote. In a clocked block that creates a race: simulation order decides the result, and the synthesised hardware may not match what you observed. This is the classic 'works in simulation, fails in silicon' defect.",
          ],
        },
        {
          heading: "The rule, stated once",
          body: [
            "Use non-blocking (`<=`) for anything that assigns a clocked register. Use blocking (`=`) only in combinational blocks that drive a temporary or a combinational output. Never mix both operators for the same variable.",
            "Follow that rule and an entire category of ordering bugs disappears. The reason it is worth memorising precisely is that the failure it prevents is intermittent and order-dependent — the worst kind to debug on real hardware.",
          ],
        },
      ],
      example: {
        title: "Pipeline register with non-blocking assignments",
        language: "verilog",
        code: `module pipe #(parameter W = 8)
  (input clk, input rst, input [W-1:0] d, output reg [W-1:0] q);

  reg [W-1:0] q_prev;

  always @(posedge clk or posedge rst) begin
    if (rst) begin
      q_prev <= 0;
      q      <= 0;
    end else begin
      // both sample the OLD values -> correct shift
      q      <= q_prev;
      q_prev <= d;
    end
  end
endmodule`,
        explanation: [
          "Both assignments are non-blocking, so `q_prev <= d` and `q <= q_prev` both use the values before this edge. The register genuinely shifts by one stage.",
          "If `q_prev` were assigned with `=` first, `q <= q_prev` would read the *new* value of q_prev, and the stage would collapse into one cycle of delay instead of two.",
        ],
      },
      exercise: {
        prompt:
          "A colleague writes both `q = d;` and `q <= d;` for the same register in one always block. Explain the specific hazard and what the synthesiser and the simulator may each do.",
        hint: "Consider what each operator does to the variable's value at the moment it executes.",
        solution:
          "The block assigns the same register with both operators, which is explicitly prohibited by the coding standard and by synthesis tools. The simulator will produce a result that depends on statement order and on how the scheduler processes the mixed assignments; the synthesiser may infer different logic than the simulation showed, or reject the code. The register's behaviour becomes unpredictable across the sim/synthesis boundary, so it must be rewritten using only non-blocking.",
      },
      checks: [
        {
          question: "Why must clocked registers use non-blocking assignment?",
          options: [
            "It schedules updates so every register samples pre-edge values, avoiding races.",
            "It is faster to simulate than blocking assignment.",
            "It is required for the block to be synthesised at all.",
            "It prevents the register from being reset incorrectly.",
          ],
          answerIndex: 0,
          explanation:
            "Non-blocking defers the update until all reads in that time step are done, so registers reading each other all see the old values — which is what the hardware does.",
        },
        {
          question: "What does blocking assignment (`=`) do that makes it unsafe in a clocked block?",
          options: [
            "It applies the value immediately, so later statements can read the new value and create an order-dependent race.",
            "It blocks the clock until the assignment completes.",
            "It forces the value to be stored in a latch.",
            "It cannot be used with multi-bit signals.",
          ],
          answerIndex: 0,
          explanation:
            "Immediate update means statement order changes the result in simulation, while synthesis may build different hardware — a sim/synthesis mismatch.",
        },
        {
          question: "What is the difference between asynchronous and synchronous reset?",
          options: [
            "Async reset takes effect immediately regardless of the clock; sync reset is only honoured at a clock edge.",
            "Async reset clears all registers; sync reset clears only one.",
            "Sync reset requires a separate reset clock domain.",
            "There is no functional difference, only naming.",
          ],
          answerIndex: 0,
          explanation:
            "Async reset acts on the level of the reset signal itself; sync reset is treated as a normal input sampled at the edge. Mixing the two styles in one design creates inconsistent reset behaviour.",
        },
      ],
    },

    {
      slug: "testbench-and-verification",
      title: "Driving a Design With a Self-checking Testbench",
      summary:
        "Separating design from stimulus, checking results automatically rather than eyeballing waveforms, and the difference between directed and random tests.",
      minutes: 8,
      objectives: [
        "Structure a testbench with no ports that instantiates the design under test.",
        "Replace manual waveform inspection with an automated pass/fail check.",
        "Explain why directed tests alone give false confidence.",
        "Describe a simple scoreboard and what coverage adds to it.",
      ],
      sections: [
        {
          heading: "The testbench lives outside the design",
          body: [
            "A testbench is itself a module but with no ports: it reaches into the design through hierarchical references or by connecting to its ports from the outside. It generates stimulus, applies it, and observes responses. Keeping it strictly separate from the design means the design itself stays clean of simulation-only code.",
            "The clock and reset are usually produced by the testbench. A common pattern is a free-running clock driven by an always block that flips every half-period, with reset applied for a few cycles at the start and released in a controlled way so the design leaves reset predictably.",
          ],
        },
        {
          heading: "Checking beats looking",
          body: [
            "Watching a waveform and deciding it 'looks right' does not scale and cannot be repeated reliably. A self-checking testbench compares the actual result against an expected value and raises an error the moment they differ, which turns verification into something you can run a thousand times in regression.",
            "The expected value can come from a reference model, a golden vector file, or a simple assertion about what must never happen. Whichever you choose, the goal is the same: the test must be able to fail loudly and unambiguously, because a test that cannot fail is not a test.",
          ],
        },
        {
          heading: "Directed tests are necessary but not sufficient",
          body: [
            "Directed tests target specific corners you thought of — boundary values, the documented illegal case, the corner you hit last time. They are essential for known hazards, but they only explore the corners you already imagined, which is exactly the blind spot in a new design.",
            "Constrained random testing fills that gap by letting the tool generate combinations you would not have enumerated, while a coverage model measures which parts of the design were actually exercised. Coverage is what tells you your testing is complete rather than merely passing — it converts 'no bugs found' into a quantitative claim.",
          ],
        },
      ],
      example: {
        title: "A minimal self-checking testbench",
        language: "verilog",
        code: `module tb;
  reg a, b, c;
  wire y;
  integer errors = 0;

  majority3 dut(.a(a), .b(b), .c(c), .y(y));   // design under test

  // free-running clock-like stimulus generator omitted for combinational DUT

  task check(input ea, input eb, input ec, input ey);
    begin
      a = ea; b = eb; c = ec;
      #1;                                  // let combinational logic settle
      if (y !== ey) begin
        errors = errors + 1;
        $display("FAIL: %b%b%b -> got %b, want %b", ea,eb,ec, y, ey);
      end
    end
  endtask

  initial begin
    check(0,0,0, 0);  check(1,1,0, 1);
    check(1,1,1, 1);  check(0,1,0, 0);
    if (errors == 0) $display("PASS"); else $display("%0d ERRORS", errors);
    $finish;
  end
endmodule`,
        explanation: [
          "The `check` task drives inputs, waits for settle time, and compares against an expected value — so the test fails loudly instead of relying on someone reading a waveform.",
          "Counting errors and printing a final PASS/FAIL summary is what makes this runnable in an automated regression rather than interactively.",
        ],
      },
      exercise: {
        prompt:
          "Your directed testbench passes 100% of cases but the design fails in the field. Give two concrete reasons coverage would have caught what your tests missed, and describe the fix.",
        hint: "Think about what your tests did not enumerate and what a coverage model measures.",
        solution:
          "(1) The tests only covered the corners you thought of — a state or input combination outside that set was never exercised, so its bug was never triggered. A coverage model would report the un-hit bins. (2) An ordering/timing corner (e.g. back-to-back requests, reset during operation) was not directed at. The fix is to add a constrained-random phase plus a coverage model reporting which bins remain unhit, then write targeted tests to close them.",
      },
      checks: [
        {
          question: "What is the primary advantage of a self-checking testbench over watching waveforms?",
          options: [
            "It detects mismatches automatically and can run repeatedly in regression.",
            "It simulates faster than a waveform viewer.",
            "It removes the need for a reference model.",
            "It guarantees the design is correct.",
          ],
          answerIndex: 0,
          explanation:
            "Automatic comparison turns verification into an objective, repeatable pass/fail signal. Waveform inspection is subjective and cannot scale to thousands of runs.",
        },
        {
          question: "Why are directed tests alone insufficient for confidence in a new design?",
          options: [
            "They only explore the corners you already thought of, leaving unimagined cases untested.",
            "They are too slow to run.",
            "They cannot be used with clocked designs.",
            "They always produce false failures.",
          ],
          answerIndex: 0,
          explanation:
            "Directed tests encode your existing assumptions. Bugs frequently live in combinations you did not consider, which is what random stimulus plus coverage is designed to expose.",
        },
        {
          question: "What does a functional coverage model actually measure?",
          options: [
            "Which parts of the design's behavioural space were actually exercised.",
            "How many lines of RTL were executed.",
            "How fast the simulation ran.",
            "How many assertions passed.",
          ],
          answerIndex: 0,
          explanation:
            "Coverage quantifies which bins of the intended behaviour were hit, converting 'nothing failed' into a measurable statement about what was tested — and what was not.",
        },
      ],
    },
  ],
};
