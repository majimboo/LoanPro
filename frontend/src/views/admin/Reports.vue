<template>
  <div class="container is-fluid">
    <h1 class="title">Reports</h1>

    <div class="columns">
      <div class="column is-one-quarter">
        <div class="box">
          <h2 class="subtitle">Report Categories</h2>
          <div class="buttons is-vertical is-fullwidth">
            <button 
              @click="selectedReport = 'financial'" 
              :class="['button', selectedReport === 'financial' ? 'is-primary' : 'is-light']"
            >
              Financial Reports
            </button>
            <button 
              @click="selectedReport = 'loans'" 
              :class="['button', selectedReport === 'loans' ? 'is-primary' : 'is-light']"
            >
              Loan Reports
            </button>
            <button 
              @click="selectedReport = 'customer'" 
              :class="['button', selectedReport === 'customer' ? 'is-primary' : 'is-light']"
            >
              Customer Reports
            </button>
            <button 
              @click="selectedReport = 'inventory'" 
              :class="['button', selectedReport === 'inventory' ? 'is-primary' : 'is-light']"
            >
              Inventory Reports
            </button>
          </div>
        </div>
      </div>

      <div class="column is-three-quarters">
        <div class="box">
          <div v-if="selectedReport === 'financial'">
            <h2 class="subtitle">Financial Reports</h2>
            <div class="columns">
              <div class="column">
                <div class="card">
                  <div class="card-content">
                    <h3 class="title is-6">Revenue Summary</h3>
                    <p>Total revenue, interest collected, and payment trends</p>
                    <button @click="generateReport('revenue')" class="button is-primary mt-3">
                      Generate Report
                    </button>
                  </div>
                </div>
              </div>
              <div class="column">
                <div class="card">
                  <div class="card-content">
                    <h3 class="title is-6">Cash Flow Report</h3>
                    <p>Money in vs money out analysis</p>
                    <button @click="generateReport('cashflow')" class="button is-primary mt-3">
                      Generate Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="selectedReport === 'loans'">
            <h2 class="subtitle">Loan Reports</h2>
            <div class="columns">
              <div class="column">
                <div class="card">
                  <div class="card-content">
                    <h3 class="title is-6">Active Loans</h3>
                    <p>Currently active loan portfolio analysis</p>
                    <button @click="generateReport('active-loans')" class="button is-primary mt-3">
                      Generate Report
                    </button>
                  </div>
                </div>
              </div>
              <div class="column">
                <div class="card">
                  <div class="card-content">
                    <h3 class="title is-6">Overdue Loans</h3>
                    <p>Loans past due date requiring attention</p>
                    <button @click="generateReport('overdue-loans')" class="button is-primary mt-3">
                      Generate Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="selectedReport === 'customer'">
            <h2 class="subtitle">Customer Reports</h2>
            <div class="columns">
              <div class="column">
                <div class="card">
                  <div class="card-content">
                    <h3 class="title is-6">Customer Activity</h3>
                    <p>Most active customers and borrowing patterns</p>
                    <button @click="generateReport('customer-activity')" class="button is-primary mt-3">
                      Generate Report
                    </button>
                  </div>
                </div>
              </div>
              <div class="column">
                <div class="card">
                  <div class="card-content">
                    <h3 class="title is-6">Customer Risk Assessment</h3>
                    <p>Payment history and risk analysis</p>
                    <button @click="generateReport('customer-risk')" class="button is-primary mt-3">
                      Generate Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="selectedReport === 'inventory'">
            <h2 class="subtitle">Inventory Reports</h2>
            <div class="columns">
              <div class="column">
                <div class="card">
                  <div class="card-content">
                    <h3 class="title is-6">Collateral Inventory</h3>
                    <p>Items currently held as collateral</p>
                    <button @click="generateReport('collateral-inventory')" class="button is-primary mt-3">
                      Generate Report
                    </button>
                  </div>
                </div>
              </div>
              <div class="column">
                <div class="card">
                  <div class="card-content">
                    <h3 class="title is-6">Forfeited Items</h3>
                    <p>Items available for sale</p>
                    <button @click="generateReport('forfeited-items')" class="button is-primary mt-3">
                      Generate Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="!selectedReport">
            <div class="notification is-info">
              <p>Select a report category from the left to view available reports.</p>
            </div>
          </div>
        </div>

        <div v-if="reportData" class="box mt-4">
          <h2 class="subtitle">Report Results</h2>
          <div class="content">
            <pre>{{ reportData }}</pre>
          </div>
          <button @click="exportReport" class="button is-success">
            Export to CSV
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../services/api';

export default {
  name: 'Reports',
  data() {
    return {
      selectedReport: null,
      reportData: null,
      isLoading: false
    };
  },
  methods: {
    async generateReport(reportType) {
      this.isLoading = true;
      try {
        const response = await api.get(`/reports/${reportType}`);
        this.reportData = response.data;
      } catch (error) {
        console.error('Error generating report:', error);
        this.reportData = `Error generating ${reportType} report. Please try again.`;
      } finally {
        this.isLoading = false;
      }
    },
    exportReport() {
      if (!this.reportData) return;
      
      const dataStr = JSON.stringify(this.reportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `report-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  }
};
</script>

