<template>
  <div class="has-background-light is-min-height-100vh">
    <!-- Header Section -->
    <div class="page-header">
      <div class="container">
        <nav class="breadcrumb" aria-label="breadcrumbs">
          <ul>
            <li><router-link to="/dashboard">Dashboard</router-link></li>
            <li><router-link to="/customers">Customers</router-link></li>
            <li class="is-active"><a href="#" aria-current="page">{{ customer?.first_name }} {{ customer?.last_name }}</a></li>
          </ul>
        </nav>
        
        <div class="level">
          <div class="level-left">
            <div class="level-item">
              <div class="media">
                <div class="media-left">
                  <figure class="image is-64x64">
                    <img 
                      :src="getProfilePhotoUrl(customer?.profile_photo)" 
                      :alt="customer?.first_name + ' ' + customer?.last_name"
                      class="is-rounded"
                      @error="handleImageError">
                  </figure>
                </div>
                <div class="media-content">
                  <h1 class="title is-3">
                    {{ customer?.first_name }} {{ customer?.last_name }}
                  </h1>
                  <p class="subtitle is-5">
                    Customer ID: {{ customer?.id }} • Joined {{ formatDate(customer?.created_at) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="level-right">
            <div class="level-item">
              <div class="field is-grouped">
                <p class="control">
                  <router-link :to="`/loans/new?customer=${customer?.id}`" class="button is-primary">
                    <span class="icon">
                      <i class="fas fa-plus"></i>
                    </span>
                    <span>New Loan</span>
                  </router-link>
                </p>
                <p class="control">
                  <router-link :to="`/customers/${customer?.id}/edit`" class="button is-warning">
                    <span class="icon">
                      <i class="fas fa-edit"></i>
                    </span>
                    <span>Edit</span>
                  </router-link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="section" v-if="customer">
      <div class="container">
        <div class="columns">
          <!-- Left Column -->
          <div class="column is-8">
            <!-- Customer Overview -->
            <div class="card mb-5">
              <header class="card-header">
                <p class="card-header-title">
                  <span class="icon mr-2">
                    <i class="fas fa-user"></i>
                  </span>
                  Customer Information
                </p>
              </header>
              <div class="card-content">
                <div class="columns">
                  <div class="column">
                    <div class="field">
                      <label class="label">Full Name</label>
                      <p class="control">
                        <span class="tag is-large is-white">{{ customer.first_name }} {{ customer.last_name }}</span>
                      </p>
                    </div>
                    <div class="field">
                      <label class="label">Email Address</label>
                      <p class="control">
                        <span class="tag is-large is-white" v-if="customer.user?.email">
                          <span class="icon">
                            <i class="fas fa-envelope"></i>
                          </span>
                          <span>{{ customer.user.email }}</span>
                        </span>
                        <span class="has-text-grey" v-else>No email provided</span>
                      </p>
                    </div>
                    <div class="field">
                      <label class="label">Phone Number</label>
                      <p class="control">
                        <span class="tag is-large is-white" v-if="customer.phone">
                          <span class="icon">
                            <i class="fas fa-phone"></i>
                          </span>
                          <span>{{ customer.phone }}</span>
                        </span>
                        <span class="has-text-grey" v-else>No phone provided</span>
                      </p>
                    </div>
                  </div>
                  <div class="column">
                    <div class="field">
                      <label class="label">Address</label>
                      <p class="control">
                        <span class="tag is-large is-white" v-if="customer.address" style="height: auto; white-space: normal;">
                          <span class="icon">
                            <i class="fas fa-map-marker-alt"></i>
                          </span>
                          <span>{{ customer.address }}</span>
                        </span>
                        <span class="has-text-grey" v-else>No address provided</span>
                      </p>
                    </div>
                    <div class="field">
                      <label class="label">Member Since</label>
                      <p class="control">
                        <span class="tag is-large is-info">
                          <span class="icon">
                            <i class="fas fa-calendar"></i>
                          </span>
                          <span>{{ formatDate(customer.created_at) }}</span>
                        </span>
                      </p>
                    </div>
                    <div class="field">
                      <label class="label">Account Status</label>
                      <p class="control">
                        <span class="tag is-large is-success">
                          <span class="icon">
                            <i class="fas fa-check-circle"></i>
                          </span>
                          <span>Active</span>
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Loans Section -->
            <div class="card">
              <header class="card-header">
                <p class="card-header-title">
                  <span class="icon mr-2">
                    <i class="fas fa-file-invoice-dollar"></i>
                  </span>
                  Customer Loans
                </p>
                <div class="card-header-icon">
                  <router-link :to="`/loans/new?customer=${customer.id}`" class="button is-success is-small">
                    <span class="icon">
                      <i class="fas fa-plus"></i>
                    </span>
                    <span>New Loan</span>
                  </router-link>
                </div>
              </header>
              <div class="card-content">
                <div v-if="isLoadingLoans" class="has-text-centered py-6">
                  <div class="loading-spinner"></div>
                  <p class="mt-4">Loading loans...</p>
                </div>
                
                <div v-else-if="customerLoans.length === 0" class="has-text-centered py-6 px-4">
                  <div class="has-text-centered py-6">
                    <span class="icon is-large has-text-grey-light">
                      <i class="fas fa-file-invoice-dollar fa-3x"></i>
                    </span>
                    <h3 class="title is-5 has-text-grey-light mt-4">No loans yet</h3>
                    <p class="subtitle is-6 has-text-grey">This customer hasn't taken any loans yet.</p>
                    <router-link :to="`/loans/new?customer=${customer.id}`" class="button is-primary">
                      <span class="icon">
                        <i class="fas fa-plus"></i>
                      </span>
                      <span>Create First Loan</span>
                    </router-link>
                  </div>
                </div>

                <div v-else>
                  <div class="loan-item" v-for="loan in customerLoans" :key="loan.id">
                    <div class="card">
                      <div class="card-content">
                        <div class="columns is-vcentered">
                          <div class="column">
                            <p class="title is-5 mb-2">{{ loan.loan_number }}</p>
                            <p class="subtitle is-6 has-text-grey">{{ loan.loan_type }}</p>
                          </div>
                          <div class="column is-narrow">
                            <div class="has-text-right">
                              <p class="title is-5 mb-1">₱{{ formatCurrency(loan.principal_amount) }}</p>
                              <span class="tag" :class="getStatusClass(loan.status)">
                                {{ formatStatus(loan.status) }}
                              </span>
                            </div>
                          </div>
                          <div class="column is-narrow">
                            <div class="has-text-right">
                              <p class="has-text-grey is-size-7">Issue Date</p>
                              <p class="has-text-weight-semibold">{{ formatDate(loan.issue_date) }}</p>
                            </div>
                          </div>
                          <div class="column is-narrow">
                            <div class="has-text-right">
                              <p class="has-text-grey is-size-7">Due Date</p>
                              <p class="has-text-weight-semibold">{{ formatDate(loan.maturity_date) }}</p>
                            </div>
                          </div>
                          <div class="column is-narrow">
                            <div class="buttons">
                              <router-link :to="`/loans/${loan.id}`" class="button is-info is-small">
                                <span class="icon">
                                  <i class="fas fa-eye"></i>
                                </span>
                              </router-link>
                              <router-link :to="`/loans/${loan.id}/payment`" class="button is-success is-small" v-if="loan.status === 'ACTIVE'">
                                <span class="icon">
                                  <i class="fas fa-money-bill"></i>
                                </span>
                              </router-link>
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

          <!-- Right Column -->
          <div class="column is-4">
            <!-- Customer Stats -->
            <div class="card mb-5">
              <header class="card-header">
                <p class="card-header-title">
                  <span class="icon mr-2">
                    <i class="fas fa-chart-pie"></i>
                  </span>
                  Customer Summary
                </p>
              </header>
              <div class="card-content">
                <div class="stat-item">
                  <div class="level">
                    <div class="level-left">
                      <div>
                        <p class="has-text-grey is-size-7">Total Loans</p>
                        <p class="title is-4">{{ customerStats.totalLoans }}</p>
                      </div>
                    </div>
                    <div class="level-right">
                      <span class="icon has-text-info">
                        <i class="fas fa-file-invoice-dollar fa-lg"></i>
                      </span>
                    </div>
                  </div>
                </div>
                
                <hr>
                
                <div class="stat-item">
                  <div class="level">
                    <div class="level-left">
                      <div>
                        <p class="has-text-grey is-size-7">Active Loans</p>
                        <p class="title is-4">{{ customerStats.activeLoans }}</p>
                      </div>
                    </div>
                    <div class="level-right">
                      <span class="icon has-text-success">
                        <i class="fas fa-check-circle fa-lg"></i>
                      </span>
                    </div>
                  </div>
                </div>
                
                <hr>
                
                <div class="stat-item">
                  <div class="level">
                    <div class="level-left">
                      <div>
                        <p class="has-text-grey is-size-7">Total Borrowed</p>
                        <p class="title is-4">₱{{ formatCurrency(customerStats.totalBorrowed) }}</p>
                      </div>
                    </div>
                    <div class="level-right">
                      <span class="icon has-text-warning">
                        <i class="fas fa-coins fa-lg"></i>
                      </span>
                    </div>
                  </div>
                </div>
                
                <hr>
                
                <div class="stat-item">
                  <div class="level">
                    <div class="level-left">
                      <div>
                        <p class="has-text-grey is-size-7">Outstanding</p>
                        <p class="title is-4">₱{{ formatCurrency(customerStats.totalOutstanding) }}</p>
                      </div>
                    </div>
                    <div class="level-right">
                      <span class="icon has-text-danger">
                        <i class="fas fa-exclamation-triangle fa-lg"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent Activity -->
            <div class="card">
              <header class="card-header">
                <p class="card-header-title">
                  <span class="icon mr-2">
                    <i class="fas fa-history"></i>
                  </span>
                  Recent Activity
                </p>
              </header>
              <div class="card-content">
                <div class="timeline">
                  <div class="timeline-item" v-for="activity in recentActivity" :key="activity.id">
                    <div class="timeline-marker" :class="getActivityColor(activity.type)"></div>
                    <div class="timeline-content">
                      <p class="heading">{{ formatDate(activity.date) }}</p>
                      <p>{{ activity.description }}</p>
                    </div>
                  </div>
                  
                  <div v-if="recentActivity.length === 0" class="has-text-centered has-text-grey">
                    <p>No recent activity</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="section">
      <div class="container">
        <div class="has-text-centered py-6">
          <div class="loading-spinner"></div>
          <p class="mt-4">Loading customer details...</p>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal" :class="{ 'is-active': showDeleteModal }">
      <div class="modal-background" @click="showDeleteModal = false"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Delete Customer</p>
          <button class="delete" @click="showDeleteModal = false"></button>
        </header>
        <section class="modal-card-body">
          <p>Are you sure you want to delete <strong>{{ customer?.first_name }} {{ customer?.last_name }}</strong>?</p>
          <div class="notification is-warning mt-4">
            <p><strong>Warning:</strong> This action cannot be undone. All associated loans, payments, and data will also be deleted.</p>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-danger" @click="deleteCustomer" :class="{ 'is-loading': isDeleting }">Delete</button>
          <button class="button" @click="showDeleteModal = false">Cancel</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../../services/api';

export default {
  name: 'ModernCustomerDetail',
  data() {
    return {
      customer: null,
      customerLoans: [],
      isLoadingLoans: false,
      customerStats: {
        totalLoans: 0,
        activeLoans: 0,
        totalBorrowed: 0,
        totalOutstanding: 0
      },
      recentActivity: [],
      
      // Delete modal
      showDeleteModal: false,
      isDeleting: false,
      
      defaultAvatar: '/api/placeholder/64/64'
    };
  },
  async created() {
    await this.fetchCustomer();
    await this.fetchCustomerLoans();
    this.calculateStats();
    this.generateRecentActivity();
  },
  methods: {
    async fetchCustomer() {
      try {
        const response = await api.get(`/customers/${this.$route.params.id}`);
        this.customer = response.data;
      } catch (error) {
        console.error('Error fetching customer details:', error);
        this.$emit('notification', 'error', 'Error', 'Failed to load customer details');
        this.$router.push('/customers');
      }
    },
    
    async fetchCustomerLoans() {
      this.isLoadingLoans = true;
      try {
        const response = await api.get(`/loans?customer=${this.$route.params.id}`);
        this.customerLoans = response.data || [];
      } catch (error) {
        console.error('Error fetching customer loans:', error);
        this.customerLoans = [];
      } finally {
        this.isLoadingLoans = false;
      }
    },
    
    calculateStats() {
      this.customerStats = {
        totalLoans: this.customerLoans.length,
        activeLoans: this.customerLoans.filter(loan => loan.status === 'ACTIVE').length,
        totalBorrowed: this.customerLoans.reduce((sum, loan) => sum + parseFloat(loan.principal_amount || 0), 0),
        totalOutstanding: this.customerLoans
          .filter(loan => loan.status === 'ACTIVE')
          .reduce((sum, loan) => sum + parseFloat(loan.outstanding_principal || 0), 0)
      };
    },
    
    generateRecentActivity() {
      // Generate sample activity from loans
      this.recentActivity = this.customerLoans
        .slice(0, 5)
        .map(loan => ({
          id: loan.id,
          type: 'loan',
          date: loan.created_at,
          description: `Loan ${loan.loan_number} created for ₱${this.formatCurrency(loan.principal_amount)}`
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    
    confirmDelete() {
      this.showDeleteModal = true;
    },
    
    async deleteCustomer() {
      this.isDeleting = true;
      try {
        await api.delete(`/customers/${this.customer.id}`);
        this.$emit('notification', 'success', 'Success', 'Customer deleted successfully');
        this.$router.push('/customers');
      } catch (error) {
        console.error('Error deleting customer:', error);
        this.$emit('notification', 'error', 'Error', 'Failed to delete customer');
      } finally {
        this.isDeleting = false;
        this.showDeleteModal = false;
      }
    },
    
    getProfilePhotoUrl(profilePhoto) {
      if (!profilePhoto) return this.defaultAvatar;
      if (profilePhoto.startsWith('http')) return profilePhoto;
      return `http://localhost:3000${profilePhoto}`;
    },
    
    handleImageError(event) {
      event.target.src = this.defaultAvatar;
    },
    
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },
    
    formatCurrency(amount) {
      if (!amount) return '0.00';
      return parseFloat(amount).toLocaleString('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
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
    
    getActivityColor(type) {
      const colorMap = {
        'loan': 'is-info',
        'payment': 'is-success',
        'update': 'is-warning'
      };
      return colorMap[type] || 'is-light';
    }
  }
};
</script>

