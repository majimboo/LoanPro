<template>
  <div class="modern-layout">
    <!-- Modern Top Navbar -->
    <nav class="modern-navbar is-fixed-top" role="navigation" aria-label="main navigation">
      <div class="navbar-container">
        <!-- Brand Section -->
        <div class="navbar-brand-section">
          <div class="brand-logo">
            <div class="brand-icon">
              <i class="fas fa-coins"></i>
            </div>
            <div class="brand-text">
              <span class="brand-name">LoanPro</span>
              <span class="brand-tagline">Management System</span>
            </div>
          </div>
        </div>

        <!-- Center Section (Desktop Search) -->
        <div class="navbar-center-section is-hidden-touch" v-if="isLoggedIn">
          <div class="search-container">
            <div class="control has-icons-left">
              <input class="input is-rounded" type="text" placeholder="Search loans, customers...">
              <span class="icon is-left">
                <i class="fas fa-search"></i>
              </span>
            </div>
          </div>
        </div>

        <!-- Actions Section -->
        <div class="navbar-actions-section">
          <!-- Quick Actions (Desktop) -->
          <div class="quick-actions is-hidden-touch" v-if="isLoggedIn">
            <button class="action-btn" title="Notifications">
              <i class="fas fa-bell"></i>
              <span class="notification-badge" v-if="dashboardNotifications">{{ dashboardNotifications }}</span>
            </button>
            <div class="quick-add-wrapper">
              <button class="action-btn" title="Quick Add" @click="showQuickAdd = !showQuickAdd">
                <i class="fas fa-plus"></i>
              </button>
              <!-- Quick Add Dropdown -->
              <div class="quick-add-menu" v-if="showQuickAdd" @click.stop>
                <div class="dropdown-content">
                  <a class="dropdown-item" @click="$router.push('/loans/new'); showQuickAdd = false">
                    <i class="fas fa-file-invoice-dollar mr-2 has-text-primary"></i>
                    <div>
                      <div class="has-text-weight-semibold">New Loan</div>
                      <div class="is-size-7 has-text-grey">Create a new loan application</div>
                    </div>
                  </a>
                  <a class="dropdown-item" @click="$router.push('/customers/new'); showQuickAdd = false">
                    <i class="fas fa-user-plus mr-2 has-text-info"></i>
                    <div>
                      <div class="has-text-weight-semibold">Add Customer</div>
                      <div class="is-size-7 has-text-grey">Register a new customer</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- User Menu -->
          <div class="user-menu" v-if="isLoggedIn">
            <div class="dropdown is-right" :class="{ 'is-active': isUserMenuOpen }">
              <div class="dropdown-trigger">
                <button class="user-avatar-btn" @click="toggleUserMenu">
                  <div class="user-avatar">
                    <span class="avatar-initials">{{ getUserInitials() }}</span>
                  </div>
                  <div class="user-info is-hidden-mobile">
                    <span class="user-name">{{ userName }}</span>
                    <span class="user-role">{{ userRole }}</span>
                  </div>
                  <i class="fas fa-chevron-down ml-2 is-hidden-mobile"></i>
                </button>
              </div>
              <div class="dropdown-menu">
                <div class="dropdown-content">
                  <!-- Mobile-only quick access -->
                  <div class="is-hidden-desktop">
                    <a class="dropdown-item" @click="$router.push('/notifications'); isUserMenuOpen = false">
                      <i class="fas fa-bell mr-2"></i>
                      <span>Notifications</span>
                      <span class="tag is-small is-primary ml-auto" v-if="dashboardNotifications">{{ dashboardNotifications }}</span>
                    </a>
                    <hr class="dropdown-divider">
                  </div>
                  
                  <a class="dropdown-item" @click="$router.push('/profile'); isUserMenuOpen = false">
                    <i class="fas fa-user mr-2"></i>
                    <span>Profile</span>
                  </a>
                  <a class="dropdown-item" @click="$router.push('/settings'); isUserMenuOpen = false">
                    <i class="fas fa-cog mr-2"></i>
                    <span>Settings</span>
                  </a>
                  <hr class="dropdown-divider">
                  <a class="dropdown-item has-text-danger" @click="logout">
                    <i class="fas fa-sign-out-alt mr-2"></i>
                    <span>Logout</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Mobile burger for guest users -->
          <button class="mobile-menu-btn is-hidden-desktop" 
                  v-if="!isLoggedIn"
                  :class="{ 'is-active': isMobileMenuOpen }"
                  @click="toggleMobileMenu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>

    <!-- Mobile Bottom Navigation -->
    <nav class="bottom-nav is-hidden-desktop" v-if="isLoggedIn">
      <div class="bottom-nav-items">
        <router-link to="/dashboard" class="bottom-nav-item" active-class="is-active">
          <span class="icon">
            <i class="fas fa-chart-line"></i>
          </span>
          <span class="bottom-nav-label">Dashboard</span>
        </router-link>
        
        <router-link to="/loans" class="bottom-nav-item" active-class="is-active">
          <span class="icon">
            <i class="fas fa-file-invoice-dollar"></i>
          </span>
          <span class="bottom-nav-label">Loans</span>
        </router-link>
        
        <router-link to="/customers" class="bottom-nav-item" active-class="is-active">
          <span class="icon">
            <i class="fas fa-users"></i>
          </span>
          <span class="bottom-nav-label">Customers</span>
        </router-link>
        
        <router-link to="/reports" class="bottom-nav-item" active-class="is-active">
          <span class="icon">
            <i class="fas fa-chart-bar"></i>
          </span>
          <span class="bottom-nav-label">Reports</span>
        </router-link>
      </div>
    </nav>

    <!-- Desktop Sidebar -->
    <aside class="sidebar is-hidden-touch" v-if="isLoggedIn">
      <div class="sidebar-content">
        <div class="sidebar-header">
          <div class="logo-container">
            <div class="logo-icon">
              <i class="fas fa-coins"></i>
            </div>
            <h2 class="title">LoanPro</h2>
            <p class="subtitle">Loan Management System</p>
          </div>
        </div>

        <div class="sidebar-menu">
          <p class="menu-label">Main</p>
          <ul class="menu-list">
            <li>
              <router-link to="/dashboard" active-class="is-active">
                <span class="icon">
                  <i class="fas fa-chart-line"></i>
                </span>
                <span>Dashboard</span>
                <span class="tag is-small is-success ml-auto" v-if="dashboardNotifications">{{ dashboardNotifications }}</span>
              </router-link>
            </li>
          </ul>

          <p class="menu-label">Loan Management</p>
          <ul class="menu-list">
            <li>
              <router-link to="/loans" active-class="is-active">
                <span class="icon">
                  <i class="fas fa-file-invoice-dollar"></i>
                </span>
                <span>All Loans</span>
              </router-link>
              <ul class="submenu">
                <li><router-link to="/loans/active">Active Loans</router-link></li>
                <li><router-link to="/loans/overdue">Overdue Loans</router-link></li>
                <li><router-link to="/loans/completed">Completed</router-link></li>
              </ul>
            </li>
            <li>
              <router-link to="/loans/new" active-class="is-active">
                <span class="icon">
                  <i class="fas fa-plus-circle"></i>
                </span>
                <span>New Loan</span>
              </router-link>
            </li>
          </ul>

          <p class="menu-label">Customer Management</p>
          <ul class="menu-list">
            <li>
              <router-link to="/customers" active-class="is-active">
                <span class="icon">
                  <i class="fas fa-users"></i>
                </span>
                <span>All Customers</span>
              </router-link>
            </li>
            <li>
              <router-link to="/customers/new" active-class="is-active">
                <span class="icon">
                  <i class="fas fa-user-plus"></i>
                </span>
                <span>Add Customer</span>
              </router-link>
            </li>
          </ul>

          <p class="menu-label">Reports & Analytics</p>
          <ul class="menu-list">
            <li>
              <router-link to="/reports/financial" active-class="is-active">
                <span class="icon">
                  <i class="fas fa-chart-bar"></i>
                </span>
                <span>Financial Reports</span>
              </router-link>
            </li>
            <li>
              <router-link to="/reports/performance" active-class="is-active">
                <span class="icon">
                  <i class="fas fa-chart-pie"></i>
                </span>
                <span>Performance</span>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="main-content" :class="{ 'with-sidebar': isLoggedIn }">
      <div class="content-wrapper">
        <!-- Router view with transition -->
        <transition name="page" mode="out-in">
          <router-view :key="$route.fullPath" />
        </transition>
      </div>
    </main>

    <!-- Notification Container -->
    <div class="notifications-container">
      <div v-for="notification in notifications" 
           :key="notification.id"
           class="notification"
           :class="[`is-${notification.type}`]">
        <button class="delete" @click="removeNotification(notification.id)"></button>
        <strong>{{ notification.title }}</strong>
        <p>{{ notification.message }}</p>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div class="loading-overlay" v-show="isLoading">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <p class="has-text-white mt-4">Loading...</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModernLayout',
  data() {
    return {
      isLoggedIn: false,
      userName: '',
      userRole: '',
      isMobileMenuOpen: false,
      isUserMenuOpen: false,
      showQuickAdd: false,
      notifications: [],
      dashboardNotifications: 0,
      isLoading: false,
      breadcrumbs: []
    };
  },
  computed: {
    isMobile() {
      return window.innerWidth < 1024;
    }
  },
  created() {
    this.checkLoginStatus();
    this.updateBreadcrumbs();
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.user-menu')) {
        this.isUserMenuOpen = false;
      }
      if (!e.target.closest('.quick-add-wrapper')) {
        this.showQuickAdd = false;
      }
    });
  },
  watch: {
    $route: {
      handler: 'updateBreadcrumbs',
      immediate: true
    }
  },
  methods: {
    checkLoginStatus() {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      if (token && user) {
        this.isLoggedIn = true;
        this.userName = user.email || user.name || 'User';
        this.userRole = user.role;
      } else {
        this.isLoggedIn = false;
        this.userName = '';
        this.userRole = '';
      }
    },
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    },
    toggleUserMenu() {
      this.isUserMenuOpen = !this.isUserMenuOpen;
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.isLoggedIn = false;
      this.$router.push('/login');
      this.addNotification('success', 'Logged Out', 'You have been successfully logged out.');
    },
    addNotification(type, title, message) {
      const id = Date.now();
      this.notifications.push({ id, type, title, message });
      setTimeout(() => {
        this.removeNotification(id);
      }, 5000);
    },
    removeNotification(id) {
      this.notifications = this.notifications.filter(n => n.id !== id);
    },
    updateBreadcrumbs() {
      // Generate breadcrumbs based on current route
      const routeParts = this.$route.path.split('/').filter(part => part);
      this.breadcrumbs = [];
      
      let currentPath = '';
      routeParts.forEach((part, index) => {
        currentPath += '/' + part;
        this.breadcrumbs.push({
          name: this.capitalize(part.replace('-', ' ')),
          path: currentPath
        });
      });
    },
    capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    getUserInitials() {
      if (!this.userName) return 'U';
      const names = this.userName.split(' ');
      if (names.length >= 2) {
        return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
      }
      return this.userName.charAt(0).toUpperCase();
    }
  }
};
</script>

