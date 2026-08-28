import { API_BASE_URL } from "./apiConfig";
export interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  clientName: string;
  industry: string;
  challenge: string;
  solution: string;
  results: string;
  coverImageUrl: string;
}

export const CASE_STUDIES_API_URL = `${API_BASE_URL}/case-studies`;

// Client names carrying this suffix are illustrative by editorial
// convention (see the existing splitClientName logic in the list and
// detail views).
const ILLUSTRATIVE_SUFFIX = " (Illustrative Example)";

// Slugs of case studies that are illustrative / composite examples, not
// verified real client engagements. The current set uses invented
// client names (and one, multi-bank-settlement-api-modernization, names
// two different companies in its own body), and the site's own
// homepage notes that real, permission-cleared public case studies are
// still in progress. Until a study is confirmed real and cleared for
// publication, list its slug here so the page and card label it
// "Illustrative Case Study". Remove a slug only when the engagement is
// genuinely real and the client has approved the write-up.
export const ILLUSTRATIVE_CASE_STUDY_SLUGS = new Set<string>([
  "multi-bank-settlement-api-modernization",
  "patient-records-modernization-healthcare-platform",
  "scaling-saas-platform-enterprise-workloads",
  "scalable-digital-platform-for-technology-agency",
]);

export function isIllustrativeCaseStudy(study: {
  slug: string;
  clientName: string;
}): boolean {
  return (
    study.clientName.endsWith(ILLUSTRATIVE_SUFFIX) ||
    ILLUSTRATIVE_CASE_STUDY_SLUGS.has(study.slug)
  );
}

/** Strips the illustrative suffix and trailing punctuation/whitespace
 *  that the CMS free-text fields sometimes carry. */
export function cleanCaseStudyText(value: string): string {
  return value.replace(ILLUSTRATIVE_SUFFIX, "").replace(/[.\s]+$/, "").trim();
}

export async function fetchCaseStudies(): Promise<CaseStudy[]> {
  const res = await fetch(CASE_STUDIES_API_URL, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch case studies: ${res.status}`);
  }
  return res.json();
}

export async function fetchCaseStudyBySlug(
  slug: string
): Promise<CaseStudy | null> {
  const res = await fetch(`${CASE_STUDIES_API_URL}/${slug}`, {
    cache: "no-store",
  });
  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error(`Failed to fetch case study: ${res.status}`);
  }
  return res.json();
}
