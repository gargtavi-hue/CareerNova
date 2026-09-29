/* CareerNova - Interactive ChatGPT & Gemini AI Chatbot Engine */

import { showToast } from './toast.js';

const STORAGE_KEY = 'careernova_gemini_api_key';

// Multi-turn conversation state
export let conversationMessages = [];

export function getGeminiApiKey() {
  return localStorage.getItem(STORAGE_KEY) || '';
}

export function setGeminiApiKey(key) {
  if (key && key.trim()) {
    localStorage.setItem(STORAGE_KEY, key.trim());
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
  updateAiStatusBadge();
}

export function openAiSettingsModal() {
  const modal = document.getElementById('ai-settings-modal');
  const input = document.getElementById('gemini-api-key-input');
  const statusEl = document.getElementById('ai-key-status');

  const currentKey = getGeminiApiKey();
  if (input) input.value = currentKey;

  if (statusEl) {
    if (currentKey) {
      statusEl.innerHTML = `
        <span style="color: #15803d; font-weight: 700;">🟢 Gemini 2.5 Flash Connected</span>
        <p style="margin: 4px 0 0; color: #64748b; font-size: 11px;">Multi-turn interactive conversation active with Google's generative AI model.</p>
      `;
    } else {
      statusEl.innerHTML = `
        <span style="color: #0369a1; font-weight: 700;">🌐 Free Live Web Search Active</span>
        <p style="margin: 4px 0 0; color: #64748b; font-size: 11px;">The chatbot will search the live web (Wikipedia & DuckDuckGo) for real-time definitions, algorithms, and concepts.</p>
      `;
    }
  }

  if (modal) modal.classList.remove('hidden');
}

export function closeAiSettingsModal() {
  document.getElementById('ai-settings-modal')?.classList.add('hidden');
}

export function saveAiKey() {
  const input = document.getElementById('gemini-api-key-input');
  const key = input ? input.value.trim() : '';

  if (key) {
    setGeminiApiKey(key);
    showToast('Gemini AI connected! Multi-turn conversational mode active.');
  } else {
    setGeminiApiKey('');
    showToast('Key cleared. Switched to Free Live Web Search mode.');
  }

  closeAiSettingsModal();
}

export function clearAiKey() {
  setGeminiApiKey('');
  const input = document.getElementById('gemini-api-key-input');
  if (input) input.value = '';
  showToast('AI Key removed. Live Web Search is active.');
  closeAiSettingsModal();
}

export function updateAiStatusBadge() {
  const key = getGeminiApiKey();
  const indicator = document.getElementById('coach-mode-indicator');
  const badge = document.getElementById('coach-status-badge');

  if (indicator) {
    indicator.innerText = key ? 'Gemini 2.5 Flash • Multi-Turn Chat Active' : 'Nova AI • Live Web Search Active';
  }
  if (badge) {
    badge.innerText = key ? '✨ Gemini AI' : 'Web Online';
    badge.className = key ? 'badge badge-navy' : 'badge badge-green';
  }
}

/* ==========================================================================
   INTERACTIVE INPUT & CODE ACTIONS
   ========================================================================== */
export function handleChatInputInput(event) {
  const textarea = event.target;
  textarea.style.height = 'auto';
  textarea.style.height = Math.min(textarea.scrollHeight, 140) + 'px';
  const sendBtn = document.getElementById('chat-send-btn');
  if (sendBtn) {
    sendBtn.disabled = !textarea.value.trim();
  }
}

export function handleChatInputKeyDown(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendChatMessage();
  }
}

export function copyCode(btn) {
  const codeEl = btn.closest('.code-container')?.querySelector('code');
  if (codeEl) {
    const text = codeEl.innerText;
    navigator.clipboard.writeText(text).then(() => {
      btn.innerText = '✓ Copied!';
      setTimeout(() => btn.innerText = '📋 Copy', 2000);
    }).catch(() => {
      btn.innerText = '✓ Copied';
      setTimeout(() => btn.innerText = '📋 Copy', 2000);
    });
  }
}

// Attach to window so onclick="copyCode(this)" works anywhere
if (typeof window !== 'undefined') {
  window.copyCode = copyCode;
}

/* ==========================================================================
   CHAT SESSION MANAGEMENT (+ NEW CHAT)
   ========================================================================== */
