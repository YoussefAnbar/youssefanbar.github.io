/* =====================================================================
   CONTENT — sourced from the repositories and the current résumé.
   Numbers are read, not estimated.
   ===================================================================== */

/* Four hues, one per discipline. Colour is an index, not decoration. */
const HUE = { hw:'var(--c1)', fw:'var(--c2)', sn:'var(--c3)', sw:'var(--c4)' };

const INTERESTS = [
  { i:'sat',   c:'fw', t:'Flight software',   d:'C++ on NASA JPL’s F′ framework' },
  { i:'board', c:'hw', t:'Board design',      d:'Schematic to fabricated PCB' },
  { i:'chip',  c:'fw', t:'Embedded firmware', d:'C on bare metal, tested first' },
  { i:'wave',  c:'sn', t:'Sensing & RF',      d:'Making the physical world legible' },
  { i:'arm',   c:'hw', t:'Robotics',          d:'Teleoperation and modular joints' },
  { i:'car',   c:'sw', t:'Motorsport',        d:'Longhorn Baja electronics' }
];

const SKILLS = [
  { t:'Hardware & power', g:'board', hue:'hw', items:[
    { n:'Altium Designer',    m:['Altium'] },
    { n:'Schematic capture',  m:['Altium','schematic'] },
    { n:'PCB layout',         m:['Altium','PCB','HAT'] },
    { n:'MOSFET switching',   m:['MOSFET'] },
    { n:'LiPo / LiHV power',  m:['LiPo','LiHV','LiPo / LiHV'] },
    { n:'LDO regulation',     m:['LDO'] },
    { n:'DRC & CAM',          m:['CAMtastic','DRC','CAM'] },
    { n:'SolidWorks',         m:['SolidWorks'] },
    { n:'JLCPCB fabrication', m:['Altium','fabrication'] }
  ]},
  { t:'Firmware, embedded & flight', g:'chip', hue:'fw', items:[
    { n:'Embedded C',          m:['Embedded C','C/C++'] },
    { n:'C++',                 m:['C++'] },
    { n:'F′ (F Prime)',        m:['F Prime','F′'] },
    { n:'STM32 · Cortex-M0+',  m:['STM32','STM32C011'] },
    { n:'RP2040',              m:['RP2040'] },
    { n:'CAN bus',             m:['CAN'] },
    { n:'SPI-CAN',             m:['SPI-CAN','MCP2515'] },
    { n:'Auto-enumeration',    m:['auto-enumeration','enumerat'] },
    { n:'Rate-group tasks',    m:['rate-group'] },
    { n:'Linux / ARM targets', m:['Linux/ARM','ARM'] }
  ]},
  { t:'Sensing & instrumentation', g:'wave', hue:'sn', items:[
    { n:'Magnetic encoders',    m:['MT6701','encoder','encoders'] },
    { n:'Hall-effect',          m:['Hall-effect'] },
    { n:'6-axis IMU',           m:['IMU'] },
    { n:'Chipless RFID',        m:['RFID'] },
    { n:'Resonant RLC',         m:['RLC'] },
    { n:'Strain & temperature', m:['strain','LPBF','thermal'] },
    { n:'DAQ ~500 Hz',          m:['Hall-effect','RP2040'] },
    { n:'LiDAR & GPS',          m:['LiDAR'] },
    { n:'OBD-II · BMW ISTA',    m:['OBD-II','ISTA'], exp:'BMW' }
  ]},
  { t:'Software & data', g:'code', hue:'sw', items:[
    { n:'Python',             m:['Python'] },
    { n:'NumPy · Pandas',     m:['NumPy','Pandas','scikit'] },
    { n:'Neural networks',    m:['PyTorch','neural','Gemini'] },
    { n:'TypeScript',         m:['TypeScript'] },
    { n:'ROS 2 Jazzy',        m:['ROS 2'] },
    { n:'React',              m:['React','Next.js'] },
    { n:'FastAPI',            m:['FastAPI'] },
    { n:'SQL · Java · Swift', m:['SQL','Swift'] },
    { n:'Git',                m:['Python','TypeScript','Embedded C','Altium','C/C++'] }
  ]}
];

