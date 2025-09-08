<template>
  <div class="loan-card" @click="viewLoan">
    <div class="card">
      <!-- Card Header -->
      <header class="card-header">
        <div class="card-header-title is-size-6">
          <span class="loan-number">{{ loan.loan_number }}</span>
          <span class="tag ml-2" :class="getStatusClass(loan.status)">
            {{ formatStatus(loan.status) }}
          </span>
        </div>
        <div class="card-header-icon">
          <div class="dropdown is-right" :class="{ 'is-active': showDropdown }" @click.stop>
            <div class="dropdown-trigger">
              <button class="button is-small is-ghost" @click="toggleDropdown">
                <span class="icon">
                  <i class="fas fa-ellipsis-v"></i>
                </span>
              </button>
            </div>
            <div class="dropdown-menu">
              <div class="dropdown-content">
                <a class="dropdown-item" @click="$emit('action', 'edit', loan.id)">
                  <span class="icon">
                    <i class="fas fa-edit"></i>
                  </span>
                  <span>Edit</span>
                </a>
                <a class="dropdown-item" @click="$emit('action', 'payment', loan.id)">
                  <span class="icon">
                    <i class="fas fa-money-bill-wave"></i>
                  </span>
                  <span>Make Payment</span>
                </a>
                <a class="dropdown-item" @click="$emit('action', 'extend', loan.id)">
                  <span class="icon">
                    <i class="fas fa-calendar-plus"></i>
                  </span>
                  <span>Extend Loan</span>
                </a>
                <hr class="dropdown-divider">
                <a class="dropdown-item" @click="printLoan">
                  <span class="icon">
                    <i class="fas fa-print"></i>
                  </span>
                  <span>Print</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Card Content -->
      <div class="card-content">
        <!-- Customer Info -->
        <div class="customer-info">
          <div class="media">
            <div class="media-left">
              <figure class="image is-40x40">
                <div class="avatar">
                  <span class="avatar-initials">
                    {{ getCustomerInitials(loan.customer) }}
                  </span>
                </div>
              </figure>
            </div>
            <div class="media-content">
              <div class="customer-name">
                {{ loan.customer?.first_name }} {{ loan.customer?.last_name }}
              </div>
              <div class="customer-phone">
                {{ loan.customer?.phone || 'No phone' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Loan Details -->
        <div class="loan-details">
          <div class="detail-row">
            <span class="detail-label">Loan Type:</span>
            <span class="tag is-light" :class="getLoanTypeClass(loan.loan_type)">
              {{ formatLoanType(loan.loan_type) }}
            </span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">Principal Amount:</span>
            <span class="detail-value has-text-weight-bold">
              ₱{{ formatCurrency(loan.principal_amount) }}
            </span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">Outstanding:</span>
            <span class="detail-value" :class="getOutstandingClass(loan.outstanding_principal, loan.principal_amount)">
              ₱{{ formatCurrency(loan.outstanding_principal) }}
            </span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">Interest Rate:</span>
            <span class="detail-value">{{ loan.interest_rate }}% monthly</span>
          </div>
        </div>

        <!-- Due Date Section -->
        <div class="due-date-section" :class="getDueDateSectionClass(loan.maturity_date, loan.status)">
          <div class="due-date-header">
            <span class="icon is-small">
              <i class="fas" :class="getDueDateIcon(loan.maturity_date, loan.status)"></i>
            </span>
            <span class="due-date-label">{{ getDueDateLabel(loan.status) }}</span>
          </div>
          <div class="due-date-value">
            {{ formatDate(loan.maturity_date) }}
          </div>
          <div class="due-date-countdown" v-if="loan.status === 'ACTIVE'">
            {{ getTimeUntilDue(loan.maturity_date) }}
          </div>
        </div>

        <!-- Progress Bar (Payment Progress) -->
        <div class="payment-progress" v-if="loan.status !== 'FORFEITED'">
          <div class="progress-label">
            <span>Payment Progress</span>
            <span class="progress-percentage">{{ getPaymentProgress(loan) }}%</span>
          </div>
          <progress class="progress" 
                    :class="getProgressClass(loan)" 
                    :value="getPaymentProgress(loan)" 
                    max="100">
            {{ getPaymentProgress(loan) }}%
          </progress>
        </div>

        <!-- Collateral Info (if available) -->
        <div class="collateral-info" v-if="loan.collaterals && loan.collaterals.length > 0">
          <div class="collateral-header">
            <span class="icon is-small">
              <i class="fas fa-shield-alt"></i>
            </span>
            <span>Collateral</span>
          </div>
          <div class="collateral-items">
            <div v-for="(collateral, index) in loan.collaterals.slice(0, 2)" 
                 :key="index" 
                 class="collateral-item">
              <span class="collateral-type">{{ formatCollateralType(collateral.collateral_type) }}</span>
              <span class="collateral-desc">{{ getCollateralDescription(collateral) }}</span>
            </div>
            <div v-if="loan.collaterals.length > 2" class="collateral-more">
              +{{ loan.collaterals.length - 2 }} more items
            </div>
          </div>
        </div>

        <!-- Notes/Alerts -->
        <div class="loan-alerts" v-if="hasAlerts(loan)">
          <div class="alert-item" v-for="alert in getLoanAlerts(loan)" :key="alert.type">
            <span class="icon is-small" :class="alert.iconClass">
              <i class="fas" :class="alert.icon"></i>
            </span>
            <span class="alert-text">{{ alert.message }}</span>
          </div>
        </div>
      </div>

      <!-- Card Footer -->
      <footer class="card-footer">
        <div class="card-footer-item">
          <div class="quick-actions">
            <button class="button is-small is-primary is-outlined" @click.stop="$emit('action', 'view', loan.id)">
              <span class="icon">
                <i class="fas fa-eye"></i>
              </span>
              <span>View</span>
            </button>
            
            <button class="button is-small is-success is-outlined" 
                    @click.stop="$emit('action', 'payment', loan.id)"
                    v-if="loan.status === 'ACTIVE' || loan.status === 'OVERDUE'">
              <span class="icon">
                <i class="fas fa-money-bill-wave"></i>
              </span>
              <span>Pay</span>
            </button>
            
            <button class="button is-small is-warning is-outlined" 
                    @click.stop="$emit('action', 'edit', loan.id)">
              <span class="icon">
                <i class="fas fa-edit"></i>
              </span>
              <span>Edit</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoanCard',
  props: {
    loan: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showDropdown: false
    };
  },
  methods: {
    viewLoan() {
      this.$emit('action', 'view', this.loan.id);
    },

    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },

    printLoan() {
      window.open(`/api/loans/${this.loan.id}/print`, '_blank');
      this.showDropdown = false;
    },

    getCustomerInitials(customer) {
      if (!customer) return '??';
      const first = customer.first_name?.charAt(0) || '';
      const last = customer.last_name?.charAt(0) || '';
      return (first + last).toUpperCase() || '??';
    },

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

    formatCollateralType(type) {
      const typeMap = {
        'PHYSICAL_ITEM': 'Physical Item',
        'VEHICLE_TITLE': 'Vehicle',
        'PROPERTY_TITLE': 'Property',
        'CHECK': 'Check',
        'NONE': 'None'
      };
      return typeMap[type] || type;
    },

    getCollateralDescription(collateral) {
      switch (collateral.collateral_type) {
        case 'PHYSICAL_ITEM':
          return collateral.item_name || 'Physical Item';
        case 'VEHICLE_TITLE':
          return `${collateral.vehicle_year} ${collateral.vehicle_make} ${collateral.vehicle_model}`.trim();
        case 'PROPERTY_TITLE':
          return collateral.property_type || 'Property';
        case 'CHECK':
          return `Check #${collateral.check_number}`;
        default:
          return collateral.description || 'Collateral';
      }
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

    getOutstandingClass(outstanding, principal) {
      const ratio = outstanding / principal;
      if (ratio > 0.8) return 'has-text-danger';
      if (ratio > 0.5) return 'has-text-warning';
      return 'has-text-success';
    },

    getDueDateSectionClass(dateString, status) {
      if (status === 'OVERDUE') return 'has-background-danger-light';
      
      const dueDate = new Date(dateString);
      const now = new Date();
      const diffDays = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));

      if (diffDays <= 0) return 'has-background-danger-light';
      if (diffDays <= 7) return 'has-background-warning-light';
      return 'has-background-success-light';
    },

    getDueDateIcon(dateString, status) {
      if (status === 'OVERDUE') return 'fa-exclamation-triangle';
      
      const dueDate = new Date(dateString);
      const now = new Date();
      const diffDays = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));

      if (diffDays <= 0) return 'fa-exclamation-triangle';
      if (diffDays <= 7) return 'fa-clock';
      return 'fa-calendar-check';
    },

    getDueDateLabel(status) {
      if (status === 'OVERDUE') return 'Overdue';
      if (status === 'REDEEMED') return 'Redeemed';
      if (status === 'FORFEITED') return 'Forfeited';
      return 'Due Date';
    },

    getTimeUntilDue(dateString) {
      const dueDate = new Date(dateString);
      const now = new Date();
      const diffDays = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));

      if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
      if (diffDays === 0) return 'Due today';
      if (diffDays === 1) return 'Due tomorrow';
      return `${diffDays} days left`;
    },

    getPaymentProgress(loan) {
      const paid = parseFloat(loan.principal_amount) - parseFloat(loan.outstanding_principal || 0);
      const progress = (paid / parseFloat(loan.principal_amount)) * 100;
      return Math.max(0, Math.min(100, Math.round(progress)));
    },

    getProgressClass(loan) {
      const progress = this.getPaymentProgress(loan);
      if (progress >= 80) return 'is-success';
      if (progress >= 50) return 'is-warning';
      return 'is-danger';
    },

    hasAlerts(loan) {
      return this.getLoanAlerts(loan).length > 0;
    },

    getLoanAlerts(loan) {
      const alerts = [];
      
      // Overdue alert
      if (loan.status === 'OVERDUE') {
        alerts.push({
          type: 'overdue',
          icon: 'fa-exclamation-triangle',
          iconClass: 'has-text-danger',
          message: 'Payment overdue'
        });
      }

      // High interest alert
      if (parseFloat(loan.accrued_interest || 0) > parseFloat(loan.principal_amount) * 0.5) {
        alerts.push({
          type: 'high_interest',
          icon: 'fa-percentage',
          iconClass: 'has-text-warning',
          message: 'High accrued interest'
        });
      }

      // Due soon alert
      const dueDate = new Date(loan.maturity_date);
      const now = new Date();
      const diffDays = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 3 && diffDays > 0 && loan.status === 'ACTIVE') {
        alerts.push({
          type: 'due_soon',
          icon: 'fa-clock',
          iconClass: 'has-text-warning',
          message: 'Due very soon'
        });
      }

      return alerts.slice(0, 2); // Limit to 2 alerts
    }
  }
};
</script>