export function resetChatSession() {
  conversationMessages = [];
  const chatBox = document.getElementById('chat-box');
  if (chatBox) {
    chatBox.innerHTML = `
      <div class="chat-empty-state" id="chat-empty-state">
        <div class="chat-welcome-sparkle">✨</div>
        <h2 class="chat-welcome-title">Where shall we begin today?</h2>
        <p class="chat-welcome-desc">Ask any question, write & debug code, solve algorithms, prepare for interviews, or explore live web knowledge.</p>

        <div class="chat-prompt-grid">
          <div class="chat-prompt-card" onclick="sendSuggestedChat('Implement a Trie (Prefix Tree) in Python with insert and search methods, including complexity analysis.')">
            <div class="chat-prompt-card-header">💻 Write Code & Algorithms</div>
            <div class="chat-prompt-card-desc">Implement a Trie with insert and search methods + Big-O analysis.</div>
          </div>

          <div class="chat-prompt-card" onclick="sendSuggestedChat('Explain the system design of a distributed Rate Limiter using Token Bucket and Redis.')">
            <div class="chat-prompt-card-header">🏗️ System Design Blueprint</div>
            <div class="chat-prompt-card-desc">Explore rate limiters with token buckets, API gateways, and Redis.</div>
          </div>

          <div class="chat-prompt-card" onclick="sendSuggestedChat('Give me a high-impact STAR framework response for: Tell me about a time you handled a difficult production bug.')">
            <div class="chat-prompt-card-header">🎤 STAR Behavioral Prep</div>
            <div class="chat-prompt-card-desc">Structure answers for handling tight deadlines and production bugs.</div>
          </div>

          <div class="chat-prompt-card" onclick="sendSuggestedChat('What are the core trade-offs between SQL and NoSQL databases for high-scale microservices?')">
            <div class="chat-prompt-card-header">🗄️ SQL vs NoSQL Trade-offs</div>
            <div class="chat-prompt-card-desc">Compare ACID relational databases vs horizontal NoSQL clusters.</div>
          </div>
        </div>
      </div>
    `;
  }
  const inputEl = document.getElementById('chat-input');
  if (inputEl) {
    inputEl.value = '';
    inputEl.style.height = 'auto';
    inputEl.focus();
  }
  showToast('Started a new chat session.');
}

/* ==========================================================================
   LIVE WEB SEARCH (WIKIPEDIA & DUCKDUCKGO)
   ========================================================================== */
export function cleanSearchQuery(query) {
  let s = (query || '').replace(/[?.,!]/g, '').trim();
  s = s.replace(/^(what is an|what is a|what is the|what are the|what are|what is|who is the|who was|who is|explain the|explain|tell me about|how does a|how does the|how does|how do|define)\s+/i, '');
  return s.trim() || query;
}

