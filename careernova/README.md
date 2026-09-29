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
│   ├── coach.css                   # AI Placement Coach chat interface & prompt shortcuts
│   ├── chatbot.css                 # Floating context help widget & AI settings modal styling
│   ├── mock-interview.css          # Multi-step mock interview wizard, scoring ring, report
│   └── tpo.css                     # College placement coordinator table & stats grid
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
│       ├── coach.js                # Coach interface integration alias
│       ├── context-chatbot.js      # Context-aware floating assistant
│       ├── mock-interview.js       # Interactive mock interview session & report evaluator
│       ├── tpo.js                  # Campus placement roster table filtering
│       └── toast.js                # Floating toast notification manager
└── README.md
```

---

## 🚀 How to Run

Because `bundle.js` is included, CareerNova runs anywhere with **zero configuration**:

1. **Direct Double-Click**:
   Simply double-click `index.html` in File Explorer. It opens in your default browser (Chrome, Edge, Firefox) and works immediately without any server.
2. **VS Code Live Server**:
   Right-click `index.html` → **Open with Live Server**.
3. **Python Server**:
   ```bash
   python -m http.server 8000 --directory C:\Users\Tavishi\.gemini\antigravity\scratch\careernova
   ```
   Then open `http://localhost:8000`.
