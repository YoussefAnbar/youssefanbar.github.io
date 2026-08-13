/* =====================================================================
   CONTENT
   Numbers are read from the repositories and the résumé, not estimated.
   ===================================================================== */

/* ---------------------------------------------------------------------
   skills
   --------------------------------------------------------------------- */
const SKILLS = [
  { t:'Hardware',
    items:['Altium Designer','Schematic capture','2-layer PCB layout','Multi-sheet design',
           'Custom SchLib / PcbLib','DRC & CAM verification','BOM generation','JLCPCB fabrication',
           'Soldering & rework','Oscilloscope · DMM'] },
  { t:'Firmware & embedded',
    items:['Embedded C','STM32 · Cortex-M0+','RP2040 · Raspberry Pi Pico','CAN bus · MCP2515',
           'SPI · I²C · UART','Interrupt-driven design','Host-compiled unit tests','PlatformIO'] },
  { t:'Sensing & instrumentation',
    items:['Magnetic rotary encoders','Hall-effect sensors','6-axis IMU','Resonant RLC · chipless RFID',
           'Strain & temperature sensing','Data acquisition ~500 Hz','Telemetry logging',
           'OBD-II · BMW ISTA','In-circuit testing'] },
  { t:'Software & tooling',
    items:['Python','C / C++','TypeScript · JavaScript','ROS 2 Jazzy','React · Next.js','FastAPI',
           'PyTorch · scikit-learn','SQL','Git','pytest · mypy --strict','Ansys','MATLAB'] }
];

/* ---------------------------------------------------------------------
   experience
   --------------------------------------------------------------------- */
const EXPERIENCE = [
  {
    role:'Software Engineering Intern', org:'GE Vernova', where:'Austin, TX', when:'2026',
    bullets:[
      `Built a P&amp;ID and loop-diagram verification agent that cross-checks instrument tags from an
       Excel index against engineering drawing PDFs and returns a colour-coded review workbook.`,
      `Designed it to be architecturally incapable of returning a false “verified” — anything ambiguous
       resolves to yellow and final engineering sign-off stays human-owned.`,
      `Kept the entire pipeline local, so no drawings or project data leave the machine. Enterprise
       integrations are specified as documented contracts with working mocks behind them.`,
      `Shipped an internal onboarding hub with an admin-editable process flowchart, zero runtime
       dependencies, offline operation, and server-side authentication on every write.`
    ]
  },
  {
    role:'Undergraduate Researcher — Embedded Sensing', org:'The University of Texas at Austin',
    where:'Austin, TX', when:'2025 – present',
    bullets:[
      `DARPA-scale research on chipless RFID strain and temperature sensors embedded inside
       laser-powder-bed-fusion metal parts.`,
      `Designing resonant RLC sensing architectures targeting ~1×10⁻⁴ strain and under 1&nbsp;°C
       temperature resolution.`,
      `Supporting micro-cold-spray fabrication and experimental validation of sensors that can never be
       serviced, recalibrated, or re-powered once the part is printed.`
    ]
  },
  {
    role:'Electronics — Longhorn Baja Racing', org:'Baja SAE, UT Austin', where:'Austin, TX',
    when:'2025 – present',
    bullets:[
      `Integrated 7+ vehicle sensors onto a Raspberry Pi Pico ECU: four Hall-effect wheel-speed
       channels, a six-axis IMU, brake pressure, and CVT temperature.`,
      `Implemented live data acquisition at ~500&nbsp;Hz per sensor with microSD telemetry logging
       past 8&nbsp;GB for post-run analysis.`,
      `Held sampling latency under 5&nbsp;ms while staying robust to the continuous vibration and
       electromagnetic interference of a competition vehicle.`
    ]
  },
  {
    role:'Electrical Engineer Service Intern', org:'BMW', where:'Houston, TX', when:'Jul 2024',
    bullets:[
      `Ran diagnostics on Digital Motor Electronics using OBD-II scanners and BMW ISTA, troubleshooting
       4+ control-unit failures across 25+ vehicle models.`,
      `Supported A/C service by testing refrigerant pressure and worked alongside tyre and alignment
       operations across 40+ vehicles.`,
      `Shadowed senior technicians on control-module programming and in-circuit testing, learning how
       production electronics actually fail rather than how the textbook says they do.`
    ]
  },
  {
    role:'Job Shadowing — Electrical & Chemical Engineering', org:'Schlumberger', where:'Houston, TX',
    when:'Jul – Aug 2024',
    bullets:[
      `Fluid engineering for well-bore drilling at the world's largest drilling contractor by revenue.`,
      `Focused on distributed energy sources and the electrical pressure sensors used downhole.`
    ]
  },
  {
    role:'Electrical Engineering Intern', org:'Baker Hughes', where:'Houston, TX', when:'Jun 2023',
    bullets:[
      `Worked with the Remote Operations Engineering team on hybrid electric drill development and
       offshore well-bore monitoring.`,
      `Managed rotary steerable gear tests measuring torque under simulated downhole pressure to
       accelerate early-phase failure analysis.`,
      `Used Ansys and Jewel Suite to visualise drill performance and subsurface models — my first
       proper look at electronics that have to survive somewhere nobody can reach.`
    ]
  }
];

