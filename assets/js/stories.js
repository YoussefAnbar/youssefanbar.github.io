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
  'cdh-flight-software':                        { status: 'draft' },
  'inhabit-robotics-teleop-hand-and-can-joints':{ status: 'draft' },
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