const EXPERIENCE = [
  { role:'ITR / Design Engineering Intern', org:'GE Vernova', where:'Houston, TX',
    when:'May – Aug 2026', accent:'hw',
    bullets:[
      'Built an AI cross-document verification system spanning <b>7 document types</b> and <b>6 automated consistency checks</b> — a projected <b>93% reduction in review labour</b> and cycle time from <b>16 weeks to 4</b> across 5 departments, easing backlog through 2029.',
      'Completed <b>40+ design review checks</b> and documented <b>20+ technical anomalies</b> across P&amp;IDs, one-line diagrams, motor schematics, and customer wiring and load adjustments, aligning drawings to <b>IEEE 315-1975</b>.',
      'Identified 5+ anomalies in Frontier engine data by correlating min-gate function software trends against EPlan modelling, root-causing each with a linear regression model.',
      'Automated competitive benchmarking through a Velocity Suite data collector and a datacenter market-intelligence scraper, replacing manual tracking with live fuel-cost and operational data on GE turbines versus competitors.',
      'Authored a research paper on clutched versus clutchless synchronous condensers for grid stability applications.'
    ] },
  { role:'Command &amp; Data Handling — Flight Software', org:'Texas Spacecraft Laboratory · NASA partner',
    where:'UT Austin', when:'2026 – present', accent:'fw',
    bullets:[
      'Developing CDH flight software in <b>C++</b> on NASA JPL’s <b>F′ (F Prime)</b> framework — authoring Components, Ports, and Commands for telemetry and command dispatch.',
      'Implementing rate-group scheduled tasks and FPP model definitions for autocoded interfaces, validated on <b>Linux/ARM target hardware</b>.'
    ] },
  { role:'Co-founder', org:'Inhabit Robotics', where:'Dexterous teleop + modular CAN joints',
    when:'2026 – present', accent:'hw',
    bullets:[
      'Built a dexterous teleop hand on the <b>Unitree G1 EDU (Dex3-1)</b> via <code>xr_teleoperate</code>, mapping operator joint poses to force-controlled actuators. <b>Demoed to SF VCs.</b>',
      'Architecting V2: daisy-chainable CAN-bus joints using MCUs, magnetic encoders, and SPI-CAN, with auto-enumeration so the base controller detects module order to the end-effector.',
      'In talks with <b>Tess Ventures</b> and angel investors.'
    ] },
  { role:'Embedded Hardware Engineer — PCB / Power', org:'tinyCore Industries',
    where:'Team of 8 · pre-seed $700K', when:'2025 – 2026', accent:'hw',
    bullets:[
      'Designed a custom micro-drone HAT PCB in Altium driving <b>4× brushed coreless motors</b> via MOSFET low-side switching, with 1S LiPo/LiHV power delivery and an onboard 3.3&nbsp;V LDO feeding the MCU.',
      'Replaced motor connectors with through-hole solder pads for vibration resistance; validated manufacturability via 3D PCB export and SolidWorks fit checks. <b>Platform sold to universities.</b>'
    ] },
  { role:'Undergraduate Researcher — Embedded Chipless RFID', org:'PhD lab, UT Austin',
    where:'Structural health monitoring', when:'2025 – present', accent:'sn',
    bullets:[
      'DARPA-scale research on wireless chipless RFID strain and temperature sensors embedded in <b>LPBF-manufactured metal parts</b>.',
      'Designing resonant RLC sensing architectures and supporting micro-cold-spray fabrication, targeting <b>~1×10⁻⁵ strain</b> and <b>&lt;1&nbsp;°C</b> resolution.'
    ] },
  { role:'Electronics — Longhorn Baja Electric Racing', org:'SAE, UT Austin', where:'Austin, TX',
    when:'2025 – present', accent:'sw',
    bullets:[
      'Integrated <b>7+ sensors</b> into a Raspberry Pi Pico ECU — Hall-effect wheel speed, 6-axis IMU, brake pressure, engine/CVT temperature.',
      'Implemented ~500&nbsp;Hz acquisition per sensor with microSD telemetry logging and <b>&lt;5&nbsp;ms sampling latency</b> under vibration and EMI.'
    ] },
  { role:'Electrical Engineer Service Intern', org:'BMW', where:'Houston, TX', when:'Jul 2024', accent:'fw',
    bullets:[
      'Aided diagnostic tests on Digital Motor Electronics using OBD-II scanners and BMW ISTA, troubleshooting <b>4+ control-unit failures across 25+ vehicle models</b>.',
      'Worked alongside senior technicians on in-circuit testing and ECU programming, building familiarity with control-module software and fault-tracing on live service vehicles.'
    ] },
  { role:'Electrical Engineering Intern', org:'Baker Hughes', where:'Houston, TX', when:'Jun 2023', accent:'sn',
    bullets:[
      'Managed rotary steerable gear tests measuring drill torque under simulated downhole pressure to accelerate early-phase failure analysis.',
      'Observed Ansys and Jewel Suite modelling of drill performance for electronics integration.'
    ] }
];

