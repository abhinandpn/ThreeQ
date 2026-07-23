// App Helper Utilities
const App = {
  formatDateKolkata(dateStr) {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(date);
    } catch (e) {
      return dateStr;
    }
  },

  getTodayDateString() {
    const options = {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
    return new Intl.DateTimeFormat('en-CA', options).format(new Date());
  },

  renderHeader(activePage = '') {
    const container = document.getElementById('header-root');
    if (!container) return;

    container.innerHTML = `
      <header class="app-header">
        <div class="header-container">
          <a href="index.html" class="brand-logo">
            <div class="logo-badge">
              3Q
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="font-weight: 900; font-size: 1.15rem; color: #fff;">ThreeQ</span>
                <span style="color: var(--saffron-light); font-size: 0.75rem;">✨</span>
              </div>
              <p style="font-size: 0.6rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">3 Questions • 1 Min</p>
            </div>
          </a>

          <!-- Desktop Navigation Menu -->
          <nav class="nav-menu desktop-nav">
            <a href="quiz.html" class="nav-link nav-link-cta">⚡ Today's Quiz</a>
            <a href="archive.html" class="nav-link ${activePage === 'archive' ? 'active' : ''}">Archive</a>
            <a href="leaderboard.html" class="nav-link ${activePage === 'leaderboard' ? 'active' : ''}">Leaderboard</a>
            <a href="profile.html" class="nav-link ${activePage === 'profile' ? 'active' : ''}">Profile</a>
            <a href="settings.html" class="nav-link ${activePage === 'settings' ? 'active' : ''}">Settings</a>
            <a href="admin-login.html" class="nav-link" title="Admin Portal">🛡️</a>
          </nav>

          <!-- Mobile Header Right Actions -->
          <div class="mobile-header-actions">
            <a href="quiz.html" class="btn btn-emerald mobile-quiz-btn" style="padding: 6px 12px; font-size: 0.75rem; min-height: 34px;">⚡ Quiz</a>
            <button type="button" class="mobile-menu-toggle" id="mobile-menu-btn" aria-label="Toggle Navigation Menu">
              <span id="menu-icon">☰</span>
            </button>
          </div>
        </div>

        <!-- Mobile Drawer Navigation -->
        <div class="mobile-nav-drawer" id="mobile-nav-drawer">
          <div class="mobile-drawer-content">
            <a href="quiz.html" class="mobile-drawer-link ${activePage === 'quiz' ? 'active' : ''}">
              <span>⚡ Today's Daily Quiz</span>
              <span class="badge badge-emerald">Live</span>
            </a>
            <a href="archive.html" class="mobile-drawer-link ${activePage === 'archive' ? 'active' : ''}">
              <span>📚 Quiz Archive</span>
            </a>
            <a href="leaderboard.html" class="mobile-drawer-link ${activePage === 'leaderboard' ? 'active' : ''}">
              <span>🏆 Leaderboard</span>
            </a>
            <a href="profile.html" class="mobile-drawer-link ${activePage === 'profile' ? 'active' : ''}">
              <span>👤 Aspirant Profile</span>
            </a>
            <a href="settings.html" class="mobile-drawer-link ${activePage === 'settings' ? 'active' : ''}">
              <span>⚙️ App Settings</span>
            </a>
            <a href="admin-login.html" class="mobile-drawer-link">
              <span>🛡️ Admin Portal Login</span>
            </a>
          </div>
        </div>
      </header>

      <!-- Mobile Bottom Fixed Navigation Bar -->
      <nav class="mobile-bottom-bar">
        <a href="index.html" class="bottom-tab ${activePage === 'home' || activePage === '' ? 'active' : ''}">
          <span class="tab-icon">🏠</span>
          <span class="tab-label">Home</span>
        </a>
        <a href="quiz.html" class="bottom-tab ${activePage === 'quiz' ? 'active' : ''}">
          <span class="tab-icon">⚡</span>
          <span class="tab-label">Quiz</span>
        </a>
        <a href="archive.html" class="bottom-tab ${activePage === 'archive' ? 'active' : ''}">
          <span class="tab-icon">📚</span>
          <span class="tab-label">Archive</span>
        </a>
        <a href="leaderboard.html" class="bottom-tab ${activePage === 'leaderboard' ? 'active' : ''}">
          <span class="tab-icon">🏆</span>
          <span class="tab-label">Board</span>
        </a>
        <a href="profile.html" class="bottom-tab ${activePage === 'profile' ? 'active' : ''}">
          <span class="tab-icon">👤</span>
          <span class="tab-label">Profile</span>
        </a>
      </nav>
    `;

    // Mobile Hamburger Menu Toggle Script
    setTimeout(() => {
      const toggleBtn = document.getElementById('mobile-menu-btn');
      const drawer = document.getElementById('mobile-nav-drawer');
      const menuIcon = document.getElementById('menu-icon');

      if (toggleBtn && drawer) {
        toggleBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const isOpen = drawer.classList.contains('open');
          if (isOpen) {
            drawer.classList.remove('open');
            if (menuIcon) menuIcon.textContent = '☰';
          } else {
            drawer.classList.add('open');
            if (menuIcon) menuIcon.textContent = '✕';
          }
        });

        document.addEventListener('click', (e) => {
          if (drawer.classList.contains('open') && !drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
            drawer.classList.remove('open');
            if (menuIcon) menuIcon.textContent = '☰';
          }
        });
      }
    }, 0);
  },

  renderFooter() {
    const container = document.getElementById('footer-root');
    if (!container) return;

    container.innerHTML = `
      <footer class="app-footer">
        <div class="footer-container">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
              <div class="logo-badge" style="width: 32px; height: 32px; font-size: 0.9rem;">3Q</div>
              <span style="font-weight: 900; font-size: 1.2rem; color: #fff;">ThreeQ</span>
            </div>
            <p style="font-size: 0.85rem; line-height: 1.6; margin-bottom: 12px; color: var(--text-secondary);">
              3 Questions. 1 Minute. Every Day. Futuristic daily current affairs learning micro-platform focused on Kerala and India.
            </p>
            <p style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">
              © ${new Date().getFullYear()} ThreeQ. Built with HTML5, CSS3 & Go.
            </p>
          </div>

          <div>
            <h4 style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: #fff; margin-bottom: 12px; letter-spacing: 0.05em;">Navigation</h4>
            <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.85rem;">
              <a href="index.html" style="color: var(--text-secondary);">Home</a>
              <a href="quiz.html" style="color: var(--text-secondary);">Today's Quiz</a>
              <a href="archive.html" style="color: var(--text-secondary);">Quiz Archive</a>
              <a href="leaderboard.html" style="color: var(--text-secondary);">Leaderboard</a>
              <a href="about.html" style="color: var(--text-secondary);">About & FAQ</a>
            </div>
          </div>

          <div>
            <h4 style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: #fff; margin-bottom: 12px; letter-spacing: 0.05em;">Admin Portal</h4>
            <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.85rem;">
              <a href="admin-login.html" style="color: var(--emerald-light); font-weight: 700;">🛡️ Admin Login</a>
              <a href="admin-dashboard.html" style="color: var(--text-secondary);">Admin Dashboard</a>
              <a href="admin-quizzes.html" style="color: var(--text-secondary);">Manage Quizzes</a>
            </div>
          </div>
        </div>
      </footer>
    `;
  }
};
