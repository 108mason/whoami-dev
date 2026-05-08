// ========================================
// Portfolio 2 — Terminal Interactions
// ========================================

(function () {
  "use strict";

  const terminal = document.getElementById("terminal");
  const navLinks = document.querySelectorAll(".nav-cmd");
  const blocks = document.querySelectorAll(".block");

  // --- Typing animation for command text ---
  function typeText(el) {
    if (el.dataset.typed) return;
    el.dataset.typed = "true";

    const text = el.dataset.text;
    el.textContent = "";
    el.style.width = "auto";
    el.classList.add("animate");

    let i = 0;
    const interval = setInterval(() => {
      el.textContent += text[i];
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        el.classList.remove("animate");
        el.classList.add("done");
      }
    }, 40);
  }

  // --- Scroll-triggered reveal with IntersectionObserver ---
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");

          // Trigger typing for the command in this block
          const typed = entry.target.querySelector(".typed");
          if (typed) typeText(typed);
        }
      });
    },
    {
      root: terminal,
      threshold: 0.05,
    }
  );

  blocks.forEach((block) => revealObserver.observe(block));

  // --- Active nav tracking on scroll ---
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle("active", link.dataset.section === id);
          });
        }
      });
    },
    {
      root: terminal,
      threshold: 0.3,
    }
  );

  blocks.forEach((block) => navObserver.observe(block));

  // --- Nav click: smooth scroll ---
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.getElementById(link.dataset.section);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        // Force reveal immediately on nav click — needed for tall sections on mobile
        target.classList.add("visible");
        const typed = target.querySelector(".typed");
        if (typed) typeText(typed);
      }
    });
  });

  // --- Keyboard shortcut: 1-6 to jump to sections ---
  const sectionIds = ["hero", "about", "skills", "experience", "projects", "contact"];

  document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    const idx = parseInt(e.key) - 1;
    if (idx >= 0 && idx < sectionIds.length) {
      const target = document.getElementById(sectionIds[idx]);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        e.preventDefault();
      }
    }
  });
})();

// ========================================
// Chat Widget — Local Knowledge Base
// ========================================

