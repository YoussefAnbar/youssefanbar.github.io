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
     Everything below is scaffolding — the page renders the project
     overview and an honest "in progress" note until it is written.
     --------------------------------------------------------------- */
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

  'cdh-flight-software':                        { status: 'draft' },
  'tinycore-industries-micro-drone-hat':        { status: 'draft' },
  'baja-telemetry-ecu':                         { status: 'draft' },
  'chipless-rfid-strain-sensing':               { status: 'draft' },
  'inhabit-data-pipeline':                      { status: 'draft' },
  'teleoperation-console':                      { status: 'draft' },
  'escalation-sentiment-dashboard':             { status: 'draft' },
  'lidar-smart-bin':                            { status: 'draft' },
  'ai-cross-document-verification':             { status: 'draft' },
  'design-review-and-benchmarking':             { status: 'draft' },
  'finabulary':                                 { status: 'draft' },
  'virtual-wardrobe-platform':                  { status: 'draft' },
  'foundations':                                { status: 'draft' }
};
