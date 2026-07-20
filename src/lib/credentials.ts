/**
 * Credential reference data for /credentials.
 *
 * The per-credential glossary itself lives in `iot-curriculum.ts` (it comes off
 * the same accredited brochure as the course table). This file holds the two
 * things that are *about* credentials rather than a list of them:
 *
 *  1. SACA's three-tier structure, so a student can see what 22 codes add up to.
 *  2. The accreditations Ogeechee Tech itself holds — i.e. why a credential
 *     earned here is worth anything.
 *
 * Same code-not-CMS reasoning as `iot-curriculum.ts`: these are third-party
 * certification facts, not marketing copy. The framing around them is CMS-
 * editable via the `credentialsPage` singleton.
 */

/**
 * Researched 2026-07-20 against saca.org and the Tech-Labs / TechEd Products
 * micro-credential listings. SACA runs three tiers, and the diploma's
 * credentials sit in the first two.
 *
 * ⚠️ Deliberately does NOT name which Specialist certification a graduate
 * completes. Mapping the program's 22 credentials against SACA's published
 * core requirements suggests **Electrical Systems Specialist** is fully covered
 * (C-101, C-201, C-202, C-204, C-206 — all in the program) and that several
 * others sit one credential short, usually C-211. But that mapping comes from a
 * third-party mirror, SACA grants a Specialist only once the *exams* are
 * passed, and GTCIO has never claimed it. Telling a student they'll graduate a
 * Specialist would be an over-claim. See PROJECT.md §8 — worth GTCIO confirming,
 * because if it holds it is a real selling point.
 */
export type CredentialTier = {
  name: string;
  codes: string;
  detail: string;
  /** True for the tiers this diploma actually covers. */
  inProgram: boolean;
};

export const SACA_TIERS: CredentialTier[] = [
  {
    name: "Associate",
    codes: "C-101 – C-104",
    inProgram: true,
    detail:
      "The entry tier, written for people operating and supporting Industry 4.0 equipment. The diploma builds in all four: basic operations, advanced operations, robot system operations, and IIoT/networking/data analytics.",
  },
  {
    name: "Specialist",
    codes: "C-2xx and C-3xx micro-credentials",
    inProgram: true,
    detail:
      "Each Specialist certification is modular — a set of core micro-credentials that apply everywhere, plus electives matched to a region or employer. Earn the core set and SACA grants the Specialist certification. The diploma's C-2xx and C-3xx credentials are these building blocks, and they stack toward several Specialist tracks including electrical, control, mechanical, and robotics systems.",
  },
  {
    name: "Professional",
    codes: "Engineering level",
    inProgram: false,
    detail:
      "An engineering certification covering the analysis, design, and optimization of Industry 4.0 systems. Beyond this diploma, but it is the same ladder — the credentials earned here are the first rungs of it.",
  },
];

/** Non-SACA credentials the diploma also carries. */
export const OTHER_CREDENTIALS = [
  {
    name: "FANUC Certified Robot Operator – 1",
    issuer: "FANUC America",
    detail:
      "Earned in Industrial Robotics II. Covers the core robot operator skills an entry-level worker needs: robot operations and programming, material handling, and its components. FANUC is the robotics platform the labs are built on.",
  },
  {
    name: "OSHA 10 – General Industry",
    issuer: "U.S. Department of Labor",
    detail:
      "Earned alongside Operations Technology I. The standard 10-hour general industry safety card, recognised on any industrial site in the country and asked for by most employers before you set foot on a floor.",
  },
];

/**
 * Ogeechee Tech's own accreditations — the reason a credential earned here
 * carries weight. Sourced from OTC's "Industrial Systems Training Program"
 * brochure (see PROJECT.md §10).
 *
 * ⚠️ These five are **equipment vendors and certification bodies OTC is
 * accredited BY** — not employers who hire graduates, and not GTCIO partners.
 * Deliberately kept off the Partners page (PROJECT.md §10); don't conflate them.
 *
 * This is the fallback for BOTH the Credentials page and the IOT Training
 * Programs page. The live copy is CMS-editable in one place only —
 * IOT Training Programs Page → "Credentials & affiliations" — and both pages
 * read it, so an editor never has to update the same fact twice.
 */
export const AFFILIATIONS = [
  {
    title: "FANUC",
    detail: "The only authorized FANUC satellite training site in the state of Georgia.",
  },
  {
    title: "SACA Gold",
    detail:
      "A Smart Automation Certification Alliance Gold Certification Site, and a SACA Regional Instructor Training Center — the first in Georgia.",
  },
  {
    title: "Amatrol",
    detail:
      "An Amatrol Certified Instructor Training Site, hosting Amatrol Technical Training Institute (ATTI) courses.",
  },
  {
    title: "Mitsubishi Electric",
    detail: "A Mitsubishi Electric Automation Training Provider.",
  },
  {
    title: "Advanced Manufacturing Academy",
    detail: "An Advanced Manufacturing Academy Training Center.",
  },
];
