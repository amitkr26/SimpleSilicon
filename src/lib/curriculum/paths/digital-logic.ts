// Original lesson content written for SimpleSilicon.
// Subject basis: standard digital-design topics covered in any
// undergraduate computer-architecture or digital-electronics course
// (number systems, Boolean algebra, sequential logic, finite state
// machines). All wording below is original.
import type { CurriculumPath } from "../types";

export const DIGITAL_LOGIC: CurriculumPath = {
  slug: "digital-logic",
  title: "Digital Logic Foundations",
  level: "Beginner",
  category: "foundations",
  summary:
    "Number systems, Boolean algebra, the handful of combinational blocks everything else is built from, and the two ideas — clocks and state — that turn logic into sequential circuits.",
  outcomes: [
    "Convert values between binary, hexadecimal and decimal, and reason about fixed-width arithmetic including overflow.",
    "Prove and simplify Boolean expressions using Boolean algebra and Karnaugh maps.",
    "Read and construct the canonical combinational blocks: adders, multiplexers, decoders, comparators.",
    "Explain what a flip-flop actually stores, how clock edges sample it, and why skew matters.",
    "Model a synchronous control block as a Moore or Mealy state machine and implement it in two always blocks.",
  ],
  prerequisites: [],
  tools: [],
  modules: [
    {
      slug: "bits-and-base",
      title: "Bits, Bases, and Why Width Is Everything",
      summary:
        "How numbers become bits, what the position of a bit is worth, and what an N-bit machine can and cannot represent.",
      minutes: 7,
      objectives: [
        "Decode a value from any positional base and encode a value into binary or hexadecimal.",
        "Distinguish the signed and unsigned interpretations of a fixed-width bit pattern.",
        "Predict the result of a fixed-width addition that overflows, and say why it is silent.",
      ],
      sections: [
        {
          heading: "A bit has no type — its position does",
          body: [
            "A single bit is only a switch that is either open or closed, and on its own it cannot hold a number. What gives a bit pattern meaning is position: in every base, the value of a slot is the base raised to the power of how far left of the point it sits. That single rule is the whole of positional notation, and it is worth internalising, because hardware almost never tells you which interpretation you are looking at.",
            "The hardware stores the same toggle of charges whether you decide to read it as unsigned, as two's-complement, or as a character. Choosing the interpretation is a decision made by the instruction, the operator, or the wire — not by the storage. This is why the same sixteen-bit pattern `0xFFFF` can mean 65535 to one instruction and -1 to another without a single bit changing.",
          ],
        },
        {
          heading: "Signed and unsigned are the same bits",
          body: [
            "Two's-complement is the encoding almost every modern processor uses for signed integers, and its useful trick is that addition and subtraction circuits do not need to know which encoding is in use. To negate a two's-complement number you invert every bit and add one. The sign is not a separate flag; it is simply the value of the most significant bit read at the correct weight.",
            "When a fixed-width addition overflows, the carry out of the most significant bit is silently dropped, and the result wraps. Signed overflow is more dangerous than it looks: the sign bit flips on its own, so a growing positive value can become a large negative value with no instruction signalling a fault. Correct code has to check the carry explicitly or reason about the valid range before the operation.",
          ],
        },
        {
          heading: "Working in hexadecimal",
          body: [
            "Engineers almost never count in binary in practice, because the bit strings become unmanageable past about sixteen bits. Hexadecimal survives because sixteen is an exact power of two: each hex digit maps to exactly four bits, so a value can be converted one nibble at a time with no arithmetic.",
            "The habit worth building is to read hex as a compact window onto the bits rather than as a separate number system. Seeing `0xB7` and knowing immediately that it is `1011_0111` — and that the top nibble is `1011` because `B` is eleven — is faster and less error-prone than doing base conversion by hand.",
          ],
        },
      ],
      example: {
        title: "Reading an 8-bit pattern three ways",
        language: "text",
        code: `pattern = 0b1111_1011   (hex 0xFB)

unsigned  : 251
signed    : -5          (two's complement: invert + 1)
             invert -> 0b0000_0100
             add 1  -> 0b0000_0101 = 5, so -5

eighth bit (sign)       : 1  -> negative
low nibble              : 0xB = 1011 -> 11`,
        explanation: [
          "The same eight toggles decode to 251 under unsigned reading and to -5 under two's-complement reading. Nothing about the storage changed; only the weight assigned to the top bit did.",
          "Because the top bit is 1, any signed reader already knows the number is negative before it does any arithmetic. That is the entire job of the sign bit in this encoding.",
        ],
      },
      exercise: {
        prompt:
          "An 8-bit accumulator holds 0x7F (127, signed). It adds 1. What pattern results, what is the unsigned value, and what is the signed value? Explain the wrap.",
        hint: "127 is the largest positive value in signed 8-bit. Add one and watch what happens to the sign bit.",
        solution:
          "127 + 1 = 128, which needs bit 7 set: 0x80. Unsigned that reads 128, but signed two's-complement reads -128. The addition was correct at the bit level; only the interpretation flipped. This is signed overflow — a growing positive value jumped to the most negative value with no fault raised.",
      },
      checks: [
        {
          question: "Why is hexadecimal used as the standard compact notation for bit strings?",
          options: [
            "Because 16 is an exact power of two, so each digit maps cleanly onto four bits.",
            "Because it is the base processors natively compute in.",
            "Because it needs fewer characters than binary for decimal values.",
            "Because two's-complement only works in base 16.",
          ],
          answerIndex: 0,
          explanation:
            "The useful property is that 16 = 2^4, so conversion to and from binary is a digit-by-digit substitution with no arithmetic. Decimal does not share this property, which is why it is poor at exposing raw bits.",
        },
        {
          question: "The pattern 0xFF in 8 bits is read as signed. What does it represent?",
          options: ["127", "255", "-1", "-128"],
          answerIndex: 2,
          explanation:
            "In two's-complement, all-ones is -1: invert to 0x00, add 1 to get 1, so the value is -(1) = -1. All-ones is the most negative-looking pattern but is actually the value just below zero.",
        },
        {
          question: "What causes signed overflow to go unnoticed by the arithmetic hardware?",
          options: [
            "The carry out of the top bit is dropped, so the sign bit flips on its own.",
            "The processor checks the sign bit and raises an exception automatically.",
            "Two's-complement arithmetic cannot overflow.",
            "Overflow only occurs with floating-point values.",
          ],
          answerIndex: 0,
          explanation:
            "Addition is performed uniformly and the final carry is discarded, so the pattern simply wraps. There is no automatic flag raised by the adder itself; detecting overflow requires comparing the operands' sign with the result's sign.",
        },
      ],
    },

    {
      slug: "boolean-and-kmaps",
      title: "Boolean Algebra and Karnaugh Maps",
      summary:
        "The handful of laws that govern every logic gate, and a visual method for turning a truth table into the cheapest circuit that computes it.",
      minutes: 8,
      objectives: [
        "Apply De Morgan's laws and the idempotent/distributive laws to transform a Boolean expression.",
        "Build a Karnaugh map from a truth table and read off the minimal sum-of-products.",
        "Explain why a circuit that is logically correct but written wastefully still costs real area and delay.",
      ],
      sections: [
        {
          heading: "Boolean algebra is normalisation, not memorisation",
          body: [
            "Every law of Boolean algebra exists to move an expression toward a form that is cheaper to build. Idempotence lets you delete redundant terms; distributive factoring lets you share a common sub-expression between several outputs; and De Morgan's lets you rewrite an AND into an OR with inverted inputs, which matters when your technology library offers one gate type more cheaply than another.",
            "The reason to care is that two expressions that are logically identical are not economically identical. A raw sum-of-products for some functions can contain far more gates than the minimal form, and every extra gate is area, power, and a slice of delay on the critical path.",
          ],
        },
        {
          heading: "Karnaugh maps as a picture of adjacency",
          body: [
            "A Karnaugh map is a truth table laid out so that rows differing in exactly one variable sit next to each other. Because adjacent cells differ by a single bit, a group of adjacent 1s corresponds to a term in which exactly one variable has been dropped — and dropping a variable is exactly what makes the expression cheaper.",
            "The two rules that prevent most errors: groups must be rectangles of size a power of two (1, 2, 4, 8…), and you may wrap around the edges of the map because the layout is circular, not a grid with hard borders. Larger groups mean fewer literals, so you always draw the biggest rectangles you can, overlapping them as needed to cover every 1 at least once.",
          ],
        },
        {
          heading: "Don't-cares and don't-oversimplify",
          body: [
            "Inputs that never occur in the real system — invalid codes, unused state encodings — produce don't-care outputs. In a Karnaugh map those cells are free: you can treat them as a 1 to grow a group larger, or as a 0 to avoid overlapping, whichever yields the smaller circuit. They are often the difference between an acceptable design and an elegant one.",
            "The trap is assuming don't-cares when they are not guaranteed. If an unreachable encoding can in fact be produced — through a reset race, a test mode, or a scan operation — you have silently built a circuit that misbehaves on a path you told yourself did not exist.",
          ],
        },
      ],
      example: {
        title: "Minimising a four-input function",
        language: "text",
        code: `f(A,B,C,D) = sum of minterms
  {0,1,2,5,8,9,10,13,15}

Karnaugh map (rows AB, cols CD):

        CD
     00  01  11  10
AB 00 1   1   0   1
   01 0   1   0   0
   11 0   1   1   0
   10 1   0   0   1

Groups:
  {0,1,8,9}      -> ~B ~D
  {0,2,8,10}     -> ~B ~D   (wraps horizontally)
  {1,5,13}       -> ~A C D  ... refine with {1,5}+{13,15}
  {13,15} + {9,11}? -> use only valid covers

Minimal SOP (one valid answer):
  f = ~B~D + ~A C D + A B D`,
        explanation: [
          "The all-corners group {0,1,8,9} drops both A and C, giving a two-literal term — the kind of reduction that does not fall out of algebra by inspection.",
          "The exact grouping depends on which don't-care cells you exploit; the point is that you always prefer the largest legal rectangle, because each extra cell merged removes one literal from the product term.",
        ],
      },
      exercise: {
        prompt:
          "A four-input detector asserts f = 1 exactly when inputs read 2, 3, 5, 7, 11, 13 (binary) as unsigned values. Draw the Karnaugh map and write the minimal sum-of-products for f.",
        hint: "Place a 1 in each listed minterm cell, then look for groups of 2 and 4 before settling for singletons.",
        solution:
          "f = ~A~B C + ~A C D + A ~B D is one valid minimal cover. The key is spotting the three pairs that each reduce a four-literal minterm down to three literals, and confirming no larger rectangle (size 4) is available, since the set of asserted codes is scattered rather than clustered.",
      },
      checks: [
        {
          question: "What makes two adjacent cells on a Karnaugh map combinable into one term?",
          options: [
            "They differ in exactly one input variable, so that variable cancels.",
            "They have the same output value.",
            "They are separated by a power of two in row index.",
            "They share the same number of set bits.",
          ],
          answerIndex: 0,
          explanation:
            "Adjacency in the map is defined to mean a single-bit difference. The differing variable is the one that disappears when the two minterms are OR-ed, which is exactly how a term gets shorter.",
        },
        {
          question: "When building groups on a Karnaugh map, what constraint applies to size?",
          options: [
            "Groups must be rectangles containing a power of two cells.",
            "Groups must be exactly four cells.",
            "Groups must not wrap around the map edges.",
            "Groups must contain only 1s and no don't-cares.",
          ],
          answerIndex: 0,
          explanation:
            "Only power-of-two rectangles correspond to cancelling a whole set of variables. Wrapping is permitted (the map is topologically circular), and don't-cares may be used as 1s.",
        },
        {
          question: "Why can using a don't-care as a 1 make the circuit cheaper?",
          options: [
            "It lets you merge a larger rectangle, which drops more literals from the term.",
            "It adds a gate that bypasses the don't-care input.",
            "It forces the output to be constant in that case.",
            "It reduces the number of truth-table rows that must be stored.",
          ],
          answerIndex: 0,
          explanation:
            "Absorbing a don't-care cell into a group grows the rectangle. Each additional cell merged can eliminate one more input variable from the resulting product term, shrinking the gate count.",
        },
      ],
    },

    {
      slug: "combinational-blocks",
      title: "The Combinational Blocks You Actually Reuse",
      summary:
        "Adders, multiplexers, decoders and comparators — the four structures that appear inside nearly every datapath, and how to reason about their delay.",
      minutes: 8,
      objectives: [
        "Explain the ripple-carry delay and why it grows linearly with operand width.",
        "Use a multiplexer to implement any logic function of a small number of variables.",
        "Describe what a decoder does and how decoders relate to one-hot state encoding.",
        "Compute a first-order propagation delay for a chain of combinational logic.",
      ],
      sections: [
        {
          heading: "Delay is a property of the path, not the gate",
          body: [
            "Combinational logic has no memory: its output is a function of its current inputs alone, and it is assumed to have settled by the time the next clock arrives. That assumption is what static timing analysis later formalises. In practice, delay accumulates along a path — each gate contributes its own propagation time, and wires contribute their own — so the slowest path through a block, not the average one, sets your clock period.",
            "The consequence is that a logically identical circuit can meet timing or miss it depending on how it is written. Factoring out a shared sub-expression saves area but can lengthen a path; duplicating logic can shorten a path at the cost of area. These are the trade-offs that stay with you for an entire career.",
          ],
        },
        {
          heading: "Why the ripple-carry adder teaches the right lesson",
          body: [
            "A ripple-carry adder adds bit by bit, forwarding each carry into the next position. It is the clearest example of a carry chain: the most significant bit cannot produce a correct answer until the carry from the least significant bit has propagated through every stage. Its delay therefore grows in proportion to the width of the operand.",
            "This is why faster adders exist. A carry-lookahead adder pre-computes group generate and propagate signals so the carry into distant positions arrives after a couple of gate delays instead of a linear walk. The trade is extra hardware and a wider fan-out — a pattern you will see repeated everywhere: pay area and complexity to buy delay.",
          ],
        },
        {
          heading: "Multiplexers as universal builders",
          body: [
            "A multiplexer selects one of several inputs according to a selector code. Because its output can be routed to any input, a 2^n-input multiplexer with n selector bits can implement any Boolean function of those n variables — you simply wire the constant 0 or 1 into each data input according to the truth table.",
            "The reason this matters in real design is that it gives you a uniform way to think about selection, which is everywhere: a datapath operand selector, a state-encoding decoder, a test-mode override, and even a portion of a lookup table in FPGA fabric are all multiplexers with different packaging.",
          ],
        },
      ],
      example: {
        title: "Carry propagation depth in a 4-bit ripple adder",
        language: "text",
        code: `  A3 B3   A2 B2   A1 B1   A0 B0
    \\/      \\/      \\/      \\/
   FA3 <--  FA2 <--  FA1 <--  FA0 <-- cin
    |       |       |       |
   S3      S2      S1      S0   + cout

Each FA = one full-adder delay (sum/carry out).
Worst case: cin must ripple through all four stages
before the top sum/cout is valid.

   delay ~ 4 * t_FA  ->  linear in width`,
        explanation: [
          "Even though each individual full adder is fast, the carry has to visit every stage, so the block's delay scales with the operand width rather than with the log of it.",
          "A carry-lookahead network breaks this by computing carries from generate/propagate terms in parallel, turning the linear chain into a shallow tree at the cost of more gates and heavier fan-out.",
        ],
      },
      exercise: {
        prompt:
          "You need a 4-input combinational function f(a,b,c,d) built from one standard component. Which component can implement it directly, and how do you wire it?",
        hint: "Think about which structure maps a selector code to one of many data inputs.",
        solution:
          "A 16-input multiplexer (4 selector bits a,b,c,d, 16 data inputs). Wire each data input to the constant 0 or 1 given by that row of the truth table. A decoder with enable plus an OR gate also works, but a single MUX does it in one stage. Any function of n variables is realisable by a 2^n-input MUX.",
      },
      checks: [
        {
          question: "Why does a ripple-carry adder's delay grow with operand width?",
          options: [
            "Each carry must propagate sequentially through every stage before the top bits are valid.",
            "Each bit needs its own dedicated clock cycle.",
            "The sum bits cannot be computed in parallel at all.",
            "Longer operands require more voltage to charge.",
          ],
          answerIndex: 0,
          explanation:
            "The carry chain is inherently sequential: stage i+1 cannot settle until stage i has produced its carry. That serial dependency is the linear-in-width term.",
        },
        {
          question: "Which structure can directly implement any function of n input variables?",
          options: [
            "A multiplexer with 2^n data inputs and n selector bits.",
            "A ripple-carry adder with n stages.",
            "A D flip-flop with n data inputs.",
            "A single NAND gate with n inputs.",
          ],
          answerIndex: 0,
          explanation:
            "The selector picks one data line, and each data line carries the function's value for that input combination — so the truth table is wired directly into the MUX.",
        },
        {
          question: "In combinational logic, what determines the maximum clock speed of a block?",
          options: [
            "The slowest propagation path through the logic, plus any wire delay.",
            "The average delay across all paths.",
            "The number of inputs to the block.",
            "The total number of gates used.",
          ],
          answerIndex: 0,
          explanation:
            "Every path must settle before the next active clock edge, so the longest (critical) path sets the minimum period. Average delay and gate count matter for power and area, not for whether the path meets timing.",
        },
      ],
    },

    {
      slug: "sequential-and-fsm",
      title: "Clocks, Flip-Flops, and State Machines",
      summary:
        "How storage elements turn a cloud of logic into a machine with memory, how to split it into Moore or Mealy form, and how to avoid the two classic bugs.",
      minutes: 9,
      objectives: [
        "Describe what a flip-flop captures on a clock edge and state the setup and hold window it requires.",
        "Explain the difference between Moore and Mealy output timing and choose between them.",
        "Decompose a control specification into states, transitions and outputs, then implement it as two clocked blocks.",
        "Identify the incomplete-assignment and unintended-latch failure modes.",
      ],
      sections: [
        {
          heading: "State is a decision sampled in time",
          body: [
            "A flip-flop stores one bit, but its behaviour is fundamentally about timing: it captures its input only during a narrow window around the active clock edge, and holds it stable the rest of the time. Inputs that arrive outside that window are ignored, which is why a signal that is logically correct but too slow relative to the clock produces intermittent, hardware-only failures.",
            "That capture window has two edges. Setup time is how long the input must be stable before the edge; hold time is how long it must remain stable after. Violating either leaves the flip-flop in a metastable state where the output has not decided — a condition that can propagate as an apparently random value into downstream logic.",
          ],
        },
        {
          heading: "Mealy vs Moore is a timing decision",
          body: [
            "A Moore machine derives its outputs purely from the current state, so an output changes only after a clock edge moves the machine into a new state. A Mealy machine lets outputs depend on the current inputs as well, so the output can respond within the same cycle rather than waiting for the next edge.",
            "Mealy gives you a faster response but couples your outputs to input glitches; Moore gives you a cleaner, registered-looking output at the cost of an extra cycle of latency. Choosing between them is less about taste and more about whether downstream logic expects a settled value immediately or after the next edge.",
          ],
        },
        {
          heading: "Two bugs that are invisible until simulation",
          body: [
            "The first is an incomplete assignment. If an if-block has no else branch, or a case statement does not cover every possible value, synthesis infers a latch so the value can be held when no branch fires. That latch was not in your intent, it changes your timing, and it is the single most common structural defect in introductory RTL.",
            "The second is the state encoding mismatch: your simulation passes with a one-hot encoding while your synthesis tool silently chooses binary, or vice versa, and any code that assumed a specific encoding now behaves differently. The defence is to declare the encoding explicitly rather than leaving it to be inferred.",
          ],
        },
      ],
      example: {
        title: "Two-process Moore machine for a simple controller",
        language: "verilog",
        code: `module ctl(input clk, input rst, input go, output reg done);
  // State register
  always @(posedge clk or posedge rst) begin
    if (rst)
      state <= IDLE;
    else
      state <= next;
  end

  // Next-state + output logic (Moore: outputs depend only on state)
  always @(*) begin
    next = state;            // default: hold
    done = 1'b0;
    case (state)
      IDLE  : if (go) next = RUN;
      RUN   : begin
                next  = DONE;
                done  = 1'b0;
              end
      DONE  : begin
                next  = IDLE;
                done  = 1'b1;   // output set from state only
              end
      default: next = IDLE;
    endcase
  end
endmodule`,
        explanation: [
          "The first always block is the register: it updates only on a clock edge and holds state. The second is purely combinational and is written as a complete assignment with a default, which is what prevents an inferred latch.",
          "Because `done` is assigned only inside branches driven by `state`, this is Moore: the output changes only after the register moves into DONE, never as a direct function of `go`.",
        ],
      },
      exercise: {
        prompt:
          "Design a two-state controller that accepts a start pulse, asserts busy for exactly three cycles, then asserts done for one cycle. Say whether Moore or Mealy fits better and explain your state choices.",
        hint: "Counting three cycles needs a state per count, or a counter register alongside the state.",
        solution:
          "Use Moore with states IDLE, BUSY, DONE, plus a small counter. IDLE -> BUSY on start; BUSY holds while the counter increments to 2; then BUSY -> DONE for one cycle; DONE -> IDLE. Moore fits because you want `busy` and `done` to be clean registered outputs that do not glitch in response to the start input. Mealy would let `busy` assert within the start cycle, but at the cost of coupling it to start's exact arrival.",
      },
      checks: [
        {
          question: "What does a flip-flop capture, and when?",
          options: [
            "Its input value, sampled within the setup/hold window around a clock edge.",
            "Its input continuously, tracking it at all times.",
            "Its output, latched back into its input each cycle.",
            "A stored value only when a reset is asserted.",
          ],
          answerIndex: 0,
          explanation:
            "A flip-flop is edge-triggered: outside the narrow setup/hold window around the active edge it ignores its input entirely, which is what makes synchronous design possible.",
        },
        {
          question: "What is the key timing difference between Moore and Mealy outputs?",
          options: [
            "Moore outputs change only after a clock edge; Mealy outputs can change within the same cycle as the input.",
            "Moore outputs are combinational; Mealy outputs are registered.",
            "Moore responds faster to inputs than Mealy.",
            "There is no timing difference, only a difference in code length.",
          ],
          answerIndex: 0,
          explanation:
            "Moore derives outputs solely from state, so they can only change when the state register updates. Mealy lets outputs depend on inputs too, giving same-cycle response but with possible glitch coupling.",
        },
        {
          question: "A synthesiser infers a latch in your sequential design. What most likely caused it?",
          options: [
            "An incomplete assignment — a missing else/default leaves a branch where nothing is driven.",
            "You used a clock edge correctly in an always block.",
            "The design has too many states.",
            "You declared the state register as reg.",
          ],
          answerIndex: 0,
          explanation:
            "If no branch assigns a value for some input combination, the logic must hold its previous value, and synthesis implements that hold with a latch. Complete assignments with defaults avoid it.",
        },
      ],
    },
  ],
};
