/* Five stories to replace the remaining drafts. Appended by a script. */
const NEW_STORIES = `
  'cdh-flight-software': {
    status: 'ready',
    note: 'Written from the work itself. The lab’s repository is not mine to publish, so this describes the engineering rather than quoting a commit history.',
    lede: \`Command and Data Handling for SCOPE, a mission at the Texas Spacecraft Laboratory — a NASA
           partner lab. CDH is the part of a spacecraft that receives commands, decides what to do with
           them, and gets telemetry back down. It is written in C++ on F′, the framework NASA JPL uses
           on real missions, which means most of the architecture is not up to me — and that turns out
           to be the point.\`,
    sections: [
      { h: 'What F′ actually imposes',
        p: \`F′ is a component framework, not a library you call. You do not write a program with a
            main loop; you write <b>Components</b> that own state and behaviour, expose typed
            <b>Ports</b>, and register <b>Commands</b> the ground can invoke. The connections between
            components are declared in FPP model files, and a code generator emits the plumbing.\`,
        list: [
          '<b>Components</b> — the units of behaviour, each with its own state and its own thread affinity',
          '<b>Ports</b> — typed, directional connections; a component cannot reach into another one, only call a port it was given',
          '<b>Commands</b> — dispatched from the ground, with opcodes and argument types declared in the model rather than parsed by hand',
          '<b>FPP model files</b> — the topology, autocoded into the interface glue',
          '<b>Rate groups</b> — periodic scheduling, so work runs at a declared frequency instead of whenever a loop gets round to it'
        ] },
      { h: 'Why autocoded interfaces matter more than they sound',
        p: \`The generated glue is the same idea as the frozen CAN frame on the robot, enforced by a
            tool instead of by discipline. If a port's type changes, every component connected to it
            fails to build. You cannot have one side of an interface quietly disagree with the other,
            because neither side is hand-written. <b>The class of bug where two modules each believe a
            different thing about a shared structure is designed out rather than tested for.</b>\` },
      { h: 'Rate groups, and the same argument as the teleop loop',
        p: \`Work is attached to a rate group and runs at a declared frequency. That is the flight
            equivalent of the fixed-iteration inverse-kinematics solver in the teleop console and the
            absolute-deadline loop in pi-teleop: <b>bounded work per tick beats work that finishes
            when it finishes.</b> A scheduler you can reason about is worth more than one that is
            occasionally faster.\` },
      { h: 'Validated on target, not on a laptop',
        p: \`F′ builds for a host machine and for the flight target. Running on Linux/ARM target
            hardware is where the differences that matter appear — timing, endianness, memory
            behaviour, and how the toolchain treats types that were fine on a desktop. Passing on the
            host proves the logic; passing on the target is the only thing that proves the software.\` }
    ],
    decisions: [
      { d: 'Learn the framework rather than route around it',
        why: \`F′ is opinionated and it is opinionated for reasons that were paid for on previous
              missions. The instinct to write a simpler thing that does what you want is exactly the
              instinct that produces software nobody else can review. The constraint is the value.\` },
      { d: 'Declare interfaces in the model, never in prose',
        why: \`Every interface described in a comment eventually diverges from the code. An interface
              described in FPP cannot, because the code is generated from it.\` }
    ]
  },

  'baja-telemetry-ecu': {
    status: 'ready',
    note: 'Written from the work itself; the team’s code is not in a repository of mine.',
    lede: \`Seven-plus sensors on a Raspberry Pi Pico, logging a competition off-road vehicle at about
           500 Hz per channel to microSD, with sampling latency held under 5 ms. Four Hall-effect
           wheel-speed channels, a six-axis IMU, brake pressure, and engine and CVT temperature.\`,
    sections: [
      { h: 'The sensors were not the hard part',
        p: \`Reading a Hall-effect sensor is a solved problem. The difficulty is the environment: a
            Baja car is continuous high-amplitude vibration and a great deal of electrical noise from
            the drivetrain. <b>A logger that drops samples under vibration and EMI is worthless,
            because those are precisely the conditions it exists to measure.</b> Any failure mode
            correlated with the thing you are measuring destroys the measurement.\` },
      { h: 'Why wheel speed is four channels and not one',
        p: \`Four independent Hall-effect channels means wheel speeds can be compared against each
            other. A single wheel spinning faster than the other three is slip; all four rising
            together is acceleration. One channel gives you a number, four give you an
            interpretation — and the comparison is only valid if the channels are sampled close
            enough together in time to be talking about the same instant.\` },
      { h: 'Where the 5 ms comes from',
        p: \`The latency target is not about the sensor, it is about correlation. At competition
            speeds a vehicle covers real distance in a few milliseconds, so a brake-pressure sample
            and a wheel-speed sample separated by too much time cannot be honestly plotted on the
            same axis. Holding the loop tight enough that all channels belong to the same moment is
            what makes post-run analysis mean anything.\` },
      { h: 'Log everything, decide later',
        p: \`The Pico writes raw channels to microSD rather than computing derived values on the
            vehicle. Storage is cheap and a run is not repeatable — the car goes out once. Anything
            computed on board and not stored is a decision made before you knew what you were looking
            for, and it cannot be revisited. Same instinct as keeping the raw ADC reading on the CAN
            frame alongside the calibrated angle.\` }
    ],
    decisions: [
      { d: 'RP2040 rather than a general-purpose Linux board',
        why: \`Two cores, deterministic timing, no operating system deciding when your code runs, and
              programmable IO for the wheel-speed edges. A Linux scheduler introduces jitter that a
              microcontroller simply does not have, and the whole value of this device is timing you
              can trust.\` },
      { d: 'Raw channels to disk, analysis off the vehicle',
        why: \`On-vehicle processing is compute you cannot debug and data you cannot recover. The
              correct division is: the car records, the laptop interprets.\` }
    ]
  },

  'chipless-rfid-strain-sensing': {
    status: 'ready',
    note: 'Ongoing research in a PhD lab at UT Austin. Written at the level of the engineering, without lab-internal detail.',
    lede: \`Wireless strain and temperature sensors embedded inside metal parts made by laser powder
           bed fusion, targeting roughly 1×10⁻⁵ strain and better than 1 °C. Chipless means there is
           no integrated circuit, no battery and no antenna feed inside the part — the sensor is a
           passive resonant structure, and everything is read from outside.\`,
    sections: [
      { h: 'Why chipless, and what it costs',
        p: \`A conventional sensor needs power and a way to get its reading out. Neither survives being
            cast inside a metal component. A chipless resonant sensor has no active parts to power
            and nothing to fail electrically — the measurement is the shift in its resonant frequency,
            interrogated from outside.\`,
        list: [
          '<b>No battery</b> — nothing to deplete inside a part that will never be opened',
          '<b>No chip</b> — no semiconductor to fail at temperature or under the thermal cycling of the print itself',
          '<b>The cost</b> — a passive resonator gives you frequency, not a digital reading, so all the difficulty moves into the interrogation and the calibration'
        ] },
      { h: 'Strain and temperature are the same measurement',
        p: \`Both change the resonant frequency, which is the central difficulty. A frequency shift on
            its own is ambiguous — it could be mechanical load or it could be the part warming up.
            <b>Separating them is the actual research problem</b>, and it is why the architecture
            matters more than the sensitivity: a design that reads beautifully but cannot tell strain
            from heat has not measured anything.\` },
      { h: 'Metal is a hostile place to put an antenna',
        p: \`Radio does not pass through metal. A sensor embedded in a conductive part has to be
            positioned and coupled so that it can still be interrogated, which constrains geometry,
            depth and orientation before any electrical design starts. The RF problem and the
            manufacturing problem are the same problem.\` },
      { h: 'Micro-cold spray, and one attempt',
        p: \`Fabrication deposits material without the heat that would destroy a fine feature. It has
            to survive the rest of the build, because the sensor is not attached to the part — it is
            <b>inside</b> it. Once the print finishes there is no access, no rework, no recalibration
            and no second revision. Every decision has to be right before the part exists.\` }
    ],
    decisions: [
      { d: 'Resonant RLC rather than an active sensing element',
        why: \`Passive structures have no failure mode that requires power. In a location that can
              never be serviced, "cannot fail because there is nothing to fail" beats "unlikely to
              fail".\` },
      { d: 'Treat the ambiguity as the specification',
        why: \`Chasing raw sensitivity first would produce a very precise number of unknown meaning.
              Resolving strain against temperature is what makes the reading a measurement rather
              than a signal.\` }
    ]
  },

  'ai-cross-document-verification': {
    status: 'ready',
    note: 'Employer work at GE Vernova. The repositories are private; this describes the design, with no confidential data.',
    lede: \`Instrument engineers verify tags by hand across loop diagrams, P&IDs, interconnect
           drawings and one-line diagrams — thousands of them, and exactly the kind of work where
           attention degrades before accuracy does. This reads an instrument index, reads the drawing
           PDFs locally, and returns a colour-banded review workbook: green verified, red mismatch,
           yellow uncertain.\`,
    sections: [
      { h: 'The architectural refusal',
        p: \`The design principle, written into the repository's own architecture document, is that
            <b>the system never asks a language model to decide whether two drawings agree</b>.
            Instead: extract structured facts from the loop diagram, extract structured facts from
            the P&ID, compare them with deterministic scoring, and use the local model only to
            normalise messy text or explain an ambiguous case.\`,
        quote: \`A language model's answer cannot be audited. A structured extraction with rule-based comparison can.\` },
      { h: 'Every row has to justify itself',
        p: \`The output is not a verdict, it is evidence. Each row records what the loop diagram
            claimed, what was found on the P&ID, where on the drawing it was found, a confidence
            score from 0 to 100, and why the row landed green, yellow or red. An engineer disagreeing
            with a row can see exactly which step produced it.\` },
      { h: 'Yellow is a real answer',
        p: \`Anything uncertain resolves to yellow rather than being forced into green or red, and
            final engineering approval stays human-owned by design. <b>On industrial drawings a
            confidently wrong "verified" is worse than no tool at all</b>, because it removes the
            scrutiny that would otherwise have caught the error. The conservative bias is the
            product.\` },
      { h: 'Contracts first, credentials never',
        p: \`Every enterprise system it touches — the document vault, the SSO provider, the internal
            vision gateway — exists in the repository as a <b>documented API contract with a working
            mock behind it</b>. The tool runs end to end against synthetic data from a clean
            checkout. That is not a limitation; it is what makes the thing testable at all, and it
            means no real drawing, index, credential or internal URL is ever in the repository.\` },
      { h: 'Local by default',
        p: \`Rendering, text extraction, tag detection, matching and the language model all run on the
            machine. Nothing about a project leaves it. The privacy property comes from there being
            no code path that sends anything out, rather than from a policy saying it should not.\` }
    ],
    decisions: [
      { d: 'Regex and fuzzy matching before machine learning',
        why: \`ISA-5.1 instrument tags are structured. A rule that knows the structure is auditable,
              instant, and free; a model that guesses at it is none of those. The model earns its
              place only where the text is genuinely messy.\` },
      { d: 'Check that the tag prefix matches its claimed role',
        why: \`A tag can be present, correctly spelled, and still wrong — a temperature prefix on
              something documented as a pressure instrument. Comparing strings finds typos; comparing
              structure finds mistakes.\` }
    ]
  },

  'design-review-and-benchmarking': {
    status: 'ready',
    note: 'Employer work at GE Vernova. Described at the level of method; no customer or project data.',
    lede: \`The half of the internship that was not software: 40+ design review checks, 20+ documented
           anomalies across P&IDs, one-line diagrams, motor schematics and customer wiring, aligned
           against IEEE 315-1975 — plus a data investigation and an automated competitive
           benchmarking pipeline.\`,
    sections: [
      { h: 'What a standard is actually for',
        p: \`IEEE 315-1975 governs how electrical symbols are drawn. Reviewing against it is
            unglamorous and it is the reason drawings from different engineers, decades and vendors
            can be read by the same person without ambiguity. <b>The value of a standard is not that
            it is correct, it is that it is shared</b> — which is the same reason the CAN frame on
            the robot is frozen and the FPP model on the spacecraft is generated rather than written.\` },
      { h: 'Anomalies are findings, not failures',
        p: \`Twenty-plus documented anomalies is the deliverable, not a defect count. A review that
            finds nothing has either been done on perfect drawings or has not been done. Writing each
            one down — what was expected, what was drawn, and which clause it contradicts — is what
            makes it actionable rather than an opinion.\` },
      { h: 'The regression that had to earn it',
        p: \`Five-plus anomalies in Frontier engine data were found by correlating min-gate function
            software trends against EPlan modelling, and root-caused with a linear regression. The
            point of the regression was not sophistication — it was having a defensible reason to say
            two things were related, rather than eyeballing two curves and calling it a pattern.\` },
      { h: 'Replacing manual tracking with a pipeline',
        p: \`Competitive benchmarking was a person periodically looking things up. A Velocity Suite
            data collector and a datacenter market-intelligence scraper turned it into live fuel-cost
            and operational data on GE turbines against competitors. The engineering content is
            small; the value is that the number is current when someone asks, instead of being as old
            as the last time anyone had time to check.\` },
      { h: 'The paper',
        p: \`Alongside the drawings, a research paper on clutched versus clutchless synchronous
            condensers for grid stability. A synchronous condenser provides inertia and reactive
            power to a grid increasingly supplied by inverters that provide neither; whether it is
            clutched to a turbine or freestanding changes what it can do and what it costs. Writing
            it was the part of the internship that most resembled being a power engineer rather than
            a software one.\` }
    ],
    decisions: [
      { d: 'Read the standard rather than pattern-match the drawings',
        why: \`It is possible to review by comparing a drawing to other drawings, and it finds
              inconsistency without finding error. Checking against the clause is slower and is the
              only version that can say why something is wrong.\` },
      { d: 'Automate the recurring lookup, not the judgement',
        why: \`The scraper collects; a person still decides what it means. The same division as the
              verification tool — machines are good at the part that is tedious and exactly bad at
              the part that carries liability.\` }
    ]
  }
`;
module.exports = NEW_STORIES;
