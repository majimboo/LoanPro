<template>
  <div class="has-background-light is-min-height-100vh">
    <!-- Welcome Section -->
    <section class="hero is-info is-medium">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-vcentered">
            <div class="column">
              <h1 class="title is-2 has-text-white">
                Welcome back, {{ userName }}!
              </h1>
              <p class="subtitle is-4 has-text-white-bis">
                Here's what's happening with your loans today
              </p>
              <div class="quick-actions">
                <router-link to="/loans/new" class="button is-primary is-medium">
                  <span class="icon">
                    <i class="fas fa-plus"></i>
                  </span>
                  <span>New Loan</span>
                </router-link>
                <router-link to="/customers/new" class="button is-white is-outlined is-medium ml-3">
                  <span class="icon">
                    <i class="fas fa-user-plus"></i>
                  </span>
                  <span>Add Customer</span>
                </router-link>
              </div>
            </div>
            <div class="column is-narrow is-hidden-mobile">
              <div class="dashboard-illustration">
                <span class="icon is-large has-text-white-ter">
                  <i class="fas fa-chart-line fa-4x"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Key Metrics Cards -->
    <section class="section">
      <div class="container">
        <div class="columns is-multiline">
          <!-- Total Active Loans -->
          <div class="column is-6-tablet is-3-desktop">
            <div class="card full-height-card has-shadow-hover has-radius has-background-success">
              <div class="card-content">
                <div class="media">
                  <div class="media-left">
                    <span class="icon is-large has-text-white">
                      <i class="fas fa-file-invoice-dollar fa-2x"></i>
                    </span>
                  </div>
                  <div class="media-content">
                    <p class="title is-4 has-text-white">{{ metrics.activeLoans.count }}</p>
                    <p class="subtitle is-6 has-text-white-bis">Active Loans</p>
                    <p class="is-size-7 has-text-white-ter">
                      ₱{{ formatCurrency(metrics.activeLoans.totalAmount) }}
                    </p>
                  </div>
                </div>
                <div class="metric-trend" v-if="metrics.activeLoans.trend">
                  <span class="tag is-light is-small">
                    <i class="fas fa-arrow-up mr-1"></i>
                    {{ metrics.activeLoans.trend }}% this month
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Overdue Loans -->
          <div class="column is-6-tablet is-3-desktop">
            <div class="card full-height-card has-shadow-hover has-radius has-background-danger">
              <div class="card-content">
                <div class="media">
                  <div class="media-left">
                    <span class="icon is-large has-text-white">
                      <i class="fas fa-exclamation-triangle fa-2x"></i>
                    </span>
                  </div>
                  <div class="media-content">
                    <p class="title is-4 has-text-white">{{ metrics.overdueLoans.count }}</p>
                    <p class="subtitle is-6 has-text-white-bis">Overdue Loans</p>
                    <p class="is-size-7 has-text-white-ter">
                      ₱{{ formatCurrency(metrics.overdueLoans.totalAmount) }}
                    </p>
                  </div>
                </div>
                <div class="metric-action" v-if="metrics.overdueLoans.count > 0">
                  <router-link to="/loans/overdue" class="button is-small is-white is-outlined">
                    View All
                  </router-link>
                </div>
              </div>
            </div>
          </div>

          <!-- Total Customers -->
          <div class="column is-6-tablet is-3-desktop">
            <div class="card full-height-card has-shadow-hover has-radius has-background-info">
              <div class="card-content">
                <div class="media">
                  <div class="media-left">
                    <span class="icon is-large has-text-white">
                      <i class="fas fa-users fa-2x"></i>
                    </span>
                  </div>
                  <div class="media-content">
                    <p class="title is-4 has-text-white">{{ metrics.totalCustomers.count }}</p>
                    <p class="subtitle is-6 has-text-white-bis">Total Customers</p>
                    <p class="is-size-7 has-text-white-ter">
                      {{ metrics.totalCustomers.newThisMonth }} new this month
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Monthly Revenue -->
          <div class="column is-6-tablet is-3-desktop">
            <div class="card full-height-card has-shadow-hover has-radius has-background-warning">
              <div class="card-content">
                <div class="media">
                  <div class="media-left">
                    <span class="icon is-large has-text-white">
                      <i class="fas fa-chart-line fa-2x"></i>
                    </span>
                  </div>
                  <div class="media-content">
                    <p class="title is-4 has-text-white">₱{{ formatCurrency(metrics.monthlyRevenue.amount) }}</p>
                    <p class="subtitle is-6 has-text-white-bis">Monthly Revenue</p>
                    <p class="is-size-7 has-text-white-ter">
                      {{ getCurrentMonth() }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Overview Section -->
    <section class="section">
      <div class="container">
        <div class="columns is-desktop">
          <!-- Recent Loans -->
          <div class="column">
            <div class="card">
              <header class="card-header">
                <p class="card-header-title">
                  <span class="icon mr-2">
                    <i class="fas fa-clock"></i>
                  </span>
                  Recent Loans
                </p>
                <router-link to="/loans" class="card-header-icon">
                  <span class="icon">
                    <i class="fas fa-arrow-right"></i>
                  </span>
                </router-link>
              </header>
              <div class="card-content">
                <div v-if="recentLoans.length === 0" class="has-text-centered py-6">
                  <span class="icon is-large has-text-grey-light">
                    <i class="fas fa-file-invoice-dollar fa-3x"></i>
                  </span>
                  <p class="title is-5 has-text-grey-light mt-4">No recent loans</p>
                  <p class="subtitle is-6 has-text-grey">Create your first loan to get started</p>
                  <router-link to="/loans/new" class="button is-primary">
                    <span class="icon">
                      <i class="fas fa-plus"></i>
                    </span>
                    <span>Create Loan</span>
                  </router-link>
                </div>
                <div v-else>
                  <div v-for="loan in recentLoans" :key="loan.id" class="loan-item">
                    <div class="media">
                      <div class="media-left">
                        <span class="icon is-medium" :class="getLoanStatusColor(loan.status)">
                          <i class="fas fa-circle"></i>
                        </span>
                      </div>
                      <div class="media-content">
                        <div class="content">
                          <div class="columns is-mobile is-vcentered">
                            <div class="column">
                              <strong>{{ loan.loan_number }}</strong>
                              <br>
                              <small class="has-text-grey">{{ loan.customer?.first_name }} {{ loan.customer?.last_name }}</small>
                            </div>
                            <div class="column is-narrow">
                              <span class="tag" :class="getStatusClass(loan.status)">
                                {{ formatStatus(loan.status) }}
                              </span>
                              <br>
                              <small class="has-text-weight-semibold">₱{{ formatCurrency(loan.principal_amount) }}</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Upcoming Due Dates -->
          <div class="column">
            <div class="card">
              <header class="card-header">
                <p class="card-header-title">
                  <span class="icon mr-2">
                    <i class="fas fa-calendar-alt"></i>
                  </span>
                  Due Soon
                </p>
                <router-link to="/loans" class="card-header-icon">
                  <span class="icon">
                    <i class="fas fa-arrow-right"></i>
                  </span>
                </router-link>
              </header>
              <div class="card-content">
                <div v-if="dueSoonLoans.length === 0" class="has-text-centered py-6">
                  <span class="icon is-large has-text-grey-light">
                    <i class="fas fa-calendar-check fa-3x"></i>
                  </span>
                  <p class="title is-5 has-text-grey-light mt-4">All caught up!</p>
                  <p class="subtitle is-6 has-text-grey">No loans due in the next 7 days</p>
                </div>
                <div v-else>
                  <div v-for="loan in dueSoonLoans" :key="loan.id" class="due-item">
                    <div class="media">
                      <div class="media-left">
                        <span class="icon is-medium has-text-warning">
                          <i class="fas fa-clock"></i>
                        </span>
                      </div>
                      <div class="media-content">
                        <div class="content">
                          <div class="columns is-mobile is-vcentered">
                            <div class="column">
                              <strong>{{ loan.loan_number }}</strong>
                              <br>
                              <small class="has-text-grey">Due: {{ formatDate(loan.maturity_date) }}</small>
                            </div>
                            <div class="column is-narrow">
                              <span class="tag is-warning">
                                {{ getDaysUntilDue(loan.maturity_date) }} days
                              </span>
                              <br>
                              <small class="has-text-weight-semibold">₱{{ formatCurrency(loan.outstanding_principal) }}</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Help Section -->
    <section class="section has-background-light">
      <div class="container">
        <div class="card">
          <div class="card-content">
            <div class="content has-text-centered">
              <span class="icon is-large has-text-info">
                <i class="fas fa-question-circle fa-2x"></i>
              </span>
              <h3 class="title is-4">Need Help Getting Started?</h3>
              <p class="subtitle">
                New to LoanPro? Here are some quick actions to help you get started:
              </p>
              
              <div class="columns is-centered">
                <div class="column is-8">
                  <div class="help-actions">
                    <div class="columns is-multiline">
                      <div class="column is-6">
                        <div class="card p-5 has-text-centered full-height-card has-shadow-hover has-radius">
                          <span class="icon is-large has-text-primary">
                            <i class="fas fa-user-plus fa-2x"></i>
                          </span>
                          <h4 class="title is-6">Add Your First Customer</h4>
                          <p class="is-size-7">Start by adding customer information to create loans</p>
                          <router-link to="/customers/new" class="button is-primary is-small">Get Started</router-link>
                        </div>
                      </div>
                      <div class="column is-6">
                        <div class="card p-5 has-text-centered full-height-card has-shadow-hover has-radius">
                          <span class="icon is-large has-text-success">
                            <i class="fas fa-file-invoice-dollar fa-2x"></i>
                          </span>
                          <h4 class="title is-6">Create Your First Loan</h4>
                          <p class="is-size-7">Issue loans with flexible terms and collateral options</p>
                          <router-link to="/loans/new" class="button is-success is-small">Create Loan</router-link>
                        </div>
                      </div>
                      <div class="column is-6">
                        <div class="card p-5 has-text-centered full-height-card has-shadow-hover has-radius">
                          <span class="icon is-large has-text-info">
                            <i class="fas fa-chart-bar fa-2x"></i>
                          </span>
                          <h4 class="title is-6">View Reports</h4>
                          <p class="is-size-7">Track your business performance with detailed reports</p>
                          <router-link to="/reports" class="button is-info is-small">View Reports</router-link>
                        </div>
                      </div>
                      <div class="column is-6">
                        <div class="card p-5 has-text-centered full-height-card has-shadow-hover has-radius">
                          <span class="icon is-large has-text-warning">
                            <i class="fas fa-cog fa-2x"></i>
                          </span>
                          <h4 class="title is-6">Configure Settings</h4>
                          <p class="is-size-7">Customize your loan terms and business settings</p>
                          <router-link to="/settings" class="button is-warning is-small">Settings</router-link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import api from '../../services/api';

export default {
  name: 'ModernDashboard',
  data() {
    return {
      userName: 'Admin',
      metrics: {
        activeLoans: { count: 0, totalAmount: 0, trend: 0 },
        overdueLoans: { count: 0, totalAmount: 0 },
        totalCustomers: { count: 0, newThisMonth: 0 },
        monthlyRevenue: { amount: 0 }
      },
      recentLoans: [],
      dueSoonLoans: [],
      isLoading: true
    };
  },
  async created() {
    await this.loadDashboardData();
    this.loadUserData();
  },
  methods: {
    async loadDashboardData() {
      this.isLoading = true;
      try {
        // Load all dashboard data concurrently
        const [metricsResponse, loansResponse, dueSoonResponse] = await Promise.all([
          api.get('/dashboard/metrics'),
          api.get('/loans?limit=5&sort=created_at:desc'),
          api.get('/loans?filter=due-soon&limit=5')
        ]);

        if (metricsResponse.data) {
          this.metrics = { ...this.metrics, ...metricsResponse.data };
        }
        
        this.recentLoans = loansResponse.data || [];
        this.dueSoonLoans = dueSoonResponse.data || [];
        
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Set some mock data for demo purposes
        this.setMockData();
      } finally {
        this.isLoading = false;
      }
    },
    
    loadUserData() {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        this.userName = user.name || user.email || 'Admin';
      }
    },

    setMockData() {
      // Mock data for demonstration
      this.metrics = {
        activeLoans: { count: 23, totalAmount: 125000, trend: 12 },
        overdueLoans: { count: 3, totalAmount: 15000 },
        totalCustomers: { count: 45, newThisMonth: 8 },
        monthlyRevenue: { amount: 8500 }
      };
      
      this.recentLoans = [
        {
          id: 1,
          loan_number: 'LN-2024-001',
          status: 'ACTIVE',
          principal_amount: 50000,
          customer: { first_name: 'Juan', last_name: 'Dela Cruz' }
        },
        {
          id: 2,
          loan_number: 'LN-2024-002',
          status: 'DUE_SOON',
          principal_amount: 25000,
          customer: { first_name: 'Maria', last_name: 'Santos' }
        }
      ];
      
      this.dueSoonLoans = [
        {
          id: 2,
          loan_number: 'LN-2024-002',
          maturity_date: '2024-01-25',
          outstanding_principal: 25000
        }
      ];
    },

    formatCurrency(amount) {
      return new Intl.NumberFormat('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-PH', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    },

    formatStatus(status) {
      return status.replace('_', ' ').toLowerCase()
        .replace(/\b\w/g, l => l.toUpperCase());
    },

    getStatusClass(status) {
      const statusMap = {
        'ACTIVE': 'is-success',
        'DUE_SOON': 'is-warning',
        'OVERDUE': 'is-danger',
        'REDEEMED': 'is-info',
        'FORFEITED': 'is-dark'
      };
      return statusMap[status] || 'is-light';
    },

    getLoanStatusColor(status) {
      const colorMap = {
        'ACTIVE': 'has-text-success',
        'DUE_SOON': 'has-text-warning',
        'OVERDUE': 'has-text-danger',
        'REDEEMED': 'has-text-info',
        'FORFEITED': 'has-text-dark'
      };
      return colorMap[status] || 'has-text-grey';
    },

    getCurrentMonth() {
      return new Date().toLocaleDateString('en-PH', { 
        month: 'long', 
        year: 'numeric' 
      });
    },

    getDaysUntilDue(dateString) {
      const dueDate = new Date(dateString);
      const today = new Date();
      const diffTime = dueDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(0, diffDays);
    }
  }
};
</script>