const KB = [
  {
    match: /\b(hi|hello|hey|howdy|sup|yo)\b/i,
    replies: [
      "Hey! I'm Daniel's portfolio bot. Ask me about his projects, skills, experience, or how to get in touch.",
      "Hello! Ask me anything about Daniel — projects, tech stack, experience, or contact info."
    ]
  },
  {
    match: /\b(who are you|what are you|what is this bot)\b/i,
    replies: ["I'm a bot that knows everything about Daniel Mason's portfolio. Ask me about his projects, skills, or background."]
  },
  {
    match: /\b(who is daniel|about daniel|tell me about|about you|who are you working for)\b/i,
    replies: ["Daniel Mason is a Full-Stack Developer & AWS Cloud Engineer based in Berlin. He builds complete products end-to-end — serverless AWS backends, React frontends, AI pipelines, and trading bots. AWS Certified Cloud Practitioner with 6+ years of experience."]
  },
  {
    match: /\b(skill|tech stack|what do you know|what can you do|languages|tools)\b/i,
    replies: ["Daniel's stack: JavaScript, TypeScript, Python, React, Node.js, Tailwind, AWS (Lambda, DynamoDB, Cognito, API Gateway, Step Functions, S3, EventBridge), Docker, Git, PostgreSQL, MongoDB. Currently learning Machine Learning."]
  },
  {
    match: /\b(aws|cloud|cert|certif)\b/i,
    replies: ["Daniel holds the AWS Certified Cloud Practitioner certification (2024) and works extensively with Lambda, DynamoDB, Cognito, API Gateway, Step Functions, S3, EventBridge, and Secrets Manager."]
  },
  {
    match: /\b(relocateme|relocation|relocate\.me|relocation platform)\b/i,
    replies: ["RelocateMe (relocateme.org) is a full-stack relocation platform Daniel built from scratch. It features an interactive world map, cost of living calculator, 9 country profiles with radar charts, and in-depth guides. It has two separate audience experiences — a global English site and a Hebrew section for Israelis. Built with React, AWS Lambda, DynamoDB, Cognito, API Gateway, amCharts 5, and deployed on Netlify."]
  },
  {
    match: /\b(finance|video pipeline|finance pipeline|video automation)\b/i,
    replies: ["The Finance Video Pipeline is a fully automated AWS Step Functions pipeline that picks a finance topic, writes a script via Claude (Bedrock), generates voiceover with Amazon Polly, renders charts, assembles an MP4, and publishes to YouTube — all for ~$0.08 per video."]
  },
  {
    match: /\b(kids|kids pipeline|kids video|children)\b/i,
    replies: ["The Kids Video Pipeline generates children's content automatically — Claude writes character-consistent scripts, Gemini Imagen 4 renders visuals, Amazon Polly (Ivy voice) narrates, Ken Burns animations add motion, and background music is mixed in. Outputs both portrait (TikTok/Instagram) and landscape (YouTube) formats."]
  },
  {
    match: /\b(polymarket|poly market|copy.?trad|trading bot)\b/i,
    replies: ["The PolyMarket Bot is an automated copy-trading bot built in TypeScript. It scans the Polymarket leaderboard, tracks top traders' positions, and mirrors their trades via the CLOB API. Runs on AWS EC2 managed by PM2."]
  },
  {
    match: /\b(atbot|arbitrage|triangular)\b/i,
    replies: ["aTBOT is a triangular arbitrage bot that scans KuCoin, Gate.io, BitMart & Binance for cross-exchange price gaps. It has a Flask dashboard, SQLite trade log, and paper/live mode toggle. Runs on AWS EC2."]
  },
  {
    match: /\b(narrify|reddit|youtube automation)\b/i,
    replies: ["Narrify is a Reddit-to-YouTube automation pipeline. It scrapes viral posts, scores them with AI, generates cinematic scripts via Claude, voices them with ElevenLabs, and publishes to YouTube, TikTok & Instagram automatically."]
  },
  {
    match: /\b(jobseeker|job seeker|job hunter|job feed)\b/i,
    replies: ["JobSeeker is an automated job feed that scrapes listings daily, scores them by relevance, and delivers a daily digest — secured with AWS Cognito auth. Built with React, Lambda, DynamoDB, and Python."]
  },
  {
    match: /\b(blogengine|blog engine|blog|automated blog)\b/i,
    replies: ["BlogEngine is a zero-cost automated blog — GitHub Actions fetches RSS feeds, scores articles by relevance, and uses Claude to generate full posts, committing directly to GitHub Pages. Completely serverless with no hosting costs."]
  },
  {
    match: /\b(multisocial|multi.?social|social media dashboard)\b/i,
    replies: ["MultiSocial is a social media management dashboard built with Next.js, TypeScript, Supabase, and Tailwind. It features post scheduling, draft & approval workflows, analytics, and a calendar view."]
  },
  {
    match: /\b(flipflop|flip.?flop|resale|arbitrage|kleinanzeigen)\b/i,
    replies: ["FlipFlop is a resale arbitrage dashboard that scrapes Kleinanzeigen listings, compares against eBay sold prices, ranks deals by profit score, and fires Telegram alerts on hot finds. Built with Python, Vue 3, and Supabase."]
  },
  {
    match: /\b(keshava|todo|task manager|pwa)\b/i,
    replies: ["Keshava is a task manager & calendar app with auth, notes, and a system monitor — installable as a PWA. Built with JavaScript, Firebase, and HTML/CSS."]
  },
  {
    match: /\b(maxhq|max.?hq|bot dashboard|polymarket dashboard)\b/i,
    replies: ["MaxHQ is the command center dashboard for the PolyMarket copy-trading bot. It displays open positions, closed trades, tracked traders, insider signals, copy settings, market blacklist, and a live log viewer. Built with React + Vite, hosted on AWS S3 as a static site. The bot runs on EC2 and the dashboard connects to it via a secured API."]
  },
  {
    match: /\b(nexacrm|nexa.?crm|nexa|crm|blog site|content site)\b/i,
    replies: ["NexaCRM is a content and blog platform covering health, lifestyle, supplements, manifestation, and community topics. Built as a multi-page static site with a clean editorial layout."]
  },
  {
    match: /\b(real.?estate|real estate monitor|property monitor|listing monitor)\b/i,
    replies: ["The Real Estate Monitor scrapes real estate listing sites using Playwright and BeautifulSoup, detects new listings in real-time, and stores results in Firebase Firestore for a live dashboard — great for tracking fast-moving rental markets."]
  },
  {
    match: /\b(apartment.?alert|apartmentalert|apartment|berlin.*apart|inberlin)\b/i,
    replies: ["ApartmentAlert monitors inberlinwohnen.de hourly for new listings and fires an email alert via AWS SNS the moment one appears. Fully serverless — Lambda + DynamoDB + EventBridge + IAM all provisioned automatically with a single bash deploy script."]
  },
  {
    match: /\b(balaram|personal dashboard|finance dashboard|life dashboard)\b/i,
    replies: ["Balaram is a private full-stack personal dashboard built with AWS Amplify — tracks expenses, investments, costs, ideas, and life goals in one place. Secured with Cognito auth, backed by DynamoDB with point-in-time recovery, and hosted on S3."]
  },
  {
    match: /\b(project|projects|what have you built|what did you build|portfolio)\b/i,
    replies: ["Daniel has built: RelocateMe (relocation platform), Finance & Kids Video Pipelines, PolyMarket Bot + MaxHQ dashboard, aTBOT (arbitrage), Narrify (Reddit→YouTube), JobSeeker, BlogEngine, MultiSocial, FlipFlop, ApartmentAlert, Real Estate Monitor, Balaram (personal dashboard), NexaCRM, FullStack Automation Framework, Keshava, and more. Ask about any specific one!"]
  },
  {
    match: /\b(experience|work|job|career|background)\b/i,
    replies: ["Daniel's career: E-Commerce Business Owner (2013–2019, drop-shipping at scale), RSA Fraud Analyst in banking (2011), Junior Frontend Developer at Lavan Group (2019–2020), Frontend Developer at QBO Services (2020–2021), and since then independent full-stack development and AWS engineering."]
  },
  {
    match: /\b(ecommerce|e-commerce|shopify|dropship)\b/i,
    replies: ["From 2013 to 2019, Daniel ran a large-volume drop-shipping operation — building and operating multiple Shopify stores, automating order workflows, and managing remote staff and virtual assistants."]
  },
  {
    match: /\b(education|degree|study|course|cert)\b/i,
    replies: ["Daniel holds a BA in Instructional System Design, completed a Full Stack Automation Course at ATID College (admitted via Ministry of Innovation Program), and earned the AWS Certified Cloud Practitioner certification in 2024."]
  },
  {
    match: /\b(contact|email|reach|hire|available|freelance|work together)\b/i,
    replies: ["Daniel is available for hire — open to full-time roles, freelance projects, and collaborations. Find him on LinkedIn: linkedin.com/in/daniel-mason-864a1399, or scroll to the contact section for full details."]
  },
  {
    match: /\b(location|where|based|city|country)\b/i,
    replies: ["Daniel is based in Berlin, Germany."]
  },
  {
    match: /\b(github)\b/i,
    replies: ["You can find Daniel's public projects on GitHub — check the contact section for the link."]
  },
  {
    match: /\b(linkedin)\b/i,
    replies: ["Daniel's LinkedIn: linkedin.com/in/daniel-mason-864a1399"]
  },
  {
    match: /\b(thank|thanks|cheers|appreciate)\b/i,
    replies: ["You're welcome! Anything else you'd like to know about Daniel?", "Happy to help! Feel free to ask anything else."]
  },
  {
    match: /\b(bye|goodbye|cya|see you)\b/i,
    replies: ["Later! Feel free to come back if you have more questions.", "Goodbye! Don't hesitate to reach out to Daniel directly."]
  }
];

