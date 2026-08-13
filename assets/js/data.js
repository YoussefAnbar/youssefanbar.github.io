/* =====================================================================
   CONTENT — numbers read from the repositories and résumé, not estimated.
   ===================================================================== */

/* ---------------------------------------------------------------------
   Palette — the resistor colour code, plus solder-mask green and copper.
   Every pair below is checked against WCAG AA at run time.
   --------------------------------------------------------------------- */
const PAL = {
  black  :['#212121','#FFFFFF'],   // 0
  brown  :['#7B4A2D','#FFFFFF'],   // 1
  red    :['#C62828','#FFFFFF'],   // 2
  orange :['#C2570D','#FFFFFF'],   // 3
  gold   :['#F2C230','#231A05'],   // 4 (yellow band)
  green  :['#2E7D32','#FFFFFF'],   // 5 — solder mask
  blue   :['#1565C0','#FFFFFF'],   // 6
  violet :['#6A3FB5','#FFFFFF'],   // 7
  slate  :['#455A64','#FFFFFF'],   // 8 (grey band)
  cyan   :['#26C6DA','#0B2A2F'],   // trace on a scope
  teal   :['#0E7A63','#FFFFFF'],
  magenta:['#AD1457','#FFFFFF']
};

const INTERESTS = [
  { i:'board', c:'green',  t:'Board design',      d:'Schematic to fabricated PCB' },
  { i:'chip',  c:'blue',   t:'Embedded firmware', d:'C on bare metal, tested first' },
  { i:'wave',  c:'cyan',   t:'Sensing & RF',      d:'Making the physical world legible' },
  { i:'arm',   c:'orange', t:'Robotics',          d:'Teleoperation and training data' },
  { i:'car',   c:'red',    t:'Motorsport',        d:'Longhorn Baja electronics' },
  { i:'brain', c:'violet', t:'Machine learning',  d:'Implemented, not imported' }
];

/* `m` = terms matched against project stack/title/description so a badge
   can show you exactly where that skill was actually used. */
const SKILLS = [
  { t:'Hardware', g:'board', items:[
    { n:'Altium Designer',   c:'orange', m:['Altium'] },
    { n:'Schematic capture', c:'brown',  m:['Altium','schematic'] },
    { n:'2-layer PCB',       c:'green',  m:['Altium','PCB','layout'] },
    { n:'Footprint libraries', c:'gold', m:['SchLib','PcbLib'] },
    { n:'DRC & CAM',         c:'blue',   m:['CAMtastic','DRC'] },
    { n:'JLCPCB fabrication',c:'red',    m:['Altium','fabrication'] },
    { n:'Soldering & rework',c:'slate',  m:['Altium'] }
  ]},
  { t:'Firmware & embedded', g:'chip', items:[
    { n:'Embedded C',        c:'blue',   m:['Embedded C','C/C++'] },
    { n:'STM32 · Cortex-M0+',c:'cyan',   m:['STM32','STM32C011'] },
    { n:'RP2040',            c:'magenta',m:['RP2040'] },
    { n:'CAN bus',           c:'orange', m:['CAN'] },
    { n:'MCP2515',           c:'slate',  m:['MCP2515'] },
    { n:'SPI · I²C · UART',  c:'violet', m:['STM32C011','RP2040'] },
    { n:'Interrupt design',  c:'black',  m:['STM32C011','RP2040'] },
    { n:'Host-run unit tests',c:'green', m:['pytest','test suites','test floor'] }
  ]},
  { t:'Sensing & instrumentation', g:'wave', items:[
    { n:'Magnetic encoders', c:'teal',   m:['MT6701','encoder'] },
    { n:'Hall-effect',       c:'green',  m:['Hall-effect'] },
    { n:'6-axis IMU',        c:'blue',   m:['IMU'] },
    { n:'Chipless RFID',     c:'violet', m:['RFID'] },
    { n:'Resonant RLC',      c:'magenta',m:['RLC'] },
    { n:'Strain & temperature',c:'red',  m:['strain','LPBF'] },
    { n:'DAQ ~500 Hz',       c:'orange', m:['Hall-effect','RP2040'] },
    { n:'Oscilloscope · DMM',c:'gold',   m:['Altium','RP2040'] }
  ]},
  { t:'Software & tooling', g:'code', items:[
    { n:'Python',            c:'blue',   m:['Python'] },
    { n:'C / C++',           c:'slate',  m:['C/C++','Embedded C'] },
    { n:'TypeScript',        c:'cyan',   m:['TypeScript'] },
    { n:'ROS 2 Jazzy',       c:'black',  m:['ROS 2'] },
    { n:'React',             c:'teal',   m:['React','Next.js'] },
    { n:'FastAPI',           c:'green',  m:['FastAPI'] },
    { n:'PyTorch',           c:'orange', m:['PyTorch'] },
    { n:'pytest · mypy',     c:'violet', m:['pytest'] },
    { n:'Git',               c:'red',    m:['Python','TypeScript','Embedded C','Altium','C/C++'] }
  ]}
];

