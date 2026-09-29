// careernova/js/modules/notifications.js
// Handles notification counting, category filtering, reading, and clearing.

export class NotificationManager {
  constructor() {
    // Initial notifications based on project design specs
    this.notifications = [
      {
        id: 1,
        title: "Google drive deadline is tomorrow",
        time: "2 min ago",
        category: "deadlines",
        isRead: false
      },
      {
        id: 2,
        title: "New hackathon added",
        time: "1 hour ago",
        category: "hackathons",
        isRead: false
      },
      {
        id: 3,
        title: "Your mock interview results are ready",
        time: "3 hours ago",
        category: "interviews",
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
    }
  }

  // 3. Mark all notifications as read
  markAllAsRead() {
    this.notifications.forEach(item => (item.isRead = true));
  }

  // 4. Clear all notifications (Clear State)
  clearAll() {
    this.notifications = [];
  }

  // 5. Filter notifications by category ('all', 'deadlines', 'hackathons', 'interviews')
  getByCategory(category) {
    if (!category || category === "all") {
      return this.notifications;
    }
    return this.notifications.filter(
      item => item.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Render HTML markup for UI display
  renderUI(containerElement, categoryFilter = "all") {
    if (!containerElement) return;

    const itemsToDisplay = this.getByCategory(categoryFilter);
    const unreadCount = this.getUnreadCount();

    if (itemsToDisplay.length === 0) {
      containerElement.innerHTML = `<div class="notification-empty">No notifications available</div>`;
      return;
    }

    const html = `
      <div class="notification-header">
        <h3>🔔 Notifications <span class="badge">${unreadCount}</span></h3>
        <div class="notification-actions">
          <button id="mark-all-btn">Mark all read</button>
          <button id="clear-all-btn">Clear all</button>
        </div>
      </div>
      <ul class="notification-list">
        ${itemsToDisplay
          .map(
            item => `
          <li class="notification-item ${item.isRead ? "read" : "unread"}" data-id="${item.id}">
            <div class="notification-content">
              <p class="notification-text">${item.title}</p>
              <span class="notification-time">${item.time}</span>
            </div>
            ${!item.isRead ? `<button class="mark-read-btn">Read</button>` : ""}
          </li>
        `
          )
          .join("")}
      </ul>
    `;

    containerElement.innerHTML = html;
  }
}