/* ---------------------------------------------------------------------
   education
   --------------------------------------------------------------------- */
const EDUCATION = [
  { school:'The University of Texas at Austin', when:'2025 – 2028',
    detail:'BS Electrical & Computer Engineering, Honors · minor in Business · GPA 4.00 / 4.00' },
  { school:'The Village School', when:'2025',
    detail:'IB Diploma 44/45 — top 0.5% globally · class rank 1 of 196' },
  { school:'Stanford Online · DeepLearning.AI', when:'2024',
    detail:'Machine Learning Certification (Coursera)' }
];

/* ---------------------------------------------------------------------
   projects — grouped honestly, presented compactly
   --------------------------------------------------------------------- */
const GROUPS = [
  { id:'hardware', label:'Hardware & firmware',
    note:'Where I actually live. Everything here starts with something physical.' },
  { id:'systems',  label:'The software that serves it',
    note:'A board is only useful if something on the other end can read it honestly.' },
  { id:'nda',      label:'Work I can’t show you',
    note:'Built at GE Vernova. Described rather than linked — I won’t publish employer work for a portfolio.' },
  { id:'craft',    label:'Learning the half I’m worse at',
    note:'Not electrical engineering, and I won’t dress it up as it. Deliberate practice at shipping and positioning.' },
  { id:'roots',    label:'Where it started',
    note:'The year I stopped importing things I didn’t understand.' }
];

