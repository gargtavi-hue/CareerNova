// careernova/js/modules/global-search.js
// Smart search router across Companies, Jobs, DSA, and Hackathons.

export class GlobalSearchEngine {
  constructor() {
    // Database containing multi-category items with deep routing metadata
    this.database = {
      companies: [
        { name: "Google Placement Roadmap", tag: "Google", desc: "4 Rounds • DSA & System Design" },
        { name: "Microsoft Technical Rounds", tag: "Microsoft", desc: "3 Rounds • Cloud & Algorithms" },
        { name: "Amazon Preparation", tag: "Amazon", desc: "4 Rounds • Leadership Principles & DSA" },
        { name: "NVIDIA Systems Track", tag: "NVIDIA", desc: "3 Rounds • C++ & Concurrency" },
        { name: "Infosys Specialist Programmer", tag: "Infosys", desc: "2 Rounds • Speed Coding" },
        { name: "TCS Digital Assessment", tag: "TCS", desc: "2 Rounds • Aptitude & CS Core" }
      ],
      jobs: [
        { name: "Amazon Software Engineer", tag: "Amazon", badge: "New Grad", role: "Backend" },
        { name: "Google Frontend Developer", tag: "Google", badge: "Verified", role: "Frontend" },
        { name: "Microsoft Cloud Engineer", tag: "Microsoft", badge: "Full-Time", role: "Fullstack" },
        { name: "Stripe Full-Stack Engineer", tag: "Stripe", badge: "Remote", role: "Fullstack" },
        { name: "SDE-1 Summer Internship", tag: "General", badge: "Internship", role: "Internships" }
      ],
      dsa: [
        { name: "Two Sum", tag: "Array", difficulty: "Easy", id: 1 },
        { name: "Valid Parentheses", tag: "Stack", difficulty: "Easy", id: 2 },
        { name: "Merge Two Sorted Lists", tag: "Linked List", difficulty: "Easy", id: 3 },
        { name: "Best Time to Buy & Sell Stock", tag: "Array", difficulty: "Easy", id: 4 },
        { name: "Longest Substring Without Repeating", tag: "String", difficulty: "Medium", id: 5 },
        { name: "3Sum", tag: "Two Pointers", difficulty: "Medium", id: 6 },
        { name: "Binary Tree Level Order Traversal", tag: "Tree", difficulty: "Medium", id: 7 },
        { name: "Course Schedule", tag: "Graph", difficulty: "Medium", id: 8 },
        { name: "LRU Cache", tag: "Design", difficulty: "Medium", id: 9 },
        { name: "Trapping Rain Water", tag: "Dynamic Programming", difficulty: "Hard", id: 10 }
      ],
      hackathons: [
        { name: "Autonomous AI Systems Sprint", tag: "AI", prize: "$25,000" },
        { name: "Distributed Systems Sprint 2026", tag: "Backend", prize: "$15,000" },
        { name: "CyberSecurity Defense League", tag: "Security", prize: "$10,000" }
      ]
    };
  }

  // Filter items across Companies, Jobs, DSA, and Hackathons
  search(query) {
    const term = (query || '').trim().toLowerCase();

    if (!term) {
      return { companies: [], jobs: [], dsa: [], hackathons: [] };
    }

    const isCompanyIntent = /company|companies|drive|drives|placement|roadmap/i.test(term);
    const isJobIntent = /job|jobs|intern|internship|hiring|career|role/i.test(term);
    const isDsaIntent = /dsa|problem|algo|algorithm|leetcode|sheet|data structure/i.test(term);
    const isHackathonIntent = /hackathon|sprint|challenge|prize|event/i.test(term);

    return {
      companies: this.database.companies.filter(
        c => isCompanyIntent || c.name.toLowerCase().includes(term) || c.tag.toLowerCase().includes(term)
      ),
      jobs: this.database.jobs.filter(
        j => isJobIntent || j.name.toLowerCase().includes(term) || j.tag.toLowerCase().includes(term) || (j.role && j.role.toLowerCase().includes(term))
      ),
      dsa: this.database.dsa.filter(
        d => isDsaIntent || d.name.toLowerCase().includes(term) || d.tag.toLowerCase().includes(term) || (d.difficulty && d.difficulty.toLowerCase().includes(term))
      ),
      hackathons: this.database.hackathons.filter(
        h => isHackathonIntent || h.name.toLowerCase().includes(term) || h.tag.toLowerCase().includes(term)
      )
    };
  }