const AWARDS = [
  { place:'2nd place', prize:4000, name:'Yconic × NVIDIA Hackathon', accent:'fw',
    d:'MCU-driven datacenter thermal twin, modelling bidirectional API flow between heat sources and heat-pump sinks.' },
  { place:'2nd place', prize:3000, name:'TVG Hackathon', accent:'sw',
    d:'Privacy-first customer-service escalation system using Google Gemini sentiment analysis to flag escalating discussions via dashboard.' },
  { place:'2nd place', prize:1000, name:'Designathon', accent:'sn',
    d:'LiDAR and GPS smart-bin product with a dashboard to optimise trash layout and collection routing.' },
  { place:'Scholarship', prize:36000, name:'UT Austin Honors Scholarship', accent:'hw',
    d:'Cockrell School of Engineering.' }
];

const EDUCATION = [
  { school:'The University of Texas at Austin', when:'2025 – 2028',
    detail:'BS Electrical &amp; Computer Engineering, Honors · GPA 4.00 / 4.00 · Dean’s List (Fall 2025, Spring 2026)' },
  { school:'The Village School', when:'2025',
    detail:'Valedictorian · 4.8 / 4.0 · rank 1 of 196 · IB Diploma 44/45, top 0.5% globally' },
  { school:'Stanford Online · DeepLearning.AI', when:'2024',
    detail:'Machine Learning Certification' }
];

const GROUPS = [
  { id:'flight',   label:'Flight software',
    note:'Written for something that cannot be power-cycled by hand.' },
  { id:'hardware', label:'Hardware &amp; firmware',
    note:'Where I actually live. Everything here starts with something physical.' },
  { id:'systems',  label:'The software that serves it',
    note:'A board is only useful if something can read it honestly.' },
  { id:'wins',     label:'Built under pressure',
    note:'Hackathon builds — all three placed 2nd. No repositories: these were designed, built and demoed inside a weekend.' },
  { id:'nda',      label:'Work I can’t show you',
    note:'Built at GE Vernova. Described rather than linked.' },
  { id:'craft',    label:'Learning the half I’m worse at',
    note:'Not electrical engineering, and I won’t dress it up as it.' },
  { id:'roots',    label:'Where it started',
    note:'The year I stopped importing things I didn’t understand.' }
];

