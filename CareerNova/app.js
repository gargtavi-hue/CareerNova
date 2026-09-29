/* CareerNova - Streamlined SaaS Desktop Logic */

let currentScore = 0;
let solvedDsaCount = 0;
const solvedDsaMap = {};

// 1. DYNAMIC GAUGE & SKILL BAR CALCULATOR
function updateGaugeVisual(score) {
  currentScore = Math.min(100, Math.max(0, score));
  
  // SVG Circle r=65, circumference = 2 * PI * 65 ≈ 408
  const circumference = 408;
  const offset = circumference - (circumference * currentScore / 100);

  const circleEl = document.getElementById('readiness-gauge-circle');
  if (circleEl) {
    circleEl.style.strokeDashoffset = offset;
  }

  const scoreText = document.getElementById('gauge-score-text');
  if (scoreText) {
    scoreText.innerText = `${currentScore}%`;
  }

  const tierBadge = document.getElementById('gauge-tier-badge');
  if (tierBadge) {
    if (currentScore === 0) {
      tierBadge.innerText = 'Diagnostic Baseline: 0%';
      tierBadge.className = 'badge badge-navy';
    } else if (currentScore >= 85) {
      tierBadge.innerText = 'Tier 1 Qualified';
      tierBadge.className = 'badge badge-green';
    } else if (currentScore >= 60) {
      tierBadge.innerText = 'Tier 2 Candidate';
      tierBadge.className = 'badge badge-orange';
    } else {
      tierBadge.innerText = `Preparation Score: ${currentScore}%`;
      tierBadge.className = 'badge badge-navy';
    }
  }
}

// 2. DSA SOLVE HANDLER (Advances Next Best Action priority task)
function solveDsaProblem(btn, problemId) {
  if (!solvedDsaMap[problemId]) {
    solvedDsaMap[problemId] = true;
    solvedDsaCount++;
    btn.innerText = 'Solved ✓';
    btn.className = 'btn-secondary';
    
    const tr = btn.closest('tr');
    if (tr) {
      const iconSpan = tr.querySelector('.dsa-status-icon');
      if (iconSpan) {
        iconSpan.innerText = '✓';
        iconSpan.style.color = '#16a34a';
      }
    }

    document.getElementById('dsa-counter-text').innerText = `${solvedDsaCount} / 10`;
    
    const dsaPct = Math.round((solvedDsaCount / 10) * 100);
    const dsaBar = document.getElementById('skill-dsa-bar');
    const dsaText = document.getElementById('skill-dsa-text');
    if (dsaBar) dsaBar.style.width = `${dsaPct}%`;
    if (dsaText) dsaText.innerText = `${solvedDsaCount} / 10 Solved`;

    // Boost score by 8% per solved problem
    updateGaugeVisual(currentScore + 8);
    
    // Update Next Best Action priority task when solving problems
    if (solvedDsaCount >= 5) {
      updatePriorityTask(
        'Step 2: Submit Google & Microsoft Campus Drive Applications',
        'Your DSA score is benchmarked! Next priority is submitting target application packages for scheduled recruitment drives.',
        'Apply to Target Drives →',
        () => switchView('applications')
      );
    }

    showToast(`DSA Question #${problemId} solved! Readiness updated to ${currentScore}%.`);
  } else {
    showToast(`Question #${problemId} is already marked solved.`);
  }
}

function updatePriorityTask(title, desc, btnLabel, actionFn) {
  const tEl = document.getElementById('priority-title-text');
  const dEl = document.getElementById('priority-desc-text');
  const bEl = document.getElementById('priority-cta-btn');
  if (tEl) tEl.innerText = title;
  if (dEl) dEl.innerText = desc;
  if (bEl) {
    bEl.innerText = btnLabel;
    bEl.onclick = actionFn;
  }
}

// 3. AUTH & ONBOARDING HANDLER
function handleAuthSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('auth-name').value || 'Alex Wright';
  const college = document.getElementById('auth-college').value || 'Stanford University';
  const branch = document.getElementById('auth-branch').value || 'Computer Science & Engineering';
  const year = document.getElementById('auth-year').value || '2026';

  document.getElementById('sidebar-user-name').innerText = name;
  document.getElementById('sidebar-user-role').innerText = `${college.split(' ')[0]} • ${year}`;
  
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  document.getElementById('sidebar-user-avatar').innerText = initials || 'AW';

  document.getElementById('hero-student-name').innerText = name;
  document.getElementById('hero-profile-subtitle').innerText = `${college} • ${branch} '${year.slice(-2)}`;

  document.getElementById('auth-view').classList.add('hidden');
  document.getElementById('app-shell').classList.remove('hidden');
  
  updateGaugeVisual(0);
  showToast(`Welcome ${name}! Candidate portal initialized for ${college}.`);
}

