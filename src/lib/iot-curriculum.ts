/**
 * The Industrial Operations Technology (IS32) curriculum, transcribed from
 * Ogeechee Tech's own "Industrial Operations Program" brochure (16pp, published
 * as a flipbook at https://online.fliphtml5.com/exygb/xhzf/ and mirrored at
 * /documents/industrial-operations-program-3.pdf as of 2026-08-25 — see
 * PROJECT.md §6's dated note on the swap).
 *
 * ── Why this is code and not CMS content ──────────────────────────────────────
 * Every other page's copy is CMS-first (see PROJECT.md §4). This file is the
 * deliberate exception. It is a faithful transcription of an *accredited*
 * course catalog: course codes, credit hours, and SACA credential mappings are
 * matters of record, not marketing copy. Letting them be freely edited in the
 * Studio would risk misstating the program to prospective students, and a
 * 12-course × ~200-bullet editing surface would be hostile to the non-technical
 * editors the CMS exists to serve. When the curriculum changes it arrives as a
 * new brochure, and a developer updates this file deliberately.
 *
 * The *framing* around this data (headings, intros, buttons) IS CMS-editable.
 *
 * ── Defects in the source brochure (researched 2026-07-20) ───────────────────
 *
 * ✅ RESOLVED — C-301 had no title in the brochure, and the description printed
 * under it was about Ethernet communications while sitting on the Mechanical
 * Systems course. SACA's own registry settles it: **C-301 is "Mechanical Power
 * Systems 2"**, the level-2 companion to C-210 Mechanical Power Systems 1.
 * That is precisely why the brochure attaches both to ISAT 1110 — the code and
 * its placement were correct; only the pasted prose was wrong. Corrected above
 * from SACA, the credentialing authority, so this needed no guesswork about
 * OTC's curriculum.
 *
 * ✅ RESOLVED 2026-07-21 — the brochure vs. catalog numbering conflict on
 * Operations Technology I/II. An email confirmed two course-number changes
 * (ISAT 3100 → ISAT 2030, ISAT 3101 → ISAT 2040), and Ogeechee Tech's own
 * official course sheet for the program ("Industrial Operations Technology
 * Diploma (Start - Fall Semester 2026)", 0317_001.pdf) corroborates both new
 * numbers and confirms the rest of the 12-course program matrix unchanged
 * (titles, credits, and SACA credential mappings all match the brochure).
 * That same document also supplied a Required General Education block the
 * brochure never mentioned — ENGL 1010 (or ENGL 1101) 3 cr, MATH 1111 3 cr,
 * EMPL 1000 2 cr, 8 credits total, bringing the program to 53 credits across
 * 15 courses. Added below as `generalEducation: true` entries. See
 * PROJECT.md §8 for the full history of this conflict.
 *
 * ✅ RESOLVED 2026-08-26 — the three course-number/title mismatches against
 * Ogeechee Tech's own course catalog. Jake directed a direct match against
 * the live 2026-2027 catalog
 * (ogeecheetech.smartcatalogiq.com/current/catalog/programs-of-study/industrial-operations-technology/industrial-operations-technology-diploma-is32),
 * which now exists (it didn't yet when this was first flagged 2026-07-20,
 * back when the program's catalog year was still the 2025-2026 edition — see
 * PROJECT.md §8 for that history) and still disagrees with the brochure the
 * same way the 2025-2026 edition did:
 *
 *      brochure (old)                              catalog (now applied)
 *      ISAT 1104  Programmable Logic Control I   →  ISAT 1103
 *      ISAT 1105  Programmable Logic Control II  →  ISAT 1104
 *      ISAT 1103  Motor Control Systems & Tblsh. →  ISAT 1105
 *      ISAT 1130  Sensors in Industrial Automation → ISAT 1130 Sensors in
 *                 (brochure drops "Smart")           Industrial **Smart** Automation
 *
 * Applied below: codes swapped among the three PLC/Motor Control courses, and
 * "Smart" restored to the Sensors course title. Array *order* is unchanged
 * (still the college's teaching sequence, not a numeric sort — see the
 * comment on `COURSES` below).
 *
 * ✅ RESOLVED 2026-08-26 — the C-205/C-206 credential swap on ISAT 1102/1130,
 * and a second, previously-unknown swap on Operations Technology I/II. Not
 * from the program catalog page itself (it lists codes/titles/credit hours
 * only) but from each course's own individual catalog description page
 * (ogeecheetech.smartcatalogiq.com/current/catalog/courses/isat-industrial-operations-technology/isat-XXXX),
 * which states in plain prose which SACA exam(s) that course prepares a
 * student for. Two clean reassignments, no information lost — read directly
 * off those pages, not inferred:
 *
 *      course                    site had                catalog course page says
 *      ISAT 1102 Electrical Sys.  C-201 + C-205         →  C-201 + C-206
 *      ISAT 1130 Sensors          C-206 + C-203 + C-213 →  C-205 + C-203 + C-213
 *      ISAT 2030 Operations I     C-101 + C-102 + OSHA10→  C-101 + C-104 + OSHA10
 *      ISAT 2040 Operations II    C-104                 →  C-102
 *
 * (C-203 and OSHA 10 aren't swapped, just carried through unchanged.)
 *
 * ✅ RESOLVED 2026-08-26 — five credentials the site attaches to a course
 * that course's own catalog description page never names:
 *
 *      ISAT 1103 Programmable Logic Control I   — site adds C-212 (catalog page names only C-207)
 *      ISAT 1105 Motor Control Sys. & Tblsh.    — site adds C-204 (catalog page names only C-202)
 *      ISAT 1120 Hydraulic & Pneumatic Systems  — site adds C-209 (catalog page names only C-255, C-304)
 *      ISAT 1130 Sensors                        — site adds C-203 (catalog page names only C-205, C-213)
 *      ISAT 2010 Industrial Robotics I          — site adds C-103 (catalog page names only C-215)
 *
 * Each of these came from the brochure's matrix, not the catalog. Jake's
 * call, same day: **keep all five as the brochure has them.** No code change
 * needed — they were left in place pending this decision and stay exactly as
 * they were. Rationale on file: unlike the four swaps above, this isn't a
 * clean reassignment the catalog contradicts — its course-description prose
 * likely just names the exam a course centers on, not every one its content
 * touches, so the brochure's fuller list isn't necessarily wrong.
 *
 * ✅ RESOLVED 2026-08-26 — the Motor Controls `objectives` omission. Separate
 * question from the five credentials above: the brochure's own printed
 * objective bullets for this course read like they actually belong to the
 * swapped Sensors/Electrical Systems pair (C-205/C-206 content — see the
 * swap above), a content mix-up independent of which C-codes attach to which
 * course, so those bullets were never trustworthy. Rather than guess which
 * brochure block was misplaced, `objectives` was built fresh from this
 * course's own catalog description page (same source and method as the
 * swaps above), which is unambiguous prose, not a matrix that could get
 * mis-transcribed.
 *
 * ✅ RESOLVED 2026-08-27 — the Sensors (ISAT 1130) `objectives` list was
 * *also* wrong, and stayed wrong through the two fixes above: it never got
 * touched when 1130's credential swapped C-206 → C-205, so it kept printing
 * C-206 "electrical panel installation" content ("Install wires and
 * terminal blocks in electrical panels," "Install electrical panel wiring
 * to electric motors," etc.) — Electrical System Installation work, not
 * sensor work. Found while transcribing the corrected curriculum into the
 * print brochure (PROJECT.md §6) and cross-checking every course against
 * it. Fixed by swapping in the brochure's own genuine sensor-connect-and-
 * test bullets, which — same defect pattern as Motor Controls — were
 * sitting misfiled under the brochure's old "Motor Controls" section the
 * whole time. Moved rather than rewritten, since they're accurate C-205
 * content once relocated. The displaced C-206 bullets aren't reused
 * anywhere — ISAT 1102 Electrical Systems (which now carries C-206) already
 * has its own correct C-201-only list, and `objectives` arrays elsewhere in
 * this file don't attempt to cover every attached credential (e.g. ISAT
 * 1104's list only covers C-207, not C-212 too), so leaving C-206 unrepresented
 * in bullet form isn't a gap — its SACA glossary entry still carries the detail.
 *
 * OSHA 10 is a mapping listed in the matrix, not a SACA credential, so it has
 * no glossary entry.
 */

