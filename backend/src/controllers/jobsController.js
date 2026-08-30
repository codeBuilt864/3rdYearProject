import * as cheerio from "cheerio";
import { ENV } from "../lib/env.js";

const PAGE_SIZE = 20;

//  Findwork

async function fetchFindwork({ search, page }) {
  const token = ENV.FINDWORK_API_KEY;
  if (!token) return [];

  try {
    const params = new URLSearchParams({ limit: PAGE_SIZE, offset: ((page || 1) - 1) * PAGE_SIZE });
    if (search) params.set("search", search);

    const res = await fetch(`https://findwork.dev/api/jobs/?${params}`, {
      headers: { Authorization: `Token ${token}` },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      console.error("[Findwork] Status:", res.status);
      return [];
    }

    const data = await res.json();
    return (data.results || []).map(normalizeFindwork);
  } catch (err) {
    console.error("[Findwork] fetch error:", err.message);
    return [];
  }
}

function normalizeFindwork(job) {
  const desc = (job.text || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  return {
    id: `findwork_${job.id}`,
    source: "Findwork",
    title: job.role || "Untitled",
    company: job.company_name || "Unknown Company",
    companyLogo: job.company_logo || null,
    location: job.location || null,
    employmentType: job.employment_type ? capitalize(job.employment_type) : null,
    workMode: detectWorkMode((job.role || "") + " " + (job.location || "") + " " + desc),
    salary: null,
    skills: (job.keywords || []).slice(0, 8),
    description: desc,
    postedDate: job.date_posted || null,
    applyUrl: job.url || "#",
  };
}



async function fetchItProDesc(url) {
  try {
    if (!url || url === "#") return "";
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return "";
    const $ = cheerio.load(await res.text());
    return $("#job-description").text().replace(/\s+/g, " ").trim();
  } catch (_) {
    return "";
  }
}

async function fetchItPro({ search, page }) {
  try {
    const pageNum = page || 1;
    const url = search
      ? `https://itpro.lk/search/?keywords=${encodeURIComponent(search)}&p=${pageNum}`
      : `https://itpro.lk/jobs/?p=${pageNum}`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) return [];

    const html = await res.text();
    const $ = cheerio.load(html);
    const jobs = [];

    const raw = [];
    $("ul.jc-list article.job-card").each((_, el) => {
      try {
        const $el = $(el);
        const applyUrl = $el.find("a.jcl").attr("href") || "#";
        const title = $el.find("h2.jc-title").text().trim();
        const company = $el.find("span.jc-company").text().trim() || "Unknown Company";
        const logo = $el.find(".jc-company-logo img").attr("src") || null;
        const dateText = $el.find("time.time-posted").attr("datetime") || null;
        if (!title || title.length < 3) return;
        raw.push({ title, company, location: null, applyUrl, logo, dateText, typeText: null });
      } catch (_) {}
    });

    // Fetch descriptions in parallel with concurrency limit of 5
    const CONCURRENCY = 5;
    for (let i = 0; i < raw.length; i += CONCURRENCY) {
      const batch = raw.slice(i, i + CONCURRENCY);
      const descs = await Promise.all(batch.map(j => fetchItProDesc(j.applyUrl)));
      batch.forEach((j, idx) => jobs.push(normalizeItPro({ ...j, desc: descs[idx] })));
    }

    return jobs;
  } catch (err) {
    console.error("[ITPro.lk] scrape error:", err.message);
    return [];
  }
}

function normalizeItPro({ title, company, location, applyUrl, logo, dateText, typeText, desc }) {
  return {
    id: `itpro_${slugify(title)}_${slugify(company)}`,
    source: "ITPro.lk",
    title,
    company,
    companyLogo: logo || null,
    location: location || "Sri Lanka",
    employmentType: typeText ? capitalize(typeText) : null,
    workMode: detectWorkMode(title + " " + (location || "") + " " + desc),
    salary: null,
    skills: extractSkills(title + " " + desc),
    description: desc,
    postedDate: dateText || null,
    applyUrl,
  };
}

//  Helpers

const SKILL_KEYWORDS = [
  "JavaScript","TypeScript","React","Vue","Angular","Node.js","Express","Python",
  "Django","Flask","Java","Spring","Kotlin","Swift","PHP","Laravel","Ruby","Rails",
  "Go","Rust","C#",".NET","C++","C","SQL","MySQL","PostgreSQL","MongoDB","Redis",
  "Docker","Kubernetes","AWS","Azure","GCP","Terraform","Ansible","Jenkins","CI/CD",
  "Git","Linux","REST","GraphQL","gRPC","Microservices","DevOps","Agile","Scrum",
  "HTML","CSS","Tailwind","SASS","Next.js","Nuxt","Svelte","Flutter","React Native",
  "Elasticsearch","Kafka","RabbitMQ","Firebase","Supabase","Prisma","Drizzle",
  "Machine Learning","AI","TensorFlow","PyTorch","Data Science","Pandas","NumPy",
];

function extractSkills(text) {
  if (!text) return [];
  const lower = text.toLowerCase();
  return SKILL_KEYWORDS.filter((s) => lower.includes(s.toLowerCase())).slice(0, 8);
}

function detectWorkMode(text) {
  if (!text) return null;
  const lower = text.toLowerCase();
  if (lower.includes("remote")) return "Remote";
  if (lower.includes("hybrid")) return "Hybrid";
  if (lower.includes("on-site") || lower.includes("onsite") || lower.includes("office")) return "On-site";
  return null;
}

function capitalize(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, "-");
}

function slugify(str) {
  return (str || "").toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 30);
}

function applyClientFilters(jobs, { workMode, jobType, company, titleFilter }) {
  return jobs.filter((job) => {
    if (workMode && job.workMode?.toLowerCase() !== workMode.toLowerCase()) return false;
    if (jobType && job.employmentType?.toLowerCase() !== jobType.toLowerCase()) return false;
    if (company && !job.company.toLowerCase().includes(company.toLowerCase())) return false;
    if (titleFilter && !job.title.toLowerCase().includes(titleFilter.toLowerCase())) return false;
    return true;
  });
}

//Controller 

export async function getJobs(req, res) {
  try {
    const {
      search = "",
      workMode = "",
      jobType = "",
      company = "",
      titleFilter = "",
      sort = "recent",
      page = "1",
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);

    const [findworkResult, itproResult] = await Promise.allSettled([
      fetchFindwork({ search, page: pageNum }),
      fetchItPro({ search, page: pageNum }),
    ]);

    const findwork = findworkResult.status === "fulfilled" ? findworkResult.value : [];
    const itpro = itproResult.status === "fulfilled" ? itproResult.value : [];

    console.log(`[Jobs] Findwork: ${findwork.length} | ITPro: ${itpro.length}`);

    let combined = applyClientFilters([...findwork, ...itpro], { workMode, jobType, company, titleFilter });

    if (sort === "recent") {
      combined.sort((a, b) => {
        const da = a.postedDate ? new Date(a.postedDate) : new Date(0);
        const db = b.postedDate ? new Date(b.postedDate) : new Date(0);
        return db - da;
      });
    }

    const seen = new Set();
    combined = combined.filter((job) => {
      const key = `${job.title.toLowerCase()}|${job.company.toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const companies = [...new Set(combined.map((j) => j.company).filter(Boolean))].sort();

    res.json({ jobs: combined, total: combined.length, page: pageNum, companies });
  } catch (err) {
    console.error("[Jobs] controller error:", err.message);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
}