const EXPERIENCE = [
  { role:'Software Engineering Intern', org:'GE Vernova', where:'Austin, TX', when:'2026', accent:'copper',
    bullets:[
      `Built a P&amp;ID and loop-diagram verification agent that cross-checks instrument tags against
       engineering drawing PDFs and returns a colour-coded review workbook.`,
      `Designed it to be architecturally incapable of returning a false “verified” — anything ambiguous
       resolves to yellow and final sign-off stays human-owned.`,
      `Kept the whole pipeline local, so no drawings or project data leave the machine.`,
      `Shipped an internal onboarding hub with an editable process flowchart and zero runtime dependencies.`
    ] },
  { role:'Undergraduate Researcher — Embedded Sensing', org:'UT Austin', where:'Austin, TX',
    when:'2025 – present', accent:'moss',
    bullets:[
      `DARPA-scale research on chipless RFID strain and temperature sensors embedded inside
       laser-powder-bed-fusion metal parts.`,
      `Designing resonant RLC sensing architectures targeting ~1×10⁻⁴ strain and under 1&nbsp;°C.`,
      `Supporting micro-cold-spray fabrication of sensors that can never be serviced once the part is printed.`
    ] },
  { role:'Electronics — Longhorn Baja Racing', org:'Baja SAE, UT Austin', where:'Austin, TX',
    when:'2025 – present', accent:'amber',
    bullets:[
      `Integrated 7+ vehicle sensors onto a Raspberry Pi Pico ECU — four Hall-effect wheel-speed
       channels, a six-axis IMU, brake pressure, and CVT temperature.`,
      `Live acquisition at ~500&nbsp;Hz per sensor with microSD telemetry logging past 8&nbsp;GB.`,
      `Held sampling latency under 5&nbsp;ms while staying robust to continuous vibration and EMI.`
    ] },
  { role:'Electrical Engineer Service Intern', org:'BMW', where:'Houston, TX', when:'Jul 2024', accent:'clay',
    bullets:[
      `Ran diagnostics on Digital Motor Electronics with OBD-II and BMW ISTA, troubleshooting 4+
       control-unit failures across 25+ vehicle models.`,
      `Tested refrigerant pressure and supported tyre and alignment operations across 40+ vehicles.`,
      `Shadowed in-circuit testing and control-module programming — where I learned how production
       electronics actually fail rather than how the textbook says they do.`
    ] },
  { role:'Job Shadowing — Electrical & Chemical', org:'Schlumberger', where:'Houston, TX',
    when:'Jul – Aug 2024', accent:'slate',
    bullets:[
      `Fluid engineering for well-bore drilling at the world's largest drilling contractor by revenue.`,
      `Focused on distributed energy sources and the electrical pressure sensors used downhole.`
    ] },
  { role:'Electrical Engineering Intern', org:'Baker Hughes', where:'Houston, TX', when:'Jun 2023', accent:'copper',
    bullets:[
      `Worked with the Remote Operations Engineering team on hybrid electric drills.`,
      `Managed rotary steerable gear tests measuring torque under simulated downhole pressure to
       accelerate early-phase failure analysis.`,
      `Used Ansys and Jewel Suite to visualise drill performance — my first proper look at electronics
       that have to survive somewhere nobody can reach.`
    ] }
];

const EDUCATION = [
  { school:'The University of Texas at Austin', when:'2025 – 2028',
    detail:'BS Electrical & Computer Engineering, Honors · minor in Business · GPA 4.00' },
  { school:'The Village School', when:'2025',
    detail:'IB Diploma 44/45 — top 0.5% globally · class rank 1 of 196' },
  { school:'Stanford Online · DeepLearning.AI', when:'2024',
    detail:'Machine Learning Certification' }
];

