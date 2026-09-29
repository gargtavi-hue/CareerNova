// careernova/js/modules/notifications.js
// Handles notification counting, category filtering, reading, clearing, and routing.

export class NotificationManager {
  constructor() {
    this.currentFilter = 'all';
    // Initial notifications based on project design specs & user requirements
    this.notifications = [
      {
        id: 1,
        title: "Google placement drive opened",
        description: "Google 2026 Campus Recruitment is now live. Explore interview rounds & preparation checklist.",
        time: "Just now",
        category: "deadlines",
        type: "drive",
        target: "Google",
        isRead: false
      },
      {
        id: 2,
        title: "You have been shortlisted",
        description: "Congratulations! Shortlisted for Amazon SDE-1 Technical Round. Try a mock interview session.",
        time: "45 min ago",
        category: "interviews",
        type: "interview",
        target: "Amazon",
        isRead: false
      },
      {
        id: 3,
        title: "New hackathon added",
        description: "Distributed Systems Sprint 2026 with $15k in prize pool is now open for university teams.",
        time: "2 hours ago",
        category: "hackathons",
        type: "hackathon",
        target: "Distributed Systems Sprint",
        isRead: false
      },
      {
        id: 4,
        title: "New verified job alert",
        description: "Stripe posted Frontend Engineer (New Grad 2026) — Remote / Hybrid.",
        time: "4 hours ago",
        category: "jobs",
        type: "job",
        target: "Frontend",
        isRead: false
      },
      {
        id: 5,
        title: "Google drive deadline is tomorrow",
        description: "Reminder: Submit your online assessment score before tomorrow 11:59 PM.",
        time: "1 day ago",
        category: "deadlines",
        type: "drive",
        target: "Google",
        isRead: false
      }
    ];
  }

  // 1. Get total unread count
  getUnreadCount() {
    return this.notifications.filter(item => !item.isRead).length;
  }

  // 2. Mark a single notification as read
  markAsRead(id) {
    const target = this.notifications.find(item => item.id === id);
    if (target) {
      target.isRead = true;
      this.updateBadge();
    }
  }

  // 3. Mark all notifications as read
  markAllAsRead() {
    this.notifications.forEach(item => (item.isRead = true));
    this.updateBadge();
    if (typeof document !== 'undefined') {
      this.renderUI(document.getElementById('notification-center-panel'), this.currentFilter);
    }
    if (typeof window !== 'undefined' && typeof window.showToast === 'function') {
      window.showToast('All notifications marked as read.');
    }
  }

  // 4. Clear all notifications (Clear State)
  clearAll() {
    this.notifications = [];
    this.updateBadge();
    if (typeof document !== 'undefined') {
      this.renderUI(document.getElementById('notification-center-panel'), this.currentFilter);
    }
    if (typeof window !== 'undefined' && typeof window.showToast === 'function') {
      window.showToast('All notifications cleared.');
    }
  }

  // 5. Filter notifications by category ('all', 'deadlines', 'hackathons', 'interviews', 'jobs')
  getByCategory(category) {
    if (!category || category === "all") {
      return this.notifications;
    }
    return this.notifications.filter(
      item => item.category.toLowerCase() === category.toLowerCase()
    );
  }