export async function searchLiveWeb(query) {
  try {
    const cleanQuery = cleanSearchQuery(query);
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(cleanQuery)}&utf8=&format=json&origin=*`;
    
    const res = await fetch(searchUrl, {
      headers: { 'Api-User-Agent': 'CareerNova/1.0 (Campus Placement Platform)' }
    });
    if (!res.ok) return null;
    
    const data = await res.json();
    if (data.query && data.query.search && data.query.search.length > 0) {
      let chosenHit = data.query.search[0];
      // If there's a computer science / computing / programming disambiguation in top 5, prefer it
      const csHit = data.query.search.slice(0, 5).find(h => 
        /\(computer science\)|\(computing\)|\(programming\)|\(software\)|\(data structure\)|\(algorithm\)/i.test(h.title)
      );
      if (csHit) {
        chosenHit = csHit;
      }

      const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(chosenHit.title)}`;
      const sumRes = await fetch(summaryUrl, {
        headers: { 'Api-User-Agent': 'CareerNova/1.0 (Campus Placement Platform)' }
      });
      if (sumRes.ok) {
        const sumData = await sumRes.json();
        return {
          title: sumData.title,
          description: sumData.description || 'Web Topic Overview',
          extract: sumData.extract,
          url: sumData.content_urls ? sumData.content_urls.desktop.page : `https://en.wikipedia.org/wiki/${encodeURIComponent(chosenHit.title)}`
        };
      }
    }
  } catch (err) {
    console.warn('Wikipedia web search error:', err);
  }

  // Fallback to DuckDuckGo Instant Answer API
  try {
    const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&origin=*`;
    const res = await fetch(ddgUrl);
    if (res.ok) {
      const data = await res.json();
      if (data.AbstractText) {
        return {
          title: data.Heading || query,
          description: 'Instant Answer',
          extract: data.AbstractText,
          url: data.AbstractURL || 'https://duckduckgo.com/?q=' + encodeURIComponent(query)
        };
      }
    }
  } catch (err) {
    console.warn('DuckDuckGo search error:', err);
  }

  return null;
}

/* ==========================================================================
   GOOGLE GEMINI API CALL (MULTI-TURN CHAT CONTEXT)
   ========================================================================== */
export async function queryGeminiApi(history, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  // Map conversation messages to Gemini format
  const contents = history.map(item => ({
    role: item.role === 'user' ? 'user' : 'model',
    parts: [{ text: item.content }]
  }));

  const payload = {
    contents,
    systemInstruction: {
      parts: [
        {
          text: `You are Nova, an intelligent conversational AI assistant like ChatGPT and Gemini.
You assist university students, software engineers, and professionals with:
1. Coding & Algorithms: Write production-grade, bug-free code with comments. State Big-O Time & Space complexity.
2. System Design: Outline high-level architecture, scalability trade-offs, caching, and database schemas.
3. Interview & Career Preparation: Behavioral STAR framework answers, resume enhancements, and mock interview critique.
4. General Knowledge: Explain concepts clearly, step-by-step, with real-world analogies.

Formatting: Always use clean GitHub-flavored Markdown. Wrap code in fenced code blocks with the language tag (e.g. \`\`\`python).`
        }
      ]
    }
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message = errorData.error?.message || `HTTP error ${res.status}`;
    throw new Error(message);
  }

  const result = await res.json();
  const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('No response text returned by Gemini API');
  return text;
}

/* ==========================================================================
   CONVERSATIONAL & CURATED KNOWLEDGE ENGINE
   ========================================================================== */
function getConversationalReply(text) {
  const q = text.trim().toLowerCase();

  // Greetings
  if (/^(hi|hello|hey|greetings|good (morning|afternoon|evening))\b/i.test(q)) {
    return `Hello! 👋 I'm **Nova**, your interactive AI assistant.

I can help you with:
- 💻 **Coding & Algorithms** (Python, JavaScript, Java, C++, DSA, LeetCode)
- 🏗️ **System Design** (Microservices, Caching, Databases, Scalability)
- 📝 **Interview Prep** (STAR behavioral answers, Resume bullets, HR questions)
- 🌐 **Live Web Information** (Searching definitions, tools, and technical concepts)

What would you like to work on or discuss today?`;
  }

  // Who are you / capabilities
  if (/who are you|what are you|what can you do|introduce yourself/i.test(q)) {
    return `I am **Nova AI**, an interactive conversational AI assistant designed for engineers and university candidates.

Like ChatGPT and Gemini, I can chat interactively, answer complex technical questions, write clean code with time and space complexity, and debug software.

*Tip:* You can also click **⚙️ AI Settings** to connect a free Google Gemini key for deep generative reasoning and multi-turn code generation!`;
  }

  // Thanks
  if (/^(thank you|thanks|thx|awesome|great|cool|perfect|appreciate it)\b/i.test(q)) {
    return `You're very welcome! 😊 Feel free to ask follow-up questions, request more code examples, or explore another topic!`;
  }

  // Humor
  if (/tell me a joke|say something funny/i.test(q)) {
    return `Why do programmers prefer dark mode?
Because light attracts bugs! 🐛😄

What problem can we solve together next?`;
  }

  return null;
}

