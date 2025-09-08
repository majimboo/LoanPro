<template>
  <div class="has-background-light is-min-height-100vh">
    <!-- Progress Header -->
    <div class="has-background-white py-5 mb-5 form-header-border">
      <div class="container">
        <nav class="breadcrumb" aria-label="breadcrumbs">
          <ul>
            <li><router-link to="/dashboard">Dashboard</router-link></li>
            <li><router-link to="/loans">Loans</router-link></li>
            <li class="is-active"><a href="#" aria-current="page">{{ isEdit ? 'Edit' : 'New' }} Loan</a></li>
          </ul>
        </nav>
        
        <div class="level">
          <div class="level-left">
            <div class="level-item">
              <div>
                <h1 class="title is-3">
                  <span class="icon mr-2">
                    <i class="fas fa-file-invoice-dollar"></i>
                  </span>
                  {{ isEdit ? 'Edit Loan' : 'Create New Loan' }}
                </h1>
                <p class="subtitle is-5">
                  {{ isEdit ? 'Update loan details and terms' : 'Fill out the form below to create a new loan' }}
                </p>
              </div>
            </div>
          </div>
          <div class="level-right">
            <div class="level-item">
              <div class="field is-grouped">
                <p class="control">
                  <router-link to="/loans" class="button is-light">
                    <span class="icon">
                      <i class="fas fa-arrow-left"></i>
                    </span>
                    <span>Back to Loans</span>
                  </router-link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Content -->
    <div class="pb-6">
      <div class="container">
        <form @submit.prevent="handleSubmit">
          <div class="columns">
            <!-- Main Form Column -->
            <div class="column is-8">
              <!-- Step 1: Loan Basic Information -->
              <div class="card form-section">
                <header class="card-header">
                  <p class="card-header-title">
                    <span class="icon mr-2">
                      <i class="fas fa-info-circle"></i>
                    </span>
                    Loan Information
                  </p>
                  <span class="card-header-icon">
                    <span class="tag is-primary">Step 1</span>
                  </span>
                </header>
                <div class="card-content">
                  <!-- Customer Selection -->
                  <div class="field">
                    <label class="label">
                      Customer *
                      <HelpTooltip message="Select the customer for this loan. If the customer doesn't exist, create a new customer first." />
                    </label>
                    <div class="control">
                      <div class="select is-fullwidth" :class="{ 'is-danger': errors.customer_id }">
                        <select v-model="loan.customer_id" required @change="onCustomerChange">
                          <option value="">Select a customer...</option>
                          <option v-for="customer in customers" :key="customer.id" :value="customer.id">
                            {{ customer.first_name }} {{ customer.last_name }} ({{ customer.phone || 'No phone' }})
                          </option>
                        </select>
                      </div>
                    </div>
                    <p v-if="errors.customer_id" class="help is-danger">{{ errors.customer_id }}</p>
                    <p class="help">
                      Don't see the customer? 
                      <router-link to="/customers/new" class="has-text-link">Create a new customer</router-link>
                    </p>
                  </div>

                  <!-- Loan Type -->
                  <div class="field">
                    <label class="label">
                      Loan Type *
                      <HelpTooltip message="Choose the type of loan. This determines what kind of collateral can be used." />
                    </label>
                    <div class="control">
                      <div class="select is-fullwidth" :class="{ 'is-danger': errors.loan_type }">
                        <select v-model="loan.loan_type" required @change="onLoanTypeChange">
                          <option value="">Select loan type...</option>
                          <option value="PAWN">Pawn Loan - Physical items as collateral</option>
                          <option value="TITLE">Title Loan - Vehicle/Property title as collateral</option>
                          <option value="CHECK_REDISCOUNT">Check Rediscount - Check as collateral</option>
                          <option value="SECURED">Secured Loan - Other collateral</option>
                          <option value="UNSECURED">Unsecured Loan - No collateral required</option>
                        </select>
                      </div>
                    </div>
                    <p v-if="errors.loan_type" class="help is-danger">{{ errors.loan_type }}</p>
                  </div>

                  <!-- Loan Number (if editing) -->
                  <div class="field" v-if="isEdit">
                    <label class="label">Loan Number</label>
                    <div class="control">
                      <input class="input" type="text" v-model="loan.loan_number" disabled>
                    </div>
                    <p class="help">Loan numbers cannot be changed after creation.</p>
                  </div>

                  <!-- Date Fields -->
                  <div class="columns">
                    <div class="column">
                      <div class="field">
                        <label class="label">
                          Issue Date *
                          <HelpTooltip message="The date when the loan is issued. Usually today's date." />
                        </label>
                        <div class="control">
                          <input class="input" 
                                 type="date" 
                                 v-model="loan.issue_date" 
                                 :class="{ 'is-danger': errors.issue_date }"
                                 required
                                 @change="calculateMaturityDate">
                        </div>
                        <p v-if="errors.issue_date" class="help is-danger">{{ errors.issue_date }}</p>
                      </div>
                    </div>
                    <div class="column">
                      <div class="field">
                        <label class="label">
                          Loan Term (Months) *
                          <HelpTooltip message="How many months until the loan matures. Common terms are 1, 3, 6, or 12 months." />
                        </label>
                        <div class="control">
                          <div class="select is-fullwidth">
                            <select v-model="loanTermMonths" @change="calculateMaturityDate">
                              <option value="1">1 Month</option>
                              <option value="2">2 Months</option>
                              <option value="3">3 Months</option>
                              <option value="6">6 Months</option>
                              <option value="12">12 Months</option>
                              <option value="custom">Custom...</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="column">
                      <div class="field">
                        <label class="label">
                          Maturity Date *
                          <HelpTooltip message="The date when the loan must be repaid. Calculated automatically based on issue date and term." />
                        </label>
                        <div class="control">
                          <input class="input" 
                                 type="date" 
                                 v-model="loan.maturity_date" 
                                 :class="{ 'is-danger': errors.maturity_date }"
                                 :disabled="loanTermMonths !== 'custom'"
                                 required>
                        </div>
                        <p v-if="errors.maturity_date" class="help is-danger">{{ errors.maturity_date }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 2: Financial Details -->
              <div class="card form-section">
                <header class="card-header">
                  <p class="card-header-title">
                    <span class="icon mr-2">
                      <i class="fas fa-calculator"></i>
                    </span>
                    Financial Details
                  </p>
                  <span class="card-header-icon">
                    <span class="tag is-primary">Step 2</span>
                  </span>
                </header>
                <div class="card-content">
                  <div class="columns">
                    <div class="column">
                      <div class="field">
                        <label class="label">
                          Principal Amount (₱) *
                          <HelpTooltip message="The amount being loaned to the customer. Enter amount in Philippine Peso." />
                        </label>
                        <div class="control has-icons-left">
                          <input class="input" 
                                 type="number" 
                                 step="0.01" 
                                 v-model="loan.principal_amount" 
                                 :class="{ 'is-danger': errors.principal_amount }"
                                 required
                                 @input="calculateTotals">
                          <span class="icon is-small is-left">
                            <i class="fas fa-peso-sign"></i>
                          </span>
                        </div>
                        <p v-if="errors.principal_amount" class="help is-danger">{{ errors.principal_amount }}</p>
                      </div>
                    </div>
                    <div class="column">
                      <div class="field">
                        <label class="label">
                          Interest Rate (% per month) *
                          <HelpTooltip message="Monthly interest rate. For example, 5% means 5% interest per month." />
                        </label>
                        <div class="control has-icons-right">
                          <input class="input" 
                                 type="number" 
                                 step="0.01" 
                                 v-model="loan.interest_rate" 
                                 :class="{ 'is-danger': errors.interest_rate }"
                                 required
                                 @input="calculateTotals">
                          <span class="icon is-small is-right">
                            <i class="fas fa-percent"></i>
                          </span>
                        </div>
                        <p v-if="errors.interest_rate" class="help is-danger">{{ errors.interest_rate }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Financial Summary -->
                  <div class="notification is-light" v-if="loan.principal_amount && loan.interest_rate && loanTermMonths !== 'custom'">
                    <h6 class="title is-6">Loan Summary</h6>
                    <div class="columns is-mobile">
                      <div class="column">
                        <strong>Principal:</strong><br>
                        ₱{{ formatCurrency(loan.principal_amount) }}
                      </div>
                      <div class="column">
                        <strong>Interest ({{ loanTermMonths }} months):</strong><br>
                        ₱{{ formatCurrency(calculatedInterest) }}
                      </div>
                      <div class="column">
                        <strong>Total Amount:</strong><br>
                        <span class="has-text-weight-bold">₱{{ formatCurrency(totalAmount) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 3: Collateral Information -->
              <div class="card form-section" v-if="needsCollateral">
                <header class="card-header">
                  <p class="card-header-title">
                    <span class="icon mr-2">
                      <i class="fas fa-shield-alt"></i>
                    </span>
                    Collateral Information
                  </p>
                  <span class="card-header-icon">
                    <span class="tag is-primary">Step 3</span>
                  </span>
                </header>
                <div class="card-content">
                  <div class="field">
                    <label class="label">Number of Collateral Items</label>
                    <div class="control">
                      <div class="select">
                        <select v-model="numberOfCollaterals" @change="updateCollateralList">
                          <option v-for="n in 10" :key="n" :value="n">{{ n }} item{{ n > 1 ? 's' : '' }}</option>
                        </select>
                      </div>
                    </div>
                    <p class="help">You can add multiple items as collateral for this loan.</p>
                  </div>

                  <div v-for="(collateral, index) in collaterals" :key="index" class="collateral-item">
                    <div class="box">
                      <h6 class="title is-6">Collateral Item {{ index + 1 }}</h6>
                      
                      <CollateralForm 
                        :collateral="collateral"
                        :collateral-type="loan.loan_type"
                        @update="updateCollateral(index, $event)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sidebar Column -->
            <div class="column is-4">
              <!-- Quick Actions -->
              <div class="card">
                <header class="card-header">
                  <p class="card-header-title">Quick Actions</p>
                </header>
                <div class="card-content">
                  <div class="field">
                    <button type="submit" 
                            class="button is-primary is-fullwidth is-medium"
                            :class="{ 'is-loading': isSubmitting }"
                            :disabled="!isFormValid">
                      <span class="icon">
                        <i class="fas" :class="isEdit ? 'fa-save' : 'fa-plus'"></i>
                      </span>
                      <span>{{ isEdit ? 'Update Loan' : 'Create Loan' }}</span>
                    </button>
                  </div>
                  
                  <div class="field">
                    <button type="button" 
                            class="button is-light is-fullwidth"
                            @click="saveDraft"
                            :disabled="isSubmitting">
                      <span class="icon">
                        <i class="fas fa-save"></i>
                      </span>
                      <span>Save as Draft</span>
                    </button>
                  </div>

                  <div class="field">
                    <router-link to="/loans" class="button is-text is-fullwidth">
                      <span class="icon">
                        <i class="fas fa-times"></i>
                      </span>
                      <span>Cancel</span>
                    </router-link>
                  </div>
                </div>
              </div>

              <!-- Form Validation Status -->
              <div class="card" v-if="Object.keys(errors).length > 0">
                <header class="card-header">
                  <p class="card-header-title has-text-danger">
                    <span class="icon mr-2">
                      <i class="fas fa-exclamation-triangle"></i>
                    </span>
                    Please Fix These Issues
                  </p>
                </header>
                <div class="card-content">
                  <ul>
                    <li v-for="(error, field) in errors" :key="field" class="has-text-danger">
                      <small>{{ error }}</small>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Help Card -->
              <div class="card">
                <header class="card-header">
                  <p class="card-header-title">
                    <span class="icon mr-2">
                      <i class="fas fa-question-circle"></i>
                    </span>
                    Need Help?
                  </p>
                </header>
                <div class="card-content">
                  <div class="content is-small">
                    <h6>Loan Types Explained:</h6>
                    <ul>
                      <li><strong>Pawn Loan:</strong> Use physical items like jewelry, electronics as collateral</li>
                      <li><strong>Title Loan:</strong> Use vehicle or property title as collateral</li>
                      <li><strong>Check Rediscount:</strong> Use post-dated checks as collateral</li>
                      <li><strong>Secured Loan:</strong> Any other form of collateral</li>
                      <li><strong>Unsecured Loan:</strong> No collateral required (higher risk)</li>
                    </ul>
                    
                    <h6>Common Interest Rates:</h6>
                    <ul>
                      <li>Pawn Loans: 3-5% per month</li>
                      <li>Title Loans: 2-4% per month</li>
                      <li>Secured Loans: 2-3% per month</li>
                      <li>Unsecured Loans: 5-8% per month</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../../services/api';
import HelpTooltip from '../../../components/common/HelpTooltip.vue';
import CollateralForm from '../../../components/forms/CollateralForm.vue';

export default {
  name: 'ModernLoanForm',
  components: {
    HelpTooltip,
    CollateralForm
  },
  data() {
    return {
      isEdit: false,
      isSubmitting: false,
      customers: [],
      loanTermMonths: '3',
      numberOfCollaterals: 1,
      loan: {
        customer_id: '',
        loan_type: '',
        loan_number: '',
        issue_date: this.getTodayDate(),
        maturity_date: '',
        principal_amount: '',
        interest_rate: '',
        outstanding_principal: '',
        accrued_interest: 0,
        penalties: 0
      },
      collaterals: [{}],
      errors: {},
      calculatedInterest: 0,
      totalAmount: 0
    };
  },
  computed: {
    needsCollateral() {
      return this.loan.loan_type && this.loan.loan_type !== 'UNSECURED';
    },
    isFormValid() {
      return this.loan.customer_id && 
             this.loan.loan_type && 
             this.loan.issue_date && 
             this.loan.maturity_date && 
             this.loan.principal_amount && 
             this.loan.interest_rate &&
             Object.keys(this.errors).length === 0;
    }
  },
  async created() {
    await this.loadCustomers();
    this.checkIfEdit();
    if (this.isEdit) {
      await this.loadLoanData();
    }
  },
  methods: {
    async loadCustomers() {
      try {
        const response = await api.get('/customers');
        this.customers = response.data || [];
      } catch (error) {
        console.error('Error loading customers:', error);
        this.$emit('notification', 'error', 'Error', 'Failed to load customers');
      }
    },

    checkIfEdit() {
      this.isEdit = this.$route.params.id !== undefined;
    },

    async loadLoanData() {
      try {
        const response = await api.get(`/loans/${this.$route.params.id}`);
        this.loan = response.data;
        this.calculateLoanTerm();
      } catch (error) {
        console.error('Error loading loan:', error);
        this.$emit('notification', 'error', 'Error', 'Failed to load loan data');
      }
    },

    getTodayDate() {
      return new Date().toISOString().split('T')[0];
    },

    calculateMaturityDate() {
      if (this.loan.issue_date && this.loanTermMonths !== 'custom') {
        const issueDate = new Date(this.loan.issue_date);
        const maturityDate = new Date(issueDate.setMonth(issueDate.getMonth() + parseInt(this.loanTermMonths)));
        this.loan.maturity_date = maturityDate.toISOString().split('T')[0];
      }
      this.calculateTotals();
    },

    calculateLoanTerm() {
      if (this.loan.issue_date && this.loan.maturity_date) {
        const issueDate = new Date(this.loan.issue_date);
        const maturityDate = new Date(this.loan.maturity_date);
        const diffMonths = maturityDate.getMonth() - issueDate.getMonth() + 
          (12 * (maturityDate.getFullYear() - issueDate.getFullYear()));
        
        if ([1, 2, 3, 6, 12].includes(diffMonths)) {
          this.loanTermMonths = diffMonths.toString();
        } else {
          this.loanTermMonths = 'custom';
        }
      }
    },

    calculateTotals() {
      if (this.loan.principal_amount && this.loan.interest_rate && this.loanTermMonths !== 'custom') {
        const principal = parseFloat(this.loan.principal_amount);
        const rate = parseFloat(this.loan.interest_rate) / 100;
        const months = parseInt(this.loanTermMonths);
        
        this.calculatedInterest = principal * rate * months;
        this.totalAmount = principal + this.calculatedInterest;
      }
    },

    onCustomerChange() {
      this.validateField('customer_id');
    },

    onLoanTypeChange() {
      this.validateField('loan_type');
      this.updateCollateralList();
    },

    updateCollateralList() {
      const newLength = parseInt(this.numberOfCollaterals);
      if (newLength > this.collaterals.length) {
        // Add more collaterals
        while (this.collaterals.length < newLength) {
          this.collaterals.push({});
        }
      } else if (newLength < this.collaterals.length) {
        // Remove excess collaterals
        this.collaterals = this.collaterals.slice(0, newLength);
      }
    },

    updateCollateral(index, collateralData) {
      this.collaterals[index] = collateralData;
    },

    validateField(field) {
      // Remove existing error for this field
      delete this.errors[field];
      
      // Add validation logic
      switch (field) {
        case 'customer_id':
          if (!this.loan.customer_id) {
            this.errors.customer_id = 'Please select a customer';
          }
          break;
        case 'loan_type':
          if (!this.loan.loan_type) {
            this.errors.loan_type = 'Please select a loan type';
          }
          break;
        // Add more validations as needed
      }
    },

    async handleSubmit() {
      this.isSubmitting = true;
      this.errors = {};

      try {
        // Set outstanding principal to principal amount for new loans
        this.loan.outstanding_principal = this.loan.principal_amount;
        
        const loanData = { ...this.loan };
        
        let response;
        if (this.isEdit) {
          response = await api.put(`/loans/${this.$route.params.id}`, loanData);
        } else {
          response = await api.post('/loans', loanData);
        }

        // If we have collaterals and the loan was created successfully
        if (this.needsCollateral && this.collaterals.length > 0 && response.data) {
          const loanId = response.data.loanId || this.$route.params.id;
          await this.saveCollaterals(loanId);
        }

        this.$emit('notification', 'success', 'Success', 
          `Loan ${this.isEdit ? 'updated' : 'created'} successfully!`);
        
        this.$router.push('/loans');
        
      } catch (error) {
        console.error('Error saving loan:', error);
        if (error.response && error.response.data && error.response.data.errors) {
          this.errors = error.response.data.errors;
        } else {
          this.$emit('notification', 'error', 'Error', 
            `Failed to ${this.isEdit ? 'update' : 'create'} loan`);
        }
      } finally {
        this.isSubmitting = false;
      }
    },

    async saveCollaterals(loanId) {
      try {
        for (const collateral of this.collaterals) {
          if (Object.keys(collateral).length > 0) {
            await api.post('/collaterals', {
              ...collateral,
              loan_id: loanId
            });
          }
        }
      } catch (error) {
        console.error('Error saving collaterals:', error);
      }
    },

    async saveDraft() {
      // Implementation for saving as draft
      console.log('Save as draft functionality');
    },

    formatCurrency(amount) {
      if (!amount) return '0.00';
      return parseFloat(amount).toLocaleString('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
  }
};
</script>

