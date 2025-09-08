<template>
  <div class="page-container dashboard">
    <!-- Welcome Section -->
    <section class="dashboard-hero">
      <div class="hero-content">
        <div class="container">
          <div class="columns is-vcentered">
            <div class="column">
              <div class="welcome-content">
                <h1 class="hero-title">
                  Welcome back, {{ userName }}! 👋
                </h1>
                <p class="hero-subtitle">
                  Here's what's happening with your loans today
                </p>
                <div class="hero-actions">
                  <router-link to="/loans/new" class="action-button primary">
                    <i class="fas fa-plus"></i>
                    <span>New Loan</span>
                  </router-link>
                  <router-link to="/customers/new" class="action-button secondary">
                    <i class="fas fa-user-plus"></i>
                    <span>Add Customer</span>
                  </router-link>
                </div>
              </div>
            </div>
            <div class="column is-narrow is-hidden-mobile">
              <div class="hero-illustration">
                <div class="floating-icon">
                  <i class="fas fa-chart-line"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="page-content">
      <!-- Key Metrics Cards -->
      <section class="section">
        <div class="container">
          <div class="columns is-multiline">
            <!-- Total Active Loans -->
            <div class="column is-6-tablet is-3-desktop">
              <div class="metric-card active-loans">
                <div class="metric-icon">
                  <i class="fas fa-file-invoice-dollar"></i>
                </div>
                <div class="metric-content">
                  <div class="metric-number">{{ metrics.activeLoans.count }}</div>
                  <div class="metric-label">Active Loans</div>
                  <div class="metric-detail">₱{{ formatCurrency(metrics.activeLoans.totalAmount) }} total value</div>
                  <div class="metric-trend" v-if="metrics.activeLoans.trend">
                    <i class="fas fa-arrow-up"></i>
                    {{ metrics.activeLoans.trend }}% this month
                  </div>
                </div>
              </div>
            </div>

            <!-- Overdue Loans -->
            <div class="column is-6-tablet is-3-desktop">
              <div class="metric-card overdue-loans">
                <div class="metric-icon">
                  <i class="fas fa-exclamation-triangle"></i>
                </div>
                <div class="metric-content">
                  <div class="metric-number">{{ metrics.overdueLoans.count }}</div>
                  <div class="metric-label">Overdue Loans</div>
                  <div class="metric-detail">₱{{ formatCurrency(metrics.overdueLoans.totalAmount) }} outstanding</div>
                  <div class="metric-action" v-if="metrics.overdueLoans.count > 0">
                    <router-link to="/loans/overdue" class="action-link">View All →</router-link>
                  </div>
                </div>
              </div>
            </div>

            <!-- Total Customers -->
            <div class="column is-6-tablet is-3-desktop">
              <div class="metric-card total-customers">
                <div class="metric-icon">
                  <i class="fas fa-users"></i>
                </div>
                <div class="metric-content">
                  <div class="metric-number">{{ metrics.totalCustomers.count }}</div>
                  <div class="metric-label">Total Customers</div>
                  <div class="metric-detail">{{ metrics.totalCustomers.newThisMonth }} new this month</div>
                  <div class="metric-action">
                    <router-link to="/customers" class="action-link">Manage →</router-link>
                  </div>
                </div>
              </div>
            </div>

            <!-- Monthly Revenue -->
            <div class="column is-6-tablet is-3-desktop">
              <div class="metric-card monthly-revenue">
                <div class="metric-icon">
                  <i class="fas fa-chart-line"></i>
                </div>
                <div class="metric-content">
                  <div class="metric-number">₱{{ formatCurrency(metrics.monthlyRevenue.amount) }}</div>
                  <div class="metric-label">Monthly Revenue</div>
                  <div class="metric-detail">{{ getCurrentMonth() }}</div>
                  <div class="metric-action">
                    <router-link to="/reports/financial" class="action-link">View Reports →</router-link>
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
                  <div v-if="recentLoans.length === 0" class="empty-state">
                    <div class="empty-state-icon">
                      <i class="fas fa-file-invoice-dollar"></i>
                    </div>
                    <h4 class="empty-state-title">No recent loans</h4>
                    <p class="empty-state-subtitle">Create your first loan to get started</p>
                    <router-link to="/loans/new" class="button is-primary is-rounded">
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
                                <small class="has-text-grey">{{ loan.customer?.first_name }} {{ loan.customer?.last_name }}</small>
                              </div>
                              <div class="column is-narrow">
                                <span class="tag" :class="getStatusClass(loan.status)">
                                  {{ formatStatus(loan.status) }}
                                </span>
                                <br>
                                <small class="has-text-weight-semibold"></small>
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
                  <div v-if="dueSoonLoans.length === 0" class="empty-state success">
                    <div class="empty-state-icon success">
                      <i class="fas fa-calendar-check"></i>
                    </div>
                    <h4 class="empty-state-title">All caught up!</h4>
                    <p class="empty-state-subtitle">No loans due in the next 7 days</p>
                    <div class="success-badge">
                      <i class="fas fa-check-circle"></i>
                      <span>Great job!</span>
                    </div>
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
                                <small class="has-text-grey">Due: {{ formatDate(loan.maturity_date) }}</small>
                              </div>
                              <div class="column is-narrow">
                                <span class="tag is-warning">
                                  {{ getDaysUntilDue(loan.maturity_date) }} days
                                </span>
                                <br>
                                <small class="has-text-weight-semibold"></small>
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
                            <router-link to="/customers/new" class="button is-primary is-small has-text-white">Get Started</router-link>
                          </div>
                        </div>
                        <div class="column is-6">
                          <div class="card p-5 has-text-centered full-height-card has-shadow-hover has-radius">
                            <span class="icon is-large has-text-success">
                              <i class="fas fa-file-invoice-dollar fa-2x"></i>
                            </span>
                            <h4 class="title is-6">Create Your First Loan</h4>
                            <p class="is-size-7">Issue loans with flexible terms and collateral options</p>
                            <router-link to="/loans/new" class="button is-success is-small has-text-white">Create Loan</router-link>
                          </div>
                        </div>
                        <div class="column is-6">
                          <div class="card p-5 has-text-centered full-height-card has-shadow-hover has-radius">
                            <span class="icon is-large has-text-info">
                              <i class="fas fa-chart-bar fa-2x"></i>
                            </span>
                            <h4 class="title is-6">View Reports</h4>
                            <p class="is-size-7">Track your business performance with detailed reports</p>
                            <router-link to="/reports" class="button is-info is-small has-text-white">View Reports</router-link>
                          </div>
                        </div>
                        <div class="column is-6">
                          <div class="card p-5 has-text-centered full-height-card has-shadow-hover has-radius">
                            <span class="icon is-large has-text-warning">
                              <i class="fas fa-cog fa-2x"></i>
                            </span>
                            <h4 class="title is-6">Configure Settings</h4>
                            <p class="is-size-7">Customize your loan terms and business settings</p>
                            <router-link to="/settings" class="button is-warning is-small has-text-white">Settings</router-link>
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
        // Fallback error handling without toast
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