const GROUPS = [
  { id:'hardware', label:'Hardware &amp; firmware', note:'Where I actually live. Everything here starts with something physical.' },
  { id:'systems',  label:'The software that serves it', note:'A board is only useful if something can read it honestly.' },
  { id:'nda',      label:'Work I can’t show you', note:'Built at GE Vernova. Described rather than linked.' },
  { id:'craft',    label:'Learning the half I’m worse at', note:'Not electrical engineering, and I won’t dress it up as it.' },
  { id:'roots',    label:'Where it started', note:'The year I stopped importing things I didn’t understand.' }
];

const PROJECTS = [
  { g:'hardware', cover:'board', title:'Inhabit Joint Pod', when:'2026',
    stack:'Altium · STM32C011 · Embedded C · MCP2515 CAN · MT6701 encoder',
    d:`A modular robot joint taken from a blank Altium sheet to a board I could hold — multi-sheet
    schematic, hand-routed two-layer layout, and a real JLCPCB fabrication order. Every way it can
    fail has its own bit in a status byte, because a sensor that can't see must say so.`,
    stats:[['board revisions','27'],['test suites','7'],['fault modes','6']],
    links:[['Inhabit — hardware','https://github.com/YoussefAnbar/Inhabit','private']] },

  { g:'hardware', cover:'trace', title:'tinyCore / tinyDrone', when:'2025 – 2026',
    stack:'Altium Designer · SchLib / PcbLib · CAMtastic',
    d:`A drone control board with power, IO, and serial on separate sheets, and custom footprint
    libraries authored rather than borrowed. Software has hot reload; hardware has a three-week lead
    time and a bill. Finding that out once made me check the datasheet twice.`,
    stats:[['commits','58'],['layers','2'],['sheets','4']],
    links:[['tinyCore','https://github.com/YoussefAnbar/tinyCore','private']] },

  { g:'hardware', cover:'wave', title:'Baja Telemetry ECU', when:'2025 – 2026',
    stack:'RP2040 · C/C++ · Hall-effect · 6-axis IMU',
    d:`Seven sensors logging at ~500&nbsp;Hz each. The sensors weren't the hard part — the environment
    was. A logger that drops samples under vibration and EMI is worthless, because those are exactly
    the conditions it exists to measure.`,
    stats:[['channels','7+'],['latency','< 5 ms'],['logged','≥ 8 GB']],
    links:[['Baja SAE · UT Austin','']] },

  { g:'hardware', cover:'coil', title:'Chipless RFID Strain Sensing', when:'2025 – present',
    stack:'RF · Resonant RLC · LPBF · Micro-cold spray',
    d:`Wireless sensors sealed inside 3D-printed metal, where there is no revision two. The most
    unforgiving version of the thing all my other work rehearses — design as though you will never
    get to touch it again.`,
    stats:[['strain','~1×10⁻⁴'],['temperature','< 1 °C']],
    links:[['UT Austin · research','']] },

  { g:'systems', cover:'flow', title:'Inhabit Data Pipeline', when:'2026',
    stack:'Python · ROS 2 Jazzy · pytest · parquet',
    d:`Turns CAN frames into training data that's allowed to be trusted. Episodes drifting outside the
    jitter budget are quarantined with an exact reason — not averaged in. Bad data costs you the model
    and the month you spend not understanding why.`,
    stats:[['commits','350'],['merged PRs','285'],['test floor','6 000']],
    links:[['Inhabit-Software','https://github.com/YoussefAnbar/Inhabit-Software','private']] },

  { g:'systems', cover:'arm', title:'Teleoperation Console', when:'2026',
    stack:'TypeScript · Vite · WebSockets · CCD / DLS IK',
    d:`Drag an arm in a browser and a simulated robot follows at 100&nbsp;Hz. I ported CPython's
    Mersenne Twister to TypeScript and checked it draw for draw to fifteen decimals — an embarrassingly
    long weekend, but the demo and the bench are provably the same system.`,
    stats:[['loop','100 Hz'],['parity','15 decimals'],['commits','51']],
    links:[['Inhabit_UI','https://github.com/YoussefAnbar/Inhabit_UI','private']] },

  { g:'nda', cover:'doc', title:'P&ID Verification Agent', when:'2026 · GE Vernova',
    stack:'Python · PyMuPDF · Local LLM · OCR',
    d:`Cross-checks instrument tags across thousands of engineering drawings. The constraint I'm
    proudest of is a refusal: it cannot return a false “verified.” A confidently wrong answer removes
    the scrutiny that would have caught it.`,
    stats:[['runs','entirely local'],['false “verified”','0 by design']],
    links:[['Private — employer work','','private']] },

  { g:'nda', cover:'grid', title:'Onboarding Hub', when:'2026 · GE Vernova',
    stack:'Python stdlib · Vanilla JS · SVG · No build',
    d:`An internal tool with a drag-and-drop process flowchart and nothing to install. The password is
    checked server-side on every save, not just to unlock the UI. Honest failure messages are most of
    what decides whether an internal tool gets used.`,
    stats:[['dependencies','0'],['offline','yes']],
    links:[['Private — employer work','','private']] },

  { g:'craft', cover:'chart', title:'Finabulary', when:'2026',
    stack:'React · Vite · Expo · Swift · Supabase',
    d:`A financial-literacy app, built to find out what shipping actually costs. The answer is that most
    of it isn't engineering — accessibility audits, privacy labels, review notes, and a full rebrand in
    the final week when the name didn't clear.`,
    stats:[['clients','3'],['commits','55'],['status','deployed']],
    links:[['Live site','https://signalwise-one.vercel.app'],['signalwise','https://github.com/YoussefAnbar/signalwise','private']] },

  { g:'craft', cover:'stack', title:'Virtual Wardrobe Platform', when:'2026',
    stack:'Next.js · TypeScript · FastAPI · Monorepo',
    d:`Mostly an exercise in saying no to the interesting parts first. I deferred AI processing,
    scraping, auth, payments, and 3D physics until the boring core loop worked. Shipping the
    interesting part first is how projects die at eighty percent.`,
    stats:[['packages','7'],['deferred','5, on purpose']],
    links:[['tryon-shopping-webapp','https://github.com/YoussefAnbar/tryon-shopping-webapp','private']] },

  { g:'roots', cover:'net', title:'Foundations', when:'2024 – 2025',
    stack:'Python · PyTorch · scikit-learn · LeRobot',
    d:`A hundred and twenty-three commits of implementing things instead of importing them. Knowing
    what a seeded random draw actually <em>is</em> is what let me port CPython's Mersenne Twister two
    years later.`,
    stats:[['commits','123'],['notebooks','30+']],
    links:[['AI_Portfolio','https://github.com/YoussefAnbar/AI_Portfolio'],['vhs-intro-ai','https://github.com/YoussefAnbar/vhs-intro-ai','private']] }
];