function getBotReply(message) {
  const msg = message.toLowerCase();

  // Collect all matching rules (skip pure greeting/farewell if other rules also match)
  const greetingOnly = /^\s*(hi|hello|hey|howdy|sup|yo|bye|goodbye|cya|see you|thank|thanks|cheers|appreciate)[!.,\s]*$/i;
  const matches = KB.filter(entry => entry.match.test(msg));

  if (matches.length === 0) {
    return "I'm not sure about that — but you can ask me about Daniel's projects, skills, experience, or how to get in touch. Try something like \"tell me about RelocateMe\" or \"what's his tech stack\".";
  }

  // If message is purely a greeting/farewell, reply with that
  if (greetingOnly.test(msg)) {
    const r = matches[0].replies;
    return r[Math.floor(Math.random() * r.length)];
  }

  // Otherwise skip pure greeting/farewell rules and use the most specific match
  const meaningful = matches.filter(e =>
    !/\b(hi|hello|hey|howdy|sup|yo|bye|goodbye|cya|see you|thank|thanks|cheers|appreciate)\b/i.test(e.match.source)
  );
  const best = meaningful.length > 0 ? meaningful[0] : matches[0];
  const r = best.replies;
  return r[Math.floor(Math.random() * r.length)];
}

// --- Toggle chat ---
function toggleChat() {
  const chatWindow = document.getElementById('chatWindow');
  if (chatWindow) chatWindow.classList.toggle('open');
}

// --- Add message to chat ---
function addMessage(text, sender) {
  const messagesDiv = document.getElementById('chatMessages');
  if (!messagesDiv) return;

  const msg = document.createElement('div');
  msg.className = 'chat-msg ' + sender;

  const prompt = document.createElement('span');
  prompt.className = 'chat-msg-prompt';
  prompt.textContent = sender === 'bot' ? 'bot$' : 'you$';

  const bubble = document.createElement('span');
  bubble.className = 'chat-msg-text';
  bubble.textContent = text;

  msg.appendChild(prompt);
  msg.appendChild(bubble);
  messagesDiv.appendChild(msg);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// --- Send message ---
function sendChatMessage() {
  const input = document.getElementById('chatInput');
  if (!input) return;

  const message = input.value.trim();
  if (!message) return;

  addMessage(message, 'user');
  input.value = '';

  const typingIndicator = document.getElementById('typingIndicator');
  if (typingIndicator) typingIndicator.style.display = 'flex';

  setTimeout(() => {
    if (typingIndicator) typingIndicator.style.display = 'none';
    addMessage(getBotReply(message), 'bot');
  }, 600);
}

// --- Enter key to send ---
document.addEventListener('keypress', function(e) {
  if (e.key === 'Enter' && e.target.id === 'chatInput') {
    sendChatMessage();
  }
});
