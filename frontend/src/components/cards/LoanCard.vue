<template>
  <div class="modern-loan-card" @click="viewLoan">
    <div class="card">
      <!-- Card Header - Clean and Simple -->
      <header class="card-header">
        <div class="card-header-title">
          <div class="loan-header-info">
            <h3 class="loan-number">{{ loan.loan_number }}</h3>
            <span class="tag" :class="getStatusClass(loan.status)">
              {{ formatStatus(loan.status) }}
            </span>
          </div>
        </div>
      </header>

      <!-- Card Content - Organized Information -->
      <div class="card-content">
        <!-- Customer Section -->
        <div class="loan-section customer-section">
          <div class="customer-info">
            <div class="customer-avatar">
              {{ getCustomerInitials(loan.customer) }}
            </div>
            <div class="customer-details">
              <div class="customer-name">
                {{ loan.customer?.first_name }} {{ loan.customer?.last_name }}
              </div>
              <div class="customer-contact">
                {{ loan.customer?.phone || 'No phone' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Financial Overview -->
        <div class="loan-section financial-section">
          <div class="financial-grid">
            <div class="financial-item">
              <span class="financial-label">Principal</span>
              <span class="financial-value primary">₱{{ formatCurrency(loan.principal_amount) }}</span>
            </div>
            <div class="financial-item">
              <span class="financial-label">Outstanding</span>
              <span class="financial-value" :class="getOutstandingClass(loan.outstanding_principal, loan.principal_amount)">
                ₱{{ formatCurrency(loan.outstanding_principal) }}
              </span>
            </div>
          </div>
          
          <!-- Payment Progress -->
          <div class="payment-progress">
            <div class="progress-info">
              <span class="progress-label">Paid</span>
              <span class="progress-percentage">{{ getPaymentProgress(loan) }}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" 
                   :style="{ width: getPaymentProgress(loan) + '%' }"
                   :class="getProgressClass(loan)"></div>
            </div>
          </div>
        </div>

        <!-- Due Date Section -->
        <div class="loan-section due-section" :class="getDueDateSectionClass(loan.maturity_date, loan.status)">
          <div class="due-info">
            <div class="due-icon">
              <i class="fas" :class="getDueDateIcon(loan.maturity_date, loan.status)"></i>
            </div>
            <div class="due-details">
              <div class="due-label">{{ getDueDateLabel(loan.status) }}</div>
              <div class="due-date">{{ formatDate(loan.maturity_date) }}</div>
              <div class="due-countdown" v-if="loan.status === 'ACTIVE'">
                {{ getTimeUntilDue(loan.maturity_date) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Loan Type & Interest -->
        <div class="loan-section details-section">
          <div class="detail-chips">
            <span class="detail-chip loan-type" :class="getLoanTypeClass(loan.loan_type)">
              {{ formatLoanType(loan.loan_type) }}
            </span>
            <span class="detail-chip interest-rate">
              {{ loan.interest_rate }}% monthly
            </span>
          </div>
        </div>

        <!-- Alerts (if any) -->
        <div class="loan-section alerts-section" v-if="hasAlerts(loan)">
          <div class="alert-item" v-for="alert in getLoanAlerts(loan)" :key="alert.type" :class="alert.alertClass">
            <i class="fas" :class="alert.icon"></i>
            <span>{{ alert.message }}</span>
          </div>
        </div>
      </div>

      <!-- Card Footer - Action Buttons -->
      <footer class="card-footer">
        <button class="card-footer-item action-btn view-btn" @click.stop="$emit('action', 'view', loan.id)">
          <i class="fas fa-eye"></i>
          <span>View</span>
        </button>
        
        <button class="card-footer-item action-btn pay-btn" 
                @click.stop="$emit('action', 'payment', loan.id)"
                v-if="loan.status === 'ACTIVE' || loan.status === 'OVERDUE'">
          <i class="fas fa-money-bill-wave"></i>
          <span>Pay</span>
        </button>
        
        <button class="card-footer-item action-btn edit-btn" 
                @click.stop="$emit('action', 'edit', loan.id)">
          <i class="fas fa-edit"></i>
          <span>Edit</span>
        </button>
        
        <div class="card-footer-item dropdown-wrapper" @click.stop>
          <div class="dropdown is-right" :class="{ 'is-active': showDropdown }">
            <div class="dropdown-trigger">
              <button class="action-btn more-btn" @click="toggleDropdown">
                <i class="fas fa-ellipsis-h"></i>
              </button>
            </div>
            <div class="dropdown-menu">
              <div class="dropdown-content">
                <a class="dropdown-item" @click="$emit('action', 'extend', loan.id)">
                  <i class="fas fa-calendar-plus mr-2"></i>
                  Extend Loan
                </a>
                <a class="dropdown-item" @click="printLoan">
                  <i class="fas fa-print mr-2"></i>
                  Print Details
                </a>
              </div>
            </div>
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
          alertClass: 'alert-danger',
          message: 'Payment overdue'
        });
      }

      // High interest alert
      if (parseFloat(loan.accrued_interest || 0) > parseFloat(loan.principal_amount) * 0.5) {
        alerts.push({
          type: 'high_interest',
          icon: 'fa-percentage',
          alertClass: 'alert-warning',
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
          alertClass: 'alert-warning',
          message: 'Due very soon'
        });
      }

      return alerts.slice(0, 2); // Limit to 2 alerts
    }
  }
};
</script>

