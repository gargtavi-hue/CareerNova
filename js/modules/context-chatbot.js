/* CareerNova - Context-Aware Help Assistant with Live Web Fallback */

import { resolveAnswer } from './chatbot.js';

export const CONTEXT_HELP = {
  dashboard: {
    title: 'Dashboard Help',
    intro: 'This page summarizes placement readiness, practice progress, and upcoming campus recruitment drives.',
    sections: {
      readiness: 'The Placement Readiness Index is an at-a-glance score. Completing DSA problems and skill diagnostics updates your readiness tier.',
      priority: 'Next Best Action suggests an immediate focus area. Start with the skill diagnostic to benchmark your algorithmic problem solving.',
      drives: 'Target Campus Drives lists scheduled corporate hiring drives. Choose View All Drives to explore company preparation guides.'
    }
  },
  dsa: {
    title: 'DSA Practice Help',
    intro: 'Practice curated data structures & algorithm problems and filter by topic, difficulty, or company.',
    sections: {
      progress: 'The progress card tracks solved questions and difficulty breakdown. Mark problems complete after solving to update your index.',
      filters: 'Use search for a problem title, topic, or company, or use the dropdown filters to narrow the list.',
      problems: 'Click any problem to view its statement, test cases, and hint. Explain your time and space complexity before coding.'
    }
  },
  hackathons: {
    title: 'Hackathons & Sprints Help',
    intro: 'Browse corporate challenges and filter opportunities by registration status and category.',
    sections: {
      filters: 'Select a status or category to filter active sprints. The count dynamically updates.',
      listings: 'Each card summarizes the challenge, sponsor, skills, rewards, and fast-track recruitment passes.'
    }
  },
  aichat: {
    title: 'Placement Coach Help',
    intro: 'Use the AI coach for mock interview practice, DSA explanations, system design architecture, and behavioral STAR feedback.',
    sections: {
      shortcuts: 'Prompt shortcuts provide immediate answers to frequent technical and behavioral placement questions.',
      messages: 'Ask questions or paste your drafted answers to receive structured, rubric-based feedback.'
    }
  },
  jobs: {
    title: 'Verified Job Postings Help',
    intro: 'Browse university graduate placement roles and filter postings by engineering role and employment type.',
    sections: {
      filters: 'Filter by Frontend, Backend, Fullstack, or Internships. Click the heart icon to save jobs.',
      listings: 'Review job requirements, skills, location, and click Apply Now to jump directly to official careers portals.'
    }
  },
  applications: {
    title: 'Company Preparation Help',
    intro: 'Explore company application guides, hiring preparation, required tech stacks, and interview checklists.',
    sections: {
      search: 'Search by company or role keyword, and filter by Product or Service companies.',
      companies: 'Click Prepare for Company to open detailed interview rounds, DSA focus topics, and preparation checklists.'
    }
  },
  college: {
    title: 'College TPO Portal Help',
    intro: 'The TPO portal summarizes campus placement statistics and student recruitment progression.',
    sections: {
      roster: 'Use the roster filters to narrow students by branch or placement status.',
      overview: 'Review batch placement percentage, average CTC packages, and highest offers.'
    }
  }
};

export function getHelpContext() {
  const activeView = document.querySelector('.page-view:not(.hidden)');
  const viewId = activeView?.id.replace('view-', '') || 'dashboard';
  const config = CONTEXT_HELP[viewId] || CONTEXT_HELP.dashboard;
  const activeElement = document.activeElement;
  const section = activeElement?.closest('[data-help-section]') || activeElement?.closest('.card, .dsa-progress-card, .dsa-controls, .dsa-problem-grid, .filter-bar, .jobs-list, .applications-layout, .chat-wrapper, table');
  const key = section?.dataset?.helpSection || inferHelpSection(section, viewId) || inferHelpSection(activeView, viewId);
  return { viewId, config, section, key };
}

