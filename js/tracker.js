(function () {
  console.log('Tracker loaded');

  var KEY = 'careernova_apps_v2';
  var STATUSES = ['Applied', 'Interview', 'Offer', 'Rejected'];
  var SEED = [
    { id: 1, company: 'Google',    role: 'Software Engineer Intern', date: '2026-09-15', source: 'LinkedIn',   status: 'Interview' },
    { id: 2, company: 'Amazon',    role: 'SDE-1',                    date: '2026-09-10', source: 'Referral',   status: 'Applied' },
    { id: 3, company: 'Microsoft', role: 'Data Analyst',             date: '2026-08-28', source: 'Campus TPO', status: 'Offer' }
  ];

  function $(id) { return document.getElementById(id); }

  function getApps() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw === null) { saveApps(SEED); return SEED.slice(); }
      return JSON.parse(raw) || [];
    } catch (e) { return []; }
  }

  function saveApps(apps) { localStorage.setItem(KEY, JSON.stringify(apps)); }

  function esc(v) {
    var d = document.createElement('div');
    d.textContent = v == null ? '' : v;
    return d.innerHTML;
  }

  function render() {
    var all = getApps();
    var count = function (s) { return all.filter(function (a) { return a.status === s; }).length; };

    var stats = {
      total: all.length,
      applied: count('Applied'),
      interviews: count('Interview'),
      offers: count('Offer'),
      rejected: count('Rejected')
    };
    Object.keys(stats).forEach(function (k) {
      var el = $('tracker-' + k);
      if (el) el.textContent = stats[k];
    });

    var q = ($('application-search').value || '').trim().toLowerCase();
    var st = $('application-status-filter').value;
    var list = all.filter(function (a) {
      var textOk = a.company.toLowerCase().indexOf(q) > -1 || a.role.toLowerCase().indexOf(q) > -1;
      return textOk && (st === 'all' || a.status === st);
    });

    var box = $('applications-list');
    if (!list.length) {
      box.innerHTML = '<div class="empty-state"><h3>' +
        (all.length ? 'No applications found' : 'No applications yet') + '</h3></div>';
      return;
    }

    box.innerHTML =
      '<table class="app-table"><thead><tr><th>Company</th><th>Role</th><th>Date</th><th>Source</th><th>Status</th><th>Action</th></tr></thead><tbody>' +
      list.map(function (a) {
        return '<tr data-id="' + a.id + '">' +
          '<td><strong>' + esc(a.company) + '</strong></td>' +
          '<td>' + esc(a.role) + '</td>' +
          '<td>' + (esc(a.date) || '-') + '</td>' +
          '<td>' + (esc(a.source) || '-') + '</td>' +
          '<td><select class="status-select badge ' + a.status.toLowerCase() + '" data-action="status">' +
            STATUSES.map(function (s) {
              return '<option value="' + s + '"' + (s === a.status ? ' selected' : '') + '>' + s + '</option>';
            }).join('') +
          '</select></td>' +
          '<td><button type="button" class="btn-delete" data-action="delete">Delete</button></td>' +
          '</tr>';
      }).join('') + '</tbody></table>';
  }

  function openModal() {
    $('app-form').reset();
    $('modal-date').value = new Date().toISOString().split('T')[0];
    $('app-modal').classList.remove('hidden');
  }

  function closeModal() {
    $('app-modal').classList.add('hidden');
    $('app-form').reset();
  }

  function init() {
    if (!$('add-app-btn')) { console.log('Tracker: add-app-btn not found'); return; }

    $('add-app-btn').addEventListener('click', openModal);
    $('close-modal-btn').addEventListener('click', closeModal);
    $('cancel-modal-btn').addEventListener('click', closeModal);

    $('app-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var app = {
        id: Date.now(),
        company: $('modal-company').value.trim(),
        role: $('modal-role').value.trim(),
        date: $('modal-date').value,
        source: $('modal-source').value.trim(),
        status: $('modal-status').value
      };
      if (!app.company || !app.role) return;
      saveApps([app].concat(getApps()));
      closeModal();
      render();
    });

    $('application-search').addEventListener('input', render);
    $('application-status-filter').addEventListener('change', render);

    $('applications-list').addEventListener('click', function (e) {
      if (e.target.getAttribute('data-action') === 'delete') {
        var id = e.target.closest('tr').getAttribute('data-id');
        if (!confirm('Delete this application?')) return;
        saveApps(getApps().filter(function (a) { return String(a.id) !== id; }));
        render();
      }
    });

    $('applications-list').addEventListener('change', function (e) {
      if (e.target.getAttribute('data-action') === 'status') {
        var id = e.target.closest('tr').getAttribute('data-id');
        var val = e.target.value;
        saveApps(getApps().map(function (a) {
          return String(a.id) === id ? Object.assign({}, a, { status: val }) : a;
        }));
        render();
      }
    });

    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();