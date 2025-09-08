<template>
  <div class="page-container">
    <!-- Page Header -->
    <div class="page-header">
      <div class="container">
        <div class="level">
          <div class="level-left">
            <div class="level-item">
              <div>
                <h1 class="title is-3">
                  <span class="icon mr-2">
                    <i class="fas fa-file-invoice-dollar"></i>
                  </span>
                  Loan Management
                </h1>
                <p class="subtitle is-5">
                  Manage all your loans, payments, and customer relationships
                </p>
              </div>
            </div>
          </div>
          <div class="level-right">
            <div class="level-item">
              <div class="field is-grouped">
                <p class="control">
                  <router-link to="/loans/new" class="button is-primary">
                    <span class="icon">
                      <i class="fas fa-plus"></i>
                    </span>
                    <span>New Loan</span>
                  </router-link>
                </p>
                <p class="control">
                  <button class="button is-light" @click="refreshLoans">
                    <span class="icon">
                      <i class="fas fa-sync-alt" :class="{ 'fa-spin': isRefreshing }"></i>
                    </span>
                    <span class="is-hidden-mobile">Refresh</span>
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="page-content">
      <!-- Quick Stats Cards -->
      <section class="section py-4">
        <div class="container">
          <div class="columns">
            <div class="column">
              <div class="card stats-card has-background-success has-text-white">
                <div class="card-content">
                  <div class="media">
                    <div class="media-content">
                      <p class="title is-3 has-text-white">{{ stats.active }}</p>
                      <p class="subtitle is-6 has-text-white-bis">Active Loans</p>
                    </div>
                    <div class="media-right">
                      <span class="icon is-large has-text-white-ter">
                        <i class="fas fa-handshake fa-2x"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="column">
              <div class="card stats-card has-background-warning has-text-white">
                <div class="card-content">
                  <div class="media">
                    <div class="media-content">
                      <p class="title is-3 has-text-white">{{ stats.dueSoon }}</p>
                      <p class="subtitle is-6 has-text-white-bis">Due Soon</p>
                    </div>
                    <div class="media-right">
                      <span class="icon is-large has-text-white-ter">
                        <i class="fas fa-clock fa-2x"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="column">
              <div class="card stats-card has-background-danger has-text-white">
                <div class="card-content">
                  <div class="media">
                    <div class="media-content">
                      <p class="title is-3 has-text-white">{{ stats.overdue }}</p>
                      <p class="subtitle is-6 has-text-white-bis">Overdue</p>
                    </div>
                    <div class="media-right">
                      <span class="icon is-large has-text-white-ter">
                        <i class="fas fa-exclamation-triangle fa-2x"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="column">
              <div class="card stats-card has-background-info has-text-white">
                <div class="card-content">
                  <div class="media">
                    <div class="media-content">
                      <p class="title is-3 has-text-white">₱{{ formatCurrency(stats.totalValue) }}</p>
                      <p class="subtitle is-6 has-text-white-bis">Total Value</p>
                    </div>
                    <div class="media-right">
                      <span class="icon is-large has-text-white-ter">
                        <i class="fas fa-chart-line fa-2x"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Filters and Search -->
      <section class="section py-4">
        <div class="container">
          <div class="card">
            <div class="card-content">
              <div class="columns is-multiline is-mobile">
                <!-- Search -->
                <div class="column is-12-mobile is-6-tablet is-4-desktop">
                  <div class="field">
                    <label class="label">Search Loans</label>
                    <div class="control has-icons-left has-icons-right">
                      <input class="input" type="text" v-model="searchQuery" 
                             placeholder="Search by loan number, customer name..."
                             @input="debouncedSearch">
                      <span class="icon is-small is-left">
                        <i class="fas fa-search"></i>
                      </span>
                      <span class="icon is-small is-right" v-if="searchQuery" @click="clearSearch">
                        <i class="fas fa-times"></i>
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Status Filter -->
                <div class="column is-12-mobile is-6-tablet is-3-desktop">
                  <div class="field">
                    <label class="label">Status</label>
                    <div class="control">
                      <div class="select is-fullwidth">
                        <select v-model="filters.status" @change="applyFilters">
                          <option value="">All Status</option>
                          <option value="ACTIVE">Active</option>
                          <option value="DUE_SOON">Due Soon</option>
                          <option value="OVERDUE">Overdue</option>
                          <option value="REDEEMED">Redeemed</option>
                          <option value="FORFEITED">Forfeited</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Loan Type Filter -->
                <div class="column is-12-mobile is-6-tablet is-3-desktop">
                  <div class="field">
                    <label class="label">Loan Type</label>
                    <div class="control">
                      <div class="select is-fullwidth">
                        <select v-model="filters.loanType" @change="applyFilters">
                          <option value="">All Types</option>
                          <option value="PAWN">Pawn</option>
                          <option value="TITLE">Title Loan</option>
                          <option value="CHECK_REDISCOUNT">Check Rediscount</option>
                          <option value="SECURED">Secured</option>
                          <option value="UNSECURED">Unsecured</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="column is-12-mobile is-6-tablet is-2-desktop">
                  <div class="field">
                    <label class="label">Actions</label>
                    <div class="control">
                      <div class="field is-grouped">
                        <p class="control">
                          <button class="button is-light" @click="resetFilters">
                            <span class="icon">
                              <i class="fas fa-undo"></i>
                            </span>
                            <span class="is-hidden-mobile">Reset</span>
                          </button>
                        </p>
                        <p class="control">
                          <button class="button is-light" @click="exportLoans">
                            <span class="icon">
                              <i class="fas fa-download"></i>
                            </span>
                            <span class="is-hidden-mobile">Export</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Loans Grid/List -->
      <section class="section">
        <div class="container">
        <!-- View Toggle -->
        <div class="level is-mobile">
          <div class="level-left">
            <div class="level-item">
              <p class="subtitle is-6">
                {{ filteredLoans.length }} loan{{ filteredLoans.length !== 1 ? 's' : '' }} found
                <span v-if="searchQuery"> for "{{ searchQuery }}"</span>
              </p>
            </div>
          </div>
          <div class="level-right">
            <div class="level-item">
              <div class="field is-grouped">
                <p class="control">
                  <button class="button is-small" 
                          :class="{ 'is-primary': viewMode === 'grid' }"
                          @click="viewMode = 'grid'">
                    <span class="icon">
                      <i class="fas fa-th"></i>
                    </span>
                  </button>
                </p>
                <p class="control">
                  <button class="button is-small" 
                          :class="{ 'is-primary': viewMode === 'list' }"
                          @click="viewMode = 'list'">
                    <span class="icon">
                      <i class="fas fa-list"></i>
                    </span>
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="has-text-centered py-6">
          <div class="loading-spinner"></div>
          <p class="mt-4">Loading loans...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredLoans.length === 0 && !isLoading" class="has-text-centered py-6 px-4">
          <div class="has-text-centered py-6">
            <span class="icon is-large has-text-grey-light">
              <i class="fas fa-file-invoice-dollar fa-3x"></i>
            </span>
            <h3 class="title is-4 has-text-grey-light mt-4">
              {{ searchQuery ? 'No loans found' : 'No loans yet' }}
            </h3>
            <p class="subtitle is-6 has-text-grey">
              {{ searchQuery 
                  ? 'Try adjusting your search criteria' 
                  : 'Create your first loan to get started' }}
            </p>
            <div class="mt-5" v-if="!searchQuery">
              <router-link to="/loans/new" class="button is-primary has-text-white">
                <span class="icon">
                  <i class="fas fa-plus"></i>
                </span>
                <span>Create First Loan</span>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Grid View -->
        <div v-else-if="viewMode === 'grid'" class="loan-grid">
          <div class="columns is-multiline">
            <div v-for="loan in paginatedLoans" :key="loan.id" 
                 class="column is-12-mobile is-6-tablet is-4-desktop">
              <LoanCard :loan="loan" @action="handleLoanAction" />
            </div>
          </div>
        </div>

        <!-- List View -->
        <div v-else class="loan-list">
          <div class="card">
            <div class="table-container">
              <table class="table is-fullwidth is-hoverable">
                <thead>
                  <tr>
                    <th @click="sortBy('loan_number')" class="is-sortable">
                      Loan Number
                      <span class="icon is-small">
                        <i class="fas fa-sort"></i>
                      </span>
                    </th>
                    <th @click="sortBy('customer')" class="is-sortable">Customer</th>
                    <th @click="sortBy('loan_type')" class="is-sortable">Type</th>
                    <th @click="sortBy('principal_amount')" class="is-sortable">Amount</th>
                    <th @click="sortBy('maturity_date')" class="is-sortable">Maturity</th>
                    <th @click="sortBy('status')" class="is-sortable">Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="loan in paginatedLoans" :key="loan.id">
                    <td>
                      <router-link :to="`/loans/${loan.id}`" class="has-text-weight-semibold">
                        {{ loan.loan_number }}
                      </router-link>
                    </td>
                    <td>
                      <div>
                        <strong>{{ loan.customer?.first_name }} {{ loan.customer?.last_name }}</strong>
                        <br>
                        <small class="has-text-grey">{{ loan.customer?.phone }}</small>
                      </div>
                    </td>
                    <td>
                      <span class="tag" :class="getLoanTypeClass(loan.loan_type)">
                        {{ formatLoanType(loan.loan_type) }}
                      </span>
                    </td>
                    <td>
                      <strong>₱{{ formatCurrency(loan.principal_amount) }}</strong>
                      <br>
                      <small class="has-text-grey">Outstanding: ₱{{ formatCurrency(loan.outstanding_principal) }}</small>
                    </td>
                    <td>
                      <div>
                        {{ formatDate(loan.maturity_date) }}
                        <br>
                        <small :class="getDueDateClass(loan.maturity_date)">
                          {{ getTimeUntilDue(loan.maturity_date) }}
                        </small>
                      </div>
                    </td>
                    <td>
                      <span class="tag" :class="getStatusClass(loan.status)">
                        {{ formatStatus(loan.status) }}
                      </span>
                    </td>
                    <td>
                      <div class="field is-grouped">
                        <p class="control">
                          <router-link :to="`/loans/${loan.id}`" class="button is-small is-info">
                            <span class="icon">
                              <i class="fas fa-eye"></i>
                            </span>
                          </router-link>
                        </p>
                        <p class="control">
                          <router-link :to="`/loans/${loan.id}/edit`" class="button is-small is-warning">
                            <span class="icon">
                              <i class="fas fa-edit"></i>
                            </span>
                          </router-link>
                        </p>
                        <p class="control">
                          <button class="button is-small is-light" @click="showLoanMenu(loan.id, $event)">
                            <span class="icon">
                              <i class="fas fa-ellipsis-v"></i>
                            </span>
                          </button>
                        </p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <nav class="pagination is-centered mt-5" v-if="totalPages > 1">
          <button class="pagination-previous" 
                  :disabled="currentPage === 1" 
                  @click="changePage(currentPage - 1)">
            Previous
          </button>
          <button class="pagination-next" 
                  :disabled="currentPage === totalPages" 
                  @click="changePage(currentPage + 1)">
            Next page
          </button>
          <ul class="pagination-list">
            <li v-for="page in visiblePages" :key="page">
              <button class="pagination-link" 
                      :class="{ 'is-current': page === currentPage }"
                      @click="changePage(page)">
                {{ page }}
              </button>
            </li>
          </ul>
        </nav>
        </div>
      </section>
    </div>

    <!-- Context Menu -->
    <div class="context-menu" v-if="contextMenu.show" :style="contextMenuStyle" @click.stop>
      <div class="dropdown-content">
        <a class="dropdown-item" @click="makePayment(contextMenu.loanId)">
          <span class="icon">
            <i class="fas fa-money-bill-wave"></i>
          </span>
          <span>Make Payment</span>
        </a>
        <a class="dropdown-item" @click="extendLoan(contextMenu.loanId)">
          <span class="icon">
            <i class="fas fa-calendar-plus"></i>
          </span>
          <span>Extend Loan</span>
        </a>
        <hr class="dropdown-divider">
        <a class="dropdown-item" @click="printLoanDetails(contextMenu.loanId)">
          <span class="icon">
            <i class="fas fa-print"></i>
          </span>
          <span>Print Details</span>
        </a>
        <a class="dropdown-item has-text-danger" @click="deleteLoan(contextMenu.loanId)">
          <span class="icon">
            <i class="fas fa-trash"></i>
          </span>
          <span>Delete Loan</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../../services/api';