export function inferHelpSection(element, viewId) {
  if (!element) return '';
  const text = (element.innerText || '').slice(0, 500).toLowerCase();
  const rules = {
    dashboard: [[/readiness|skill|index/, 'readiness'], [/priority|next best/, 'priority'], [/drive|scheduled/, 'drives']],
    dsa: [[/progress|solved/, 'progress'], [/filter|search/, 'filters'], [/problem|leetcode/, 'problems']],
    hackathons: [[/status|category|filter/, 'filters'], [/challenge|sponsor|register/, 'listings']],
    aichat: [[/shortcut|prompt/, 'shortcuts'], [/chat|coach|question/, 'messages']],
    jobs: [[/role|type|filter/, 'filters'], [/job|company|apply/, 'listings']],
    applications: [[/search|category/, 'search'], [/company|application|preparation/, 'companies']],
    college: [[/filter|branch|status|roster/, 'roster'], [/placement|readiness|overview/, 'overview']]
  };
  for (const [pattern, result] of (rules[viewId] || [])) {
    const reg = Array.isArray(pattern) ? pattern[0] : pattern;
    if (reg.test(text)) return Array.isArray(pattern) ? pattern[1] : result;
  }
  return '';
}

export function formatHelpReply(question) {
  const context = getHelpContext();
  const q = question.toLowerCase();
  if (/\b(tab|page|screen|where am i)\b/.test(q)) return context.config.intro;
  if (/\b(section|this area|this part)\b/.test(q) || context.key) {
    const answer = context.config.sections[context.key];
    if (answer) return answer;
  }
  const matches = Object.values(CONTEXT_HELP).flatMap(page => [page.intro, ...Object.values(page.sections)]).filter(answer => {
    const words = answer.toLowerCase().match(/[a-z]{4,}/g) || [];
    return words.some(word => q.includes(word));
  });
  if (matches.length) return matches[0];
  return null;
}

export function addContextHelpMessage(text, sender) {
  const messages = document.getElementById('context-help-messages');
  if (!messages) return;
  const bubble = document.createElement('div');
  bubble.className = `context-help-message ${sender}`;
  bubble.innerHTML = text;
  messages.appendChild(bubble);
  messages.scrollTop = messages.scrollHeight;
}

export function refreshContextHelp() {
  const { config, section, key } = getHelpContext();
  const titleEl = document.getElementById('context-help-title');
  if (titleEl) titleEl.textContent = config.title;
  const label = section ? (section.querySelector('h1,h2,h3,h4')?.innerText || key || 'Current section') : 'Current page';
  const locEl = document.getElementById('context-help-location');
  if (locEl) locEl.textContent = label;
}

export function initContextChatbot() {
  const panel = document.getElementById('context-help-panel');
  const toggle = document.getElementById('context-help-toggle');
  if (!panel || !toggle) return;

  toggle.addEventListener('click', () => {
    const opening = panel.classList.contains('hidden');
    panel.classList.toggle('hidden', !opening);
    toggle.setAttribute('aria-expanded', String(opening));
    if (opening) document.getElementById('context-help-input')?.focus();
    refreshContextHelp();
  });

  const closeBtn = document.getElementById('context-help-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      panel.classList.add('hidden');
      toggle.setAttribute('aria-expanded', 'false');
    });
  }

  const form = document.getElementById('context-help-form');
  if (form) {
    form.addEventListener('submit', async event => {
      event.preventDefault();
      const input = document.getElementById('context-help-input');
      if (!input) return;
      const question = input.value.trim();
      if (!question) return;

      addContextHelpMessage(question, 'user');
      input.value = '';
      input.disabled = true;

      const pageReply = formatHelpReply(question);
      if (pageReply) {
        addContextHelpMessage(pageReply, 'assistant');
        input.disabled = false;
        input.focus();
        refreshContextHelp();
      } else {
        // Query live web or AI
        const thinkingId = 'context-thinking-' + Date.now();
        const thinkingBubble = document.createElement('div');
        thinkingBubble.id = thinkingId;
        thinkingBubble.className = 'context-help-message assistant';
        thinkingBubble.innerHTML = '<em>Searching web & preparing answer...</em>';
        document.getElementById('context-help-messages')?.appendChild(thinkingBubble);

        try {
          const webReply = await resolveAnswer(question);
          document.getElementById(thinkingId)?.remove();
          addContextHelpMessage(webReply, 'assistant');
        } catch (err) {
          document.getElementById(thinkingId)?.remove();
          addContextHelpMessage(`Sorry, an error occurred: ${err.message}`, 'assistant');
        } finally {
          input.disabled = false;
          input.focus();
          refreshContextHelp();
        }
      }
    });
  }

  document.addEventListener('click', event => {
    if (event.target.closest('.nav-item')) setTimeout(refreshContextHelp, 0);
  });
  document.addEventListener('focusin', refreshContextHelp);
  refreshContextHelp();
}