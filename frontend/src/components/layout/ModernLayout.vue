<template>
  <div class="modern-layout">
    <!-- Mobile Header -->
    <nav class="navbar is-primary is-fixed-top" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item has-text-weight-bold">
          <span class="icon mr-2">
            <i class="fas fa-coins"></i>
          </span>
          LoanPro
        </a>

        <!-- Mobile burger menu -->
        <a role="button" 
           class="navbar-burger" 
           :class="{ 'is-active': isMobileMenuOpen }"
           @click="toggleMobileMenu">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <!-- Mobile/Desktop menu -->
      <div class="navbar-menu" :class="{ 'is-active': isMobileMenuOpen }">
        <div class="navbar-start is-hidden-desktop" v-if="isLoggedIn">
          <router-link to="/dashboard" class="navbar-item" @click="isMobileMenuOpen = false">
            <span class="icon">
              <i class="fas fa-chart-line"></i>
            </span>
            <span>Dashboard</span>
          </router-link>
          <router-link to="/loans" class="navbar-item" @click="isMobileMenuOpen = false">
            <span class="icon">
              <i class="fas fa-file-invoice-dollar"></i>
            </span>
            <span>Loans</span>
          </router-link>
          <router-link to="/customers" class="navbar-item" @click="isMobileMenuOpen = false">
            <span class="icon">
              <i class="fas fa-users"></i>
            </span>
            <span>Customers</span>
          </router-link>
          <router-link to="/reports" class="navbar-item" @click="isMobileMenuOpen = false">
            <span class="icon">
              <i class="fas fa-chart-bar"></i>
            </span>
            <span>Reports</span>
          </router-link>
          <hr class="navbar-divider">
        </div>
        
        <div class="navbar-end">
          <div class="navbar-item has-dropdown" :class="{ 'is-active': isUserMenuOpen }">
            <a class="navbar-link" @click="toggleUserMenu">
              <span class="icon">
                <i class="fas fa-user-circle"></i>
              </span>
              <span class="is-hidden-mobile ml-2">{{ userName }}</span>
            </a>
            <div class="navbar-dropdown is-right">
              <a class="navbar-item" @click="$router.push('/profile')">
                <span class="icon">
                  <i class="fas fa-user"></i>
                </span>
                <span>Profile</span>
              </a>
              <a class="navbar-item" @click="$router.push('/settings')">
                <span class="icon">
                  <i class="fas fa-cog"></i>
                </span>
                <span>Settings</span>
              </a>
              <hr class="navbar-divider">
              <a class="navbar-item" @click="logout">
                <span class="icon">
                  <i class="fas fa-sign-out-alt"></i>
                </span>
                <span>Logout</span>
              </a>
            </div>
          </div>
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
          <h2 class="title is-4 has-text-white">
            <span class="icon mr-2">
              <i class="fas fa-coins"></i>
            </span>
            LoanPro
          </h2>
          <p class="subtitle is-6 has-text-white-ter">Loan Management System</p>
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
    }
  }
};
</script>