export type Course = {
  code: string;
  title: string;
  credits: number;
  /** SACA credential codes, in the order the brochure's matrix lists them. */
  credentials: string[];
  /** Omitted where the source document's objective list is unreliable. */
  objectives?: string[];
  /** Prose description, for courses the brochure describes rather than bullets. */
  summary?: string;
  /**
   * True for the three Required General Education courses (0317_001.pdf,
   * added 2026-07-21) rather than the IS32-specific program courses. They
   * carry no SACA credentials by design, not by omission.
   */
  generalEducation?: boolean;
};

/**
 * Listed in the brochure's own order — note it runs 1102 → 1105 → 1103 → 1104
 * → 1130 → 1110 (catalog numbering, applied 2026-08-26 — see the file header),
 * which is the college's teaching sequence, not a numeric sort. The 12
 * program courses sum to 45
 * credits; the 3 general education courses appended after them (0317_001.pdf)
 * add 8 more, for 53 total.
 */
export const COURSES: Course[] = [
  {
    code: "ISAT 1102",
    title: "Electrical Systems",
    credits: 4,
    credentials: ["C-201", "C-206"],
    objectives: [
      "Apply electrical system safety",
      "Connect and operate basic electrical circuits",
      "Interpret electrical schematics and diagrams",
      "Use a digital multimeter (DMM) to make electrical measurements",
      "Analyze basic load circuits",
      "Test and replace/reset fuses and circuit breakers",
      "Connect and operate basic reactive components",
      "Analyze basic combination circuits",
      "Troubleshoot basic series and parallel electrical circuits",
      "Analyze inductive circuits",
      "Analyze capacitive circuits",
    ],
  },
  {
    code: "ISAT 1105",
    title: "Motor Control Systems and Troubleshooting",
    credits: 4,
    credentials: ["C-202", "C-204"],
    // Built 2026-08-26 from this course's own catalog description page
    // (ogeecheetech.smartcatalogiq.com/current/catalog/courses/isat-industrial-operations-technology/isat-1105)
    // rather than the brochure — see the file header for why the brochure's
    // printed bullets for this course couldn't be trusted.
    objectives: [
      "Apply motor control safety procedures",
      "Connect and operate motor control circuits using 3-phase AC motors",
      "Connect and operate magnetic motor starters, control relays, and timer relays",
      "Interpret motor control ladder logic diagrams",
      "Check motor control circuits for proper ground connections",
      "Wire motors for high and low voltage",
      "Interpret motor control application circuits",
      "Apply troubleshooting safety procedures",
      "Troubleshoot faults in electric motor control circuits and AC variable frequency drives",
      "Test motor control components",
      "Use a digital multimeter, clamp-on ammeter, and PLC status indicators to troubleshoot motor control circuits",
    ],
  },
  {
    code: "ISAT 1103",
    title: "Programmable Logic Control I",
    credits: 4,
    credentials: ["C-207", "C-212"],
    objectives: [
      "Start up and shut down a PLC system",
      "Configure an Ethernet/IP driver",
      "Transfer programs between a PLC and PC via point-to-point Ethernet",
      "Transfer programs between a PLC and PC via USB serial",
      "Operate and monitor a PLC",
      "Connect, configure, and operate an HMI panel with Ethernet",
      "Configure PLC discrete I/O",
      "Program and operate a basic PLC logic program",
      "Create a PLC project",
      "Program and operate a PLC logic program that uses comparison instructions",
      "Program and operate a PLC project that uses math instructions",
      "Program and operate a PLC motor control sequence program",
      "Program and operate a basic PLC sequence program",
    ],
  },
  {
    code: "ISAT 1104",
    title: "Programmable Logic Control II",
    credits: 4,
    credentials: ["C-208"],
    objectives: [
      "Use status and diagnostic indicators to troubleshoot a PLC",
      "Troubleshoot PLC inputs and outputs",
      "Troubleshoot a PLC power distribution system",
      "Troubleshoot a PLC processor",
      "Troubleshoot a PLC system with discrete I/O",
      "Program and operate a multi-step PLC sequence program",
      "Troubleshoot a multi-step PLC sequence program",
    ],
  },
  {
    code: "ISAT 1130",
    title: "Sensors in Industrial Smart Automation",
    credits: 4,
    // C-206 → C-205 swap confirmed against the catalog's own course
    // description (2026-08-26); C-203 kept per Jake's call the same day —
    // see the file header.
    credentials: ["C-205", "C-203", "C-213"],
    // Replaced 2026-08-27 — the previous list was C-206 "electrical panel
    // installation" content, misplaced here from the brochure the same way
    // Motor Controls' list was (see the file header). This list is the
    // brochure's own genuine sensor-connect-and-test bullets, which were
    // misfiled under the old "Motor Controls" section — moved here rather
    // than rewritten, since they're accurate C-205 content.
    objectives: [
      "Identify and select an electronic sensor for an application",
      "Connect and test an inductive proximity sensor",
      "Connect and test a capacitive proximity sensor",
      "Connect and test a magnetic reed switch",
      "Connect and test a hall-effect sensor",
      "Connect and test a photoelectric sensor",
      "Interpret basic electrical control schematics",
      "Connect and test electro-pneumatic power circuits",
      "Connect and test electric relay sequence control circuits",
      "Connect and test a relay sequence circuit that uses electronic sensors",
    ],
  },
  {
    code: "ISAT 1110",
    title: "Mechanical Systems",
    credits: 4,
    credentials: ["C-210", "C-301"],
    objectives: [
      "Identify mechanical power transmission type and application",
      "Apply mechanical power transmission safety procedures",
      "Use a dial indicator to measure component dimensions",
      "Install and mount a motor",
      "Select and install a shaft key and hub",
      "Install and adjust pillow block and flange bearings",
      "Install and align a shaft system with a flexible jaw coupling",
      "Install and adjust a basic V-belt drive system",
      "Install and adjust a basic chain drive system",
      "Install and align a gear drive system",
      "Monitor the performance of a mechanical power transmission system",
      "Apply lubrication to mechanical components",
    ],
  },
  {
    code: "ISAT 1120",
    title: "Hydraulic & Pneumatic Systems",
    credits: 4,
    credentials: ["C-209", "C-255", "C-304"],
    objectives: [
      "Apply pneumatic system safety procedures",
      "Connect and adjust a pneumatic supply line",
      "Start up and shut down a reciprocating air compressor",
      "Interpret pneumatic schematics",
      "Connect and operate basic pneumatic circuits",
      "Connect and adjust flow control and needle valves",
      "Monitor performance of pneumatic system pressure and force",
      "Monitor pneumatic system operation",
      "Perform basic pneumatic system servicing",
    ],
  },
  {
    code: "ISAT 2010",
    title: "Industrial Robotics I",
    credits: 3,
    credentials: ["C-215", "C-103"],
    objectives: [
      "Identify robot type and applications",
      "Identify the components of an articulated servo robot",
      "Identify types of end-of-arm tooling",
      "Determine robot work envelope",
      "Identify robot workcell safety features",
      "Perform a robot workcell safety inspection",
      "Apply robot safety procedures",
      "Power up and shut down a robot",
      "Use a teach pendant to view menus and status indicators",
      "Identify robot model number and version data",
      "Jog an articulated robot in joint mode",
      "Set and test robot joint travel limits",
      "Identify robot position in each of 5 frames",
      "Jog an articulated robot using Cartesian coordinates",
      "Define a tool frame and user frame",
      "Load a robot program",
      "Teach robot motion points and enter program commands",
      "Test a robot program",
      "Operate a robot in production",
      "Recover a robot from basic faults",
    ],
  },
  {
    code: "ISAT 2020",
    title: "Industrial Robotics II",
    credits: 3,
    credentials: ["C-216", "FANUC-1"],
    objectives: [
      "Enter and interpret a robot program with motion commands",
      "Enter and interpret robot program tool and user frame offset commands",
      "Enter and interpret robot program data register commands",
      "Enter and interpret robot program branching commands",
      "Enter and interpret robot program looping and wait commands",
      "Interface and test discrete robot inputs and outputs",
      "Interface and test PLC I/O to a robot controller",
      "Enter and interpret robot programs that use discrete I/O",
      "Connect and test robot Ethernet network communications",
      "Enter and test a robot program macro command",
      "Develop and test a basic pick and place robot program",
      "Develop and test a machine load/unload robot program",
      "Develop and test a basic assembly robot program",
      "Develop and test a basic gluing robot program",
    ],
  },
  {
    code: "CIST 1601",
    title: "Information Security Fundamentals",
    credits: 3,
    credentials: [],
    summary:
      "A broad overview of information security, covering terminology, history, and security systems development and implementation, along with the legal, ethical, and professional issues in the field.",
  },
  {
    code: "ISAT 2030",
    title: "Operations Technology I",
    credits: 4,
    // C-102 → C-104 swap confirmed against the catalog's own course
    // description (2026-08-26) — see the file header.
    credentials: ["C-101", "C-104", "OSHA 10"],
    objectives: [
      "Concepts and terminology of smart manufacturing",
      "Basic setup, adjustment, and operation of automated machines",
      "Safety and hand tools",
      "Blueprint and schematic reading",
      "Precision measurement",
      "Basic electrical control, pneumatic, and sensor systems operation",
      "Basic robot operation and terminology; production monitoring via HMI, internet, Ethernet, and smart phones",
      "Smart manufacturing system metrics and optimization",
      "Setup, adjustment, and operation of computer controlled machines",
      "Basic Ethernet network operation",
      "Basic programmable controller programming and operation",
      "Basic mechanical and hydraulics system operation and adjustment",
      "Basic mechatronic systems programming and operation",
      "Basic robotics and CNC programming/operation",
      "HMI interface and operation",
    ],
  },
  {
    code: "ISAT 2040",
    title: "Operations Technology II",
    credits: 4,
    // C-104 → C-102 swap confirmed against the catalog's own course
    // description (2026-08-26) — see the file header.
    credentials: ["C-102"],
    objectives: [
      "Concepts of the Industrial Internet of Things (IIoT)",
      "PLC Ethernet messaging communications",
      "Barcode and RFID programming and operation",
      "Smart sensor programming and operation",
      "Managed Ethernet switch configuration and operation",
      "Variable frequency drive programming",
      "SQL database systems",
      "Data analytics and manufacturing execution systems (MES)",
      "Lean manufacturing and system optimization",
    ],
  },
  {
    code: "ENGL 1010",
    title: "Fundamentals of English I",
    credits: 3,
    credentials: [],
    generalEducation: true,
    summary:
      "Required general education course. May instead be satisfied with ENGL 1101 – Composition & Rhetoric (also 3 credits).",
  },
  {
    code: "MATH 1111",
    title: "College Algebra",
    credits: 3,
    credentials: [],
    generalEducation: true,
    summary: "Required general education course.",
  },
  {
    code: "EMPL 1000",
    title: "Interpersonal Relations and Professional Development",
    credits: 2,
    credentials: [],
    generalEducation: true,
    summary: "Required general education course.",
  },
];

