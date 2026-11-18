/* Lodestar Lab site content. Edit this file to update projects, research, roadmap and more.
   Every page reads from here, so a change shows up everywhere at once. */
window.LAB = {

CONFIG: {
  org: "MiCreateInc",                       // GitHub organization
  homeRepo: "mcr-lodestar",                 // the lab's home repo (this website)
  micreate: "https://www.micreate.org/"
},

TRACKS: {
  A: { name: "AI agent automation", short: "AI agents", page: "agents.html" },
  B: { name: "ML research for trafficking prevention", short: "ML research", page: "research.html" }
},

/* x/y place each project on the home page star map (680 x 520). */
PROJECTS: [
  { id:"B1", track:"B", x:490, y:140, short:"Find services", name:"Multilingual resource finder",
    risk:"low", riskText:"Low", size:"Small", status:"First build", first:true, rq:"RQ1",
    what:"Helps survivors and caseworkers find nearby shelter, legal aid and hotlines in their own language.",
    how:"Multilingual sentence embeddings index a public service directory. Queries in any supported language retrieve the closest services, with optional reranking. The tool never writes its own answers; every result links to the original listing.",
    eval:"Recall@5 and MRR on a hand-labeled query set written by partner staff in each supported language. Also p95 latency and cost per query.",
    data:"Public directory data only. Queries are not stored.",
    repo:"lodestar-resource-finder" },
  { id:"A1", track:"A", x:195, y:140, short:"Translate", name:"Translation and outreach agent",
    risk:"low", riskText:"Low", size:"Small", status:"Second build", rq:"RQ3",
    what:"Translates flyers, newsletters and public materials into the languages partners need, keeps the layout, and hands staff a draft to approve.",
    how:"An agent reads the source file, translates with an anti-trafficking glossary, back-translates to check meaning, flags uncertain phrases, then waits for staff approval before saving final files.",
    eval:"chrF and COMET on a fixed set of past public materials, glossary-term accuracy, staff edits needed per document, and how often staff send a draft back.",
    data:"Public, non-client text only. Nothing is published without staff approval.",
    repo:"lodestar-outreach-agent" },
  { id:"A2", track:"A", x:175, y:300, short:"Draft reports", name:"Grant and board reporting agent",
    risk:"medium", riskText:"Medium", size:"Small", status:"Planned", rq:"RQ3",
    what:"Pulls numbers from program spreadsheets and forms and drafts grant and board reports in each funder's format.",
    how:"An agent extracts fields from spreadsheets and PDFs, computes every total with code rather than the language model, fills the funder's template, and lists each number with its source cell for staff to check.",
    eval:"Field-level precision and recall on synthetic forms, share of numbers traced to a source, and time saved per report as estimated by staff.",
    data:"Runs on the partner's own computer. No data leaves it, and client data is never sent to outside AI services without written approval.",
    repo:"lodestar-report-agent" },
  { id:"A3", track:"A", x:215, y:420, short:"Route requests", name:"Help request routing agent",
    risk:"higher", riskText:"Higher", size:"Small", status:"Exploring", rq:"RQ3",
    what:"Sorts incoming requests for help with copyright, contracts, business formation or mentorship, and suggests which volunteer in the MiCreate network could take each one.",
    how:"An agent classifies the request type and urgency, writes a short summary with personal details removed, and suggests a volunteer match. A staff member makes every assignment.",
    eval:"Routing accuracy on synthetic requests, rate of personal details leaking into summaries (target: zero), and how often staff override the suggestion.",
    data:"Starts only with MiCreate's agreement. Runs inside MiCreate's own systems, and survivors' stories are never stored by the lab.",
    repo:"lodestar-request-router" },
  { id:"B2", track:"B", x:500, y:335, short:"Screen job ads", name:"Job-ad risk screener",
    risk:"higher", riskText:"Higher", size:"Medium", status:"Needs a partner", rq:"RQ2",
    what:"Flags job ads that show common deceptive-recruitment patterns, so a trained reviewer can take a closer look. A research prototype built with a university partner.",
    how:"A text classifier that starts from a transparent baseline (TF-IDF with logistic regression) and moves to a fine-tuned multilingual transformer only if it measurably helps. Scores are calibrated and come with explanations a reviewer can read.",
    eval:"Precision and recall at a reviewer-chosen threshold, calibration error, and false-positive rates compared across languages and regions. Red-team review for evasion before any release.",
    data:"Starts only once a university or domain partner is on board. Scores support a trained reviewer and never act alone. Training data stays with the partner, and the model stays private if the release check fails.",
    repo:"lodestar-jobad-screener" }
],

/* Simulated agent runs for the agents page. kind: trigger, read, model, code, check, tool, approval, write, done */
AGENT_RUNS: [
  { id:"A1", label:"Translate a flyer", title:"Translation and outreach agent",
    perms:[["Read files in the outreach folder","allow"],["Translate public text with the glossary","allow"],["Save drafts","allow"],["Publish or send anything","ask"],["Open client records","never"]],
    steps:[
      {kind:"trigger", t:"Request received", p:"Staff uploaded know-your-rights-flyer.docx and asked for Spanish and Vietnamese."},
      {kind:"read", t:"Read the flyer", perm:"Allowed", p:"214 words, 3 headings. One phone number and the organization name are marked to stay unchanged."},
      {kind:"model", t:"Translate with the glossary", perm:"Allowed", p:"Two drafts written. 12 glossary terms matched, including legal aid and labor rights."},
      {kind:"check", t:"Back-translate and compare meaning", p:"2 phrases flagged for a person to check: the headline in Vietnamese and \"free legal help\" in Spanish."},
      {kind:"approval", t:"Waiting for staff approval", perm:"Needs approval", p:"Review the drafts and the 2 flagged phrases.", revise:"Revise flagged phrases with the staff note"},
      {kind:"write", t:"Save final files", perm:"Allowed", p:"Saved flyer-es.docx and flyer-vi.docx to the outreach folder."},
      {kind:"done", t:"Run complete", p:"Every step, tool call and approval is in the audit log."}
    ]},
  { id:"A2", label:"Draft a board report", title:"Grant and board reporting agent",
    perms:[["Read the program tracker on this computer","allow"],["Run calculations in code","allow"],["Draft text with the model","allow"],["Save the report on this computer","allow"],["Upload anything to the internet","never"]],
    steps:[
      {kind:"trigger", t:"Scheduled run", p:"The monthly board report is due Friday."},
      {kind:"read", t:"Open the program tracker", perm:"Allowed", p:"program-tracker.xlsx: 3 sheets, 148 rows. The file stays on this computer."},
      {kind:"code", t:"Compute totals in code", perm:"Allowed", p:"Workshops held, people served and volunteer hours, calculated in code so the numbers are exact."},
      {kind:"model", t:"Draft report sections", perm:"Allowed", p:"Summary, highlights and next steps written in the board template."},
      {kind:"check", t:"Trace every number to its source", p:"14 of 14 numbers link back to a cell in the tracker."},
      {kind:"approval", t:"Waiting for the program manager", perm:"Needs approval", p:"Check the draft and the source of each number.", revise:"Rewrite the sections named in the note"},
      {kind:"write", t:"Save the report", perm:"Allowed", p:"Saved board-report-january.docx on this computer. Nothing left it."},
      {kind:"done", t:"Run complete", p:"Every number and its source cell is in the audit log."}
    ]},
  { id:"A3", label:"Route a help request", title:"Help request routing agent",
    perms:[["Read new requests from the contact form","allow"],["Search the volunteer directory","allow"],["Draft an introduction","allow"],["Assign a volunteer or send email","ask"],["Store the request outside MiCreate","never"]],
    steps:[
      {kind:"trigger", t:"New request", p:"A request arrived through the contact form (sample data)."},
      {kind:"model", t:"Classify the request", perm:"Allowed", p:"Type: contract review. Urgency: normal."},
      {kind:"check", t:"Remove personal details from the summary", p:"Name, phone number and city removed. The summary keeps only what a volunteer needs."},
      {kind:"tool", t:"Search the volunteer directory", perm:"Allowed", p:"3 volunteers with contract experience have time this month."},
      {kind:"approval", t:"Staff chooses the volunteer", perm:"Needs approval", p:"The agent suggests a match. A person makes the assignment.", revise:"Search again with the staff note"},
      {kind:"write", t:"Draft an introduction email", perm:"Allowed", p:"Draft placed in the staff outbox. It is not sent automatically."},
      {kind:"done", t:"Run complete", p:"The request text was never stored outside MiCreate. Every step is in the audit log."}
    ]}
],

RESEARCH_QUESTIONS: [
  { id:"RQ1", q:"How well do multilingual embedding models connect people to services in languages with little training data?",
    why:"Survivors often search in their first language. A finder that works well in English but poorly in Tagalog or Amharic fails the people who need it most.",
    method:"Labeled query sets written by partner staff; recall@k and MRR reported per language; error analysis of missed services.",
    projects:["B1"], status:"Data collection planned" },
  { id:"RQ2", q:"Can a job-ad screener catch deceptive recruitment without over-flagging ads in some languages or regions?",
    why:"A screener that wrongly flags ads from certain communities would harm the people it is meant to protect.",
    method:"Calibrated classifiers, per-group false-positive rates, threshold selection with reviewers, red-team testing for evasion.",
    projects:["B2"], status:"Seeking a university partner" },
  { id:"RQ3", q:"How reliably do AI agents complete real nonprofit workflows, and where must a person step in?",
    why:"Agents save time only if staff can trust them. We want to know which steps are safe to automate and which always need review.",
    method:"An open task suite of nonprofit workflows; success rate, staff edits per output, rejection rate at approval steps, cost and time per run.",
    projects:["A1","A2","A3"], status:"Task suite in design" },
  { id:"RQ4", q:"How far can synthetic data stand in for sensitive case data when testing tools?",
    why:"Real case data must stay with partners. If synthetic data gives similar test results, tools can be built safely without ever seeing it.",
    method:"Partners run the same evaluation on their own data locally and share only the scores, which we compare with results on synthetic data.",
    projects:["A2","A3"], status:"Planned" }
],

DATASETS: [
  { name:"lodestar-service-queries", what:"Multilingual search queries, each labeled with the services that answer it. The benchmark for RQ1.",
    project:"B1", license:"CC BY 4.0", target:"1,000 queries in 6 languages", status:"Planned",
    sample:{query_id:"q-0142",language:"es",query:"Necesito un lugar seguro para dormir esta noche",relevant_services:["svc-shelter-031","svc-hotline-002"],written_by:"partner staff"} },
  { name:"lodestar-agent-tasks", what:"A suite of nonprofit workflows with inputs and success criteria, for testing agents. The benchmark for RQ3.",
    project:"A1, A2, A3", license:"CC BY 4.0", target:"100 tasks across 3 workflows", status:"In design",
    sample:{task_id:"t-017",workflow:"translate_flyer",input:"flyers/know-your-rights.docx",targets:["es","vi"],must_keep:["phone numbers","organization names"],success:"glossary terms correct; staff approves with 2 edits or fewer"} },
  { name:"lodestar-synthetic-forms", what:"Synthetic program forms and spreadsheets with labeled fields. No real person appears in them.",
    project:"A2", license:"CC0", target:"500 forms", status:"Planned",
    sample:{form_id:"f-0091",type:"workshop_summary",synthetic:true,fields:{workshop_date:"2027-01-14",attendees:12,volunteer_hours:9.5,topic:"copyright basics"}} },
  { name:"Job-ad data (not released)", closed:true, what:"Data for the job-ad screener stays with the university partner. Releasing it could teach recruiters what gets flagged, so we publish only aggregate results and the evaluation code.",
    project:"B2", license:"Not released", target:"Held by partner", status:"Needs a partner" }
],

PUBLICATIONS: [
  { t:"Research agenda", d:"The four questions on this page, with methods and how partners can join.", status:"This page" },
  { t:"Data and ethics policy", d:"The one-page policy every project follows. Published once MiCreate signs it off.", status:"Drafting" },
  { t:"Resource finder evaluation report", d:"Retrieval results per language, with the model card for B1.", status:"After the B1 pilot" },
  { t:"Agent task suite v0.1", d:"The first release of lodestar-agent-tasks, with baseline results.", status:"Planned" }
],

STEPS: [
  { t:"Define with partners", d:"Frontline staff and survivor advisors help define the problem, who the tool serves, and what a wrong answer would cost.", li:["Written problem statement and success criteria","Agreed list of things the tool must never do","Survivor advisors compensated through partners where possible"], chips:["Partner interviews","Problem brief"] },
  { t:"Collect data", d:"Public or synthetic data by default. Real case data stays with the partner organization and is never stored by the lab.", li:["Versioned datasets with a datasheet","No scraping of individuals","Personal data only when strictly needed"], chips:["DVC","Datasheets for datasets"] },
  { t:"Start with a baseline", d:"The simplest approach that could work comes first, so every later improvement is measured against something real.", li:["Test set frozen before any modeling","Baseline results recorded in the repository"], chips:["scikit-learn","BM25","Rule-based agent"] },
  { t:"Build and iterate", d:"Models and agents are built with tracked, reproducible experiments, so anyone can pick up the work.", li:["Pinned dependencies and fixed seeds","Every run logged with data, prompt and code versions","Code review on every change"], chips:["PyTorch","Hugging Face","MLflow"] },
  { t:"Evaluate", d:"Results on held-out data, broken down by language and group to catch uneven errors before they reach anyone.", li:["Per-group error rates, not just one average","Model cards and agent cards with known failure modes","Evaluation runs automatically in CI"], chips:["GitHub Actions","Model cards"] },
  { t:"Release check", gate:true, d:"Could traffickers use it to evade detection? Could it wrongly target migrants, sex workers or other groups? If yes, we redesign it or keep it private.", li:["Misuse review by the lab and a partner","Sign-off against the data and ethics policy"], chips:["See the release check below"] },
  { t:"Deploy", d:"Low-cost serving that fits nonprofit budgets, on donated cloud credits or the partner's own computer.", li:["Latency and cost budgets set before launch","No secrets in repositories","Clear contact for reporting problems"], chips:["Serverless","Local install","Azure and AWS credits"] },
  { t:"Monitor", d:"Watch for drift and partner-reported errors, and report what we learned every quarter.", li:["Input drift checks","Agent audit logs reviewed monthly","Quarterly one-page update to MiCreate"], chips:["Quarterly report"] }
],

QUESTIONS: [
  { q:"Does it use only public or synthetic data, with any real case data staying with the partner?", want:true, fix:"Move to public or synthetic data, or keep processing on the partner's computers." },
  { q:"Could traffickers use it to evade detection?", want:false, fix:"Redesign to remove the evasion path, or keep the tool private." },
  { q:"Could it wrongly target migrants, sex workers or other groups?", want:false, fix:"Check per-group error rates and redesign before release." },
  { q:"Does a trained person make every final decision, and approve anything an agent sends or publishes?", want:true, fix:"Add an approval step so the tool supports a person instead of acting alone." },
  { q:"Have frontline staff or survivor advisors reviewed it?", want:true, fix:"Get review from frontline staff or survivor advisors." },
  { q:"Is there a held-out evaluation, published in a model or agent card?", want:true, fix:"Freeze a test set, measure, and publish a card." }
],

ROAD: [
  { m:"Month 1", d:"Dec 2026", p:"Lab approved. GitHub space created. Ethics policy and research agenda drafted." },
  { m:"Month 2", d:"Jan 2027", p:"Policy signed off. B1 query set collected. Agent task suite designed.", key:true },
  { m:"Month 3", d:"Feb 2027", p:"B1 baseline and evaluation in CI. A1 agent prototype with an approval step." },
  { m:"Month 4", d:"Mar 2027", p:"B1 pilot with a partner. A1 tested on the task suite.", key:true },
  { m:"Month 5", d:"Apr 2027", p:"A1 pilot with MiCreate staff. University partner talks for B2." },
  { m:"Month 6", d:"May 2027", p:"B1 public release with a model card. First lab report and quarterly update.", key:true }
],

PRINCIPLES: [
  ["Survivor-centered","Tools are shaped with input from frontline staff and survivor advisors, not built around them."],
  ["Do no harm","Every project passes a misuse check before it is released."],
  ["People decide","Agents suggest and draft. A person approves anything that is sent, published or assigned."],
  ["Privacy first","No personal data unless strictly needed, and no scraping of individuals."],
  ["Measured","Nothing ships without a held-out evaluation anyone can rerun."],
  ["Open source","Code, evaluations and safe datasets are public by default."],
  ["Small and finished","We ship small tools that work rather than start large ones we cannot maintain."]
],

METRICS: [
  "Partner organizations testing or using a tool",
  "People served, as reported by partners and never collected by us",
  "Staff hours saved by agents, as estimated by partners",
  "Model and agent quality on held-out evaluations",
  "Open-source use: stars, forks and outside contributors"
],

ROLES: [
  ["Founding lead","Sets direction, writes code, coordinates volunteers.","Filled"],
  ["Agent engineer","Builds agent workflows, tool permissions and approval steps.","Open"],
  ["ML engineer","Builds retrieval and classification models with their evaluation harness.","Open"],
  ["Research partner","University researchers who co-design studies for RQ1 to RQ4.","Open"],
  ["Survivor advisor","Reviews tools before release. Compensated through partner organizations where possible.","Through partners"]
],

STAR_NAMES: ["vega","altair","deneb","rigel","capella","spica","mira","castor","pollux","arcturus","antares","electra","maia","alcor","mizar","izar","hadar","nunki","sabik","mimosa","acrux","ankaa","diphda","hamal","merak","dubhe","alnair","kochab","shaula","wezen","adhara","mintaka","alnitak","saiph","schedar","caph","markab","enif","sadr","albireo","zosma","algieba","denebola","alphecca","menkar","mirfak","atria"]
};