function getCuratedPlacementResponse(text) {
  const q = text.toLowerCase();

  if (q.includes('two sum') || (q.includes('dsa') && q.includes('approach'))) {
    return `
### 🧩 Two Sum Problem — Optimal Approach

**1. Problem Statement:**
Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

**2. Complexity Trade-Offs:**
- **Brute Force:** Nested loops comparing every pair $\\rightarrow$ $O(n^2)$ time, $O(1)$ space.
- **Optimal (HashMap):** Store numbers in a hash map as you iterate $\\rightarrow$ $O(n)$ time, $O(n)$ space.

\`\`\`javascript
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}
\`\`\`

**Interview Tip:** Always clarify whether the input array is sorted (which enables $O(1)$ space Two-Pointer approach).
    `;
  }

  if (q.includes('sql') && q.includes('nosql')) {
    return `
### 🗄️ SQL vs NoSQL — System Design Comparison

| Dimension | SQL (Relational) | NoSQL (Non-Relational) |
| :--- | :--- | :--- |
| **Examples** | PostgreSQL, MySQL, SQLite | MongoDB, Redis, Cassandra |
| **Data Schema** | Rigid, normalized tables with schemas | Dynamic, flexible (Documents, Key-Value) |
| **Transactions** | Strict **ACID** guarantees | Eventual consistency (**BASE** properties) |
| **Scaling** | Vertical (scale-up with bigger VM) | Horizontal (scale-out with sharded nodes) |
| **Best For** | Financial ledgers, ERP, complex JOINs | Real-time analytics, user sessions, catalogs |

**Interview Tip:** Don't declare one "better". Contrast read-heavy vs write-heavy workloads and partition tolerance (CAP theorem).
    `;
  }

  if (q.includes('star') || (q.includes('deadline') && q.includes('behavioral'))) {
    return `
### 🎤 STAR Behavioral Framework: Handling Tight Deadlines

- **Situation:** Describe a high-stakes project facing an unforeseen deadline crunch or scope expansion.
- **Task:** Clearly outline the core deliverable and the impact of missing the release date.
- **Action (Spend 50% of time here):**
  1. *Prioritization:* Evaluated features with the team using the Eisenhower Matrix to de-scope non-critical items.
  2. *Resource Allocation:* Delegated parallel modules and automated regression testing.
  3. *Proactive Communication:* Sent daily stakeholder updates to manage expectations.
- **Result:** Delivered the release on time with zero P0 production incidents, followed by a post-launch retrospective.

**Interview Tip:** Interviewers look for how YOU think, prioritize, and communicate under pressure.
    `;
  }

  if (q.includes('rate limiter') && q.includes('system design')) {
    return `
### 🏗️ Rate Limiter — 5-Minute System Design Blueprint

**1. Core Algorithms:**
- **Token Bucket:** Best for bursty traffic; tokens refilled at fixed rate.
- **Leaky Bucket:** Constant outflow rate, smooths sudden spikes.
- **Sliding Window Counter:** Low memory footprint, 99% accuracy.

**2. High-Level Architecture:**
Place the rate limiter at the **API Gateway** layer backed by an in-memory **Redis** cluster using atomic \`INCR\` and \`EXPIRE\` operations.

\`\`\`python
# Conceptual Redis Token Bucket Check
def is_allowed(user_id, limit=100, window_sec=60):
    key = f"rate:{user_id}"
    current = redis_client.incr(key)
    if current == 1:
        redis_client.expire(key, window_sec)
    return current <= limit
\`\`\`

**3. HTTP Return Codes:** Return \`429 Too Many Requests\` with \`Retry-After\` headers.
    `;
  }

  if (q.includes('polymorphism') || (q.includes('oop') && (q.includes('pillar') || q.includes('principle')))) {
    return `
### 🧱 OOP Pillars & Polymorphism Explained

**The 4 Pillars of Object-Oriented Programming:**
1. **Encapsulation:** Bundling state and methods together while restricting direct access (private variables + public getters/setters).
2. **Abstraction:** Hiding complex implementation details and exposing only the essential interface.
3. **Inheritance:** Creating new classes based on existing ones to promote code reuse (\`Dog extends Animal\`).
4. **Polymorphism:** *"Many forms"* — ability of an object or method to take on multiple behaviors.

**Two Main Types of Polymorphism:**
- **Compile-Time (Static):** Method Overloading (same method name, different argument parameters).
- **Run-Time (Dynamic):** Method Overriding (subclass overrides parent class method using dynamic method dispatch).
    `;
  }

  if (q.includes('acid') || (q.includes('database') && q.includes('transaction'))) {
    return `
### 💾 ACID Properties in Databases

- **Atomicity (All-or-Nothing):** Every statement in a transaction succeeds, or the entire transaction is rolled back.
- **Consistency:** The database transitions only from one valid state to another, respecting all constraints and foreign keys.
- **Isolation:** Concurrent transactions execute without interfering with one another (Isolation levels: *Read Uncommitted, Read Committed, Repeatable Read, Serializable*).
- **Durability:** Once committed, updates survive server crashes and power outages (persisted to Write-Ahead Log on disk).
    `;
  }

  if (q.includes('cap theorem')) {
    return `
### 🌐 CAP Theorem (Brewer's Theorem)

In any distributed data store, you can only guarantee at most **two out of three** properties simultaneously:

1. **Consistency (C):** Every read receives the most recent write or an error.
2. **Availability (A):** Every non-failing node returns a non-error response for every request.
3. **Partition Tolerance (P):** The system continues to operate despite network splits or dropped packets.

**Crucial Interview Insight:** Because network partitions (P) are physically unavoidable across cloud datacenters, the true trade-off is always between **CP** (e.g. MongoDB, Google Spanner, Redis) and **AP** (e.g. Cassandra, DynamoDB, CouchDB).
    `;
  }

  return null;
}