/** The 12 IS32 program courses — everything except general education. */
export const PROGRAM_COURSES = COURSES.filter((c) => !c.generalEducation);

/** The 3 Required General Education courses (0317_001.pdf, added 2026-07-21). */
export const GENERAL_EDUCATION_COURSES = COURSES.filter((c) => c.generalEducation);

/** 45. Derived rather than hardcoded so it can never drift from the table. */
export const PROGRAM_CREDITS = PROGRAM_COURSES.reduce((sum, c) => sum + c.credits, 0);

/** 8. Derived rather than hardcoded so it can never drift from the table. */
export const GENERAL_EDUCATION_CREDITS = GENERAL_EDUCATION_COURSES.reduce(
  (sum, c) => sum + c.credits,
  0,
);

/** 53 — program + general education. Derived so it can never drift from the table. */
export const TOTAL_CREDITS = COURSES.reduce((sum, c) => sum + c.credits, 0);

export type Credential = {
  code: string;
  /** Absent for C-301, which the source brochure leaves untitled. */
  title?: string;
  description: string;
  /** Groups the glossary. */
  family: "Industry 4.0 Associate" | "Systems & Controls" | "Robotics";
};

export const CREDENTIALS: Credential[] = [
  {
    code: "C-101",
    title: "Certified Industry 4.0 Associate I — Basic Operations",
    family: "Industry 4.0 Associate",
    description:
      "An introductory credential that prepares individuals to succeed in modern production environments using Industry 4.0 controls, automation, and processes. Appropriate for individuals working in any occupation in advanced manufacturing.",
  },
  {
    code: "C-102",
    title: "Certified Industry 4.0 Associate II — Advanced Operations",
    family: "Industry 4.0 Associate",
    description:
      "Prepares individuals to analyze and modify modern production control systems that use Industry 4.0 automation technologies and processes. Appropriate for people in maintenance, IT, and engineering roles seeking to become versed in manufacturing facility floor controls, automation, and programming.",
  },
  {
    code: "C-103",
    title: "Certified Industry 4.0 Associate III — Robot System Operations",
    family: "Industry 4.0 Associate",
    description:
      "An introductory credential preparing individuals to operate industrial robots and other Industry 4.0 technologies in a modern production environment. Ideal for manufacturing technicians, maintenance technicians, and IT professionals.",
  },
  {
    code: "C-104",
    title: "Certified Industry 4.0 Associate IV — IIoT, Networking & Data Analytics",
    family: "Industry 4.0 Associate",
    description:
      "Prepares individuals to program and optimize Industry 4.0 automation technologies such as IIoT, smart sensors and devices, networking, and data analytics software. Ideal for maintenance technicians and IT professionals.",
  },
  {
    code: "C-201",
    title: "Electrical Systems 1",
    family: "Systems & Controls",
    description:
      "Connect, adjust, operate, troubleshoot, and analyze electrical circuits using basic components: resistors, capacitors, inductors, DC motors, solenoids, manual switches, relays, fuses, circuit breakers, transformers, and indicators. Includes electrical safety rules, reading circuit diagrams, applying Ohm's and Kirchhoff's Laws, using digital multimeters, interpreting series/parallel circuits, and assessing power and circuit protection.",
  },
  {
    code: "C-202",
    title: "Electric Motor Control Systems 1",
    family: "Systems & Controls",
    description:
      "Connect, adjust, and operate electrical motor control circuits using 3-phase AC motors, reversing magnetic motor starters with overloads, drum switches, control relays, timer relays, and pushbutton, selector, limit, pressure, and float switches. Includes motor control safety, reading ladder logic diagrams, checking ground connections, and wiring motors for high and low voltage.",
  },
  {
    code: "C-203",
    title: "Variable Frequency Drive Systems 1",
    family: "Systems & Controls",
    description:
      "Connect, configure, adjust, and operate AC variable frequency motor drives using basic volts-per-hertz mode. Includes VFD safety rules, manual keypad operation, normal and emergency shutdown, viewing and editing parameters, changing speed with a potentiometer, interfacing external discrete I/O, interpreting and resetting error codes, and configuring acceleration, deceleration, and braking.",
  },
  {
    code: "C-204",
    title: "Motor Control Troubleshooting 1",
    family: "Systems & Controls",
    description:
      "Troubleshoot and remedy faults in electric motor control circuits and AC variable frequency drives. Skills include troubleshooting safety, systems troubleshooting, component testing, and using digital multimeters, clamp-on ammeters, and PLC status indicators.",
  },
  {
    code: "C-205",
    title: "Sensor Logic Systems 1",
    family: "Systems & Controls",
    description:
      "Connect, adjust, and operate discrete (on/off) electronic sensors and relay control sequence circuits — inductive, capacitive, magnetic reed, photoelectric, and hall effect sensors, limit switches, control and timer relays, DC motors, indicators, electro-pneumatic solenoid valves, and pneumatic actuators. Includes selecting a sensor type for an application and reading ladder logic diagrams.",
  },
  {
    code: "C-206",
    title: "Electrical System Installation 1",
    family: "Systems & Controls",
    description:
      "Install and commission electrical motor control circuits using control cabinet enclosures, 3-phase AC motors, magnetic motor starters, relays, switches, indicators, solenoid valves, safety disconnects, and circuit protection. Includes proper PPE, reading wiring installation diagrams, sizing circuit protection, installing on DIN rails, testing ground systems, and routing wire with raceways and conduits.",
  },
  {
    code: "C-207",
    title: "Programmable Controller Systems 1",
    family: "Systems & Controls",
    description:
      "Program, configure, adjust, monitor, and operate industrial PLC systems. Includes PLC safety, normal and emergency startup/shutdown, operating in different modes, configuring software drivers and discrete I/O, loading and operating HMI programs, transferring programs between PC and processor, and interpreting ladder logic with contacts, coils, timers, counters, math, and comparison instructions.",
  },
  {
    code: "C-208",
    title: "Programmable Controller Troubleshooting 1",
    family: "Systems & Controls",
    description:
      "Troubleshoot and remedy faults in programmable logic controller systems, covering the PLC power supply, power distribution system, processor module, discrete input and output modules, chassis, and discrete field I/O devices, using digital multimeters, PLC software, and status indicators.",
  },
  {
    code: "C-209",
    // SACA numbers its credentials with arabic digits. The brochure styles a
    // few as roman numerals ("Pneumatic Systems I"); normalised here to SACA's
    // own form, verified 2026-07-20 — otherwise C-210 would render as
    // "Mechanical Power Systems I" directly beside "Mechanical Power Systems 2".
    title: "Pneumatic Systems 1",
    family: "Systems & Controls",
    description:
      "Connect, adjust, operate, and analyze pneumatic circuits using fittings, air compressors, filters, regulators, lubricators, gauges, rotameters, directional and flow control valves, check valves, cylinders, and motors. Includes pneumatic safety, reading circuit symbols and diagrams, the Force-Pressure-Area formula, Pascal's Law, compressor startup and shutdown, and measuring delta P.",
  },
  {
    code: "C-210",
    title: "Mechanical Power Systems 1",
    family: "Systems & Controls",
    description:
      "Install, adjust, align, tension, operate, and analyze basic mechanical power transmission drive systems: motors, shafts, flexible jaw couplings, chain drives, V-belt drives, spur gear drives, and pillow block and flange bearings. Includes mechanical drive safety, correcting for soft foot, sizing keys, aligning shafts, calculating speed and torque, and lubrication.",
  },
  {
    code: "C-212",
    title: "Ethernet Communications 1",
    family: "Systems & Controls",
    description:
      "Connect, configure, monitor, and operate basic Ethernet networks in an Industry 4.0 environment. Includes interpreting and setting IP addresses for PCs, PLCs, and robots, configuring managed switches and subnets, star topologies, static and dynamic addressing, network diagnostics, and port security.",
  },
  {
    code: "C-213",
    title: "Smart Sensor and Identification Systems 1",
    family: "Systems & Controls",
    description:
      "Connect, configure, program, monitor, and operate smart sensors (analog pressure/ultrasonic, photoelectric, stack light), barcode readers, and RFID readers. Includes connecting sensors via IO-Link Masters, downloading IODD and EDS files, configuring PLCs to receive sensor data, monitoring sensor health over the network, and programming RFID tags and barcode labels.",
  },
  {
    code: "C-255",
    title: "Hydraulic Maintenance 1",
    family: "Systems & Controls",
    description:
      "Install and maintain hydraulic systems: replacing o-rings, cartridge and threaded components, hoses, steel tubing, filters, and fittings; inspecting hydraulic fluid for water, contaminants, temperature, and lubricity; taking oil samples; using a filter cart; interpreting oil specifications; and bleeding hydraulic cylinders.",
  },
  {
    code: "C-301",
    // Title and description corrected 2026-07-20 against SACA's own registry,
    // which is the credentialing authority (saca.org; corroborated by
    // portal.saca.org certificate records and the Tech-Labs micro-credential
    // list). The brochure left C-301 untitled and printed an Ethernet
    // networking description under it — that description belongs to a
    // higher-level Ethernet credential that is NOT part of this program.
    // C-301 is the level-2 companion to C-210 Mechanical Power Systems 1,
    // which is exactly why the brochure attaches both to ISAT 1110 Mechanical
    // Systems. The placement was right all along; only the prose was wrong.
    title: "Mechanical Power Systems 2",
    family: "Systems & Controls",
    description:
      "Extends mechanical power transmission work to heavy-duty drives: grid, gear, and flange couplings, QD/taper-lock bushings, timing and HTD belts, and heavy-duty and silent chains. Covers mechanical troubleshooting safety procedures, installing and adjusting timing belt, heavy-duty shaft coupling, heavy-duty chain and heavy-duty V-belt drive systems, reverse dial indicator shaft alignment, detecting wear, and sizing components for a specific load.",
  },
  {
    code: "C-304",
    title: "Pneumatic Troubleshooting 1",
    family: "Systems & Controls",
    description:
      "Troubleshoot and remedy faults in electro-pneumatic, PLC-controlled systems, covering filters, regulators, lubricators, solenoid-operated directional control valves, flow control valves, vacuum generators, vacuum cups, vacuum switches, and quick exhaust valves.",
  },
  {
    code: "C-215",
    title: "Robot System Operations 1",
    family: "Robotics",
    description:
      "Set up, adjust, monitor, and operate industrial robot systems in an Industry 4.0 environment. Includes robot safety rules, identifying robot types, components, and end-effectors, normal and emergency startup and shutdown, work envelopes, safety inspections, using a teach pendant to jog in joint mode or Cartesian coordinates, setting travel limits, defining frames, loading and testing programs, and recovering from faults.",
  },
  {
    code: "C-216",
    title: "Robot Systems Integration 1",
    family: "Robotics",
    description:
      "Program, interface, and optimize industrial robot systems for pick and place, basic assembly, machine load/unload, and gluing applications. Includes developing robot sequences and programs, entering programs and points with a teach pendant, interfacing sensors and solenoid outputs to robot digital I/O, interfacing robot I/O to a PLC, and cycle time optimization.",
  },
  {
    code: "FANUC-1",
    title: "FANUC Certified Robot Operator — 1",
    family: "Robotics",
    description:
      "Focuses on the core robot operator skills needed by entry-level workers, indicating an operator level of skills and knowledge. Covers a basic understanding of robot operations and programming, material handling, and its components.",
  },
];