const BYTES = [
  { hex:'A3', name:'angle_raw_adc', type:'u16 · low byte',
    d:`The unconditioned reading straight off the encoder, before scaling or calibration. I keep the raw
    value on the wire deliberately — if calibration later turns out to be wrong, every episode ever
    recorded can be recomputed instead of thrown away.` },
  { hex:'0F', name:'angle_raw_adc', type:'u16 · high byte',
    d:`Endianness is fixed by the contract and asserted in the codec tests on both the C and Python
    sides. A disagreement between a board and a host is the kind of bug that eats a weekend, so it gets
    a test rather than a comment.` },
  { hex:'12', name:'angle_millideg', type:'i16 · low byte',
    d:`The calibrated angle in thousandths of a degree. Signed, because joints travel both ways.
    Integer rather than float, so every node agrees exactly — no drift between a Cortex-M0+, a Python
    process, and a browser.` },
  { hex:'D4', name:'angle_millideg', type:'i16 · high byte',
    d:`Millidegrees let the full ±180° range fit inside sixteen bits with room to spare. A deliberate
    trade of precision against frame size, made once and then not reopened every time someone wants
    another decimal place.` },
  { hex:'02', name:'node_id', type:'u8',
    d:`Which physical pod sent this. It's also folded into the arbitration ID, so the bus arbitrates by
    node priority for free — a hardware property earned by a numbering decision rather than by code.` },
  { hex:'01', name:'chain_index', type:'u8',
    d:`Position in the kinematic chain, kept separate from node_id on purpose. Conflating identity and
    ordering would mean never swapping a failed pod without renumbering the arm, and field-replaceability
    is the entire point of a modular joint.` },
  { hex:'00', name:'status_flags', type:'u8 · bitfield',
    d:`Six named failure modes, one bit each: ADC fault, SPI fault, CAN fault, magnet out of bounds, not
    enumerated, calibration invalid. The physical form of the rule I keep coming back to — a subsystem
    that can't do its job has to say so.` },
  { hex:'7B', name:'xor checksum', type:'u8',
    d:`XOR across the preceding seven bytes. Cheap enough to compute inside an interrupt, enough to catch
    the single-bit corruption a short bus actually produces. The host records whether it matched, so a
    corrupted frame becomes a recorded fact instead of a silent one.` }
];
