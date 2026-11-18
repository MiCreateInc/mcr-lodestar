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
  { id:"C1", track:"A", x:215, y:92, short:"Chatbots", name:"Website and Slack chatbots",
    risk:"medium", riskText:"Medium", size:"Medium", status:"In testing", first:true, rq:"RQ3",
    what:"Answer common questions from participants, volunteers and partners: programs, onboarding and general business resources.",
    how:"Claude-based assistants on the website and in Slack. Each answer has a one-line summary, then three parts: government and state resources, trusted websites, and MiCreate's own information, followed by a disclaimer. Crisis questions go to hotlines, and case-specific legal questions go to a person.",
    eval:"Tested by entrepreneurs from the new cohort who agreed to take part, with staff reviewing answers in a test channel. A set of sample questions checks that the bot separates general information from legal advice.",
    data:"Legal information, not legal advice. Web sources are limited to a green list of verified organizations. No personal details from images or LinkedIn, and no staff or volunteer details shared.",
    repo:null },
  { id:"C2", track:"A", x:150, y:190, short:"Onboarding", name:"Onboarding automation",
    risk:"low", riskText:"Low", size:"Small", status:"In progress", first:true, rq:"RQ3",
    what:"Takes new participants from the interest form to a discovery call and weekly modules in Google Classroom.",
    how:"Forms sort each person by category (business coaching, partner, volunteer, general inquiry), with daily or weekly alerts instead of an email per submission. A fixed class code adds participants to Google Classroom.",
    eval:"Time from sign-up to first module, and how many steps staff still do by hand. The workflow is reviewed with MiCreate leadership.",
    data:"Age check on forms (13+ or parental consent). Participant data stays in MiCreate's Google Workspace.",
    repo:null },
  { id:"A1", track:"A", x:130, y:295, short:"Outreach", name:"Outreach agent",
    risk:"low", riskText:"Low", size:"Small", status:"Idea", rq:"RQ3",
    what:"Drafts volunteer and board recruitment posts, flyers and translations of outreach materials for staff to approve.",
    how:"An agent drafts posts and flyers from MiCreate's program information, translates them with an anti-trafficking glossary, and waits for staff approval before anything is posted.",
    eval:"Staff edits needed per draft, how often drafts are sent back, and translation quality (chrF, COMET) on past public materials.",
    data:"Public, non-client text only. Nothing is posted without staff approval.",
    repo:"lodestar-outreach-agent" },
  { id:"A2", track:"A", x:170, y:392, short:"Draft reports", name:"Grant and board reporting agent",
    risk:"medium", riskText:"Medium", size:"Small", status:"Idea", rq:"RQ3",
    what:"Pulls numbers from program spreadsheets and forms and drafts grant and board reports in each funder's format.",
    how:"An agent extracts fields from spreadsheets and PDFs, computes every total with code rather than the language model, fills the funder's template, and lists each number with its source cell for staff to check.",
    eval:"Field-level precision and recall on synthetic forms, share of numbers traced to a source, and time saved per report as estimated by staff.",
    data:"Runs on MiCreate's own computers. No data leaves them, and client data is never sent to outside AI services without written approval.",
    repo:"lodestar-report-agent" },
  { id:"A3", track:"A", x:255, y:470, short:"Match partners", name:"Partner match agent",
    risk:"higher", riskText:"Higher", size:"Small", status:"Idea", rq:"RQ3",
    what:"Suggests which trusted network partner fits each entrepreneur's request, so matching doesn't depend on reading every email by hand.",
    how:"An agent reads the request type, searches MiCreate's trusted partner list, and drafts a suggested match with pricing and next steps. A person confirms every match before anyone is contacted.",
    eval:"How often staff accept the suggested match, time saved per request, and zero personal details in shared summaries.",
    data:"Runs inside MiCreate's own Google Workspace. Partner and participant data never leave it, and access follows MiCreate IDs.",
    repo:"lodestar-request-router" },
  { id:"B1", track:"B", x:500, y:140, short:"Find services", name:"Multilingual resource finder",
    risk:"low", riskText:"Low", size:"Small", status:"Idea", rq:"RQ1",
    what:"Helps survivors and caseworkers find nearby shelter, legal aid and hotlines in their own language.",
    how:"Multilingual sentence embeddings index a public service directory. Queries in any supported language retrieve the closest services, with optional reranking. The tool never writes its own answers; every result links to the original listing.",
    eval:"Recall@5 and MRR on a hand-labeled query set written by partner staff in each supported language. Also p95 latency and cost per query.",
    data:"Public directory data only. Queries are not stored.",
    repo:"lodestar-resource-finder" },
  { id:"B2", track:"B", x:510, y:335, short:"Screen job ads", name:"Job-ad risk screener",
    risk:"higher", riskText:"Higher", size:"Medium", status:"Idea, needs a partner", rq:"RQ2",
    what:"Flags job ads that show common deceptive-recruitment patterns, so a trained reviewer can take a closer look. A research prototype built with a university partner.",
    how:"A text classifier that starts from a transparent baseline (TF-IDF with logistic regression) and moves to a fine-tuned multilingual transformer only if it measurably helps. Scores are calibrated and come with explanations a reviewer can read.",
    eval:"Precision and recall at a reviewer-chosen threshold, calibration error, and false-positive rates compared across languages and regions. Red-team review for evasion before any release.",
    data:"Starts only once a university or domain partner is on board. Scores support a trained reviewer and never act alone. Training data stays with the partner, and the model stays private if the release check fails.",
    repo:"lodestar-jobad-screener" }
],