const PROJECTS = [
  { g:'flight', cover:'sat', title:'CDH Flight Software', when:'2026 – present',
    stack:'C++ · NASA JPL F′ (F Prime) · FPP · Linux/ARM',
    d:'Command and Data Handling for the Texas Spacecraft Laboratory, a NASA partner lab. I author Components, Ports, and Commands for telemetry and command dispatch, and implement rate-group scheduled tasks with FPP model definitions for autocoded interfaces, validated on Linux/ARM target hardware. <em>Flight software has the same property as a sensor cast into metal: you do not get to go back and fix it.</em>',
    stats:[['framework','NASA JPL F′'],['language','C++'],['target','Linux / ARM']],
    links:[['Texas Spacecraft Laboratory','']] },

  { g:'hardware', cover:'arm', title:'Inhabit Robotics — Teleop Hand &amp; CAN Joints', when:'2026 – present',
    stack:'Unitree G1 EDU (Dex3-1) · xr_teleoperate · STM32C011 · CAN · SPI-CAN · MT6701 magnetic encoders',
    d:'Co-founded. Built a dexterous teleop hand on the Unitree G1, mapping operator joint poses to force-controlled actuators, and demoed it to VCs in San Francisco. V2 is a daisy-chainable CAN-bus joint architecture with auto-enumeration, so the base controller works out module order all the way to the end-effector rather than being told.',
    stats:[['status','in talks · Tess Ventures'],['bus','CAN · SPI-CAN'],['V2','auto-enumerating']],
    links:[['Inhabit-Software','https://github.com/YoussefAnbar/Inhabit-Software','private'],
           ['Inhabit_UI','https://github.com/YoussefAnbar/Inhabit_UI','private']] },

  { g:'hardware', cover:'board', title:'tinyCore Industries — Micro-drone HAT', when:'2025 – 2026',
    stack:'Altium · MOSFET low-side switching · 1S LiPo / LiHV · 3.3 V LDO · DRC · CAM · SolidWorks',
    d:'A custom micro-drone HAT PCB driving four brushed coreless motors, with 1S LiPo/LiHV power delivery and an onboard LDO feeding the MCU. I replaced the motor connectors with through-hole solder pads for vibration resistance and validated manufacturability through 3D PCB export and SolidWorks fit checks. <em>Team of eight, pre-seed $700K, and the platform sold to universities</em> — a very different bar from a board that only has to work on my desk.',
    stats:[['team','8'],['funding','pre-seed $700K'],['outcome','sold to universities']],
    links:[['tinyCore','https://github.com/YoussefAnbar/tinyCore','private']] },

  { g:'hardware', cover:'wave', title:'Baja Telemetry ECU', when:'2025 – present',
    stack:'RP2040 · C/C++ · Hall-effect · 6-axis IMU · microSD',
    d:'Seven sensors logging at ~500&nbsp;Hz each. The sensors weren’t the hard part — the environment was. A logger that drops samples under vibration and EMI is worthless, because those are exactly the conditions it exists to measure.',
    stats:[['channels','7+'],['latency','< 5 ms'],['rate','~500 Hz']],
    links:[['Longhorn Baja Electric Racing','']] },

  { g:'hardware', cover:'coil', title:'Chipless RFID Strain Sensing', when:'2025 – present',
    stack:'RF · resonant RLC · LPBF · micro-cold spray',
    d:'Wireless strain and temperature sensors sealed inside 3D-printed metal, where there is no revision two. Targeting ~1×10⁻⁵ strain and under 1&nbsp;°C. The most unforgiving version of the thing all my other work rehearses — design as though you will never get to touch it again.',
    stats:[['strain','~1×10⁻⁵'],['temperature','< 1 °C'],['scale','DARPA-scale']],
    links:[['UT Austin · PhD lab','']] },

  { g:'systems', cover:'flow', title:'Inhabit Data Pipeline', when:'2026',
    stack:'Python · ROS 2 Jazzy · pytest · parquet',
    d:'Turns CAN frames into training data that’s allowed to be trusted. Episodes drifting outside the jitter budget are quarantined with an exact reason — not averaged in. Bad data costs you the model and the month you spend not understanding why.',
    stats:[['commits','350'],['merged PRs','285'],['test floor','6 000']],
    links:[['Inhabit-Software','https://github.com/YoussefAnbar/Inhabit-Software','private']] },

  { g:'systems', cover:'net', title:'Teleoperation Console', when:'2026',
    stack:'TypeScript · Vite · WebSockets · CCD / DLS IK',
    d:'Drag an arm in a browser and a simulated robot follows at 100&nbsp;Hz. I ported CPython’s Mersenne Twister to TypeScript and checked it draw for draw to fifteen decimals — an embarrassingly long weekend, but the demo and the bench are provably the same system.',
    stats:[['loop','100 Hz'],['parity','15 decimals'],['commits','51']],
    links:[['Inhabit_UI','https://github.com/YoussefAnbar/Inhabit_UI','private']] },

  { g:'wins', cover:'thermal', title:'Datacenter Thermal Twin', when:'Yconic × NVIDIA · 2nd, $4,000',
    stack:'MCU · bidirectional API · thermal modelling',
    d:'An MCU-driven digital twin of datacenter thermals, modelling bidirectional API flow between heat sources and heat-pump sinks — treating waste heat as an input to something rather than a problem to vent.',
    stats:[['placed','2nd'],['prize','$4,000'],['built in','one weekend']],
    links:[['No public repository','']] },

  { g:'wins', cover:'chart', title:'Escalation Sentiment Dashboard', when:'TVG Hackathon · 2nd, $3,000',
    stack:'Google Gemini · sentiment analysis · dashboard',
    d:'A privacy-first customer-service escalation system that reads sentiment on live conversations and flags the ones heading sideways, before the customer has to ask for a manager. The privacy-first constraint was the design, not a footnote.',
    stats:[['placed','2nd'],['prize','$3,000'],['model','Gemini']],
    links:[['No public repository','']] },

  { g:'wins', cover:'grid', title:'LiDAR Smart Bin', when:'Designathon · 2nd, $1,000',
    stack:'LiDAR · GPS · routing dashboard',
    d:'A LiDAR and GPS bin that measures how full it actually is and where, with a dashboard that optimises both internal trash layout and collection routing. Sensing a physical quantity nobody was measuring, then doing something useful with it.',
    stats:[['placed','2nd'],['prize','$1,000'],['sensing','LiDAR + GPS']],
    links:[['No public repository','']] },

  { g:'nda', cover:'doc', title:'AI Cross-Document Verification', when:'2026 · GE Vernova',
    stack:'Python · document AI · consistency checking',
    d:'Cross-checks engineering documentation across <b>7 document types</b> with <b>6 automated consistency checks</b>. Projected a <b>93% reduction in review labour</b> and cut cycle time from <b>16 weeks to 4</b> across five departments, easing backlog through 2029. It is architecturally incapable of returning a false “verified” — anything ambiguous escalates to a human, because a confidently wrong answer removes the scrutiny that would have caught it.',
    stats:[['document types','7'],['checks','6'],['labour saved','93%'],['cycle','16 → 4 wks']],
    links:[['Private — employer work','','private']] },

  { g:'nda', cover:'stack', title:'Design Review &amp; Benchmarking', when:'2026 · GE Vernova',
    stack:'IEEE 315-1975 · EPlan · linear regression · Velocity Suite',
    d:'Completed 40+ design review checks and documented 20+ anomalies across P&amp;IDs, one-line diagrams, and motor schematics, aligning drawings to IEEE 315-1975. Root-caused 5+ anomalies in Frontier engine data against EPlan modelling using linear regression, and automated competitive benchmarking with a live fuel-cost and operational data collector.',
    stats:[['review checks','40+'],['anomalies','20+'],['standard','IEEE 315-1975']],
    links:[['Private — employer work','','private']] },

  { g:'craft', cover:'chart', title:'Finabulary', when:'2026',
    stack:'React · Vite · Expo · Swift · Supabase',
    d:'A financial-literacy app, built to find out what shipping actually costs. The answer is that most of it isn’t engineering — accessibility audits, privacy labels, review notes, and a full rebrand in the final week when the name didn’t clear.',
    stats:[['clients','3'],['commits','55'],['status','deployed']],
    links:[['Live site','https://signalwise-one.vercel.app'],['signalwise','https://github.com/YoussefAnbar/signalwise','private']] },

  { g:'craft', cover:'stack', title:'Virtual Wardrobe Platform', when:'2026',
    stack:'Next.js · TypeScript · FastAPI · monorepo',
    d:'Mostly an exercise in saying no to the interesting parts first. I deferred AI processing, scraping, auth, payments, and 3D physics until the boring core loop worked. Shipping the interesting part first is how projects die at eighty percent.',
    stats:[['packages','7'],['deferred','5, on purpose']],
    links:[['tryon-shopping-webapp','https://github.com/YoussefAnbar/tryon-shopping-webapp','private']] },

  { g:'roots', cover:'net', title:'Foundations', when:'2024 – 2025',
    stack:'Python · PyTorch · scikit-learn · LeRobot',
    d:'A hundred and twenty-three commits of implementing things instead of importing them. Knowing what a seeded random draw actually <em>is</em> is what let me port CPython’s Mersenne Twister two years later.',
    stats:[['commits','123'],['notebooks','30+']],
    links:[['AI_Portfolio','https://github.com/YoussefAnbar/AI_Portfolio'],['vhs-intro-ai','https://github.com/YoussefAnbar/vhs-intro-ai','private']] }
];