import LoanCard from '../../../components/cards/LoanCard.vue';

export default {
  name: 'ModernLoanList',
  components: {
    LoanCard
  },
  data() {
    return {
      loans: [],
      isLoading: true,
      isRefreshing: false,
      searchQuery: '',
      viewMode: 'grid', // 'grid' or 'list'
      currentPage: 1,
      loansPerPage: 12,
      sortField: 'created_at',
      sortDirection: 'desc',
      stats: {
        active: 0,
        dueSoon: 0,
        overdue: 0,
        totalValue: 0
      },
      filters: {
        status: '',
        loanType: '',
        dateRange: ''
      },
      contextMenu: {
        show: false,
        x: 0,
        y: 0,
        loanId: null
      }
    };
  },
  computed: {
    filteredLoans() {
      let filtered = this.loans;

      // Search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(loan => 
          loan.loan_number.toLowerCase().includes(query) ||
          (loan.customer?.first_name + ' ' + loan.customer?.last_name).toLowerCase().includes(query) ||
          loan.customer?.phone?.includes(query)
        );
      }

      // Status filter
      if (this.filters.status) {
        filtered = filtered.filter(loan => loan.status === this.filters.status);
      }

      // Loan type filter
      if (this.filters.loanType) {
        filtered = filtered.filter(loan => loan.loan_type === this.filters.loanType);
      }

      return filtered;
    },

    paginatedLoans() {
      const start = (this.currentPage - 1) * this.loansPerPage;
      const end = start + this.loansPerPage;
      return this.filteredLoans.slice(start, end);
    },

    totalPages() {
      return Math.ceil(this.filteredLoans.length / this.loansPerPage);
    },

    visiblePages() {
      const pages = [];
      const total = this.totalPages;
      const current = this.currentPage;
      
      if (total <= 7) {
        for (let i = 1; i <= total; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        if (current > 4) pages.push('...');
        
        const start = Math.max(2, current - 2);
        const end = Math.min(total - 1, current + 2);
        
        for (let i = start; i <= end; i++) {
          pages.push(i);
        }
        
        if (current < total - 3) pages.push('...');
        pages.push(total);
      }
      
      return pages;
    },

    contextMenuStyle() {
      return {
        position: 'fixed',
        top: this.contextMenu.y + 'px',
        left: this.contextMenu.x + 'px',
        zIndex: 1000
      };
    },

    debouncedSearch() {
      let timeout;
      return () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          this.applyFilters();
        }, 300);
      };
    }
  },
  async created() {
    await this.loadLoans();
    this.calculateStats();
    
    // Close context menu when clicking outside
    document.addEventListener('click', this.closeContextMenu);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.closeContextMenu);
  },
  methods: {
    async loadLoans() {
      this.isLoading = true;
      try {
        const response = await api.get('/loans');
        this.loans = response.data || [];
      } catch (error) {
        console.error('Error loading loans:', error);
        this.$emit('notification', 'error', 'Error', 'Failed to load loans');
      } finally {
        this.isLoading = false;
      }
    },

    async refreshLoans() {
      this.isRefreshing = true;
      await this.loadLoans();
      this.calculateStats();
      this.isRefreshing = false;
    },

    calculateStats() {
      const now = new Date();
      const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      this.stats = {
        active: this.loans.filter(l => l.status === 'ACTIVE').length,
        dueSoon: this.loans.filter(l => {
          const maturityDate = new Date(l.maturity_date);
          return l.status === 'ACTIVE' && maturityDate <= sevenDaysFromNow && maturityDate >= now;
        }).length,
        overdue: this.loans.filter(l => l.status === 'OVERDUE').length,
        totalValue: this.loans.reduce((sum, l) => sum + parseFloat(l.outstanding_principal || 0), 0)
      };
    },

    applyFilters() {
      this.currentPage = 1; // Reset to first page when filters change
    },

    resetFilters() {
      this.searchQuery = '';
      this.filters = {
        status: '',
        loanType: '',
        dateRange: ''
      };
      this.currentPage = 1;
    },

    clearSearch() {
      this.searchQuery = '';
      this.applyFilters();
    },

    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },

    sortBy(field) {
      if (this.sortField === field) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortField = field;
        this.sortDirection = 'asc';
      }
      // Apply sorting logic here
    },

    showLoanMenu(loanId, event) {
      event.stopPropagation();
      this.contextMenu = {
        show: true,
        x: event.clientX,
        y: event.clientY,
        loanId
      };
    },

    closeContextMenu() {
      this.contextMenu.show = false;
    },

    handleLoanAction(action, loanId) {
      switch (action) {
        case 'view':
          this.$router.push(`/loans/${loanId}`);
          break;
        case 'edit':
          this.$router.push(`/loans/${loanId}/edit`);
          break;
        case 'payment':
          this.makePayment(loanId);
          break;
        case 'extend':
          this.extendLoan(loanId);
          break;
      }
    },

    makePayment(loanId) {
      this.$router.push(`/loans/${loanId}/payment`);
      this.closeContextMenu();
    },

    extendLoan(loanId) {
      this.$router.push(`/loans/${loanId}/extend`);
      this.closeContextMenu();
    },

    printLoanDetails(loanId) {
      window.open(`/api/loans/${loanId}/print`, '_blank');
      this.closeContextMenu();
    },

    async deleteLoan(loanId) {
      if (confirm('Are you sure you want to delete this loan? This action cannot be undone.')) {
        try {
          await api.delete(`/loans/${loanId}`);
          this.loans = this.loans.filter(l => l.id !== loanId);
          this.calculateStats();
          this.$emit('notification', 'success', 'Success', 'Loan deleted successfully');
        } catch (error) {
          console.error('Error deleting loan:', error);
          this.$emit('notification', 'error', 'Error', 'Failed to delete loan');
        }
      }
      this.closeContextMenu();
    },

    exportLoans() {
      // Implementation for exporting loans
      console.log('Export functionality');
    },

    // Formatting methods
    formatCurrency(amount) {
      if (!amount) return '0.00';
      return parseFloat(amount).toLocaleString('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
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

    formatLoanType(type) {
      const typeMap = {
        'PAWN': 'Pawn',
        'TITLE': 'Title',
        'CHECK_REDISCOUNT': 'Check',
        'SECURED': 'Secured',
        'UNSECURED': 'Unsecured'
      };
      return typeMap[type] || type;
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

    getLoanTypeClass(type) {
      const typeMap = {
        'PAWN': 'is-primary',
        'TITLE': 'is-info',
        'CHECK_REDISCOUNT': 'is-warning',
        'SECURED': 'is-success',
        'UNSECURED': 'is-light'
      };
      return typeMap[type] || 'is-light';
    },

    getDueDateClass(dateString) {
      const dueDate = new Date(dateString);
      const now = new Date();
      const diffDays = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));

      if (diffDays < 0) return 'has-text-danger';
      if (diffDays <= 7) return 'has-text-warning';
      return 'has-text-grey';
    },

    getTimeUntilDue(dateString) {
      const dueDate = new Date(dateString);
      const now = new Date();
      const diffDays = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));

      if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
      if (diffDays === 0) return 'Due today';
      if (diffDays === 1) return 'Due tomorrow';
      return `${diffDays} days left`;
    }
  }
};
</script>

