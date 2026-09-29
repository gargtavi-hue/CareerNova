# CareerNova — Modular Placement & Candidate Platform

CareerNova has been modularized from 3 monolithic files (`index.html`, `styles.css`, `app.js`) into a clean, maintainable, production-ready frontend architecture.

---

## 📁 Modular Directory Architecture

```
careernova/
├── index.html                      # Semantic root document, cleanly connecting CSS & JS modules
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
│   ├── mock-interview.css          # Multi-step mock interview wizard, scoring ring, report
│   └── tpo.css                     # College placement coordinator table & stats grid
├── js/
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
│       ├── coach.js                # AI Placement Coach chat simulator & knowledge base
│       ├── mock-interview.js       # Interactive mock interview session & report evaluator
│       ├── tpo.js                  # Campus placement roster table filtering
│       └── toast.js                # Floating toast notification manager
└── README.md
```

---

## 🚀 Key Improvements & Fixes

1. **True Separation of Concerns**:
   - Style sheets are divided by functional domain. You can adjust the styling of the **DSA Practice view**, the **AI Coach**, or the **Mock Interview** without touching unrelated styles.
   - Large datasets (`MOCK_QUESTIONS`, `COMPANY_PREP_DATA`, and the new `DSA_PROBLEMS`) are separated from UI logic into `js/data/`.
   - Business logic is partitioned into standalone ES modules under `js/modules/`.

2. **Completed Missing DSA Functionality**:
   - The original code had HTML elements for `dsa-search`, filters, and a problem grid, but lacked card rendering and filtering logic.
   - Added `js/data/dsa-problems.js` and implemented `renderDsaProblems()`, `filterDsaProblems()`, `openDsaProblem()`, `openRandomDsa()`, and solve-tracking in `js/modules/dsa.js`.

3. **HTML Structural Fixes**:
   - Relocated `<div id="dsa-problem-modal">` inside `<body>` (previously placed outside `<head>` and `<body>`).
   - Added the missing `<div id="toast-notification">` element required for `showToast()` notifications.

---