const PROJECTS = [
  {
    g:'hardware', title:'Inhabit Joint Pod', when:'2026',
    stack:'Altium · STM32C011 · Embedded C · MCP2515 CAN · MT6701',
    d:`A modular robot joint taken from a blank Altium sheet to a board I could hold — multi-sheet
    schematic, two-layer layout routed by hand, DRC, CAM verification, and an actual JLCPCB
    fabrication order. The firmware reads a magnetic encoder and packs it into an 8-byte CAN frame.
    Every way it can fail has its own bit in a status byte, because a sensor that can't see is
    required to say so rather than report a plausible number.`,
    stats:[['board revisions','27'],['firmware test suites','7'],['fault modes encoded','6']],
    links:[['Inhabit — hardware','https://github.com/YoussefAnbar/Inhabit','private']]
  },
  {
    g:'hardware', title:'tinyCore / tinyDrone', when:'2025 – 2026',
    stack:'Altium Designer · SchLib / PcbLib · CAMtastic · DRC',
    d:`A drone control board with power, IO, and serial captured on separate sheets, and custom symbol
    and footprint libraries authored rather than borrowed. Slower on day one, much faster by the
    fabrication order. Software has hot reload; hardware has a three-week lead time and a bill —
    finding that out once is what turned me into someone who checks the datasheet twice.`,
    stats:[['commits','58'],['layers','2'],['schematic sheets','4']],
    links:[['tinyCore','https://github.com/YoussefAnbar/tinyCore','private']]
  },
  {
    g:'hardware', title:'Baja Telemetry ECU', when:'2025 – 2026',
    stack:'RP2040 · C/C++ · Hall-effect · 6-axis IMU · microSD',
    d:`Seven sensors logging live at roughly 500&nbsp;Hz each on a Raspberry Pi Pico. The sensors
    weren't the hard part — the environment was. A Baja car is continuous vibration and a great deal
    of electrical noise, and a logger that drops samples under exactly those conditions is worthless,
    because those are the conditions it exists to measure.`,
    stats:[['sensor channels','7+'],['latency','< 5 ms'],['logged','≥ 8 GB']],
    links:[['Baja SAE · UT Austin','']]
  },
  {
    g:'hardware', title:'Chipless RFID Strain Sensing', when:'2025 – present',
    stack:'RF · Resonant RLC · LPBF · Micro-cold spray',
    d:`Wireless strain and temperature sensors sealed inside 3D-printed metal parts, where there is no
    revision two. It's the most unforgiving version of the thing all my other work rehearses — design
    as though you will never get to touch it again — and it's the reason I find sensing more
    interesting than anything further up the stack.`,
    stats:[['strain target','~1×10⁻⁴'],['temperature','< 1 °C']],
    links:[['UT Austin · embedded sensing research','']]
  },

  {
    g:'systems', title:'Inhabit Data Pipeline', when:'2026',
    stack:'Python · ROS 2 Jazzy · pytest · parquet · mypy --strict',
    d:`Turns CAN frames into training data that's allowed to be trusted. Any episode whose timing
    drifts outside the jitter budget is quarantined with an exact named reason — not smoothed, not
    averaged in. Bad data costs you the model <em>and</em> the month you spend not understanding why
    the model is bad. When hardware bring-up started blocking everything, I made the robot itself a
    plugin and drove the system forward in pure simulation.`,
    stats:[['commits','350'],['merged PRs','285'],['test floor','6 000'],['coverage gate','≥ 90%']],
    links:[['Inhabit-Software','https://github.com/YoussefAnbar/Inhabit-Software','private']]
  },
  {
    g:'systems', title:'Teleoperation Console', when:'2026',
    stack:'TypeScript · Vite · WebSockets · zod · CCD / DLS IK',
    d:`Drag an arm in a browser and a simulated robot follows at 100&nbsp;Hz, with real inverse
    kinematics. The browser needed a simulator but the real physics lived in Python, so I ported
    CPython's Mersenne Twister into TypeScript and checked it draw for draw to fifteen decimal places.
    It took an embarrassingly long weekend, but the demo and the bench engine are now provably the
    same system.`,
    stats:[['loop rate','100 Hz'],['sim parity','15 decimals'],['commits','51']],
    links:[['Inhabit_UI','https://github.com/YoussefAnbar/Inhabit_UI','private']]
  },

  {
    g:'nda', title:'P&ID Verification Agent', when:'2026 · GE Vernova',
    stack:'Python · PyMuPDF · Local LLM · OCR · Fuzzy matching',
    d:`Cross-checks instrument tags across loop diagrams, P&amp;IDs, and one-line drawings — thousands
    of them, and exactly the sort of work attention degrades on. The constraint I'm proudest of is a
    refusal: it cannot return a false “verified.” On industrial drawings a confidently wrong answer is
    worse than no answer, because it removes the scrutiny that would have caught it.`,
    stats:[['runs','entirely local'],['false “verified”','0 by design']],
    links:[['Private — employer work','','private']]
  },
  {
    g:'nda', title:'Onboarding Hub', when:'2026 · GE Vernova',
    stack:'Python stdlib · Vanilla JS · SVG · No build step',
    d:`An internal tool with a drag-and-drop process flowchart, launched from a small desktop app with
    nothing to install. The password is checked server-side on every save rather than just unlocking
    the interface. Opening the file directly still lets anyone browse — it just explains why saving
    won't work. Honest failure messages are most of what decides whether an internal tool gets used.`,
    stats:[['runtime dependencies','0'],['works offline','yes']],
    links:[['Private — employer work','','private']]
  },

  {
    g:'craft', title:'Finabulary', when:'2026',
    stack:'React · Vite · Expo · Swift · Supabase · Stripe',
    d:`A financial-literacy app, built to find out what shipping actually costs. The answer is that
    most of it isn't engineering — accessibility audits, privacy labels, review notes, IAP setup, and
    a full rebrand across web and iOS in the final week when the name didn't clear. The constraint I
    set was ethical rather than technical: no stock picks and no fabricated data, enforced in the
    architecture instead of a disclaimer.`,
    stats:[['clients','3'],['commits','55'],['status','deployed']],
    links:[['Live site','https://signalwise-one.vercel.app'],['signalwise','https://github.com/YoussefAnbar/signalwise','private']]
  },
  {
    g:'craft', title:'Virtual Wardrobe Platform', when:'2026',
    stack:'Next.js · TypeScript · FastAPI · Python · Monorepo',
    d:`Product import, measurements, outfit slots, and deterministic fit recommendations. Mostly an
    exercise in saying no to the interesting parts first — I deliberately deferred AI garment
    processing, scraping, auth, payments, and 3D physics until the boring core loop worked end to end.
    Shipping the interesting part first is how projects die at eighty percent.`,
    stats:[['packages','7'],['features deferred','5, on purpose']],
    links:[['tryon-shopping-webapp','https://github.com/YoussefAnbar/tryon-shopping-webapp','private']]
  },

  {
    g:'roots', title:'Foundations', when:'2024 – 2025',
    stack:'Python · PyTorch · scikit-learn · XGBoost · LeRobot',
    d:`A hundred and twenty-three commits of implementing things instead of importing them — graph
    algorithms, road-network analysis, handwriting recognition, cross-validation, data leakage,
    gradient boosting. It ends with a LeRobot manipulation project. Knowing what a seeded random draw
    actually <em>is</em> is what let me port CPython's Mersenne Twister two years later.`,
    stats:[['commits','123'],['notebooks','30+']],
    links:[['AI_Portfolio','https://github.com/YoussefAnbar/AI_Portfolio'],['vhs-intro-ai','https://github.com/YoussefAnbar/vhs-intro-ai','private']]
  }
];