/* ==========================================================================
   UNIFIED ANSWER RESOLVER (MULTI-TURN AWARE)
   ========================================================================== */
export async function resolveAnswer(userQuery, history = []) {
  const apiKey = getGeminiApiKey();

  // 1. If Gemini API Key is available, use Gemini Generative AI with multi-turn memory
  if (apiKey) {
    try {
      const aiReply = await queryGeminiApi(history, apiKey);
      return `
        <div style="display:inline-flex; align-items:center; gap:5px; font-size:10px; color:#2563eb; background:#eff6ff; border:1px solid #bfdbfe; padding:2px 8px; border-radius:12px; margin-bottom:10px; font-weight:700;">
          ✨ Powered by Gemini 2.5 Flash
        </div>
        <div>${formatMarkdown(aiReply)}</div>
      `;
    } catch (err) {
      console.error('Gemini API failed:', err);
      showToast('Gemini API error. Falling back to Live Web Search.');
    }
  }

  // 2. Conversational greetings & intent
  const conversational = getConversationalReply(userQuery);
  if (conversational) {
    return `
      <div style="display:inline-flex; align-items:center; gap:5px; font-size:10px; color:#7c3aed; background:#f5f3ff; border:1px solid #ddd6fe; padding:2px 8px; border-radius:12px; margin-bottom:10px; font-weight:700;">
        💬 Nova Assistant
      </div>
      <div>${formatMarkdown(conversational)}</div>
    `;
  }

  // 3. Curated Placement Coaching Knowledge Base
  const curated = getCuratedPlacementResponse(userQuery);
  if (curated) {
    return `
      <div style="display:inline-flex; align-items:center; gap:5px; font-size:10px; color:#15803d; background:#f0fdf4; border:1px solid #bbf7d0; padding:2px 8px; border-radius:12px; margin-bottom:10px; font-weight:700;">
        🎯 Placement Blueprint
      </div>
      <div>${formatMarkdown(curated)}</div>
    `;
  }

  // 4. Live Web Search (Wikipedia & DuckDuckGo)
  const webResult = await searchLiveWeb(userQuery);
  if (webResult && webResult.extract) {
    return `
      <div style="display:inline-flex; align-items:center; gap:5px; font-size:10px; color:#0369a1; background:#f0f9ff; border:1px solid #bae6fd; padding:2px 8px; border-radius:12px; margin-bottom:10px; font-weight:700;">
        🌐 Live Web Search
      </div>
      <h3 style="margin: 0 0 4px; font-size: 15.5px; color: var(--text-main); font-weight: 700;">${webResult.title}</h3>
      <p style="margin: 0 0 10px; font-size: 11.5px; color: var(--text-muted); font-style: italic;">${webResult.description}</p>
      <div style="line-height: 1.65; color: var(--text-body); margin-bottom: 12px; font-size: 13.5px;">${webResult.extract}</div>
      <div style="padding-top: 10px; border-top: 1px solid var(--border-color); font-size: 11.5px;">
        🔗 <a href="${webResult.url}" target="_blank" style="color: var(--primary-accent); font-weight: 600; text-decoration: underline;">Read complete article on Wikipedia ↗</a>
      </div>
    `;
  }

  // 5. Friendly Fallback with Gemini Key prompt
  return `
    <div style="display:inline-flex; align-items:center; gap:5px; font-size:10px; color:#b45309; background:#fffbeb; border:1px solid #fef08a; padding:2px 8px; border-radius:12px; margin-bottom:10px; font-weight:700;">
      💡 Search Insight
    </div>
    <p>I searched the web for <strong>"${escapeHtml(userQuery)}"</strong>, but couldn't find a direct summary page.</p>
    <div style="margin-top: 12px; padding: 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 12px; line-height: 1.6;">
      <strong>Want answers to literally ANY question?</strong>
      <p style="margin: 4px 0 10px; color: #64748b;">Connect your free Google Gemini API key to allow Nova to write code, debug complex errors, explain architectures, and hold multi-turn conversations.</p>
      <button class="chat-btn-pill primary" style="font-size: 11px; padding: 6px 14px;" onclick="openAiSettingsModal()">
        ⚙️ Connect Free Gemini Key
      </button>
    </div>
  `;
}