<style scoped>
.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 2px dashed #dee2e6;
  transition: all 0.3s ease;
}

.empty-state:hover {
  border-color: #007bff;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f3ff 100%);
}

.empty-state.success {
  background: linear-gradient(135deg, #f0fff4 0%, #e6ffed 100%);
  border-color: #28a745;
}

.empty-state.success:hover {
  background: linear-gradient(135deg, #e6ffed 0%, #d4ffdd 100%);
}

.empty-state-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  box-shadow: 0 8px 25px rgba(0, 123, 255, 0.3);
  position: relative;
  overflow: hidden;
}

.empty-state-icon::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 2s infinite;
}

.empty-state-icon.success {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  box-shadow: 0 8px 25px rgba(40, 167, 69, 0.3);
}

.empty-state-icon i {
  font-size: 2rem;
  color: white;
  z-index: 1;
  position: relative;
}

.empty-state-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
}

.empty-state-subtitle {
  color: #6c757d;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.success-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(40, 167, 69, 0.1);
  border: 1px solid rgba(40, 167, 69, 0.3);
  border-radius: 20px;
  color: #28a745;
  font-weight: 500;
  font-size: 0.875rem;
}

.success-badge i {
  font-size: 1rem;
}

.button.is-rounded {
  border-radius: 25px;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 123, 255, 0.2);
  transition: all 0.3s ease;
}

.button.is-rounded:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.3);
}

@keyframes shimmer {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}
</style>