/* Simulated agent runs for the agents page. kind: trigger, read, model, code, check, tool, approval, write, done */
AGENT_RUNS: [
  { id:"C1", label:"Answer a question", title:"Website and Slack chatbots",
    perms:[["Search green-listed government and trusted sites","allow"],["Read MiCreate program information","allow"],["Post answers while in testing","ask"],["Give case-specific legal advice","never"],["Share staff or volunteer details","never"]],
    steps:[
      {kind:"trigger", t:"Question in Slack", p:"A participant asks how to register an LLC in Texas (sample)."},
      {kind:"check", t:"Check the question type", p:"General business question, not case-specific legal advice. No crisis words found."},
      {kind:"tool", t:"Search green-listed sources", perm:"Allowed", p:"Texas Secretary of State and SBA pages found. Unverified sites skipped."},
      {kind:"model", t:"Draft the answer", perm:"Allowed", p:"One-line summary, then government resources, trusted websites and MiCreate's own programs, under 300 words."},
      {kind:"approval", t:"Staff review during testing", perm:"Needs approval", p:"While the chatbot is in testing, staff check answers in the test channel.", revise:"Rewrite with the staff note"},
      {kind:"write", t:"Post the answer with a disclaimer", perm:"Allowed", p:"Ends with: general information, not legal advice; please double-check sources."},
      {kind:"done", t:"Run complete", p:"Every source link is in the audit log."}
    ]},
  { id:"A3", label:"Match a partner", title:"Partner match agent",
    perms:[["Read new requests from the contact form","allow"],["Search MiCreate's trusted partner list","allow"],["Draft an introduction","allow"],["Confirm a match or send email","ask"],["Store requests outside MiCreate","never"]],
    steps:[
      {kind:"trigger", t:"New request", p:"An entrepreneur asks for help with a contract review (sample data)."},
      {kind:"model", t:"Classify the request", perm:"Allowed", p:"Type: contract review. Looking for a low-cost option."},
      {kind:"check", t:"Remove personal details from the summary", p:"Name, phone number and city removed. The summary keeps only what a partner needs."},
      {kind:"tool", t:"Search trusted network partners", perm:"Allowed", p:"2 partners in MiCreate's list offer contract review at reduced rates."},
      {kind:"approval", t:"Staff confirms the match", perm:"Needs approval", p:"The agent suggests a partner. A person makes the match.", revise:"Search again with the staff note"},
      {kind:"write", t:"Draft an introduction email", perm:"Allowed", p:"Draft placed in the staff outbox. It is not sent automatically."},
      {kind:"done", t:"Run complete", p:"The request never left MiCreate's workspace."}
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
    projects:["C1","A1","A2","A3"], status:"Task suite in design" },
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
  { m:"Month 1", d:"Dec 2026", p:"Idea shared with MiCreate. Feedback gathered. Ethics policy drafted." },
  { m:"Month 2", d:"Jan 2027", p:"Ethics policy signed off. Chatbots tested with the new cohort.", key:true },
  { m:"Month 3", d:"Feb 2027", p:"Onboarding automation live. First long-term volunteers join." },
  { m:"Month 4", d:"Mar 2027", p:"Partner match prototype. B1 pilot with a partner.", key:true },
  { m:"Month 5", d:"Apr 2027", p:"Reporting agent pilot." },
  { m:"Month 6", d:"May 2027", p:"B1 public release. First lab report and quarterly update.", key:true }
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
  "Long-term volunteers active in the lab",
  "Model and agent quality on held-out evaluations",
  "Open-source use: stars, forks and outside contributors"
],

ROLES: [
  ["Lab director","Leads the lab and approves projects. To be confirmed with MiCreate leadership.","To be confirmed"],
  ["Website volunteer","Keeps MiCreate's Webflow site up to date.","Open"],
  ["Agent engineer","Builds agent workflows, tool permissions and approval steps.","Open"],
  ["ML engineer","Builds retrieval and classification models with their evaluation harness.","Open"],
  ["Research partner","University researchers who co-design studies for RQ1 to RQ4.","Open"],
  ["Survivor advisor","Reviews tools before release. Compensated through partner organizations where possible.","Through partners"]
],

STAR_NAMES: ["vega","altair","deneb","rigel","capella","spica","mira","castor","pollux","arcturus","antares","electra","maia","alcor","mizar","izar","hadar","nunki","sabik","mimosa","acrux","ankaa","diphda","hamal","merak","dubhe","alnair","kochab","shaula","wezen","adhara","mintaka","alnitak","saiph","schedar","caph","markab","enif","sadr","albireo","zosma","algieba","denebola","alphecca","menkar","mirfak","atria"]
};