const BYTES = [
  { hex:'A3', name:'angle_raw_adc', type:'u16 · low byte',
    d:'The unconditioned reading straight off the encoder, before scaling or calibration. I keep the raw value on the wire deliberately — if calibration later turns out to be wrong, every episode ever recorded can be recomputed instead of thrown away.' },
  { hex:'0F', name:'angle_raw_adc', type:'u16 · high byte',
    d:'Endianness is fixed by the contract and asserted in the codec tests on both the C and Python sides. A disagreement between a board and a host is the kind of bug that eats a weekend, so it gets a test rather than a comment.' },
  { hex:'12', name:'angle_millideg', type:'i16 · low byte',
    d:'The calibrated angle in thousandths of a degree. Signed, because joints travel both ways. Integer rather than float, so every node agrees exactly — no drift between a Cortex-M0+, a Python process, and a browser.' },
  { hex:'D4', name:'angle_millideg', type:'i16 · high byte',
    d:'Millidegrees let the full ±180° range fit inside sixteen bits with room to spare. A deliberate trade of precision against frame size, made once and then not reopened every time someone wants another decimal place.' },
  { hex:'02', name:'node_id', type:'u8',
    d:'Which physical pod sent this. It’s also folded into the arbitration ID, so the bus arbitrates by node priority for free — a hardware property earned by a numbering decision rather than by code.' },
  { hex:'01', name:'chain_index', type:'u8',
    d:'Position in the kinematic chain, kept separate from node_id on purpose. This is what makes auto-enumeration possible: the base controller works out module order to the end-effector instead of being told, so a failed joint can be swapped without renumbering the arm.' },
  { hex:'00', name:'status_flags', type:'u8 · bitfield',
    d:'Six named failure modes, one bit each: ADC fault, SPI fault, CAN fault, magnet out of bounds, not enumerated, calibration invalid. The physical form of the rule I keep coming back to — a subsystem that can’t do its job has to say so.' },
  { hex:'7B', name:'xor checksum', type:'u8',
    d:'XOR across the preceding seven bytes. Cheap enough to compute inside an interrupt, enough to catch the single-bit corruption a short bus actually produces. The host records whether it matched, so a corrupted frame becomes a recorded fact instead of a silent one.' }
];