  // Render formatted HTML search results dropdown
  renderResults(results, resultsContainerElement) {
    if (!resultsContainerElement) return;

    const totalResults =
      results.companies.length + results.jobs.length + results.dsa.length + results.hackathons.length;

    if (totalResults === 0) {
      resultsContainerElement.innerHTML = `
        <div class="search-results-card">
          <div class="search-empty">No results found matching your search.</div>
        </div>
      `;
      resultsContainerElement.classList.remove('hidden');
      return;
    }

    let html = `<div class="search-results-card">`;

    // 1. Companies
    if (results.companies.length > 0) {
      html += `
        <div class="search-category">
          <h4>🏢 Target Companies</h4>
          <ul>
            ${results.companies
              .map(
                c => `
              <li onclick="executeSearchRoute('company', '${c.tag}', '${escape(c.name)}')">
                <span>&rarr; <strong>${c.name}</strong></span>
                <span class="search-item-badge">${c.tag}</span>
              </li>`
              )
              .join("")}
          </ul>
        </div>`;
    }

    // 2. DSA Problems
    if (results.dsa.length > 0) {
      html += `
        <div class="search-category">
          <h4>🧩 DSA Practice Problems</h4>
          <ul>
            ${results.dsa
              .map(
                d => `
              <li onclick="executeSearchRoute('dsa', '${d.id || d.name}', '${escape(d.name)}')">
                <span>&rarr; <strong>${d.name}</strong> (${d.tag})</span>
                <span class="search-item-badge">${d.difficulty}</span>
              </li>`
              )
              .join("")}
          </ul>
        </div>`;
    }

    // 3. Jobs
    if (results.jobs.length > 0) {
      html += `
        <div class="search-category">
          <h4>💼 Verified Job Openings</h4>
          <ul>
            ${results.jobs
              .map(
                j => `
              <li onclick="executeSearchRoute('jobs', '${j.role || j.tag}', '${escape(j.name)}')">
                <span>&rarr; <strong>${j.name}</strong></span>
                <span class="search-item-badge">${j.badge || j.tag}</span>
              </li>`
              )
              .join("")}
          </ul>
        </div>`;
    }

    // 4. Hackathons
    if (results.hackathons.length > 0) {
      html += `
        <div class="search-category">
          <h4>🏆 Hackathons & Drives</h4>
          <ul>
            ${results.hackathons
              .map(
                h => `
              <li onclick="executeSearchRoute('hackathons', '${h.name}', '${escape(h.name)}')">
                <span>&rarr; <strong>${h.name}</strong></span>
                <span class="search-item-badge">${h.prize}</span>
              </li>`
              )
              .join("")}
          </ul>
        </div>`;
    }

    html += `</div>`;
    resultsContainerElement.innerHTML = html;
    resultsContainerElement.classList.remove('hidden');
  }
}

// Global Singleton Instance
export const globalSearchEngine = new GlobalSearchEngine();

// Execute search route on click
export function executeSearchRoute(category, target) {
  // Hide search container
  const resultsContainer = document.getElementById('global-search-results');
  if (resultsContainer) resultsContainer.classList.add('hidden');

  const searchInput = document.getElementById('global-search-input');
  if (searchInput) searchInput.value = '';

  if (category === 'company') {
    if (typeof window.switchView === 'function') {
      window.switchView('applications');
    }
    if (typeof window.openCompanyPreparation === 'function') {
      window.openCompanyPreparation(target);
    }
  } else if (category === 'dsa') {
    if (typeof window.switchView === 'function') {
      window.switchView('dsa');
    }
    // If target is numeric problem ID
    const problemId = parseInt(target, 10);
    if (!isNaN(problemId) && typeof window.openDsaProblem === 'function') {
      window.openDsaProblem(problemId);
    } else {
      const dsaSearch = document.getElementById('dsa-search');
      if (dsaSearch) {
        dsaSearch.value = target;
        dsaSearch.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  } else if (category === 'jobs') {
    if (typeof window.switchView === 'function') {
      window.switchView('jobs');
    }
    if (typeof window.filterJobs === 'function') {
      window.filterJobs(target);
    }
  } else if (category === 'hackathons') {
    if (typeof window.switchView === 'function') {
      window.switchView('hackathons');
    }
  }
}

// Live input listener for search box
export function handleGlobalSearchInput(query) {
  const container = document.getElementById('global-search-results');
  if (!container) return;

  if (!query || !query.trim()) {
    container.classList.add('hidden');
    return;
  }

  const results = globalSearchEngine.search(query);
  globalSearchEngine.renderResults(results, container);
}

// Keyboard handling: Enter to route to top hit, Escape to close
export function handleGlobalSearchKeyDown(event) {
  if (event.key === 'Escape') {
    const container = document.getElementById('global-search-results');
    if (container) container.classList.add('hidden');
  } else if (event.key === 'Enter') {
    event.preventDefault();
    const query = event.target.value.trim();
    if (!query) return;

    const results = globalSearchEngine.search(query);
    // Route to first available result
    if (results.companies.length > 0) {
      executeSearchRoute('company', results.companies[0].tag);
    } else if (results.dsa.length > 0) {
      executeSearchRoute('dsa', results.dsa[0].id || results.dsa[0].name);
    } else if (results.jobs.length > 0) {
      executeSearchRoute('jobs', results.jobs[0].role || results.jobs[0].tag);
    } else if (results.hackathons.length > 0) {
      executeSearchRoute('hackathons', results.hackathons[0].name);
    } else if (typeof window.handleGlobalSearch === 'function') {
      window.handleGlobalSearch(query);
      const container = document.getElementById('global-search-results');
      if (container) container.classList.add('hidden');
    }
  }
}

// Close search dropdown on click outside
if (typeof document !== 'undefined') {
  document.addEventListener('click', (event) => {
    const searchContainer = event.target.closest('#global-search-container');
    if (!searchContainer) {
      const results = document.getElementById('global-search-results');
      if (results && !results.classList.contains('hidden')) {
        results.classList.add('hidden');
      }
    }
  });
}