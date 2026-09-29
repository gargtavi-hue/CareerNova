/* CareerNova - AI Placement Coach & Chat Simulator */

export function sendChatMessage() {
  const inputEl = document.getElementById('chat-input');
  if (!inputEl) return;

  const text = inputEl.value.trim();
  if (!text) return;

  const chatBox = document.getElementById('chat-box');
  const placeholder = chatBox?.querySelector('div[style*="text-align: center"]');
  if (placeholder) {
    placeholder.remove();
  }

  // Append student's message
  appendChatBubble(text, 'user');
  inputEl.value = '';
  inputEl.disabled = true;

  // Thinking indicator
  const thinkingId = 'thinking-' + Date.now();
  const thinkingBubble = document.createElement('div');
  thinkingBubble.id = thinkingId;
  thinkingBubble.className = 'chat-bubble bot';
  thinkingBubble.innerText = 'Nova is thinking...';
  chatBox.appendChild(thinkingBubble);
  chatBox.scrollTop = chatBox.scrollHeight;

  setTimeout(() => {
    const thinking = document.getElementById(thinkingId);
    if (thinking) thinking.remove();

    const reply = generateCoachResponse(text);
    appendChatBubble(reply, 'bot');

    inputEl.disabled = false;
    inputEl.focus();
  }, 600);
}

export function sendSuggestedChat(promptText) {
  const inputEl = document.getElementById('chat-input');
  if (inputEl) {
    inputEl.value = promptText;
    sendChatMessage();
  }
}

