# CareerNova — Modular Placement & Candidate Platform

CareerNova is a candidate and campus placement preparation platform built with a modular, responsive frontend architecture.

---

## 🌟 Features & Intelligent Capabilities

1. **Nova AI — Interactive Chatbot (ChatGPT & Gemini Experience)**:
   - **Interactive Multi-Turn Conversation**: Talk naturally, ask follow-up questions, request code conversions, and brainstorm ideas just like in ChatGPT and Gemini.
   - **Google Gemini 2.5 Flash Generative AI**: Connect a free API key via **⚙️ AI Settings** to enable deep reasoning, bug debugging, full code generation, and multi-turn context memory.
   - **Out-of-the-Box Live Web Search & Instant Answers**: Even without an API key, Nova queries live web knowledge (Wikipedia REST & DuckDuckGo) with technical disambiguation to answer concepts, algorithms, and definitions.
   - **Rich Markdown & Syntax Highlighting with Copy**: Responses format code blocks with language tags and one-click **📋 Copy** buttons.
   - **Session Controls**: Includes **➕ New Chat** to reset threads, prompt suggestion cards on empty states, and auto-expanding multiline input (`Enter` to send, `Shift+Enter` for new line).

2. **Floating Context-Aware Help Assistant (💡 Help)**:
   - Floats in the bottom-right corner across all screens.
   - Dynamically identifies which tab/section the candidate is currently browsing and provides contextual tips.
   - Can also answer any general or technical question by searching the live web!

3. **DSA Practice Dashboard**:
   - Curated problem sets (Easy, Medium, Hard) across Array, String, Stack, Linked List, Tree, Graph, and Dynamic Programming.
   - Direct LeetCode problem links, problem detail modals, test cases, and problem-solving hints.
   - Interactive solve tracking, streak counter, and dynamic placement readiness calculation.

4. **Placement Readiness Index & Circular Gauge**:
   - Animated SVG circular gauge indexing candidate readiness across DSA, Systems Architecture, and Resume Auditing.
   - Actionable Next Best Action priority steps.

5. **Top Tech Applications**:
   - Company profiles (Google, Microsoft, Amazon, Infosys, TCS, NVIDIA) with interview round breakdowns, required skills, and interactive preparation checklists.

6. **Interactive Mock Interview Simulator**:
   - Timed, multi-question mock interview session across Technical CS, HR/Behavioral, DSA, and Company tracks.
   - Evaluates answers on Technical Accuracy, Communication, and Completeness with an actionable diagnostic report.

7. **Verified Job Postings**:
   - Filterable new-grad job postings with verified badges and bookmarking.

8. **College TPO Placement Portal**:
   - Campus-wide placement statistics and filterable student roster monitoring.

9. **Notification Center & Real-Time Alerts**:
   - Interactive bell button with animated red unread badge counter.
   - Categorized tabs: **Drives 🏢**, **Hackathons 🏆**, **Jobs 💼**, and **Shortlists 🎯**.
   - One-click "Read", "Mark all read", and "Clear all" actions.
   - Direct click-routing:
     - 🔔 *"Google placement drive opened"* $\rightarrow$ Opens Google preparation guide
     - 🔔 *"You have been shortlisted"* $\rightarrow$ Opens Mock Interview practice wizard
     - 🔔 *"New hackathon added"* $\rightarrow$ Routes to Hackathons view
     - 🔔 *"New verified job alert"* $\rightarrow$ Filters to Stripe Frontend Engineer job

10. **Smart Global Search & Routing Engine**:
    - Real-time multi-category search across Companies, Jobs, DSA, and Hackathons.
    - Floating autocomplete dropdown card with categorized results and metadata badges.
    - Keyboard-friendly navigation (`Enter` to route to top match, `Escape` to dismiss).

---

## 📁 Project Structure