  // 6. Update red bell badge in top bar
  updateBadge() {
    if (typeof document === 'undefined') return;
    const count = this.getUnreadCount();
    const badge = document.getElementById('notification-badge');
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'inline-block' : 'none';
    }
  }

  // 7. Click routing: mark read and jump to relevant feature view
  handleNotificationClick(id) {
    const item = this.notifications.find(n => n.id === id);
    if (!item) return;

    this.markAsRead(id);
    this.renderUI(document.getElementById('notification-center-panel'), this.currentFilter);

    // Route based on notification alert type
    if (item.type === 'drive') {
      if (typeof window.switchView === 'function') {
        window.switchView('applications');
      }
      if (typeof window.openCompanyPreparation === 'function' && item.target) {
        window.openCompanyPreparation(item.target);
      }
    } else if (item.type === 'hackathon') {
      if (typeof window.switchView === 'function') {
        window.switchView('hackathons');
      }
    } else if (item.type === 'job') {
      if (typeof window.switchView === 'function') {
        window.switchView('jobs');
      }
      if (typeof window.filterJobs === 'function' && item.target) {
        window.filterJobs(item.target);
      }
    } else if (item.type === 'interview') {
      if (typeof window.openMockInterviewModal === 'function') {
        window.openMockInterviewModal();
      } else if (typeof window.switchView === 'function') {
        window.switchView('aichat');
      }
    }

    // Close panel
    const panel = document.getElementById('notification-center-panel');
    if (panel) panel.classList.add('hidden');
  }

  // Render HTML markup for UI display
  renderUI(containerElement, categoryFilter = "all") {
    if (!containerElement) return;
    this.currentFilter = categoryFilter;

    const itemsToDisplay = this.getByCategory(categoryFilter);
    const unreadCount = this.getUnreadCount();
    this.updateBadge();

    const categories = [
      { id: 'all', label: 'All' },
      { id: 'deadlines', label: 'Drives 🏢' },
      { id: 'hackathons', label: 'Hackathons 🏆' },
      { id: 'jobs', label: 'Jobs 💼' },
      { id: 'interviews', label: 'Shortlists 🎯' }
    ];

    const filterTabsHtml = `
      <div class="notification-tabs">
        ${categories.map(cat => `
          <button class="notification-tab-btn ${this.currentFilter === cat.id ? 'active' : ''}" 
                  onclick="setNotificationCategory('${cat.id}')">
            ${cat.label}
          </button>
        `).join('')}
      </div>
    `;

    if (itemsToDisplay.length === 0) {
      containerElement.innerHTML = `
        <div class="notification-header">
          <h3>🔔 Notifications <span class="badge">${unreadCount}</span></h3>
          <div class="notification-actions">
            <button onclick="markAllNotificationsRead()">Mark all read</button>
            <button onclick="clearAllNotifications()">Clear all</button>
          </div>
        </div>
        ${filterTabsHtml}
        <div class="notification-empty">No notifications in this category</div>
      `;
      return;
    }

    const html = `
      <div class="notification-header">
        <h3>🔔 Notifications <span class="badge">${unreadCount}</span></h3>
        <div class="notification-actions">
          <button onclick="markAllNotificationsRead()">Mark all read</button>
          <button onclick="clearAllNotifications()">Clear all</button>
        </div>
      </div>
      ${filterTabsHtml}
      <ul class="notification-list">
        ${itemsToDisplay
          .map(
            item => `
          <li class="notification-item ${item.isRead ? "read" : "unread"}" 
              data-id="${item.id}" 
              onclick="handleNotificationItemClick(${item.id})">
            <div class="notification-content">
              <div class="notification-title-row">
                <span class="notification-tag tag-${item.category}">${item.category.toUpperCase()}</span>
                <span class="notification-time">${item.time}</span>
              </div>
              <p class="notification-text">${item.title}</p>
              ${item.description ? `<p class="notification-desc">${item.description}</p>` : ''}
            </div>
            ${!item.isRead ? `<button class="mark-read-btn" onclick="event.stopPropagation(); markNotificationRead(${item.id})">Read</button>` : ""}
          </li>
        `
          )
          .join("")}
      </ul>
    `;

    containerElement.innerHTML = html;
  }
}

// Global Singleton Instance
export const notificationManager = new NotificationManager();

export function toggleNotificationCenter() {
  const panel = document.getElementById('notification-center-panel');
  if (!panel) return;
  const isHidden = panel.classList.contains('hidden');

  // Close search dropdown if open
  const searchDropdown = document.getElementById('global-search-results');
  if (searchDropdown) searchDropdown.classList.add('hidden');

  if (isHidden) {
    notificationManager.renderUI(panel, notificationManager.currentFilter);
    panel.classList.remove('hidden');
  } else {
    panel.classList.add('hidden');
  }
}

export function setNotificationCategory(category) {
  const panel = document.getElementById('notification-center-panel');
  notificationManager.renderUI(panel, category);
}

export function markNotificationRead(id) {
  notificationManager.markAsRead(id);
  const panel = document.getElementById('notification-center-panel');
  notificationManager.renderUI(panel, notificationManager.currentFilter);
}

export function markAllNotificationsRead() {
  notificationManager.markAllAsRead();
}

export function clearAllNotifications() {
  notificationManager.clearAll();
}

export function handleNotificationItemClick(id) {
  notificationManager.handleNotificationClick(id);
}

// Close notification panel when clicking outside
if (typeof document !== 'undefined') {
  document.addEventListener('click', (event) => {
    const wrapper = event.target.closest('.notification-dropdown-wrapper');
    if (!wrapper) {
      const panel = document.getElementById('notification-center-panel');
      if (panel && !panel.classList.contains('hidden')) {
        panel.classList.add('hidden');
      }
    }
  });
}