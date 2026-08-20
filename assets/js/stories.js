/* =====================================================================
   STORIES — the long-form write-up behind each project.
   ---------------------------------------------------------------------
   This is the foundation you asked for. Each key is a project `slug`
   from data.js. Anything with a story gets a "Read the process →" link
   on its card and a full page at  project.html?p=<slug>

   To add one, copy the shape below. Every field is optional except
   `status`, so a half-written entry still renders cleanly.

     'my-slug': {
       status:  'ready'  |  'draft',      // 'draft' shows an honest placeholder
       lede:    'One paragraph framing the problem.',
       sections: [
         { h:'Heading', p:'Paragraph. HTML allowed — <b>, <em>, <code>.' },
         { h:'Heading', list:['bullet','bullet'] },
         { h:'Heading', quote:'A pulled-out line worth emphasising.' }
       ],
       diagrams: [
         { src:'assets/img/<file>.svg', alt:'What it shows', cap:'Caption under it.' }
       ],
       journal: [
         { when:'Day 1', p:'What happened, what broke, what I changed.' }
       ],
       decisions: [
         { d:'The call I made', why:'Why, and what it cost.' }
       ]
     }

   When the per-repo READMEs are written, this is where they land — either
   pasted in, or fetched from the GitHub API at build time and dropped in
   with the same shape.
   ===================================================================== */