function demoSignIn(roleType) {
  if (roleType === 'Student') {
    document.getElementById('auth-name').value = 'Alexander Wright';
    document.getElementById('auth-college').value = 'Stanford University';
    document.getElementById('auth-branch').value = 'Computer Science & Engineering';
    document.getElementById('auth-year').value = '2026';
    handleAuthSubmit({ preventDefault: () => {} });
  } else {
    document.getElementById('sidebar-user-name').innerText = 'Dr. Robert Vance (TPO)';
    document.getElementById('sidebar-user-role').innerText = 'Placement Officer';
    document.getElementById('sidebar-user-avatar').innerText = 'TP';

    document.getElementById('hero-student-name').innerText = 'TPO Officer';
    document.getElementById('hero-profile-subtitle').innerText = `Stanford University TPO Office • Campus Placement Coordinator`;

    document.getElementById('auth-view').classList.add('hidden');
    document.getElementById('app-shell').classList.remove('hidden');
    switchView('college');
    showToast('Signed in as Campus Placement Officer (TPO Portal)');
  }
}

function handleSignOut() {
  document.getElementById('app-shell').classList.add('hidden');
  document.getElementById('auth-view').classList.remove('hidden');
  showToast('Signed out successfully.');
}

// 4. MAIN NAVIGATION LOGIC
function switchView(viewId) {
    document.body.classList.toggle(
    'applications-active',
    viewId === 'applications'
);
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    if (item.getAttribute('data-view') === viewId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  const pageViews = document.querySelectorAll('.page-view');
  pageViews.forEach(view => {
    if (view.id === `view-${viewId}`) {
      view.classList.remove('hidden');
    } else {
      view.classList.add('hidden');
    }
  });
}

// 5. SUB-SCREEN FILTERING
function filterHackathons() {
  const statusVal = document.getElementById('hackathon-status-filter').value;
  const catVal = document.getElementById('hackathon-cat-filter').value;
  const cards = document.querySelectorAll('#hackathons-grid .item-card');
  let visibleCount = 0;

  cards.forEach(card => {
    const cardStatus = card.getAttribute('data-status');
    const cardCat = card.getAttribute('data-cat');

    const matchesStatus = (statusVal === 'All' || cardStatus === statusVal);
    const matchesCat = (catVal === 'All' || cardCat === catVal);

    if (matchesStatus && matchesCat) {
      card.style.display = 'flex';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  document.getElementById('hackathon-count').innerText = visibleCount;
}

function filterJobs() {
  const roleVal = document.getElementById('job-role-filter').value;
  const typeVal = document.getElementById('job-type-filter').value;
  const rows = document.querySelectorAll('#jobs-container .job-row');
  let visibleCount = 0;

  rows.forEach(row => {
    const rowRole = row.getAttribute('data-role');
    const rowType = row.getAttribute('data-type');

    const matchesRole = (roleVal === 'All' || rowRole === roleVal);
    const matchesType = (typeVal === 'All' || rowType === typeVal);

    if (matchesRole && matchesType) {
      row.style.display = 'flex';
      visibleCount++;
    } else {
      row.style.display = 'none';
    }
  });

  document.getElementById('job-count').innerText = visibleCount;
}
function toggleSavedJob(button) {
    button.classList.toggle('saved');

    if (button.classList.contains('saved')) {
        button.innerText = '♥';
        showToast('Job saved successfully.');
    } else {
        button.innerText = '♡';
        showToast('Job removed from saved jobs.');
    }
}

function filterDsaTable() {
  const topicVal = document.getElementById('dsa-topic-filter').value;
  const diffVal = document.getElementById('dsa-diff-filter').value;
  const rows = document.querySelectorAll('#dsa-table-body tr');

  rows.forEach(row => {
    const rowTopic = row.getAttribute('data-topic');
    const rowDiff = row.getAttribute('data-diff');

    const matchesTopic = (topicVal === 'All' || rowTopic === topicVal);
    const matchesDiff = (diffVal === 'All' || rowDiff === diffVal);

    if (matchesTopic && matchesDiff) {
      row.style.display = 'table-row';
    } else {
      row.style.display = 'none';
    }
  });
}

function filterTpoRoster() {
  const branchVal = document.getElementById('tpo-branch-filter').value;
  const statusVal = document.getElementById('tpo-status-filter').value;
  const rows = document.querySelectorAll('#tpo-table-body tr');
  let visibleCount = 0;

  rows.forEach(row => {
    const rowBranch = row.getAttribute('data-branch');
    const rowStatus = row.getAttribute('data-status');

    const matchesBranch = (branchVal === 'All' || rowBranch === branchVal);
    const matchesStatus = (statusVal === 'All' || rowStatus === statusVal);

    if (matchesBranch && matchesStatus) {
      row.style.display = 'table-row';
      visibleCount++;
    } else {
      row.style.display = 'none';
    }
  });

  document.getElementById('tpo-student-count').innerText = visibleCount;
}

// 6. GLOBAL SEARCH
function handleGlobalSearch(query) {
  if (!query) return;
  const q = query.toLowerCase();

  if (q.includes('dsa') || q.includes('tree') || q.includes('algorithm')) {
    switchView('dsa');
  } else if (q.includes('job') || q.includes('google') || q.includes('microsoft') || q.includes('amazon')) {
    switchView('jobs');
  } else if (q.includes('college') || q.includes('tpo') || q.includes('campus')) {
    switchView('college');
  } else if (q.includes('hackathon')) {
    switchView('hackathons');
  }
}

// 7. AI CHAT SIMULATION
function sendChatMessage() {

    const inputEl =
        document.getElementById('chat-input');

    const text =
        inputEl.value.trim();

    if (!text) return;


    const chatBox =
        document.getElementById('chat-box');

    const placeholder =
        chatBox.querySelector(
            'div[style*="text-align: center"]'
        );

    if (placeholder) {
        placeholder.remove();
    }


    // Show student's message
    appendChatBubble(text, 'user');

    inputEl.value = '';

    inputEl.disabled = true;


    // Temporary thinking indicator
    const thinkingId =
        'thinking-' + Date.now();

    const thinkingBubble =
        document.createElement('div');

    thinkingBubble.id = thinkingId;

    thinkingBubble.className =
        'chat-bubble bot';

    thinkingBubble.innerText =
        'Nova is thinking...';

    chatBox.appendChild(thinkingBubble);

    chatBox.scrollTop =
        chatBox.scrollHeight;


    setTimeout(() => {

        const thinking =
            document.getElementById(thinkingId);

        if (thinking) {
            thinking.remove();
        }


        const reply =
            generateCoachResponse(text);


        appendChatBubble(
            reply,
            'bot'
        );


        inputEl.disabled = false;

        inputEl.focus();

    }, 600);
}

function generateCoachResponse(text) {

    const q =
        text.toLowerCase();


    /* ===============================
       DSA
    =============================== */

    if (
        q.includes('two sum') ||
        q.includes('dsa') ||
        q.includes('algorithm') ||
        q.includes('data structure') ||
        q.includes('leetcode') ||
        q.includes('time complexity')
    ) {

        return `
<b>🧩 DSA Preparation</b>

Here's how I'd approach this in an interview:

<b>1. Understand the problem</b>
Clearly identify the input, output and constraints.

<b>2. Start with the simple approach</b>
Explain the brute-force solution first.

<b>3. Optimize it</b>
Look for a suitable data structure such as a HashMap, Stack, Queue or Heap.

<b>4. Explain complexity</b>
Always mention both time and space complexity.

<b>5. Test edge cases</b>
Consider empty input, duplicates, minimum/maximum values and unusual cases.

<b>Interview tip:</b>
Don't immediately start coding. Explain your approach first, then code.
        `;
    }


    /* ===============================
       SQL / DATABASE
    =============================== */

    if (
        q.includes('sql') ||
        q.includes('nosql') ||
        q.includes('database') ||
        q.includes('dbms')
    ) {

        return `
<b>🗄️ Database Interview Prep</b>

When comparing SQL and NoSQL, structure your answer around:

<b>SQL</b>
• Structured relational data
• Schema-based design
• Strong relational integrity
• Useful when relationships and transactions are important

<b>NoSQL</b>
• Flexible data models
• Often useful for large-scale distributed systems
• Easier to adapt when the data structure changes

<b>Interview tip:</b>
Don't simply say that one is "better". Explain which choice fits the requirements and why.
        `;
    }


    /* ===============================
       SYSTEM DESIGN
    =============================== */

    if (
        q.includes('system design') ||
        q.includes('rate limiter') ||
        q.includes('scalability') ||
        q.includes('distributed')
    ) {

        return `
<b>🏗️ System Design Checklist</b>

For a system-design interview, follow this order:

<b>1. Requirements</b>
Clarify what the system needs to do.

<b>2. Scale</b>
Estimate users, requests and storage.

<b>3. Architecture</b>
Explain the major components.

<b>4. Database</b>
Choose SQL or NoSQL and explain why.

<b>5. Caching</b>
Identify frequently accessed data.

<b>6. Reliability</b>
Discuss failures, redundancy and recovery.

<b>7. Trade-offs</b>
Explain what you gain and what you sacrifice with your design.

<b>Interview tip:</b>
Keep checking whether your design actually satisfies the requirements.
        `;
    }


    /* ===============================
       HR / STAR
    =============================== */

    if (
        q.includes('star') ||
        q.includes('hr') ||
        q.includes('behavioral') ||
        q.includes('strength') ||
        q.includes('weakness') ||
        q.includes('deadline')
    ) {

        return `
<b>🎤 HR / Behavioral Preparation</b>

For behavioral questions, use the <b>STAR</b> structure:

<b>S — Situation</b>
Give the relevant background.

<b>T — Task</b>
Explain what you were responsible for.

<b>A — Action</b>
Explain exactly what YOU did.

<b>R — Result</b>
Explain the outcome and what you learned.

<b>Important:</b>
Avoid spending most of your answer describing the situation. The interviewer wants to understand your actions and decisions.

<b>Practice tip:</b>
Prepare examples involving teamwork, leadership, failure, conflict, deadlines and problem-solving.
        `;
    }


    /* ===============================
       PROJECT / RESUME
    =============================== */

    if (
        q.includes('project') ||
        q.includes('resume') ||
        q.includes('portfolio') ||
        q.includes('cv')
    ) {

        return `
<b>📁 Project / Resume Preparation</b>

When explaining a project, use this structure:

<b>1. Problem</b>
What problem were you trying to solve?

<b>2. Solution</b>
What did you build?

<b>3. Technology</b>
Why did you choose your tech stack?

<b>4. Your contribution</b>
What did YOU personally implement?

<b>5. Challenge</b>
What was difficult?

<b>6. Result</b>
What did you achieve?

<b>7. Improvements</b>
What would you change if you had more time?

<b>Interview tip:</b>
Be prepared to explain every technology and major feature listed on your resume.
        `;
    }


    /* ===============================
       JAVA
    =============================== */

    if (
        q.includes('java') ||
        q.includes('oops') ||
        q.includes('inheritance') ||
        q.includes('polymorphism')
    ) {

        return `
<b>☕ Java Interview Prep</b>

Important areas to revise:

• OOP principles
• Classes and objects
• Inheritance
• Polymorphism
• Abstraction
• Encapsulation
• Exception handling
• Multithreading
• Collections
• Interfaces
• Abstract classes

<b>Interview tip:</b>
For every OOP concept, prepare a simple real-world example and a small Java code example.
        `;
    }


    /* ===============================
       OS
    =============================== */

    if (
        q.includes('operating system') ||
        q.includes('os') ||
        q.includes('deadlock') ||
        q.includes('process') ||
        q.includes('thread')
    ) {

        return `
<b>💻 Operating Systems Prep</b>

Important interview topics:

• Process vs Thread
• CPU Scheduling
• Deadlocks
• Synchronization
• Semaphores
• Virtual Memory
• Page Replacement
• Paging
• Memory Management

<b>Interview tip:</b>
For algorithms such as FCFS, SJF, SRTF and Round Robin, practice solving numerical problems as well as explaining the concept.
        `;
    }


    /* ===============================
       GREETING
    =============================== */

    if (
        q.includes('hello') ||
        q.includes('hi') ||
        q.includes('hey')
    ) {

        return `
<b>👋 Hi! I'm Nova.</b>

I'm your CareerNova Placement Coach.

You can ask me about:

• DSA & algorithms
• Java & programming
• DBMS / SQL
• Operating Systems
• System Design
• HR interviews
• STAR answers
• Resume & projects
• Placement preparation

What would you like to practice?
        `;
    }


    /* ===============================
       GENERAL PLACEMENT
    =============================== */

    return `
<b>🎯 Placement Coach</b>

I'd approach this from a placement perspective.

Try telling me which area you're preparing for:

<b>DSA</b> — algorithms, complexity, problem solving

<b>Technical</b> — Java, DBMS, OS, programming

<b>System Design</b> — architecture and scalability

<b>HR</b> — behavioral and STAR questions

<b>Resume</b> — projects and interview questions

<b>Interview</b> — mock questions and preparation strategies

For a more specific answer, include the topic you're struggling with.
    `;
}

function sendSuggestedChat(promptText) {
  document.getElementById('chat-input').value = promptText;
  sendChatMessage();
}

function appendChatBubble(msg, sender) {
  const container = document.getElementById('chat-box');
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${sender}`;
  bubble.innerHTML = msg;
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
}

// 8. MODALS & TOASTS
/* =========================================
   MOCK INTERVIEW SYSTEM
   ========================================= */

let selectedInterviewType = "technical";
let mockQuestions = [];
let currentMockQuestion = 0;
let mockAnswers = [];
let mockQuestionCount = 10;


/* -----------------------------------------
   QUESTION BANK
----------------------------------------- */

const MOCK_QUESTIONS = {

    technical: {

        easy: [
            "What is the difference between a compiler and an interpreter?",
            "What is object-oriented programming?",
            "What is the difference between a class and an object?",
            "What is a primary key in a database?",
            "What is the purpose of an operating system?"
        ],

        medium: [
            "Explain the difference between process and thread.",
            "What is normalization in DBMS and why is it used?",
            "Explain the difference between SQL and NoSQL databases.",
            "What is polymorphism in Java? Give an example.",
            "Explain the difference between stack memory and heap memory.",
            "What is deadlock in operating systems? Explain its necessary conditions.",
            "What is an API and why is it useful?",
            "Explain the concept of inheritance in object-oriented programming."
        ],

        hard: [
            "How would you design a URL shortening service like TinyURL?",
            "Explain database indexing and discuss its advantages and trade-offs.",
            "How would you design a highly scalable notification system?",
            "Explain horizontal and vertical scaling with practical examples.",
            "How would you approach designing a system that handles millions of concurrent users?"
        ]

    },


    hr: {

        easy: [
            "Tell me about yourself.",
            "Why do you want to work in the technology industry?",
            "What are your strengths?",
            "What is one weakness you are currently working on?",
            "Where do you see yourself in the next five years?"
        ],

        medium: [
            "Tell me about a challenging project you worked on and how you handled it.",
            "Describe a time when you had a disagreement with a teammate.",
            "Tell me about a failure and what you learned from it.",
            "How do you manage multiple deadlines?",
            "Why should we hire you?",
            "Describe a situation where you had to learn something quickly.",
            "How do you handle constructive criticism?",
            "Tell me about a time you demonstrated leadership."
        ],

        hard: [
            "Tell me about a decision you made that negatively affected a team. What did you learn?",
            "Describe a situation where you strongly disagreed with your manager.",
            "You have two important deadlines tomorrow. How would you decide what to prioritize?",
            "Tell me about a professional situation where you changed your opinion after receiving new information.",
            "What would you do if you were assigned a task you believed was technically incorrect?"
        ]

    },


    dsa: {

        easy: [
            "What is the time complexity of searching for an element in an unsorted array?",
            "What is the difference between an array and a linked list?",
            "Explain how a stack works.",
            "What is a queue and where is it commonly used?",
            "What is the difference between BFS and DFS?"
        ],

        medium: [
            "Explain how you would solve the Two Sum problem.",
            "How does binary search work and what is its time complexity?",
            "How would you detect a cycle in a linked list?",
            "Explain the sliding window technique with an example.",
            "How would you find the first non-repeating character in a string?",
            "Explain how a hash table works.",
            "How would you find the maximum subarray sum?",
            "Explain the difference between BFS and DFS and when you would use each."
        ],

        hard: [
            "Explain an efficient approach to solving the Trapping Rain Water problem.",
            "How would you find the shortest path in a weighted graph?",
            "Explain a dynamic programming approach to the Coin Change problem.",
            "How would you detect a cycle in a directed graph?",
            "Explain how you would approach the Longest Increasing Subsequence problem."
        ]

    },


    company: {

        easy: [
            "Tell me about yourself and your technical background.",
            "Why are you interested in joining a technology company?",
            "What programming language are you most comfortable with?",
            "Describe a project you are proud of.",
            "What technical skill are you currently improving?"
        ],

        medium: [
            "Explain one technical project from your resume in detail.",
            "How would you optimize a slow piece of code?",
            "How do you approach debugging a problem you have never seen before?",
            "Explain a challenging technical decision you made in a project.",
            "How would you design a scalable web application?",
            "Which data structures do you use most frequently and why?",
            "How do you ensure the quality of your code?",
            "Explain a technical concept to a non-technical person."
        ],

        hard: [
            "Design a scalable system for processing millions of events per day.",
            "How would you investigate a sudden performance degradation in production?",
            "Design a distributed caching system and explain your trade-offs.",
            "How would you design an application that must remain available even when individual servers fail?",
            "Walk me through how you would design a large-scale collaborative application."
        ]

    }

};


/* -----------------------------------------
   OPEN CONFIGURATION
----------------------------------------- */

function openMockInterviewModal() {

    document
        .getElementById("mock-interview-modal")
        .classList.remove("hidden");

}


/* -----------------------------------------
   CLOSE CONFIGURATION
----------------------------------------- */

function closeMockInterviewModal() {

    document
        .getElementById("mock-interview-modal")
        .classList.add("hidden");

}


/* -----------------------------------------
   SELECT INTERVIEW TYPE
----------------------------------------- */

function selectInterviewType(type, button) {

    selectedInterviewType = type;

    document
        .querySelectorAll(".interview-type-card")
        .forEach(card => {
            card.classList.remove("selected");
        });

    button.classList.add("selected");
}


/* -----------------------------------------
   START INTERVIEW
----------------------------------------- */

function startMockSession() {

    const difficulty =
        document.getElementById("interview-difficulty").value;

    mockQuestionCount =
        Number(
            document.getElementById("interview-question-count").value
        );


    const availableQuestions =
        MOCK_QUESTIONS[selectedInterviewType][difficulty];


    mockQuestions =
        shuffleArray(availableQuestions)
            .slice(
                0,
                Math.min(mockQuestionCount, availableQuestions.length)
            );


    currentMockQuestion = 0;
    mockAnswers = [];


    if (mockQuestions.length === 0) {

        showToast("No questions available for this interview.");

        return;
    }


    closeMockInterviewModal();


    document
        .getElementById("mock-session-modal")
        .classList.remove("hidden");


    displayMockQuestion();

}


/* -----------------------------------------
   DISPLAY QUESTION
----------------------------------------- */

function displayMockQuestion() {

    const question =
        mockQuestions[currentMockQuestion];

    const total =
        mockQuestions.length;


    document.getElementById("mock-question-number")
        .innerText =
        `Question ${currentMockQuestion + 1} of ${total}`;


    document.getElementById("mock-question-counter")
        .innerText =
        `${currentMockQuestion + 1} / ${total}`;


    document.getElementById("mock-question-text")
        .innerText =
        question;


    document.getElementById("mock-question-type")
        .innerText =
        getInterviewTypeName(selectedInterviewType);


    const difficulty =
        document.getElementById("interview-difficulty").value;


    document.getElementById("mock-question-difficulty")
        .innerText =
        getDifficultyName(difficulty);


    const progress =
        ((currentMockQuestion) / total) * 100;


    document.getElementById("mock-progress-bar")
        .style.width =
        `${progress}%`;


    document.getElementById("mock-answer")
        .value = "";


    document.getElementById("mock-answer")
        .focus();

}


/* -----------------------------------------
   SUBMIT ANSWER
----------------------------------------- */

function submitMockAnswer() {

    const answer =
        document.getElementById("mock-answer")
            .value
            .trim();


    if (!answer) {

        showToast("Please enter an answer before continuing.");

        return;
    }


    mockAnswers.push({
        question: mockQuestions[currentMockQuestion],
        answer: answer
    });


    if (
        currentMockQuestion <
        mockQuestions.length - 1
    ) {

        currentMockQuestion++;

        displayMockQuestion();

    } else {

        finishMockInterview();

    }

}


/* -----------------------------------------
   FINISH INTERVIEW
----------------------------------------- */

function finishMockInterview() {

    document
        .getElementById("mock-session-modal")
        .classList.add("hidden");


    const result =
        evaluateMockInterview();


    document.getElementById("mock-final-score")
        .innerText =
        result.overall;


    document.getElementById("mock-accuracy-score")
        .innerText =
        result.accuracy + "%";


    document.getElementById("mock-communication-score")
        .innerText =
        result.communication + "%";


    document.getElementById("mock-completeness-score")
        .innerText =
        result.completeness + "%";


    document.getElementById("mock-result-title")
        .innerText =
        result.title;


    document.getElementById("mock-result-summary")
        .innerText =
        result.summary;


    document.getElementById("mock-strengths")
        .innerHTML =
        result.strengths
            .map(item => `<li>${item}</li>`)
            .join("");


    document.getElementById("mock-improvements")
        .innerHTML =
        result.improvements
            .map(item => `<li>${item}</li>`)
            .join("");


    document.getElementById("mock-next-steps")
        .innerText =
        result.nextSteps;


    document
        .getElementById("mock-results-modal")
        .classList.remove("hidden");


    updateGaugeVisual(
        Math.max(currentScore, result.overall)
    );


    showToast(
        `Interview completed! Your score: ${result.overall}/100`
    );

}


/* -----------------------------------------
   SIMPLE INTERVIEW EVALUATION
----------------------------------------- */

function evaluateMockInterview() {

    let totalLength = 0;
    let detailedAnswers = 0;


    mockAnswers.forEach(item => {

        totalLength += item.answer.length;

        if (
            item.answer.length >= 120
        ) {
            detailedAnswers++;
        }

    });


    const averageLength =
        mockAnswers.length > 0
            ? totalLength / mockAnswers.length
            : 0;


    let communication =
        averageLength >= 200 ? 90 :
        averageLength >= 120 ? 80 :
        averageLength >= 60 ? 68 :
        50;


    let completeness =
        mockAnswers.length > 0
            ? Math.round(
                (detailedAnswers / mockAnswers.length) * 100
              )
            : 0;


    let accuracy =
        selectedInterviewType === "hr"
            ? Math.min(95, communication + 5)
            : Math.min(95, communication);


    let overall =
        Math.round(
            (accuracy +
             communication +
             completeness) / 3
        );


    let title;
    let summary;


    if (overall >= 85) {

        title = "Strong Interview Performance";

        summary =
            "Your answers showed good structure and sufficient detail. Keep practicing to make your responses even more precise.";

    } else if (overall >= 70) {

        title = "Good Foundation";

        summary =
            "You have a solid foundation. Focus on providing more detailed reasoning and structured answers.";

    } else {

        title = "More Practice Recommended";

        summary =
            "Your responses can be improved with more structured explanations, examples and technical reasoning.";

    }


    return {

        overall,

        accuracy,

        communication,

        completeness,

        title,

        summary,

        strengths: [
            "You completed the full interview session.",
            "You attempted every question.",
            averageLength >= 120
                ? "Your answers contained useful supporting details."
                : "You kept your answers concise."
        ],

        improvements: [
            averageLength < 120
                ? "Try giving more detailed explanations."
                : "Focus on making long answers more structured.",
            selectedInterviewType === "dsa"
                ? "Mention time and space complexity when discussing algorithms."
                : "Use specific examples to support your answers.",
            "Practice answering under realistic interview time pressure."
        ],

        nextSteps:
            selectedInterviewType === "dsa"
                ? "Continue DSA practice and focus on explaining your approach before writing code."
                : "Complete another mock interview and compare your performance."
    };

}


/* -----------------------------------------
   EXIT INTERVIEW
----------------------------------------- */

function exitMockSession() {

    const shouldExit =
        confirm(
            "Are you sure you want to exit this interview? Your current answers will be lost."
        );


    if (!shouldExit) return;


    document
        .getElementById("mock-session-modal")
        .classList.add("hidden");


    mockQuestions = [];
    mockAnswers = [];
    currentMockQuestion = 0;

}


/* -----------------------------------------
   RESULTS
----------------------------------------- */

function closeMockResults() {

    document
        .getElementById("mock-results-modal")
        .classList.add("hidden");

}


function restartMockInterview() {

    closeMockResults();

    openMockInterviewModal();

}


/* -----------------------------------------
   HELPERS
----------------------------------------- */

function shuffleArray(array) {

    return [...array]
        .sort(() => Math.random() - 0.5);

}


function getInterviewTypeName(type) {

    const names = {

        technical: "Technical",

        hr: "HR / Behavioral",

        dsa: "DSA",

        company: "Company"

    };

    return names[type] || "Technical";

}


function getDifficultyName(level) {

    const names = {

        easy: "Beginner",

        medium: "Intermediate",

        hard: "Advanced"

    };

    return names[level] || "Intermediate";

}

let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById('toast-notification');
  toast.innerText = message;
  toast.classList.remove('hidden');
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.classList.add('hidden'), 200);
  }, 3200);
}

document.addEventListener('DOMContentLoaded', () => {
  updateGaugeVisual(0);
});

/* =========================================
   TOP TECH APPLICATIONS
========================================= */

function filterCompanies() {

    const searchInput = document.getElementById("company-search");
    const categoryFilter = document.getElementById("company-category-filter");
    const cards = document.querySelectorAll(".company-card");

    if (!searchInput || !categoryFilter) return;

    const searchValue = searchInput.value.toLowerCase().trim();
    const categoryValue = categoryFilter.value;

    cards.forEach(card => {

        const company = card.dataset.company.toLowerCase();
        const category = card.dataset.category;
        const searchData = card.dataset.search.toLowerCase();

        const matchesSearch =
            company.includes(searchValue) ||
            searchData.includes(searchValue);

        const matchesCategory =
            categoryValue === "All" ||
            category === categoryValue;

        if (matchesSearch && matchesCategory) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }

    });
}

/* =========================================
   COMPANY PREPARATION DATA
========================================= */

const COMPANY_PREP_DATA = {

    Google: {
        careers: "https://www.google.com/about/careers/applications/jobs/results",
        roles: "Software Engineer / AI-ML Engineer",
        difficulty: "Advanced",
        rounds: "Coding + Technical + Behavioral",

        skills: [
            "DSA",
            "Python",
            "Java",
            "Algorithms",
            "System Design",
            "DBMS",
            "Operating Systems"
        ],

        dsa: [
            "Arrays",
            "Strings",
            "Trees",
            "Graphs",
            "Dynamic Programming",
            "Binary Search",
            "Hashing"
        ],

        questions: [
            "Explain your approach to solving a graph problem.",
            "How would you optimize an algorithm from O(n²) to O(n log n)?",
            "Explain a technical project from your resume.",
            "How would you design a scalable system?",
            "Tell me about a difficult problem you solved."
        ],

        checklist: [
            "Revise DSA fundamentals",
            "Practice medium and hard DSA problems",
            "Revise DBMS and Operating Systems",
            "Prepare project explanations",
            "Practice behavioral questions"
        ]
    },


    Microsoft: {
        careers: "https://careers.microsoft.com/v2/global/en/home.html",
        roles: "Software Engineer / Cloud Engineer",
        difficulty: "Advanced",
        rounds: "Coding + Technical + Behavioral",

        skills: [
            "DSA",
            "C++",
            "Java",
            "Python",
            "OOP",
            "DBMS",
            "Azure"
        ],

        dsa: [
            "Arrays",
            "Linked Lists",
            "Trees",
            "Graphs",
            "Stacks & Queues",
            "Dynamic Programming",
            "Sorting"
        ],

        questions: [
            "Explain object-oriented programming with an example.",
            "How would you detect a cycle in a linked list?",
            "Explain the difference between process and thread.",
            "How would you design a scalable web application?",
            "Describe a challenging technical problem you solved."
        ],

        checklist: [
            "Practice DSA regularly",
            "Revise OOP concepts",
            "Practice coding in your strongest language",
            "Revise DBMS and OS",
            "Prepare project and HR answers"
        ]
    },


    Amazon: {
        careers: "https://www.amazon.jobs/en/job-category/software-development",
        roles: "Software Development Engineer",
        difficulty: "Advanced",
        rounds: "Online Assessment + Technical + Leadership",

        skills: [
            "DSA",
            "Java",
            "Python",
            "Algorithms",
            "OOP",
            "AWS",
            "Problem Solving"
        ],

        dsa: [
            "Arrays",
            "Strings",
            "Trees",
            "Graphs",
            "Heaps",
            "Dynamic Programming",
            "Sliding Window"
        ],

        questions: [
            "How would you solve the Two Sum problem efficiently?",
            "Explain a tree traversal and its complexity.",
            "How would you design a scalable service?",
            "Describe a situation where you solved a difficult problem.",
            "How do you handle a technical disagreement in a team?"
        ],

        checklist: [
            "Practice DSA problems",
            "Revise core CS concepts",
            "Practice coding under time limits",
            "Prepare project explanations",
            "Practice behavioral answers"
        ]
    },


    Infosys: {
        careers: "https://www.infosys.com/careers/apply.html",
        roles: "Systems Engineer / Software Engineer",
        difficulty: "Beginner–Intermediate",
        rounds: "Aptitude + Coding + Technical + HR",

        skills: [
            "Java",
            "Python",
            "SQL",
            "OOP",
            "DBMS",
            "Aptitude",
            "Communication"
        ],

        dsa: [
            "Arrays",
            "Strings",
            "Sorting",
            "Searching",
            "Linked Lists",
            "Stacks",
            "Queues"
        ],

        questions: [
            "What is OOP? Explain its main principles.",
            "What is normalization in DBMS?",
            "Write a program to check whether a number is prime.",
            "What is the difference between an array and a linked list?",
            "Tell me about your academic project."
        ],

        checklist: [
            "Practice aptitude questions",
            "Revise Java or Python basics",
            "Revise SQL queries",
            "Practice basic DSA",
            "Prepare HR questions"
        ]
    },


    TCS: {
        careers: "https://www.tcs.com/careers/india",
        roles: "Graduate Engineer / Software Engineer",
        difficulty: "Beginner–Intermediate",
        rounds: "Aptitude + Coding + Technical + HR",

        skills: [
            "Java",
            "Python",
            "SQL",
            "DSA",
            "OOP",
            "Aptitude",
            "Communication"
        ],

        dsa: [
            "Arrays",
            "Strings",
            "Searching",
            "Sorting",
            "Linked Lists",
            "Stacks",
            "Queues"
        ],

        questions: [
            "What is inheritance in Java?",
            "Explain the difference between SQL and NoSQL.",
            "Write a program to reverse a string.",
            "What is the difference between stack and queue?",
            "Explain your final-year or academic project."
        ],

        checklist: [
            "Practice aptitude",
            "Revise programming fundamentals",
            "Practice basic coding problems",
            "Revise SQL and DBMS",
            "Prepare HR questions"
        ]
    },


    NVIDIA: {
        careers: "https://jobs.nvidia.com/careers",
        roles: "AI Engineer / Software Engineer",
        difficulty: "Advanced",
        rounds: "Technical + Coding + System Design",

        skills: [
            "C++",
            "Python",
            "AI / ML",
            "CUDA",
            "DSA",
            "Computer Architecture",
            "Algorithms"
        ],

        dsa: [
            "Arrays",
            "Graphs",
            "Trees",
            "Dynamic Programming",
            "Hashing",
            "Graphs",
            "Bit Manipulation"
        ],

        questions: [
            "Explain the difference between CPU and GPU architecture.",
            "What is CUDA and why is it useful?",
            "Explain an ML project you have worked on.",
            "How would you optimize a computationally expensive algorithm?",
            "Explain the time and space complexity of your solution."
        ],

        checklist: [
            "Revise C++ fundamentals",
            "Strengthen DSA",
            "Revise AI/ML concepts",
            "Study computer architecture",
            "Prepare technical project explanations"
        ]
    }

};


/* =========================================
   OPEN COMPANY PREPARATION
========================================= */

function openCompanyPreparation(companyName) {

    const data = COMPANY_PREP_DATA[companyName];

    if (!data) {
        showToast("Company preparation data is not available yet.");
        return;
    }

    document.getElementById("prep-company-name").innerText = companyName;
    document.getElementById("prep-company-role").innerText = data.roles;

    document.getElementById("prep-roles").innerText = data.roles;
    document.getElementById("prep-difficulty").innerText = data.difficulty;
    document.getElementById("prep-rounds").innerText = data.rounds;


    /* Skills */

    const skillsContainer =
        document.getElementById("prep-skills");

    skillsContainer.innerHTML = "";

    data.skills.forEach(skill => {

        const tag = document.createElement("span");

        tag.className = "prep-tag";
        tag.innerText = skill;

        skillsContainer.appendChild(tag);

    });


    /* DSA Topics */

    const dsaContainer =
        document.getElementById("prep-dsa");

    dsaContainer.innerHTML = "";

    data.dsa.forEach(topic => {

        const tag = document.createElement("span");

        tag.className = "prep-tag";
        tag.innerText = topic;

        dsaContainer.appendChild(tag);

    });


    /* Questions */

    const questionsContainer =
        document.getElementById("prep-questions");

    questionsContainer.innerHTML = "";

    data.questions.forEach((question, index) => {

        const questionBox =
            document.createElement("div");

        questionBox.className = "prep-question";

        questionBox.innerHTML =
            `<strong>Q${index + 1}.</strong> ${question}`;

        questionsContainer.appendChild(questionBox);

    });


    /* Checklist */

    const checklistContainer =
        document.getElementById("prep-checklist");

    checklistContainer.innerHTML = "";

    data.checklist.forEach((item, index) => {

        const label =
            document.createElement("label");

        label.className = "prep-check-item";

        label.innerHTML = `
            <input type="checkbox" id="prep-check-${companyName}-${index}">
            <span>${item}</span>
        `;

        checklistContainer.appendChild(label);

    });

    const opportunityButton =
    document.getElementById("prep-opportunity-btn");

opportunityButton.onclick = function () {
    window.open(data.careers, "_blank");
};


    /* Open modal */

    document
        .getElementById("company-prep-modal")
        .classList.remove("hidden");
}


/* =========================================
   CLOSE COMPANY PREPARATION
========================================= */

function closeCompanyPreparation() {

    document
        .getElementById("company-prep-modal")
        .classList.add("hidden");

}