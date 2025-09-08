<template>
  <div class="container is-fluid">
    <nav class="breadcrumb" aria-label="breadcrumbs">
      <ul>
        <li><router-link to="/reports">Reports</router-link></li>
        <li class="is-active"><a href="#" aria-current="page">Financial Reports</a></li>
      </ul>
    </nav>

    <h1 class="title">Financial Reports</h1>

    <div class="columns">
      <div class="column is-one-quarter">
        <div class="box">
          <h2 class="subtitle">Report Filters</h2>
          <div class="field">
            <label class="label">Date Range</label>
            <div class="control">
              <input v-model="filters.startDate" type="date" class="input">
            </div>
          </div>
          <div class="field">
            <label class="label">End Date</label>
            <div class="control">
              <input v-model="filters.endDate" type="date" class="input">
            </div>
          </div>
          <div class="field">
            <label class="label">Report Type</label>
            <div class="control">
              <div class="select is-fullwidth">
                <select v-model="filters.reportType">
                  <option value="revenue">Revenue Summary</option>
                  <option value="interest">Interest Analysis</option>
                  <option value="payments">Payment Breakdown</option>
                  <option value="profitability">Profitability Report</option>
                </select>
              </div>
            </div>
          </div>
          <div class="field">
            <div class="control">
              <button @click="generateReport" class="button is-primary is-fullwidth" :class="{ 'is-loading': isLoading }">
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="column is-three-quarters">
        <div class="box">
          <div v-if="!reportData && !isLoading" class="notification is-info">
            <p>Select report parameters and click "Generate Report" to view financial data.</p>
          </div>

          <div v-if="isLoading" class="notification is-primary">
            <p>Generating financial report...</p>
          </div>

          <div v-if="reportData && !isLoading">
            <div class="level">
              <div class="level-left">
                <div class="level-item">
                  <h2 class="subtitle">{{ getReportTitle() }}</h2>
                </div>
              </div>
              <div class="level-right">
                <div class="level-item">
                  <button @click="exportReport" class="button is-success">
                    <span class="icon">
                      <i class="fas fa-download"></i>
                    </span>
                    <span>Export</span>
                  </button>
                </div>
              </div>
            </div>

            <div class="columns is-multiline" v-if="reportData.summary">
              <div class="column is-3" v-for="(value, key) in reportData.summary" :key="key">
                <div class="box has-text-centered">
                  <p class="heading">{{ formatLabel(key) }}</p>
                  <p class="title is-4">{{ formatCurrency(value) }}</p>
                </div>
              </div>
            </div>

            <div v-if="reportData.details" class="table-container">
              <table class="table is-fullwidth is-striped is-hoverable">
                <thead>
                  <tr>
                    <th v-for="header in getTableHeaders()" :key="header">{{ header }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, index) in reportData.details" :key="index">
                    <td v-for="(value, key) in row" :key="key">
                      {{ formatValue(key, value) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-if="reportData.chart" class="mt-5">
              <canvas ref="chartCanvas" width="400" height="200"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../../services/api';

export default {
  name: 'FinancialReports',
  data() {
    return {
      filters: {
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        reportType: 'revenue'
      },
      reportData: null,
      isLoading: false
    };
  },
  methods: {
    async generateReport() {
      this.isLoading = true;
      try {
        const response = await api.get('/reports/financial', {
          params: this.filters
        });
        this.reportData = response.data;
      } catch (error) {
        console.error('Error generating financial report:', error);
        this.reportData = {
          error: 'Failed to generate report. Please try again.',
          summary: {},
          details: []
        };
      } finally {
        this.isLoading = false;
      }
    },
    exportReport() {
      if (!this.reportData) return;
      
      const dataStr = JSON.stringify(this.reportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `financial-report-${this.filters.reportType}-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    },
    getReportTitle() {
      const titles = {
        revenue: 'Revenue Summary Report',
        interest: 'Interest Analysis Report',
        payments: 'Payment Breakdown Report',
        profitability: 'Profitability Report'
      };
      return titles[this.filters.reportType] || 'Financial Report';
    },
    getTableHeaders() {
      if (!this.reportData.details || this.reportData.details.length === 0) return [];
      return Object.keys(this.reportData.details[0]);
    },
    formatLabel(key) {
      return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    },
    formatCurrency(value) {
      if (typeof value === 'number') {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(value);
      }
      return value;
    },
    formatValue(key, value) {
      if (typeof value === 'number' && (key.toLowerCase().includes('amount') || key.toLowerCase().includes('total'))) {
        return this.formatCurrency(value);
      }
      if (key.toLowerCase().includes('date') && value) {
        return new Date(value).toLocaleDateString();
      }
      return value;
    }
  }
};
</script>

