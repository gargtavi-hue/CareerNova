const CONTEXT_HELP = {
  dashboard: {
    title: 'Dashboard help',
    intro: 'This page summarizes placement readiness, practice progress, and upcoming campus drives.',
    sections: {
      readiness: 'The Placement Readiness Index is an at-a-glance score. In this demo, completing DSA problems updates the score; the skill bars summarize your preparation areas.',
      priority: 'Next Best Action suggests a focused next step. Start with the skill diagnostic, then use the linked preparation and application areas.',
      drives: 'Target Campus Drives lists scheduled companies and dates. Choose View All Drives to browse the company application area.'
    }
  },
  dsa: {
    title: 'DSA Practice help',
    intro: 'Practice curated data-structure and algorithm problems and filter by topic, difficulty, or company.',
    sections: {
      progress: 'The progress card tracks solved questions and difficulty counts. Mark problems complete after solving them to update progress.',
      filters: 'Use search for a problem, topic, or company, then combine the topic, difficulty, and company filters to narrow the list.',
      problems: 'Open a problem to read its prompt, example, and hint. Explain your approach and time and space complexity before coding.'
    }
  },
  hackathons: { title: 'Hackathons help', intro: 'Browse corporate challenges and filter opportunities by registration status and category.', sections: { filters: 'Select a status or category to narrow the visible hackathons. The count updates with the results.', listings: 'Each card summarizes the challenge, sponsor, skills, rewards, and registration action. Check the organizer’s current details before applying.' } },
  aichat: { title: 'Placement Coach help', intro: 'Use the coach for interview practice, DSA explanations, system design, and behavioral-answer feedback.', sections: { shortcuts: 'Prompt shortcuts start a sample question. You can edit the prompt or type your own question in the box.', messages: 'Describe the exact concept or paste your draft answer for targeted feedback. The current coach uses built-in sample responses.' } },
  jobs: { title: 'Jobs help', intro: 'Browse placement roles and narrow results by role type and employment type.', sections: { filters: 'Choose a role and job type to filter postings. Use the save icon to mark a role for later.', listings: 'Review the company, location, technologies, and role details, then use Apply Now to visit the listed employer page.' } },
  applications: { title: 'Company applications help', intro: 'Explore company application guides, hiring preparation, and role information.', sections: { search: 'Search by company or preparation keyword and use the category filter to find relevant organizations.', companies: 'Open a company preparation guide to review roles, skills, interview rounds, questions, and a checklist.' } },
  college: { title: 'College TPO help', intro: 'The TPO portal summarizes campus placement activity and student readiness.', sections: { roster: 'Use the roster filters to narrow students by branch or placement status. The count reflects visible rows.', overview: 'Placement statistics and readiness indicators help officers identify cohorts that may need support.' } }
};

function getHelpContext() {
  const activeView = document.querySelector('.page-view:not(.hidden)');
  const viewId = activeView?.id.replace('view-', '') || 'dashboard';
  const config = CONTEXT_HELP[viewId] || CONTEXT_HELP.dashboard;
  const activeElement = document.activeElement;
  const section = activeElement?.closest('[data-help-section]') || activeElement?.closest('.card, .dsa-progress-card, .dsa-controls, .dsa-problem-grid, .filter-bar, .jobs-list, .applications-layout, .chat-wrapper, table');
  const key = section?.dataset.helpSection || inferHelpSection(section, viewId) || inferHelpSection(activeView, viewId);
  return { viewId, config, section, key };
}

function inferHelpSection(element, viewId) {
  if (!element) return '';
  const text = (element.innerText || '').slice(0, 500).toLowerCase();
  const rules = {
    dashboard: [[/readiness|skill|index/, 'readiness'], [/priority|next best/, 'priority'], [/drive|scheduled/, 'drives']],
    dsa: [[/progress|solved/, 'progress'], [/filter|search/, 'filters'], [/problem|leetcode/, 'problems']],
    hackathons: [[/status|category|filter/, 'filters'], [/challenge|sponsor|register/, 'listings']],
    aichat: [[/shortcut|prompt/, 'shortcuts'], [[/chat|coach|question/], 'messages']],
    jobs: [[/role|type|filter/, 'filters'], [[/job|company|apply/], 'listings']],
    applications: [[/search|category/, 'search'], [[/company|application|preparation/], 'companies']],
    college: [[/filter|branch|status|roster/, 'roster'], [[/placement|readiness|overview/], 'overview']]
  };
  for (const [pattern, result] of (rules[viewId] || [])) if ((Array.isArray(pattern) ? pattern[0] : pattern).test(text)) return Array.isArray(pattern) ? pattern[1] : result;
  return '';
}

function formatHelpReply(question) {
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
  return `${context.config.intro} Ask me about a specific control or section and I’ll explain how to use it.`;
}

function addContextHelpMessage(text, sender) {
  const messages = document.getElementById('context-help-messages');
  const bubble = document.createElement('p');
  bubble.className = `context-help-message ${sender}`;
  bubble.textContent = text;
  messages.appendChild(bubble);
  messages.scrollTop = messages.scrollHeight;
}

function refreshContextHelp() {
  const { config, section, key } = getHelpContext();
  document.getElementById('context-help-title').textContent = config.title;
  const label = section ? (section.querySelector('h1,h2,h3,h4')?.innerText || key || 'Current section') : 'Current page';
  document.getElementById('context-help-location').textContent = label;
}

document.addEventListener('DOMContentLoaded', () => {
  const panel = document.getElementById('context-help-panel');
  const toggle = document.getElementById('context-help-toggle');
  toggle.addEventListener('click', () => {
    const opening = panel.classList.contains('hidden');
    panel.classList.toggle('hidden', !opening);
    toggle.setAttribute('aria-expanded', String(opening));
    if (opening) document.getElementById('context-help-input').focus();
    refreshContextHelp();
  });
  document.getElementById('context-help-close').addEventListener('click', () => {
    panel.classList.add('hidden');
    toggle.setAttribute('aria-expanded', 'false');
  });
  document.getElementById('context-help-form').addEventListener('submit', event => {
    event.preventDefault();
    const input = document.getElementById('context-help-input');
    const question = input.value.trim();
    if (!question) return;
    addContextHelpMessage(question, 'user');
    input.value = '';
    addContextHelpMessage(formatHelpReply(question), 'assistant');
    refreshContextHelp();
  });
  document.addEventListener('click', event => {
    if (event.target.closest('.nav-item')) setTimeout(refreshContextHelp, 0);
  });
  document.addEventListener('focusin', refreshContextHelp);
  refreshContextHelp();
});