const STORIES = {

  /* ---------------------------------------------------------------
     Worked example, written from the repository itself.
     Use this as the template for the rest.
     --------------------------------------------------------------- */
  'datacenter-thermal-twin': {
    status: 'ready',
    lede: `A datacenter throws away an enormous amount of heat, and a district heating network
           spends money making it. HeatRouter treats that mismatch as a routing problem: heat is a
           packet, buildings are sources and sinks, and the streets between them are the network.
           Built in a weekend at a hackathon; placed 2nd.`,
    sections: [
      { h: 'What it actually does',
        p: `The frontend is a city map. Orange nodes are heat <b>sources</b> — datacenters,
            industrial plants. Blue nodes are <b>sinks</b> — buildings with heat pumps that would
            otherwise burn something. Click a sink and the optimiser picks which sources should feed
            it, solves a route along real roads, and reports route length, heat recovered, CO₂
            avoided, and cost.` },
      { h: 'The loop I built',
        p: `My part was the API, and the thing that makes it a twin rather than a diagram is that
            the loop is closed. An ESP32 simulator runs a stateful thermal model on a one-second
            tick:` ,
        list: [
          '<code>GET /api/commands</code> — read the routing decisions the frontend has made',
          'Apply heat generation: sources gain, sinks lose',
          'Apply the routing commands — transfer heat from → to, at 85% efficiency',
          'Apply ambient cooling: everything drifts back toward 45 °C',
          'Clamp to a safe range so a bad command cannot melt the model',
          '<code>POST /api/telemetry</code> — push the new temperatures back'
        ] },
      { h: 'Why the loop matters',
        p: `Without step 4 and 5, the simulation would happily report that you had recovered more
            heat than existed. Ambient drift and clamping are what stop the twin from telling you a
            flattering lie — which is the same instinct as quarantining an out-of-budget episode
            rather than averaging it in.` },
      { h: 'Routing around the real world',
        p: `Routes are solved with OSRM and a wavefront search. The part that sold the demo was
            <b>obstruction painting</b>: click two points on the map to block a road, and the
            optimiser re-routes around it live. It turns an abstract optimisation into something a
            city planner can argue with — which is the whole point of a twin.`,
        quote: `A model nobody can poke at is a slide, not a tool.` }
    ],
    decisions: [
      { d: 'Heat as a packet, streets as a network',
        why: `Framing it as packet switching meant the routing problem was already solved by
              fifty years of prior art. The hard part became the thermal model, not the graph.` },
      { d: 'Simulate the MCU rather than wire one up',
        why: `A weekend is not enough time to debug hardware and a routing engine. Simulating the
              ESP32 against the real API meant the firmware contract was exercised the whole time,
              and a physical board could drop in behind it later without the API changing.` }
    ],
    journal: [
      { when: 'Day 1', p: `Map, city selector, and source/sink model up. First version routed in
              straight lines, which looked wrong immediately — heat does not travel through
              buildings. Moved to OSRM.` },
      { when: 'Day 1, late', p: `Built the API and reorganised the project so the frontend, the
              server, and the simulator all agreed on one shape for a routing command.` },
      { when: 'Day 2', p: `Obstruction painting, then the bug that ate the morning: blocking a road
              did not change the route, because the optimiser was reading a cached graph. Wrote a
              test checklist rather than clicking around hoping.` }
    ]
  },

  /* ---------------------------------------------------------------
     Written from Inhabit/JOURNAL.md and the repository history.
     --------------------------------------------------------------- */
  'inhabit-robotics-teleop-hand-and-can-joints': {
    status: 'ready',
    lede: `A modular robot joint you can daisy-chain: each pod carries its own MCU, its own magnetic
           encoder, and a CAN transceiver, so an arm is assembled rather than wired. The board is one
           repository, the firmware is another, and the eight-byte frame between them is the only
           thing they are allowed to agree on.`,
    sections: [
      { h: 'Why a magnet, and not an optical encoder',
        p: `The MT6701 is the reason the joint knows where it is. A diametrically magnetised magnet
            sits on the shaft and the chip underneath reads the field vector — <b>no contact, nothing
            to wear, and it works straight through the plastic housing</b>. An optical encoder would
            need a window, and a window is a place for dust to get in.` },
      { h: 'The tradeoff that became a fault bit',
        p: `Magnetic sensing cares a great deal about how far the magnet sits from the die and how
            well it is centred. Get it wrong and the chip still returns an angle — a confident,
            completely wrong angle. So <code>MAGNET_OOB</code> became one of the six fault bits in the
            wire format rather than something the firmware quietly tolerates.`,
        quote: `A sensor that can no longer see is required to say so. It is not allowed to guess.` },
      { h: 'Two repositories, one contract',
        p: `The board repo holds the schematic, the layout, the BOM, the encoder symbol and footprint,
            and a STEP export for mechanical fit. It contains <b>no firmware at all</b> — no
            <code>.c</code>, no <code>.h</code>, no Makefile, in any of the 27 commits. The C that runs
            on the pod lives in the software repo, and the CAN format the board speaks is defined in
            <code>can_frame.h</code> with a byte-identical Python mirror in <code>codec.py</code>.
            Anyone reading only one repository sees half the system.` },
      { h: 'What is deliberately not committed',
        p: `No Gerbers, no drill files. <code>.gitignore</code> has excluded the fabrication outputs
            since the first commit — they regenerate from the source documents, and committing them
            invites the two drifting apart. Two <code>.zip</code> archives did get committed early on,
            4.1&nbsp;MB and 1.7&nbsp;MB, and that was a mistake: opaque to diff, permanent in the
            history, and meaningless in a year.` }
    ],
    diagrams: [
      { src:'assets/img/work/inhabit-encoder-macro.jpg',
        alt:'Macro view of the encoder board seated in the joint face',
        cap:'The MT6701 in its SOIC package, seated in the joint face. Four mounting holes, decoupling passives either side, and the pad rows that carry power and the SPI lines out to the pod MCU.' },
      { src:'assets/img/work/inhabit-exploded.jpg',
        alt:'Exploded view of a joint showing housing, bearing, magnet, encoder board and harness',
        cap:'Exploded. The magnet rides on the shaft, the encoder board faces it across a fixed air gap, and the harness carries power and the CAN pair through to the next pod.' },
      { src:'assets/img/work/inhabit-arm.jpg',
        alt:'Full arm assembled from daisy-chained joint modules',
        cap:'Assembled. Every joint is the same module; the base controller works out their order by enumeration rather than being told.' }
    ],
    decisions: [
      { d: 'Freeze the wire format before either side is written',
        why: `Eight bytes, fixed field order, XOR checksum. It is the only interface between a board
              in C and a host in Python, so it was defined first and has not moved since. New
              capability means a new arbitration ID, never a redefined field.` },
      { d: 'Keep the raw ADC reading on the wire alongside the calibrated angle',
        why: `It costs two bytes of a very tight frame. It buys the ability to recompute every episode
              ever recorded if calibration later turns out to be wrong — which is not a decision you
              can reverse after the fact.` }
    ],
    journal: [
      { when: '22 April 2026', p: `Seven commits, zero commit messages. I was treating git as a save
              button rather than a record, and four of them predate the remote by ninety seconds.` },
      { when: '23 April 2026', p: `Added the MT6701 symbol, footprint, and the STEP export for
              mechanical fit. Three of the day's ten commits changed no files at all — the reflex of
              committing after Altium has already saved.` },
      { when: '24 April 2026 — the collision', p: `A teammate pushed from the wrong working directory
              and <b>deleted the PCB document from the repository</b>. Three hours later it came back
              in a commit titled "from correct folder". My side was a twelve-minute recovery burst:
              resolve, restore, restore again. Two full-file rewrites of the project file in five
              hours, in opposite directions.` },
      { when: 'What it taught me', p: `<b>Altium binaries cannot be merged.</b> Git will happily let
              two people edit a <code>.PcbDoc</code> and then hand you a conflict no tool on earth can
              resolve — there is no three-way merge for an OLE compound file. The only workable
              discipline is one person holding a document at a time, agreed out of band. We had been
              using git as if the files were text. They are not.` },
      { when: '10 June 2026', p: `"Save final PCB routing before JLCPCB order" — the commit where it
              stopped being a file and started being a thing that costs money to get wrong.` }
    ]
  },

  /* ---------------------------------------------------------------
     Written from Inhabit-Software/JOURNAL.md.
     --------------------------------------------------------------- */
  'inhabit-data-pipeline': {
    status: 'ready',
    lede: `The host side of the joint pod: firmware in C, a Python pipeline that turns CAN frames into
           robot training data, a ROS 2 bridge, and an export path to Parquet, LeRobot and HDF5.
           349 commits between 27 June and 20 July 2026 — 23 days, 286 pull requests, 274 of them
           merged. Every gate in the repository exists because something got through.`,
    sections: [
      { h: 'The rule the whole thing is built on',
        p: `Fail loud. It shows up in three places, and it is the thread that connects them:`,
        list: [
          '<code>decode_state</code> never drops a frame — it computes the XOR check, sets a <code>valid</code> flag, and raises only on a wrong-length frame',
          'the ROS 2 bridge publishes frames that failed the checksum <b>anyway</b>, with <code>checksum_valid=False</code> and a throttled warning',
          'an episode outside the jitter budget is quarantined with a written reason, not averaged into the dataset'
        ],
        quote: `A logger that quietly discards corrupted frames reports a clean bus. That is worse than
                useless — it is actively misleading about the one thing it was built to observe.` },
      { h: 'The jitter budget, and what refusing looks like',
        p: `<code>JitterBudget</code> allows a p99 of 2&nbsp;ms, a gap factor of 2.5, and a minimum of
            two samples. Against a 10&nbsp;ms nominal period that is ±20% — generous for a
            non-realtime host, tight enough that frames still line up with a 30/60&nbsp;fps video
            timeline. Four things can refuse an episode: too few samples, a monotonic clock that went
            backwards, dropouts where an interval exceeded the gap factor, and a p99 over budget. A
            failed episode writes <b>nothing</b> to the dataset directory — it writes
            <code>quarantine/&lt;episode_id&gt;.quarantine.json</code> recording the reasons and the
            stats, and <code>finalize()</code> returns <code>exported=False</code>. Jitter is measured
            and logged whether the episode passes or fails, so the number exists on the good path too.` },
      { h: 'p99 of deviation from the median, not standard deviation',
        p: `A handful of large dropouts inflates a standard deviation and hides the fact that typical
            timing was fine. Median-deviation tells you about the common case; the separate
            <code>dropouts</code> counter tells you about the tail. Collapsing them into one number
            would have made both unreadable.` },
      { h: 'Written with an AI pair, and what that changed',
        p: `Nearly every commit in this repository carries a <code>Co-authored-by: Claude</code>
            trailer. The architecture, the constraints, the protocol design and the decisions recorded
            in <code>docs/decisions/</code> are mine; a large amount of the implementation was written
            with an AI pair. Better to say that here than have someone find it in <code>git log</code>
            and wonder what else was not mentioned. What it changed: code stopped being the bottleneck
            and <b>review</b> became it. 286 pull requests in 23 days is only survivable if the gates
            are automated and unforgiving, which is why this repo has a mypy-strict configuration, a
            coverage floor, a frozen-contract verifier and a test-count ratchet. They exist because no
            one person could read everything.` },
      { h: 'Two green pull requests, one red merge',
        p: `30 June. PR #28 added <code>list_adapters</code> using <code>sorted(_REGISTRY)</code>.
            PR #32 turned <code>_REGISTRY</code> into a non-iterable <code>Registry[T]</code>. Each was
            green on its own; combined, <code>sorted(_REGISTRY)</code> raised <code>TypeError</code>.
            The fix was four lines. The lesson was not: <b>CI proves each branch is green against
            <code>main</code> as it was when the branch started, not as it will be when it lands.</b>
            With 286 pull requests and 260 branches in three weeks, that gap is where the bugs live.` },
      { h: 'The state machine nothing called',
        p: `The ENUM enumeration protocol was implemented, reviewed and merged — into a file nothing
            called. <code>main.c</code> still had a TODO stub where the state machine should have been
            wired in. The consequence, from the fix commit: <b>every schema-v1 frame on the bus carried
            <code>chain_index = 0</code></b>. Every pod claimed to be the first joint in the chain. The
            code was correct, tested and merged; the system was broken. The follow-up added a CI step
            that compiles <code>main.c</code> and runs <code>test_enum_integrate</code>, so the
            orphan regression cannot silently return with CI green.`,
        quote: `Testing a module proves the module works. It does not prove anything calls it.` },
      { h: 'The interrupt that would have died silently',
        p: `27 June: drop <code>ERRIE</code> and <code>MERRE</code> from the loopback
            <code>CANINTE</code>. The MCP2515 asserts a single <code>/INT</code> line, level-triggered,
            held low until the source is cleared. Enabling the error and message-error interrupts meant
            the first bus error would latch <code>/INT</code> low forever — and because the host waits
            on an edge, the RX interrupt would never fire again. The bus would look silent. Not
            errored: <em>silent</em>, which is the worst possible failure signature.` },
      { h: 'The docstring that lied',
        p: `<code>parquet_io.py</code> promised an fsync in its comment and did
            <code>write_table</code> plus <code>os.replace</code> in its body. Anyone reading it would
            have believed data was durable on disk. It was not. Implementing the fsync turned up a
            second problem: on Windows, <code>os.fsync</code> on a read-only handle raises
            <code>EBADF</code>, so the file has to be reopened <code>O_RDWR</code> purely so the sync
            is legal. The parent directory is fsynced too where <code>O_DIRECTORY</code> exists.` },
      { h: 'Still open',
        list: [
          'The root <code>README.md</code> is stale — it says firmware and host are "to be built". Both exist.',
          'PR #286 is still open, and 11 pull requests were closed without merging without recording why.',
          '<code>MIGRATIONS = {}</code> in <code>parquet_io.py</code> — the schema-migration mechanism exists and is empty. The first real schema change tests whether it works.',
          'The coverage floor is 90 and its own comment says ratchet toward 95. It has not moved.',
          '260 branches, almost all merged and never deleted.'
        ] }
    ],
    decisions: [
      { d: 'Publish the corrupted frame instead of dropping it',
        why: `Dropping it makes a failing bus indistinguishable from a healthy one. Publishing it with
              <code>checksum_valid=False</code> costs a flag on the message and a throttled log line,
              and turns a silent fault into a recorded one.` },
      { d: 'Quarantine, never repair',
        why: `Dataset-level quarantine moves files with <code>os.replace</code> and writes the sidecar
              <em>before</em> the move. It never deletes and never repairs, and it refuses outright
              rather than guessing when replay is non-deterministic, when no parquet can be attributed,
              on destination collision, and when an <code>episode_id</code> read out of untrusted
              parquet contains a path separator, <code>..</code> or a NUL byte. A pipeline that always
              produces output will eventually hand you garbage and call it data.` },
      { d: 'Freeze the codec and test it against the compiled C',
        why: `<code>codec.py</code> is marked FROZEN in <code>pyproject.toml</code> with the comment
              "byte-identical with firmware", and <code>test_firmware_host_parity.py</code> compiles
              the C and checks it against the Python. Without that the two copies of the frame layout
              would have diverged inside a week.` }
    ],
    journal: [
      { when: '27 June 2026', p: `First day, and three of the repository's sharpest bugs land in it:
              the <code>/INT</code> latch, the fsync the docstring had been promising, and a git
              auto-merge that produced duplicate <code>[tool.ruff]</code> tables in
              <code>pyproject.toml</code>. Invalid TOML, and the entire host test run errored — git's
              line-based merge has no idea a TOML table can only appear once.` },
      { when: '30 June 2026', p: `The integration regression from merging #28 on top of #32. Four
              lines to fix, and the reason every later gate exists.` },
      { when: 'The ratchet', p: `Test count climbed 18 → 26 → 183 → 947 → 3892 → 5474 → <b>6,053</b>
              across 232 test files, with a ratchet test pinning a floor of 6,000 so the number cannot
              quietly go backwards. Coverage is gated at 90. CI runs Python 3.11 and 3.12, blocking
              <code>ruff</code> and <code>mypy</code>, and eight C compilations under
              <code>-Wall -Wextra -std=c11</code>.` },
      { when: 'The process document written the day it was needed', p: `PR #62: "re-apply CodeRabbit
              review nits lost in parallel merge", immediately followed by PR #61, a collaboration
              document defining lanes and a PR workflow to prevent merge conflicts. Which is the only
              time a process document is any good.` },
      { when: '20 July 2026', p: `Last commit. Speed moved the bottleneck; it did not remove it.
              Merging a dozen pull requests a day produces integration failures you would never see at
              a normal pace.` }
    ]
  },

  /* ---------------------------------------------------------------
     Written from Inhabit_UI/JOURNAL.md.
     --------------------------------------------------------------- */
  'teleoperation-console': {
    status: 'ready',
    lede: `Drag an end effector in a browser and a simulated arm follows at 100&nbsp;Hz; episodes
           record and replay. 51 commits between 2 July and 23 July 2026. The piece of work here I
           care most about is a port of CPython's Mersenne Twister to TypeScript, and it comes with a
           correction I would rather make myself than have someone else find.`,
    sections: [
      { h: 'Why a browser needs CPython&rsquo;s RNG specifically',
        p: `The Python simulator generates sensor noise from a seeded RNG, so a given seed always
            produces the same episode. The browser demo needed to produce <em>the same</em> episode
            from <em>the same</em> seed — otherwise the thing on the website and the thing on the bench
            are two different systems that merely look alike, and a bug you chase in one might not
            exist in the other. JavaScript has no seedable RNG; <code>Math.random()</code> cannot be
            seeded at all. So the choice was to give up determinism in the browser, or reimplement
            CPython's <code>random</code> module in TypeScript.` },
      { h: 'The four places a reasonable implementation differs',
        p: `<code>src/shared/sim/mt19937.ts</code> is 121 lines with the standard constants —
            <code>N = 624</code>, <code>M = 397</code>, <code>MATRIX_A = 0x9908b0df</code> — and the
            full tempering chain. MT19937 is a page of well-documented code. Matching <em>CPython</em>
            is where the work was:`,
        list: [
          '<b>Seeding.</b> <code>Random(n)</code> for an integer seed takes the absolute value, decomposes it into 32-bit little-endian words, and calls <code>init_by_array</code> — not <code>init_genrand</code>. <code>seedInt</code> takes a <code>bigint</code> so arbitrary-precision Python integers survive the trip.',
          '<b>The double.</b> <code>random_random</code> does not divide a 32-bit integer by 2³². It takes two words, <code>a = u32 &gt;&gt;&gt; 5</code> (27 bits) and <code>b = u32 &gt;&gt;&gt; 6</code> (26 bits), and computes <code>(a * 67108864 + b) / 9007199254740992</code> for a full 53-bit mantissa. Getting this wrong gives you a generator that is statistically fine and numerically different, which is the worst kind of wrong.',
          '<b><code>gauss</code>.</b> CPython&rsquo;s is a paired Box–Muller that caches the second value between calls, so draws do not come out in the order a naive implementation produces.',
          '<b><code>randint</code>.</b> <code>_randbelow</code> computes k = ceil(log2(span)), draws k bits, and <em>rejects and redraws</em> out-of-range values. Modulo would be uniform enough for noise and would desynchronise the two streams immediately, because it consumes a different number of draws.'
        ] },
      { h: 'The correction',
        p: `<b>There is no parity test in this repository.</b> The README says the port is
            "parity-checked vs CPython to 15 dp" and the design document says the same. Searching the
            repo: no unit test, no golden-vector fixture, no comparison script. The only test file is
            a Playwright browser test that never touches the RNG, and <code>package.json</code> has no
            test runner at all. <code>mt19937.ts</code> was added in one commit on 7 July and has not
            been modified since. The comparison did happen, and the code is right in the four specific
            non-obvious ways above, which is not where you land by guessing — but it happened in a
            scratch session and the harness was never committed.`,
        quote: `A claim nobody can check is not evidence of anything, including when the person who
                cannot check it is me.` },
      { h: 'What the fix is',
        p: `A fixture of the first N draws from <code>random.Random(seed)</code> for a handful of
            seeds, checked into the repo, and a test asserting the TypeScript matches to 15 decimal
            places. Roughly two hours of work to turn a story I cannot back up into one I can. It is
            the top of the list and it is not done.` },
      { h: 'Two IK solvers, one of them used',
        p: `Damped least squares is what ships: Δq = Jᵀ(JJᵀ + λ²I)⁻¹e, plus a nullspace term that
            pulls unused degrees of freedom back toward a rest pose, with the 6×6 system solved by
            in-place Gaussian elimination with partial pivoting. Defaults are 5 iterations, damping
            λ = 0.12, position weight 1.0, orientation weight 0.22, nullspace gain 0.06, max step
            0.22&nbsp;rad per iteration. The damping is the entire point — a plain Jacobian
            pseudo-inverse blows up near singularities, where a tiny error at the edge of the
            workspace demands an enormous joint velocity. The λ²I trades a little accuracy for never
            producing that, and 0.12 was found by making the arm snap and increasing it until it
            stopped. <b>There is no convergence test:</b> fixed count, always 5. A
            <code>while (error &gt; eps)</code> inside a 10&nbsp;ms budget is an invitation to a frame
            drop, so the loop takes bounded work per tick and accepts whatever accuracy that buys. The
            older CCD solver is still in the tree and nothing in the stage loop calls it.` },
      { h: 'A constraint encoded as a weight of zero',
        p: `The SO-101 arm gets <code>oriWeight: 0</code>, with the note that with five degrees of
            freedom a full mirrored orientation is generally infeasible. You cannot in general match
            both a position and an orientation with five joints, so asking the solver to try produces
            a worse answer than telling it not to.` },
      { h: 'The 100 Hz loop',
        p: `<code>setInterval</code> at 10&nbsp;ms — not <code>requestAnimationFrame</code>, which is
            tied to display refresh, so a 120&nbsp;Hz monitor and a 60&nbsp;Hz monitor would produce
            different data rates from identical code. Drift is absorbed by measuring elapsed time
            against <code>performance.now()</code> and running up to 4 catch-up steps, capped so a
            backgrounded tab does not return and run ten thousand ticks at once. If
            <code>bufferedAmount</code> exceeds 256&nbsp;KB the frame buffers are dropped wholesale: a
            teleop stream that queues is worse than one that skips, because you end up controlling the
            robot's past. Client-side telemetry lives in a 240-sample <code>Float32Array</code> ring
            outside React entirely — putting 100&nbsp;Hz data into React state would re-render the
            tree a hundred times a second for something only a chart reads. Commands go upstream at
            50&nbsp;Hz, not 100, because cursor input is not meaningful at 10&nbsp;ms granularity and
            halving the rate halves the chance of hitting backpressure.` },
      { h: 'What broke',
        list: [
          '<code>useLoader</code> caches by class, not by URL. Mounting a master arm and a target arm at once meant react-three-fiber handed both the <em>same</em> <code>URDFLoader</code> instance, so each robot clobbered the other&rsquo;s mesh-loading configuration. It looked like a rendering bug. It was a caching key.',
          'A one-shot bounding-box calculation snapped the arm to the ground before the STL meshes had finished loading, so it measured an empty box and silently failed. It had been worked around with a hand-tuned position offset, which kept the real bug invisible until the offset stopped being right.',
          'Tailwind v4 puts unlayered CSS ahead of every layer. Three lines of unlayered CSS beat every utility and produced white text on lime buttons. The fix commit records the verification rather than claiming one — computed colour now <code>rgb(7,9,12)</code>, was <code>rgb(232,237,242)</code>.',
          '<code>api/contact.ts</code> imported a schema from <code>src/shared/</code>, and Vercel&rsquo;s Node function runtime transpiles files in place without rewriting import specifiers. It 500&rsquo;d in production and worked locally. Fixed by duplicating eleven lines into the function, because the alternative was fighting a build system.'
        ] },
      { h: 'Still open',
        list: [
          'No RNG parity test. Highest priority — the README makes a claim the repository cannot support.',
          'No unit tests at all. One Playwright end-to-end file is the entire suite.',
          'The README and design document still describe CCD as the shipped solver. It has been DLS since 11 July.',
          'The CCD implementation is dead code in the stage path.',
          '21 runtime dependencies for a page whose selling point is that it is precise.'
        ] }
    ],
    decisions: [
      { d: 'Reimplement CPython&rsquo;s random rather than accept a different stream',
        why: `A seeded generator that is statistically fine but numerically different means the demo
              and the bench are separate systems. The cost was an embarrassingly long weekend on four
              details nobody would guess, and a claim I then failed to make checkable.` },
      { d: 'Fixed iteration count instead of a convergence loop',
        why: `Bounded work per tick fits a real-time budget; an unbounded loop does not. It costs
              accuracy on hard poses, which is the right thing to spend when the alternative is a
              dropped frame.` },
      { d: 'One solver and a configuration table, after writing three robots by hand',
        why: `The 11 July rewrite was +1308/−775 across 24 files: three per-robot components and their
              bespoke retargeting deleted, replaced by one <code>ik.ts</code> and three rows in
              <code>retargetConfig.ts</code>. That was the right shape, and it should have been
              visible before writing the third one.` }
    ],
    journal: [
      { when: '2 July 2026', p: `First commit. One branch, one pull request for the whole repository —
              a different working style from the pipeline repo entirely, and appropriate for a
              single-author front end.` },
      { when: '7 July 2026', p: `<code>mt19937.ts</code> lands in a commit titled "Save recent
              changes" and is never touched again. The commit message is the tell: the interesting work
              of the month went in under a name that describes nothing.` },
      { when: '11 July 2026', p: `The rewrite. Per-robot components out, generic DLS plus a retarget
              table in. Everything downstream got simpler and the documentation did not follow.` },
      { when: 'Design churn', p: `The grip handle was rebuilt three times in one day — reticle, then
              glowing shaft, then boxy controller. A fade-in was slowed and then partly reverted
              because it never fired on short mobile viewports. This is what visual work looks like and
              there is no version of it that converges on the first try.` },
      { when: '23 July 2026', p: `Last commit. The thing I still owe this repository is two hours of
              fixture-writing, and until it exists the most interesting part of the project is
              something I can describe but cannot demonstrate.` }
    ]
  },

  /* ---------------------------------------------------------------
     Written from signalwise/JOURNAL.md.
     --------------------------------------------------------------- */
  'finabulary': {
    status: 'ready',
    lede: `A financial-literacy app — React and Vite on the web, Expo and then a native SwiftUI app
           with home-screen widgets, Supabase behind it, Stripe and StoreKit 2 for billing. 55 commits
           between 19 June and 25 July 2026. It was built to find out what shipping actually costs,
           and the answer is that most of it is not engineering.`,
    sections: [
      { h: '86 markdown files in the root, almost none of them technical',
        p: `App Store review notes. An FTC AI advertising disclosure. A UGC moderation policy. A DMCA
            policy. A refund and cancellation draft. A WCAG checklist. A scraping policy. A data map.
            Every one of them exists because something outside the code required it, and none of them
            is visible in the product. That is the distance between "it works on my machine" and "a
            stranger can pay for it."` },
      { h: 'The security bug I am most glad I found',
        p: `16 July. The Supabase row-level-security policy on <code>daily_briefs</code> was
            <code>USING(true)</code>. That means anyone holding the anonymous public key — which ships
            in the client bundle, which is the entire point of an anon key — could read premium
            <code>is_live=true</code> briefs straight through PostgREST. No payment, no account, just
            the REST endpoint. <b>The paywall was in the UI. The data was not behind it.</b>`,
        quote: `A UI gate is a suggestion. If the row is readable by the key you ship to the browser,
                it is public.` },
      { h: 'What went right about the fix',
        p: `The fix commit adds a test, <code>scripts/test-live-gating.mjs</code>, and the message
            notes the test was <b>red against production</b> — proving the leak was live rather than
            theoretical. It also states plainly that the migration had not yet been applied to
            production, pending review. Recording a fix as incomplete instead of describing it as done
            is the difference between a changelog and a status report.
            <code>USING(true)</code> is the default shape of an example policy, and it is the shape you
            must never leave in.` },
      { h: 'The rename, one week from submission',
        p: `The name SignalWise did not clear, so it became <b>Finabulary</b>. The first commit was
            +210/−203 across 35 files and was deliberately scoped to <em>display strings only</em>. The
            bundle ID <code>com.signalwise.app</code>, the App Group, the <code>signalwise://</code>
            URL scheme, the Supabase project refs, the domain, the env keys, the file paths and the
            internal Swift type names were all left alone. Changing a bundle ID a week before
            submission means a new app record, new provisioning, new StoreKit products, and a re-test
            of every purchase path. <b>The user-visible name and the machine-visible identifier do not
            have to agree</b>, and pretending they do would have cost the launch.
            <code>CFBundleDisplayName</code> became Finabulary; the bundle stayed
            <code>com.signalwise.app</code>.` },
      { h: 'Two ways one find-and-replace can be wrong',
        p: `Four hours later, a second commit: "catch remaining SignalWise stragglers missed by the
            extension-limited grep", +8/−8 across five files. The first sweep covered
            <code>.swift .jsx .js .json .yml .html .webmanifest</code> — and not <code>.md</code> or
            <code>.css</code>. It also matched only mixed-case "SignalWise", so it missed the wallpaper
            watermark, which was all-caps, and the service worker's <code>CACHE_VERSION</code> string.
            The file types you did not enumerate, and the casings you did not consider. What finally
            settled it was grepping the compiled <code>dist/</code> output case-insensitively —
            checking the artefact, not the input.` },
      { h: 'Refusing to overclaim on accessibility',
        p: `The audit document opens by saying it is WCAG 2.2 AA <em>readiness</em> work, not a
            certification, and that it never claims the app is ADA-compliant. The checklist sets a hard
            rule against writing "ADA compliant", "fully accessible" or "WCAG compliant" anywhere. It
            then records measured failures rather than a pass list: light-mode amber
            <code>#A9772A</code> on paper at <b>3.4:1</b>, faint <code>#8C8376</code> at <b>3.3:1</b>,
            six fixed <code>.system(size:)</code> values in one view breaking Dynamic Type, and zero
            uses of <code>accessibilityReduceMotion</code> across the entire source. Writing down that
            your own reduced-motion support does not exist, in a document being prepared for App Store
            review, is uncomfortable and correct. An accessibility statement that lists only what
            passed is a marketing document.` },
      { h: 'Other things that broke',
        list: [
          'A Leadsy visitor-identification pixel, added and reverted in <b>26 minutes</b>. The privacy label says <code>Tracking: No</code> across all 17 data rows; the pixel would have made the label false.',
          'A "Sign in with Apple" button that did nothing. It was kept once, on the argument that it was "a deliberate, disclosed placeholder, not a dead control", and deleted two days later. The second call was right — Apple treats non-functional controls as a rejection reason regardless of intent, and "disclosed" is a thing you tell yourself.',
          'Mojibake. Curated seed content contained non-ASCII that Supabase mangled into <code>â€"</code>. Fixed by forcing the seed pure ASCII and adding an encoding test as a guard. Encoding bugs do not fail loudly; they produce text that is <em>slightly</em> wrong.',
          '<code>EBADPLATFORM</code> on Vercel. Platform-specific native binaries had to move to <code>optionalDependencies</code> with both win32-x64 and linux-x64-gnu pairs, because development is on Windows and Vercel builds on Linux. A lockfile that works on your machine is not a lockfile that works.',
          'A literal <code>undefined</code> rendering into onboarding copy, alongside a Fed brief written at the wrong reading level for a product whose entire premise is explaining finance to beginners.',
          'A Swift 6 concurrency violation my own first draft of the timeout helper introduced, by capturing <code>@State</code> inside a <code>@Sendable</code> closure.'
        ] },
      { h: 'Still open',
        list: [
          '<b>The fail-closed RLS migration may still not be applied to production.</b> The file exists; the commit says it was pending review. Verify this before anything else on this list.',
          'No privacy manifest. Apple requires one.',
          'Reduce Motion is still unimplemented, and Dynamic Type still breaks in three named files.',
          'Two colour tokens still fail contrast at 3.4:1 and 3.3:1.',
          'The repository, the iOS source directory, the README and the App Store metadata still say SignalWise. The root <code>package.json</code> is still named <code>claude-design-project</code>.',
          'A 99&nbsp;KB untitled binary sits unexplained in the repository root, and the default branch is a feature branch — there is no <code>main</code>.'
        ] }
    ],
    decisions: [
      { d: 'Expo first, then native SwiftUI',
        why: `Expo had a mobile app running in a day. Widgets are where it stopped being enough —
              home-screen widgets, tinted and accented rendering modes, App Intents for configuration.
              Those are the surfaces that make a learning app actually get opened, and they are
              native-only. The Expo app is still in the tree, superseded rather than deleted.` },
      { d: 'Move content gating into the server after the RLS bug',
        why: `The daily gate became a Supabase edge function and a migration rather than a client
              check. The bug was not that the client check was weak; it was that a client check was
              the only check.` },
      { d: 'Localise early, including Arabic',
        why: `Nine locales from the start forced direction switching and RTL layout to be designed in
              rather than retrofitted. It also produced an honest Spanish content notice: the UI is
              translated, the content is not fully, and the app says so instead of pretending.` }
    ],
    journal: [
      { when: '19 June 2026', p: `First commit. Web first, on React and Vite, with Supabase behind it.` },
      { when: '16 July 2026', p: `The <code>USING(true)</code> policy on <code>daily_briefs</code>.
              Found, tested against production, fixed in a migration, and recorded as not yet
              deployed.` },
      { when: '25 July 2026', p: `The rebrand, in two commits four hours apart, one week from
              submission. Display strings in the first, the stragglers the extension-limited grep
              missed in the second.` },
      { when: 'What it cost to learn', p: `Row-level security is the security boundary and everything
              above it is decoration. A rename is a scoping exercise, not a find-and-replace. And
              compliance work is most of the distance between working software and a shipped product,
              while being entirely invisible in the code.` }
    ]
  },

  /* ---------------------------------------------------------------
     Written from tryon-shopping-webapp/JOURNAL.md.
     --------------------------------------------------------------- */
  'virtual-wardrobe-platform': {
    status: 'ready',
    lede: `A virtual wardrobe and garment-fit platform — Next.js front end, FastAPI back end, a Python
           fit engine. <code>main</code> is six commits, all on 16 May 2026; a redesign branch adds
           nineteen more over the following twelve days and was never merged. The real subject of the
           project turned out to be the deferral list, and what happened thirty-four minutes after I
           finished phase three.`,
    sections: [
      { h: 'The list of things I was not going to build',
        p: `The README says advanced AI, scraping, authentication, payments and 3D physics are deferred
            until the core web flows are stable. The architecture document ends with a section headed
            "Deferred Until Later Phases". The product spec repeats the exclusion list at the end of
            every phase, and the list barely shrinks — phase three still excludes authentication,
            production persistence, real scraping, body scanning, SMPL fitting, AI reconstruction,
            checkout, a real 3D viewer and cloth physics. The reasoning is that the interesting parts
            are the ones you can work on forever without ever having a product. Garment physics is a
            research project. Scraping retailers is a legal problem. Body scanning is a hardware
            problem. None of them answer the actual question, which is whether a person can paste a
            product link, enter their measurements, and be told whether the thing will fit.` },
      { h: 'Where the discipline shows up in the code',
        list: [
          'Product import returns deterministic mock data and says so in its own output — brand "Preview Market", description "A safe deterministic preview generated from the submitted URL. No live retailer scraping is performed in this MVP." The stub tells the truth about being a stub.',
          'The fit engine returns <code>"label": "unavailable"</code> with "Missing body or garment measurement for this region." when a size chart has no comparable measurement, rather than inventing a label. The decision log puts it plainly: reporting missing data honestly is safer than inventing fit labels.',
          'The decision log records in-memory storage <em>and its cost</em> in the same entry — products, measurements, wardrobe items, outfits and garment recipes all reset when the FastAPI process restarts. A decision log that omits consequences is a list of preferences.'
        ],
        quote: `A clothing app that tells you a garment fits when it does not actually know is worse
                than one that says it does not know.` },
      { h: 'The slots for the work I did not do',
        p: `<code>.env.example</code> declares eight credentials nothing reads, including a database
            URL, a Redis URL, S3 keys and two model API keys. <code>requirements.txt</code> lists
            <code>sqlalchemy</code> and <code>psycopg2-binary</code> with no models and no session.
            The web package installs <code>three</code>, <code>@react-three/fiber</code> and
            <code>@react-three/drei</code>, and <code>main</code> has no viewer component. The shape of
            the deferred work is visible everywhere; none of it is load-bearing.` },
      { h: 'Where it stopped holding',
        p: `<code>main</code> ends at 08:28 on 16 May with "Complete Phase 3 wardrobe measurements and
            fit engine." <b>Thirty-four minutes later</b>: "Redesign app into immersive game-like
            try-on experience." That branch ran for twelve more days and was never merged, and it went
            straight into the deferred pile — SMPL avatar generation, GLB export, rigged joint
            controls, a 3D garment preview, and an evaluation of a PPF contact solver for cloth
            simulation. <code>main</code> today has no 3D viewer and no avatar. The branch has all of
            them and does not have a working product either.`,
        quote: `Writing the constraint down is easy. The constraint only does anything on the day you
                do not want to follow it.` },
      { h: 'What broke',
        list: [
          'Product images were read as <code>image_urls</code>, a field that does not exist, instead of <code>images[0].url</code>. Every product photo was blank in every screen, and it survived until someone else read the code. There are no tests in this repository, which is exactly how a bug like that lives.',
          '<code>requirements.txt</code> was UTF-16 with a BOM and had to be re-encoded to UTF-8 so pip could parse it on fresh installs. It worked on the machine that created it and nowhere else.',
          'The reference SMPL loader depends on <code>chumpy</code>, which does not install on modern Python. Two commits of working around an abandoned dependency before any avatar could be generated at all.',
          'A 911-line debug-heavy try-on viewer, written on 19 May, replaced on 27 May by a minimal one. A 911-line viewer component is its own diagnosis.'
        ] },
      { h: 'Still open',
        list: [
          '<code>main</code> is abandoned at phase three and the redesign branch is unmerged. The two have diverged in direction, not just in content — that needs a decision, not a rebase.',
          'No tests of any kind and no CI, despite the master spec prescribing them.',
          'Four directories documented in the README do not exist on <code>main</code>. Documenting seven packages does not create seven packages.',
          'All state is in memory; nothing survives a restart.',
          'Product import is still a mock. There is no ingestion path at all.'
        ] }
    ],
    decisions: [
      { d: 'Monorepo by convention, not by tooling',
        why: `No root <code>package.json</code>, no workspaces, no Turborepo or Nx. The web app is its
              own npm project and the API a separate pip project. For two packages that is fine and
              avoids a build system nobody needed. It does mean "monorepo" overstates it.` },
      { d: 'Define the schemas once, as shared JSON',
        why: `Product, wardrobe, outfit, manual measurement, garment recipe and fit recommendation
              schemas live in one package alongside a TypeScript types file. One contract for a Python
              service and a TypeScript client — the same instinct as the CAN codec having a single
              source of truth, at a much lower stakes level.` },
      { d: 'Manual measurements before body scanning',
        why: `Manual entry is a form. Body scanning is a computer-vision project. The fit engine works
              identically either way, so it can be built and tested now and have its input source
              swapped later without the engine changing.` }
    ],
    journal: [
      { when: '16 May 2026, 08:28', p: `Phase three complete on <code>main</code>: wardrobe
              measurements and the fit engine, six commits, deferral list intact.` },
      { when: '16 May 2026, thirty-four minutes later', p: `"Redesign app into immersive game-like
              try-on experience." The deferral discipline was written down carefully, followed for six
              commits, and abandoned within the hour for the interesting parts. That is the actual
              lesson, and it is better than the tidy version.` },
      { when: '19 May 2026', p: `A swipe-first try-on UI, built around a viewer component that grew to
              911 lines.` },
      { when: '27 May 2026', p: `The blank-image bug found and fixed, the UTF-16 requirements file
              re-encoded, and the 911-line viewer replaced by a minimal one — eight days after the UI
              it replaced was written.` },
      { when: '28 May 2026', p: `Last commit on the branch. It never merged.` }
    ]
  },

  /* ---------------------------------------------------------------
     Written from vhs-intro-ai/JOURNAL.md.
     --------------------------------------------------------------- */
  'foundations': {
    status: 'ready',
    lede: `Introduction to AI coursework, and the repository where I learned to implement things
           instead of importing them. 59 commits between 1 September 2024 and 10 March 2025 across 30
           notebooks, later repackaged into a public portfolio repo. Six weeks on graphs and
           pathfinding before touching a model — the course's ordering, and the right one.`,
    sections: [
      { h: 'Two graph representations, both written by hand',
        p: `One class is an <b>adjacency matrix</b> — <code>np.zeros((n, n), dtype=int)</code> with a
            <code>directed</code> flag deciding whether <code>add_edge</code> also writes
            <code>[v][u]</code>. The other is an <b>adjacency list</b>, a dict of vertex to a list of
            neighbour-and-weight pairs. No graph library in either. Building both is the point: the
            matrix is O(1) to check whether an edge exists and O(n²) in memory whether or not you use
            it, and the list is the opposite. A road network is enormous and almost empty, so it has to
            be the list — but you do not <em>feel</em> that until you have written both and watched the
            matrix version refuse to allocate.` },
      { h: 'Dijkstra, and the thing the pseudocode assumes',
        p: `OSMnx pulls a real street network and that is <em>all</em> it is used for, plus plotting.
            The routing is mine: a <code>heapq</code> priority queue, a distances dict initialised to
            infinity, a previous-nodes dict for backtracking, and the stale-entry skip most people
            miss — <code>if current_distance &gt; distances[current_node]: continue</code>. Python's
            <code>heapq</code> has no decrease-key. You push a better distance for a node already in
            the heap, and later you pop the old worse entry; without that check you re-expand it and
            get wrong answers on some graphs. Learning that the standard-library data structure does
            not have the operation the textbook pseudocode assumes was the most useful thing in that
            notebook. I validated the result against <code>ox.shortest_path()</code> on two areas,
            Houston and Katy.` },
      { h: 'A*, and a number I trust',
        p: `The graph had to change shape: each node became coordinates plus neighbours, because A*
            needs geography and Dijkstra does not. The heuristic is a <b>Haversine distance written by
            hand</b> — <code>math.radians</code>, <code>atan2</code>, <code>R = 6378000</code>.
            Great-circle distance is admissible for road routing because a straight line over the
            earth's surface can never exceed the road distance; if the heuristic ever overestimates,
            A* stops being guaranteed to find the shortest path, and that is the entire reason it has
            to be that function and not something convenient. Both algorithms were instrumented with a
            node-push counter and run on the same 5&nbsp;km Katy walk network:`,
        list: [
          'A*: <b>1&nbsp;677</b> nodes explored',
          'Dijkstra: <b>4&nbsp;944</b> nodes explored',
          'Same path, same cost, roughly a third of the work'
        ],
        quote: `Getting that number out of my own two implementations rather than reading it in a table
                is the difference between knowing it and believing it.` },
      { h: 'MNIST, and the bug that does not raise',
        p: `Two mistakes, both recorded at the time. The first was feeding 28×28 images into a dense
            network without reshaping, fixed once I understood that a CNN expects a 4D tensor and used
            <code>.reshape(-1, 28, 28, 1)</code>. The second is the interesting one: training on raw
            0–255 pixel values instead of dividing by 255. The model still trains. It just trains
            badly and inconsistently, and <b>nothing errors</b>. Gradients scale with input magnitude,
            so a 255× larger input makes the first layer's updates 255× larger and the optimiser spends
            its time oscillating. A silent, non-crashing performance bug caused by a one-line
            preprocessing omission is a much better introduction to machine learning than anything that
            throws an exception. The dense model — 256→128→64→10 with batch norm and 0.3 dropout, Adam
            at 1e-3, early stopping with <code>restore_best_weights</code> — stopped at epoch 22 on
            <b>0.9839 validation accuracy: 161 wrong out of 10,000</b>.` },
      { h: 'The semester project, and the leakage I removed on purpose',
        p: `Predicting video game sales with scikit-learn and XGBoost, no neural network. The dataset
            has regional sales columns and a global sales column, and predicting global from regional
            is trivial and meaningless — they sum. I dropped them, and used <code>Rank</code> as an
            index only rather than as a feature, because rank <em>is</em> the target in disguise. After
            cleaning: median and most-frequent imputation, ordinal encoding with one-hot for genre,
            then decision tree to random forest to grid search to XGBoost with 5-fold cross-validation.
            Best validation <b>R² ≈ 0.4514</b>, with the overfitting diagnosed rather than the training
            score reported. R² of 0.45 predicting game sales from genre, platform, publisher and year
            is a fair result for a fair question, and reporting it honestly was more useful than tuning
            until it looked better.` },
      { h: 'The question I did not answer at the time',
        p: `A notes file in that repo has three questions and no answers. The first: how can different
            epochs have very different validation loss but very similar validation accuracy. Accuracy
            is a threshold on the argmax; loss is a continuous function of the probabilities. A model
            can become much less confident about its correct answers — loss rising sharply — while
            still putting the right class on top, so accuracy barely moves. It is the standard early
            sign of overfitting, and it is invisible if you only watch accuracy.` }
    ],
    decisions: [
      { d: 'Implement it, then check it against the library',
        why: `Hand-written Dijkstra checked against <code>ox.shortest_path</code>; hand-written A*
              checked against both. It is the pattern I have reused most since — including checking a
              TypeScript Mersenne Twister against CPython two years later, which is the one time I did
              it and failed to commit the check.` },
      { d: 'Keep the tutor transcript in the repository',
        why: `Twelve questions asked of an LLM tutor while building A*, kept deliberately rather than
              cleaned up. One of them was how to test the correctness of A*; the answer was to compare
              against a known-correct result such as the library shortest path, which is what I then
              did. Hiding where the help came from would have made the notebook look more impressive
              and the record less useful.` }
    ],
    journal: [
      { when: '1–5 September 2024', p: `Python fundamentals, then pandas and matplotlib on a Titanic
              exploratory analysis.` },
      { when: '18 September – 1 October 2024', p: `Graph theory from scratch. From the README written
              at the time: it was easy to forget to reflect both directions in an undirected graph, so
              I added debug prints and tested with small node graphs until the connections were
              consistently represented.` },
      { when: '9 October 2024', p: `Dijkstra on a real road network. Querying a wide radius generated
              graphs too large to render, so the radius came down to 5&nbsp;km with filters to keep the
              graph meaningful.` },
      { when: '18–20 October 2024', p: `A*, and the node-count comparison that made the whole six weeks
              worth it.` },
      { when: 'December 2024 – March 2025', p: `The semester project, then Kaggle's deep learning
              track, then MNIST through to 10 March.` },
      { when: 'A consequence still outstanding', p: `The work was reorganised into a public portfolio
              repo over two days in spring 2025 — 64 commits, all uploads through the web UI. Every
              Colab badge in that repo points at my old GitHub username and a private repository, so
              <b>every one of them is dead for a public visitor</b>. One is doubly broken: it targets a
              notebook filename that was renamed on 10 March 2025, before the portfolio repo existed.` }
    ]
  },

  /* ---------------------------------------------------------------
     Written from the team repository, Datlightning/MomentumBuildathon.
     --------------------------------------------------------------- */
  'escalation-sentiment-dashboard': {
    status: 'ready',
    lede: `Retail floor de-escalation. An ESP32 with a MAX4466 microphone streams audio over I2S to a
           Flask server, which transcribes it, scores the sentiment, and shows a manager which parts of
           a store are escalating. Built in six hours at the Momentum Buildathon — Yconic x NVIDIA,
           11 April 2026 — with two teammates; second place, $4,000. Every model runs on the machine it
           is deployed on, and that is the only part of the privacy story that is load-bearing.`,
    sections: [
      { h: 'What it is trying to make visible',
        p: `A queue that is quietly going wrong does not page anyone. The pitch was that <b>lane 4 has
            been hostile for six minutes</b> is invisible until the queue abandons, and by then the
            only record of it is a till that stopped ringing. The dashboard's job is to put a number
            and a location on that while there is still time to send someone over.` },
      { h: 'Nothing leaves the machine',
        p: `The inference stack is entirely local, and that was chosen rather than fallen into:`,
        list: [
          'Speech-to-text is <code>faster-whisper</code> — a <code>WhisperModel</code>, default <code>base</code>, running <code>cpu</code>/<code>int8</code>',
          'Sentiment is a local Hugging Face transformer, <code>cardiffnlp/twitter-roberta-base-sentiment-latest</code>, scored as <code>p_pos - p_neg</code> and mapped to −1..+1',
          'VADER is the fallback backend',
          'Topics come from a regex lexicon: <code>coupon</code>, <code>wait_time</code>, <code>escalation</code>, <code>payment</code>, <code>price_match</code>, <code>returns</code>',
          'The technical spec lists Google Cloud Speech-to-Text and Natural Language as an option. It is marked TODO and was never implemented.'
        ],
        quote: `Store audio never leaves the machine — not because a policy says so, but because there
                is no code path that sends it anywhere.` },
      { h: 'The privacy control is a geofence',
        p: `<code>app/services/zone_engine.py</code> types every zone as either <code>customer</code>
            or <code>private</code>, and <code>recording_allowed(zone)</code> returns true only for
            customer zones. <code>config/zones.json</code> marks the stockroom, the breakroom and the
            manager office <code>private</code> — the demo store is a simulated Walmart Supercenter
            #4218 in Houston. When a device sitting in a private zone hits
            <code>POST /escalation/trigger</code>, <code>app/routes/api.py</code> answers HTTP 403 with
            <code>"reason": "private_zone"</code> and the message
            <code>Recording disabled in {zone} — privacy mode active</code>.` },
      { h: 'And the refusals are counted',
        p: `Every block is written to a <code>privacy_blocks</code> table in SQLite and counted in
            <code>/api/analytics/summary</code>. A refusal is a measured quantity rather than a silent
            drop — which is the same instinct as a status byte that has to report its own faults. From
            the outside, a system that quietly declines to act is indistinguishable from one that was
            never asked.`,
        quote: `A control you cannot count is a control nobody can check.` },
      { h: 'Presence-triggered, not sentiment-triggered',
        p: `<code>scripts/escalation_monitor.py</code> is webcam face detection — OpenCV YuNet with
            Haar cascades — that sends <code>START_RECORDING</code> and <code>STOP_RECORDING</code> to
            the ESP32 over a WebSocket. The microphone opens because someone is standing there, not
            because something has already gone wrong. Sentiment is scored on what was captured; it does
            not decide what gets captured.` },
      { h: 'What I wrote',
        list: [
          '<code>app/services/zone_engine.py</code> (+54) and <code>config/zones.json</code> (+79) — the zone types and the recording gate',
          '<code>app/models.py</code> (+135), including the <code>privacy_blocks</code> table',
          '<code>static/js/app.js</code> (+400) and <code>templates/dashboard.html</code> (+133) — the dashboard itself',
          '<code>scripts/escalation_monitor.py</code> (+265, then +112)',
          '<code>app/services/device_sim.py</code> (+97)',
          'the merge of the ESP32 branch into the Flask app'
        ] },
      { h: 'The stack',
        p: `Python 3.11, Flask 3 and Jinja2, Tailwind over the CDN, Chart.js, SQLite, and
            <code>flask-sock</code> for WebSocket ingest. The ESP32 firmware is C++ under PlatformIO.` },
      { h: 'What is not real',
        p: `Six hours buys a demo, and the honest version of the demo says which parts are furniture:`,
        list: [
          '<b>The dashboard data is simulated.</b> <code>device_sim.py</code> defines four fake workers, and <code>api.py</code> picks escalation summaries at random from a hard-coded list with a random confidence score attached.',
          '<b>There is no redaction.</b> The database field is literally named <code>transcript_redacted</code> and it stores the raw transcript. Naming a field after work you did not do is worse than leaving the field out — anyone reading the schema would believe it.',
          '<b>Retention is a mock setting.</b> <code>retention_days_transcript: 30</code> exists and no job enforces it.',
          'All of my work is on the <code>dashboard-mvp</code> branch and was never merged to <code>main</code>. A visitor to the default branch sees none of it.',
          'There is no README on the repository at all.'
        ] }
    ],
    decisions: [
      { d: 'Run every model locally instead of calling a hosted API',
        why: `Cloud speech and sentiment would have been quicker to wire up and more accurate, and the
              spec had them written down as an option. <code>faster-whisper</code> on int8 CPU and a
              RoBERTa sentiment head are worse on both counts — but they move "privacy-first" from a
              claim about intent to a claim about architecture, which is the only kind worth making
              about a microphone in a shop.` },
      { d: 'Attach the permission to the zone, not to the device',
        why: `<code>recording_allowed()</code> takes a zone, so a device carried into the stockroom
              stops being allowed to record without anyone remembering to change a setting. Putting the
              flag on the device would have made the safe state depend on somebody updating it.` },
      { d: 'Answer 403 and record it, rather than dropping the request',
        why: `A silent drop and a healthy system produce identical data. A 403 carrying
              <code>"reason": "private_zone"</code>, a row in <code>privacy_blocks</code> and a count
              in the analytics summary means the privacy mode can be shown to have fired — which is
              what anyone should want before believing it did.` }
    ],
    journal: [
      { when: '11 April 2026, 13:11', p: `First commit. The whole repository is 14 commits between
              13:11 and 18:26 — six hours, three people: Vihas (7 commits), me (4, +1,601/−1,042) and
              sreekant gardas (3). My commits here are attributed to my own email, which is not true of
              every team repository I have worked in.` },
      { when: 'Commit bb48e4a', p: `"Add full dashboard MVP: GPS zones, privacy mode, escalation
              alerts, analytics" — the zone engine, the zone config, the 403 path and the
              <code>privacy_blocks</code> table all arrive in one commit. At that pace the privacy
              control and the feature it constrains get written together or not at all.` },
      { when: 'What the deadline bought and what it cost', p: `Local inference was decided early and
              held, so the strongest claim in the project is structurally true rather than asserted.
              Everything downstream of the demo — real device data, redaction, retention enforcement —
              is scaffolding, and the branch it all lives on never reached <code>main</code>.` },
      { when: 'What I would fix first', p: `Implement <code>transcript_redacted</code> or rename the
              column. A schema that describes work nobody did is a quieter version of exactly the
              problem this dashboard was built to catch.` }
    ]
  },

  /* ---------------------------------------------------------------
     Written from tinyCore/JOURNAL.md and the repository history.
     --------------------------------------------------------------- */
  'tinycore-industries-micro-drone-hat': {
    status: 'ready',
    lede: `A micro-drone HAT built on an ESP32-S3-MINI-1-N8: USB-C in, single-cell Li-ion charging, a
           six-axis IMU, a micro-SD socket, a Qwiic port, and MOSFET low-side switching for four
           brushed coreless motors. Two layers, Altium, 58 commits between 24 August 2025 and 27 May
           2026. The first of those commits is not mine, and 52 of the 58 carry no message at all —
           and both of those facts are more interesting than the board.`,
    sections: [
      { h: 'Where this starts, and who wrote the first commit',
        p: `The repository does not begin with me. Commit 1, <code>d12fdbd</code>, 24 August 2025,
            author <b>Geoffrey McIntyre</b>, message: a directory copy from an Altium 365 workspace. It
            brought in <code>iotaTemplate.SchDoc</code>, <code>iotaTemplate - 2 Layer.PcbDoc</code>,
            <code>iotaTemplate.IntLib</code>, two CAMtastic files, and a project called
            <code>tinyLantern.PrjPcb</code> — a lab base called <b>iotaTemplate</b> carrying somebody
            else&rsquo;s project called <b>tinyLantern</b>. On 6 March 2026 I renamed it, in three
            commits twenty-five seconds apart, and everything after that is mine.
            <b>The layer stack, the board outline, the output-job configuration and the initial
            component library are inherited.</b> <code>iotaTemplate.IntLib</code> was never renamed and
            still sits in the repository under its original name, which is an honest marker of where
            the board came from.`,
        quote: `Better to write that down than have someone run git log and find it.` },
      { h: 'What is actually on it',
        p: `<code>tinyDrone.BomDoc</code> is one of only two files here that is not opaque binary — it
            is Altium&rsquo;s pipe-delimited LiveBOM format, so the parts list can be read without
            opening Altium at all. Twenty-two catalogue items:`,
        list: [
          '<b>Compute</b> — <code>ESP32-S3-MINI-1-N8</code>. Dual-core Xtensa, Wi-Fi and BLE, 8&nbsp;MB flash, PCB antenna on the module.',
          '<b>Sensing</b> — <code>LSM6DS3TR</code>, a six-axis IMU: three-axis accelerometer plus three-axis gyro.',
          '<b>Power</b> — <code>AP2112K-3.3</code>, a 600&nbsp;mA LDO for the 3.3&nbsp;V rail; <code>MCP73831T-2ACI/OT</code>, a single-cell Li-ion charger at 4.2&nbsp;V; a <code>DMG2305UX-7</code> P-channel MOSFET (20&nbsp;V, 4.2&nbsp;A), a <code>SI2302DS</code> N-channel, an <code>MBR120</code> Schottky and a <code>1N4148W</code>.',
          '<b>IO</b> — a <code>USB4105-GF-A</code> USB-C receptacle; a <code>2908-05WB-MG</code> right-angle push-push micro-SD socket; a JST-SH four-pin right-angle Qwiic/STEMMA-QT I²C port; a two-pin 1.25&nbsp;mm battery connector; a <code>KMR211GLFS</code> tact switch; an amber <code>HSMA-C190</code> LED; and 8-pin and 9-pin 0.1" headers.'
        ] },
      { h: 'Which describes the board fairly precisely',
        p: `A USB-C-powered, battery-charging, SD-logging ESP32-S3 board with an IMU, a Qwiic port for
            whatever else you want to hang off it, and four low-side motor channels. On the mechanical
            side the motor connectors were replaced with through-hole solder pads for vibration
            resistance, checked against SolidWorks fits. The BOM is touched in twelve commits between
            2 April and 5 May and then never again — parts selection finished, layout kept going.` },
      { h: '5 May 2026 — four sheets become one',
        p: `<code>f7c1852</code>, +5/−90 in <code>tinyDrone.PrjPcb</code>. It deletes
            <code>[Document1]</code> through <code>[Document4]</code> — four schematic sheets that had
            split power, IO and serial the way the textbook says to — plus <code>[Document6]</code>, a
            reference board I had vendored in a month earlier, and renumbers what is left.
            <b>From that commit the project is one schematic sheet and one PCB.</b> Splitting a
            schematic across sheets is how a large design stays readable; this one fits on a page, and
            the split was buying indirection rather than clarity. The day after, <code>0e9cc10</code>
            registers the design-rule-check output job. Consolidate, then start rule-checking — that
            order was right.`,
        quote: `Reversing a decision that is supposed to be best practice felt wrong and was right.` },
      { h: '52 of 58 commit messages are empty',
        p: `Six commits carry any text at all: <code>Added Motors</code>,
            <code>Added Interfacing</code>, <code>PCB structure</code>,
            <code>Tracing and Rule checks</code>, <code>Tracing and Cutouts</code>, and the inherited
            first one. <b>Five of those six are empty commits</b> — zero files changed. I was
            committing the actual work silently and then immediately committing again with nothing in
            it, purely to leave a label. <code>1327222</code> &ldquo;Added Motors&rdquo; changes
            nothing; the schematic edit is in <code>ea374ee</code>, fifteen seconds earlier. It works
            in a grim way — the labels do mark the phases — but <code>git show</code> on any of them
            shows you an empty diff, which defeats the point. Altium documents are binary, so there is
            no diff to fall back on either. Reconstructing what happened in April meant reading which
            files changed on which dates; what I actually decided is gone.`,
        quote: `Binary design files make your commit log the only documentation you have.` },
      { h: 'Still open',
        list: [
          '<b>The design cannot be rebuilt from this repository.</b> The BOM references four libraries that are not committed — <code>ECEN5730Lib_2023_05_DS (2).IntLib</code>, <code>tinyCore V3.0.IntLib</code>, <code>SI2302DS.IntLib</code> — plus Altium Content Vault sources. Anyone cloning it cannot open it.',
          'Five orphaned documents are still in the repository but out of the project, and nothing distinguishes them at a glance from the two files that are live. You have to read <code>tinyDrone.PrjPcb</code> to work out which of the six schematic documents matters.',
          '<code>tinyCore_original.PcbDoc</code> is 5&nbsp;MB of somebody else&rsquo;s board sitting unexplained in the root. Vendoring a reference design in as a file is a bad way to learn from one.',
          'Four stale absolute paths inherited from the template are still baked into the output-job records. Inherited configuration is inherited debt.',
          '<code>Schlib1.SchLib</code> is a 4&nbsp;KB empty stub, and it and <code>PCB1.PcbLib</code> still carry Altium&rsquo;s default names.',
          '<b>No firmware anywhere.</b> This is a board with an ESP32-S3 on it and nothing to run.'
        ] }
    ],
    decisions: [
      { d: 'A module, not a bare ESP32-S3',
        why: `The MINI-1 costs more per unit and removes the entire RF problem — antenna matching,
              keepouts, certification. There is no RF layout of my own to get wrong and no
              certification problem to solve. For a board I was going to build in small numbers, that
              trade is not close.` },
      { d: 'Two layers',
        why: `Cheap and fast. On a board carrying a switching charger, an IMU that wants a quiet
              supply and USB differential pairs, it means the ground return is something you route
              rather than something you have. That cost is paid in layout time, which is where the
              end of this project went — the last eight commits touch nothing but the PCB.` },
      { d: 'Start from the lab template, and say so',
        why: `It got me a working layer stack, board outline and output configuration without
              designing any of them. The cost is a repository that still carries someone
              else&rsquo;s project name in a library filename, and four stale absolute paths baked
              into the output job that I have never gone back and cleared.` },
      { d: 'Author the symbols and footprints I could not find',
        why: `<code>PCB1.PcbLib</code>, <code>Schlib1.SchLib</code> and <code>tinyDrone.SCHLIB</code>
              were added on 8 May, the point where I started making parts rather than only consuming
              them. That does not make the design self-contained: it descends from a template, and the
              BOM still depends on four libraries that were never committed. Both are true at once.` }
    ],
    journal: [
      { when: '24 August 2025', p: `The first commit, and not mine — a directory copy of an Altium 365
              workspace by Geoffrey McIntyre, carrying <code>iotaTemplate</code> and a project called
              <code>tinyLantern</code>.` },
      { when: '6 March 2026', p: `Three commits in twenty-five seconds rename the project to
              <code>tinyDrone</code> and the template documents to <code>tinyTemplate</code>. The
              integrated library keeps its old name to this day.` },
      { when: '3 April 2026', p: `Eight commits, and four schematic sheets imported out of a Downloads
              folder — at 08:15 the project file still pointed at them there, and seventy-six minutes
              later they were committed properly and the paths rewritten. They arrived as browser
              duplicate downloads, so all four are still named with a <code>(1)</code> in them.` },
      { when: '5 April 2026', p: `Thirteen commits, and the one I would most like back: an unzipped
              GitHub archive of a <em>different</em>, properly structured <code>tinyCore</code>
              repository, whose PCB I pulled in wholesale as a reference and renamed
              <code>_original</code>. Five megabytes of context nobody can read.` },
      { when: '5–6 May 2026', p: `The de-scope, and then the DRC output job the following day.` },
      { when: '8 May 2026', p: `<code>PCB1.PcbLib</code> and <code>Schlib1.SchLib</code> at 01:36,
              <code>tinyDrone.SCHLIB</code> seventeen minutes later. Default Altium names, never
              changed.` },
      { when: '15 – 27 May 2026', p: `The last eight commits touch only the PCB — layout alone to the
              end. Nearly every timestamp in this repository falls between midnight and 08:00 UTC,
              which is its own kind of record.` },
      { when: 'What I would fix first', p: `Write the commit message on the commit that contains the
              work. Everything else on the open list is a cleanup task with a known answer; that one
              is the reason all of this had to be reconstructed rather than read.` }
    ]
  },

  /* ---------------------------------------------------------------
     Everything below is scaffolding — the page renders the project
     overview and an honest "in progress" note until it is written.
     These have no development journal to write from yet.
     --------------------------------------------------------------- */
  'cdh-flight-software':                        { status: 'draft' },
  'baja-telemetry-ecu':                         { status: 'draft' },
  'chipless-rfid-strain-sensing':               { status: 'draft' },
  'ultrasonic-smart-bin':                       { status: 'draft' },
  'ai-cross-document-verification':             { status: 'draft' },
  'design-review-and-benchmarking':             { status: 'draft' }
};