```
careernova/
├── index.html                      # Semantic root document connecting styles and bundle
├── styles.css                      # Master stylesheet importing all modular CSS files
├── css/
│   ├── variables.css               # Design tokens, color palette, typography & base resets
│   ├── layout.css                  # App shell, fixed sidebar navigation, top bar, headers
│   ├── components.css              # Shared buttons, inputs, badges, data tables, modals, toast
│   ├── auth.css                    # Onboarding card, form inputs, role shortcuts
│   ├── dashboard.css               # SVG placement readiness gauge, skill tracks, priority card
│   ├── dsa.css                     # DSA practice dashboard, problem cards, detail modal
│   ├── applications.css            # Top Tech company cards, split layout, prep modal
│   ├── jobs.css                    # Verified job rows, filter bar, bookmark buttons
│   ├── hackathons.css              # Hackathon cards, prizes, sprint tags
│   ├── chatbot.css                 # Nova AI (ChatGPT/Gemini) & floating assistant styling
│   ├── mock-interview.css          # Multi-step mock interview wizard, scoring ring, report
│   ├── tpo.css                     # College placement coordinator table & stats grid
│   ├── notifications.css           # Notification Center, badge pulse, category tabs & item alerts
│   └── search.css                  # Global search floating autocomplete card & category lists
├── js/
│   ├── bundle.js                   # Universal application bundle (runs on file:// and http://)
│   ├── app.js                      # Application root entry point & global event bindings
│   ├── state.js                    # Centralized state management (score, solved list, user)
│   ├── data/
│   │   ├── dsa-problems.js         # Curated DSA problem bank (descriptions, examples, hints)
│   │   ├── mock-questions.js       # Structured mock question bank (Technical, HR, DSA, Company)
│   │   └── company-prep.js         # Company interview guidelines, required skills, checklists
│   └── modules/
│       ├── auth.js                 # Authentication, demo logins, sign-out
│       ├── navigation.js           # Single-page view routing & tab transitions
│       ├── dashboard.js            # SVG circular gauge animation & priority task updates
│       ├── dsa.js                  # DSA problem card rendering, filtering & modal logic
│       ├── applications.js         # Company search, filter, and preparation modal controller
│       ├── jobs.js                 # Job filter engine & bookmark toggling
│       ├── hackathons.js           # Hackathon filter logic & registration
│       ├── chatbot.js              # Nova AI (ChatGPT/Gemini) engine & Live Web Search
│       ├── context-chatbot.js      # Context-aware floating assistant (💡 Help)
│       ├── notifications.js        # Notification Center, alert categories, read tracking & routing
│       ├── global-search.js        # Global Search Engine & cross-feature routing
│       ├── mock-interview.js       # Interactive mock interview session & report evaluator
│       ├── tpo.js                  # Campus placement roster table filtering
│       └── toast.js                # Floating toast notification manager
├── js/
│   ├── bundle.js                   # Universal application bundle (runs on file:// and http://)
│   ├── app.js                      # Application root entry point & global event bindings
│   ├── state.js                    # Centralized state management (score, solved list, user)
│   ├── data/
│   │   ├── dsa-problems.js         # Curated DSA problem bank (descriptions, examples, hints)
│   │   ├── mock-questions.js       # Structured mock question bank (Technical, HR, DSA, Company)
│   │   └── company-prep.js         # Company interview guidelines, required skills, checklists
│   └── modules/
│       ├── auth.js                 # Authentication, demo logins, sign-out
│       ├── navigation.js           # Single-page view routing & global search router
│       ├── dashboard.js            # SVG circular gauge animation & priority task updates
│       ├── dsa.js                  # DSA problem card rendering, filtering & modal logic
│       ├── applications.js         # Company search, filter, and preparation modal controller
│       ├── jobs.js                 # Job filter engine & bookmark toggling
│       ├── hackathons.js           # Hackathon filter logic & registration
│       ├── chatbot.js              # Live Web Search (Wikipedia/DDG) & Google Gemini AI engine
│       ├── context-chatbot.js      # Context-aware floating assistant
│       ├── mock-interview.js       # Interactive mock interview session & report evaluator
│       ├── tpo.js                  # Campus placement roster table filtering
│       └── toast.js                # Floating toast notification manager
└── README.md
```