export function appendChatBubble(msg, sender) {
  const container = document.getElementById('chat-box');
  if (!container) return;

  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${sender}`;
  bubble.innerHTML = msg;
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
}

export function generateCoachResponse(text) {
  const q = text.toLowerCase();

  /* DSA */
  if (
    q.includes('two sum') ||
    q.includes('dsa') ||
    q.includes('algorithm') ||
    q.includes('data structure') ||
    q.includes('leetcode') ||
    q.includes('time complexity')
  ) {
    return `
<b>🧩 DSA Preparation</b><br><br>
Here's how I'd approach this in an interview:<br><br>
<b>1. Understand the problem</b><br>Clearly identify the input, output and constraints.<br><br>
<b>2. Start with the simple approach</b><br>Explain the brute-force solution first.<br><br>
<b>3. Optimize it</b><br>Look for a suitable data structure such as a HashMap, Stack, Queue or Heap.<br><br>
<b>4. Explain complexity</b><br>Always mention both time and space complexity.<br><br>
<b>5. Test edge cases</b><br>Consider empty input, duplicates, minimum/maximum values and unusual cases.<br><br>
<b>Interview tip:</b><br>Don't immediately start coding. Explain your approach first, then code.
    `;
  }

  /* SQL / DATABASE */
  if (
    q.includes('sql') ||
    q.includes('nosql') ||
    q.includes('database') ||
    q.includes('dbms')
  ) {
    return `
<b>🗄️ Database Interview Prep</b><br><br>
When comparing SQL and NoSQL, structure your answer around:<br><br>
<b>SQL</b><br>• Structured relational data<br>• Schema-based design<br>• Strong relational integrity (ACID)<br>• Useful when relationships and transactions are important<br><br>
<b>NoSQL</b><br>• Flexible document/key-value models<br>• Useful for large-scale distributed systems<br>• High horizontal scalability<br><br>
<b>Interview tip:</b><br>Don't simply say that one is "better". Explain which choice fits the requirements and why.
    `;
  }

  /* SYSTEM DESIGN */
  if (
    q.includes('system design') ||
    q.includes('rate limiter') ||
    q.includes('scalability') ||
    q.includes('distributed')
  ) {
    return `
<b>🏗️ System Design Checklist</b><br><br>
For a system-design interview, follow this order:<br><br>
<b>1. Requirements:</b> Clarify functional and non-functional requirements.<br>
<b>2. Scale:</b> Estimate users, throughput (QPS), and storage demands.<br>
<b>3. High-Level Architecture:</b> Explain load balancers, web tiers, and services.<br>
<b>4. Storage & Caching:</b> Choose SQL or NoSQL and place Redis/Memcached.<br>
<b>5. Reliability & Scalability:</b> Address replication, partitioning, and failovers.<br><br>
<b>Interview tip:</b><br>Keep checking whether your design actually satisfies the business requirements!
    `;
  }

  /* HR / STAR */
  if (
    q.includes('star') ||
    q.includes('hr') ||
    q.includes('behavioral') ||
    q.includes('strength') ||
    q.includes('weakness') ||
    q.includes('deadline')
  ) {
    return `
<b>🎤 HR / Behavioral Preparation</b><br><br>
For behavioral questions, use the <b>STAR</b> method:<br><br>
<b>S — Situation:</b> Give the relevant context briefly.<br>
<b>T — Task:</b> Explain what your objective or role was.<br>
<b>A — Action:</b> Explain exactly what YOU did with specific technical or teamwork steps.<br>
<b>R — Result:</b> Quantify the outcome and what you learned.<br><br>
<b>Practice tip:</b><br>Prepare 3-4 versatile stories (one technical challenge, one team conflict, one failure, one leadership moment).
    `;
  }

  /* PROJECT / RESUME */
  if (
    q.includes('project') ||
    q.includes('resume') ||
    q.includes('portfolio') ||
    q.includes('cv')
  ) {
    return `
<b>📁 Project / Resume Preparation</b><br><br>
When explaining a project, use this 5-point structure:<br><br>
1. <b>The Problem:</b> What user pain point does it solve?<br>
2. <b>Tech Stack:</b> Why did you pick your chosen framework and database?<br>
3. <b>Your Role:</b> What architecture and modules did you personally code?<br>
4. <b>Toughest Bug/Challenge:</b> What broke and how did you debug it?<br>
5. <b>Impact & Metrics:</b> Speed, accuracy, or user feedback.<br><br>
<b>Interview tip:</b><br>Be ready to explain any line of code or technology listed on your resume.
    `;
  }

  /* JAVA */
  if (
    q.includes('java') ||
    q.includes('oops') ||
    q.includes('inheritance') ||
    q.includes('polymorphism')
  ) {
    return `
<b>☕ Java & OOP Interview Prep</b><br><br>
Core areas frequently tested:<br>
• 4 Pillars: Encapsulation, Abstraction, Inheritance, Polymorphism<br>
• Overloading (compile-time) vs Overriding (runtime)<br>
• Interface vs Abstract Class (default methods in Java 8+)<br>
• JVM Memory: Heap vs Stack, Garbage Collection basics<br>
• Collections Framework: HashMap collision handling & ArrayList vs LinkedList<br><br>
<b>Interview tip:</b><br>Pair every theoretical concept with a concrete code snippet or real-world example.
    `;
  }

  /* OS */
  if (
    q.includes('operating system') ||
    q.includes('os') ||
    q.includes('deadlock') ||
    q.includes('process') ||
    q.includes('thread')
  ) {
    return `
<b>💻 Operating Systems Prep</b><br><br>
Important high-frequency interview topics:<br>
• <b>Process vs Thread:</b> Isolated memory vs shared address space<br>
• <b>CPU Scheduling:</b> Round Robin, Priority, Multi-level queues<br>
• <b>Deadlock:</b> Mutual exclusion, Hold & wait, No preemption, Circular wait<br>
• <b>Memory Management:</b> Virtual memory, Paging, Page faults, LRU cache<br><br>
<b>Interview tip:</b><br>Practice drawing Coffman condition diagrams for deadlock explanations.
    `;
  }

  /* GREETING */
  if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
    return `
<b>👋 Hi! I'm Nova, your CareerNova Placement Coach.</b><br><br>
I can guide you on:<br>
• <b>DSA & Algorithms</b> (approaches & complexity)<br>
• <b>Technical Concepts</b> (Java, DBMS, OS, Networks)<br>
• <b>System Design</b> (architectures & checklists)<br>
• <b>HR & Behavioral</b> (STAR formula)<br>
• <b>Resume & Projects</b> (presentation & question defense)<br><br>
What topic would you like to prepare today?
    `;
  }

  /* GENERAL FALLBACK */
  return `
<b>🎯 Placement Coaching Perspective</b><br><br>
To give you the most tailored practice, tell me which area you're targeting:<br><br>
• <b>DSA:</b> Specific algorithms, complexities, or LeetCode questions<br>
• <b>Technical:</b> Java, DBMS/SQL, Operating Systems, or Networking<br>
• <b>System Design:</b> High-level architectures and trade-offs<br>
• <b>HR / Behavioral:</b> STAR responses for leadership, conflict, or deadlines<br><br>
Feel free to ask a specific interview question or click one of the quick shortcuts below!
  `;
}
