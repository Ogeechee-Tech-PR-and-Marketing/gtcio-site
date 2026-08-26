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
 * certification facts, not marketing copy (PROJECT.md §4).
 */

/**
 * Verified against saca.org's own Associate and Specialist Certifications
 * pages. SACA runs three categories (Associate, Specialist, Professional) —
 * the diploma's credentials sit in the first two, so the Professional tier
 * is deliberately not shown.
 *
 * ⚠️ SACA does not rank the categories hierarchically — it calls them
 * stackable, with no official order. The "Tier 1"/"Tier 2" numbering on the
 * page is this site's own presentation choice (array order below), not an
 * SACA number.
 *
 * ⚠️ Deliberately does NOT name which Specialist certification a graduate
 * completes. Mapping the program's credentials against SACA's published core
 * requirements suggests **Electrical Systems Specialist** is fully covered
 * (C-101, C-201, C-202, C-204, C-206 — all in the program) and several other
 * tracks sit one credential short, usually C-211. But that mapping comes
 * from a third-party mirror, SACA grants a Specialist only once the *exams*
 * are passed, and GTCIO has never claimed it. Telling a student they'll
 * graduate a Specialist would be an over-claim — see PROJECT.md §9.
 */
export type CredentialTier = {
  name: string;
  codes: string;
  detail: string;
  /** True for the tiers this diploma actually covers. */
  inProgram: boolean;
  /** SACA's own page for this tier. */
  url: string;
};

export const SACA_TIERS: CredentialTier[] = [
  {
    name: "Specialist",
    codes: "C-2xx and C-3xx micro-credentials",
    inProgram: true,
    detail:
      "Each Specialist credential is modular — a set of core micro-credentials that apply everywhere, plus electives matched to a region or employer. Earn the core set and SACA grants the Specialist credential. The diploma's C-2xx and C-3xx credentials are these building blocks, and they stack toward several Specialist tracks including electrical, control, mechanical, and robotics systems.",
    url: "https://www.saca.org/smart-automation-certifications/specialist-certifications/",
  },
  {
    name: "Associate",
    codes: "C-101 – C-104",
    inProgram: true,
    detail:
      "The entry tier, written for people operating and supporting Industry 4.0 equipment. The diploma builds in all four: basic operations, advanced operations, robot system operations, and IIoT/networking/data analytics.",
    url: "https://www.saca.org/smart-automation-certifications/associate-certifications/",
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
 * brochure, except the Rockwell Automation entry below.
 *
 * ⚠️ These are **equipment vendors and certification bodies OTC is
 * accredited BY** — not employers who hire graduates, and not GTCIO
 * partners. Deliberately kept off the Partners page; don't conflate them.
 *
 * One array feeds BOTH the Credentials page and the IOT Training Programs
 * page, so a fact is never maintained twice. Each item's `showOn` scopes it:
 * the diploma only builds in FANUC and SACA credentials, so Mitsubishi
 * Electric and Rockwell — employer-training-only — are marked `"employer"`
 * and filtered off /credentials, where they'd overstate what a student
 * leaves with.
 *
 * ⚠️ Amatrol is deliberately absent as an *affiliation card* but still
 * appears in the Training page's `SERVICES` (e.g. "Amatrol's e-learning
 * curriculum") — that's a delivery-method fact, not an accreditation claim.
 * Don't "fix" the apparent inconsistency in either direction.
 *
 * ⚠️ The Rockwell entry ("Academy of Advanced Manufacturing") is published
 * on the site owner's direct confirmation. The source brochure's wording
 * ("Advanced Manufacturing Academy Training Center") reverses Rockwell's
 * actual program name, and no public source confirms GTCIO as an AAM
 * partner site — if this ever needs re-verifying, that's why the brochure
 * doesn't quite match.
 */
export type Affiliation = {
  _key?: string;
  title: string;
  detail: string;
  showOn?: "both" | "employer" | "student";
};

export const AFFILIATIONS: Affiliation[] = [
  {
    title: "FANUC",
    detail: "The only authorized FANUC satellite training site in the state of Georgia.",
    showOn: "both",
  },
  {
    title: "SACA Gold",
    detail:
      "A Smart Automation Certification Alliance Gold Certification Site, and a SACA Regional Instructor Training Center — the first in the United States.",
    showOn: "both",
  },
  {
    title: "Mitsubishi Electric",
    detail: "A Mitsubishi Electric Automation Training Provider.",
    showOn: "employer",
  },
  {
    title: "Rockwell Automation",
    detail: "An Academy of Advanced Manufacturing (AAM) training site.",
    showOn: "employer",
  },
];

/** Cards whose `showOn` allows the given page. Missing `showOn` defaults to "both". */
export function affiliationsFor(
  affiliations: Affiliation[],
  page: "student" | "employer"
): Affiliation[] {
  return affiliations.filter((a) => !a.showOn || a.showOn === "both" || a.showOn === page);
}