/** Lookup used to link a course's credential codes to the glossary. */
export const CREDENTIALS_BY_CODE = new Map(CREDENTIALS.map((c) => [c.code, c]));

/**
 * The SACA-issued subset of the glossary (C-xxx codes). CREDENTIALS also holds
 * one FANUC America credential (FANUC-1), which is NOT SACA's — any "N SACA
 * credentials" stat must use this list, not CREDENTIALS.length, or FANUC
 * gets double-counted against the separate FANUC card on /credentials.
 */
export const SACA_CREDENTIALS = CREDENTIALS.filter((c) => c.code.startsWith("C-"));

export const CREDENTIAL_FAMILIES: Credential["family"][] = [
  "Industry 4.0 Associate",
  "Systems & Controls",
  "Robotics",
];

/** SACA's own description of itself, condensed from the brochure's p3 sidebar. */
export const SACA_INTRO = [
  "The Smart Automation Certification Alliance (SACA) is a non-profit organization whose mission is to develop and deploy modular Industry 4.0 credentials for a wide range of industries. It is the credentialing agency for every credential listed in this program.",
  "Built with industry at the table, SACA credentials are designed to meet the needs of modern employers who demand both knowledge and hands-on ability. Whether a company is hiring for advanced manufacturing, industrial automation, or smart systems integration, SACA credentials offer a reliable signal of a candidate's workforce readiness.",
  "SACA credentials are developed in accordance with ISO 17024 standards, the global benchmark for personnel certification — so they are not just well-designed, but credible, consistent, and globally recognized.",
];