/* ---------------------------------------------------------------------
   the CAN frame
   --------------------------------------------------------------------- */
const BYTES = [
  { hex:'A3', name:'angle_raw_adc', type:'u16 · low byte',
    d:`The unconditioned reading straight off the encoder, before any scaling or calibration. I keep
    the raw value on the wire deliberately — if calibration later turns out to be wrong, every episode
    ever recorded can be recomputed instead of thrown away.` },
  { hex:'0F', name:'angle_raw_adc', type:'u16 · high byte',
    d:`Endianness is fixed by the contract and asserted in the codec tests on both the C side and the
    Python side. A disagreement between a board and a host is the kind of bug that eats a weekend, so
    it gets a test rather than a comment.` },
  { hex:'12', name:'angle_millideg', type:'i16 · low byte',
    d:`The calibrated angle in thousandths of a degree. Signed, because joints travel both ways.
    Integer rather than float, so every node agrees on the value exactly — no drift between a
    Cortex-M0+, a Python process, and a browser.` },
  { hex:'D4', name:'angle_millideg', type:'i16 · high byte',
    d:`Millidegrees were chosen so the full ±180° range fits inside sixteen bits with room to spare.
    A deliberate trade of precision against frame size, made once and then not reopened every time
    someone wants another decimal place.` },
  { hex:'02', name:'node_id', type:'u8',
    d:`Which physical pod sent this. It's also folded into the arbitration ID, which means the bus
    arbitrates by node priority for free — a hardware property earned by a numbering decision rather
    than by code.` },
  { hex:'01', name:'chain_index', type:'u8',
    d:`Position in the kinematic chain, kept separate from node_id on purpose. Conflating identity and
    ordering would mean you could never swap a failed pod without renumbering the whole arm, and
    field-replaceability is the entire point of a modular joint.` },
  { hex:'00', name:'status_flags', type:'u8 · bitfield',
    d:`Six named failure modes, one bit each: ADC fault, SPI fault, CAN fault, magnet out of bounds,
    not yet enumerated, calibration invalid. This byte is the physical form of the rule I keep coming
    back to — a subsystem that can't do its job has to say so.` },
  { hex:'7B', name:'xor checksum', type:'u8',
    d:`XOR across the preceding seven bytes. Cheap enough to compute inside an interrupt, and enough
    to catch the single-bit corruption a short bus actually produces. The host records whether it
    matched, so a corrupted frame becomes a recorded fact instead of a silent one.` }
];