/* ==========================================================================
   CHAT UI LOGIC (SEND MESSAGE & APPEND BUBBLES)
   ========================================================================== */
export async function sendChatMessage(promptOverride) {
  const inputEl = document.getElementById('chat-input');
  const text = (promptOverride || (inputEl ? inputEl.value : '')).trim();
  if (!text) return;

  const chatBox = document.getElementById('chat-box');
  const emptyState = document.getElementById('chat-empty-state');
  if (emptyState) emptyState.remove();

  // Append User Row
  appendUserMessage(text);

  // Clear input
  if (inputEl) {
    inputEl.value = '';
    inputEl.style.height = 'auto';
    inputEl.disabled = true;
  }

  // Add to conversation history
  conversationMessages.push({ role: 'user', content: text });

  // Show Typing Indicator
  const thinkingId = 'thinking-' + Date.now();
  appendThinkingRow(thinkingId);

  try {
    const replyHtml = await resolveAnswer(text, conversationMessages);
    document.getElementById(thinkingId)?.remove();

    appendBotMessage(replyHtml);
    conversationMessages.push({ role: 'assistant', content: replyHtml });
  } catch (err) {
    document.getElementById(thinkingId)?.remove();
    appendBotMessage(`<p style="color:#dc2626;">Sorry, an error occurred while processing: ${escapeHtml(err.message)}</p>`);
  } finally {
    if (inputEl) {
      inputEl.disabled = false;
      inputEl.focus();
    }
  }
}

export function sendSuggestedChat(promptText) {
  const inputEl = document.getElementById('chat-input');
  if (inputEl) {
    inputEl.value = promptText;
  }
  sendChatMessage(promptText);
}

function appendUserMessage(text) {
  const container = document.getElementById('chat-box');
  if (!container) return;

  const row = document.createElement('div');
  row.className = 'chat-row user';
  row.innerHTML = `
    <div class="chat-bubble user">${escapeHtml(text)}</div>
    <div class="chat-avatar user-avatar">👤</div>
  `;
  container.appendChild(row);
  container.scrollTop = container.scrollHeight;
}

function appendThinkingRow(id) {
  const container = document.getElementById('chat-box');
  if (!container) return;

  const row = document.createElement('div');
  row.id = id;
  row.className = 'chat-row bot';
  row.innerHTML = `
    <div class="chat-avatar bot-avatar">✨</div>
    <div class="chat-bubble bot">
      <div class="typing-indicator">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    </div>
  `;
  container.appendChild(row);
  container.scrollTop = container.scrollHeight;
}

function appendBotMessage(htmlContent) {
  const container = document.getElementById('chat-box');
  if (!container) return;

  const row = document.createElement('div');
  row.className = 'chat-row bot';
  row.innerHTML = `
    <div class="chat-avatar bot-avatar">✨</div>
    <div class="chat-bubble bot">${htmlContent}</div>
  `;
  container.appendChild(row);
  container.scrollTop = container.scrollHeight;
}

/* ==========================================================================
   MARKDOWN FORMATTER WITH SYNTAX HIGHLIGHTED CODE & COPY BUTTON
   ========================================================================== */
export function formatMarkdown(text) {
  if (!text) return '';
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
      const language = (lang || 'code').toUpperCase();
      return `
        <div class="code-container">
          <div class="code-header">
            <span class="code-lang">${language}</span>
            <button class="code-copy-btn" onclick="copyCode(this)">📋 Copy</button>
          </div>
          <pre><code class="language-${lang || 'text'}">${code.trim()}</code></pre>
        </div>
      `;
    })
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/^### (.*$)/gim, '<h4>$1</h4>')
    .replace(/^## (.*$)/gim, '<h3>$1</h3>')
    .replace(/^# (.*$)/gim, '<h2>$1</h2>')
    .replace(/^\s*[-*]\s+(.*$)/gim, '<li>$1</li>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');

  html = html.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>');
  return html;
}

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}