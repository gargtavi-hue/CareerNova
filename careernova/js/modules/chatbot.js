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

