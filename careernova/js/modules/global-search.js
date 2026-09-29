// careernova/js/modules/global-search.js
// Smart search router across Companies, Jobs, and DSA categories.

export class GlobalSearchEngine {
  constructor() {
    // Database containing multi-category items
    this.database = {
      companies: [
        { name: "Amazon Preparation", tag: "Amazon" },
        { name: "Google Placement Roadmap", tag: "Google" },
        { name: "Microsoft Technical Rounds", tag: "Microsoft" }
      ],
      jobs: [
        { name: "Amazon Software Engineer", tag: "Amazon" },
        { name: "Google Frontend Developer", tag: "Google" },
        { name: "SDE-1 Internship", tag: "General" }
      ],
      dsa: [
        { name: "Amazon-tagged problems", tag: "Amazon" },
        { name: "Top 50 Graph Algorithms", tag: "General" },
        { name: "Dynamic Programming Sheet", tag: "Google" }
      ]
    };
  }

  // Filter items across Companies, Jobs, and DSA
  search(query) {
    const term = query.trim().toLowerCase();

    if (!term) {
      return { companies: [], jobs: [], dsa: [] };
    }

    return {
      companies: this.database.companies.filter(
        c => c.name.toLowerCase().includes(term) || c.tag.toLowerCase().includes(term)
      ),
      jobs: this.database.jobs.filter(
        j => j.name.toLowerCase().includes(term) || j.tag.toLowerCase().includes(term)
      ),
      dsa: this.database.dsa.filter(
        d => d.name.toLowerCase().includes(term) || d.tag.toLowerCase().includes(term)
      )
    };
  }

  // Render formatted HTML search results dropdown
  renderResults(results, resultsContainerElement) {
    if (!resultsContainerElement) return;

    const totalResults =
      results.companies.length + results.jobs.length + results.dsa.length;

    if (totalResults === 0) {
      resultsContainerElement.innerHTML = `<div class="search-empty">No results found</div>`;
      return;
    }

    let html = `<div class="search-results-card">`;

    if (results.companies.length > 0) {
      html += `
        <div class="search-category">
          <h4>Companies</h4>
          <ul>
            ${results.companies.map(c => `<li>&rarr; ${c.name}</li>`).join("")}
          </ul>
        </div>`;
    }

    if (results.jobs.length > 0) {
      html += `
        <div class="search-category">
          <h4>Jobs</h4>
          <ul>
            ${results.jobs.map(j => `<li>&rarr; ${j.name}</li>`).join("")}
          </ul>
        </div>`;
    }

    if (results.dsa.length > 0) {
      html += `
        <div class="search-category">
          <h4>DSA</h4>
          <ul>
            ${results.dsa.map(d => `<li>&rarr; ${d.name}</li>`).join("")}
          </ul>
        </div>`;
    }

    html += `</div>`;
    resultsContainerElement.innerHTML = html;
  }
}