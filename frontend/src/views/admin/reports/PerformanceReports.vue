<template>
  <div class="container is-fluid">
    <nav class="breadcrumb" aria-label="breadcrumbs">
      <ul>
        <li><router-link to="/reports">Reports</router-link></li>
        <li class="is-active"><a href="#" aria-current="page">Performance Reports</a></li>
      </ul>
    </nav>

    <h1 class="title">Performance Reports</h1>

    <div class="columns">
      <div class="column is-one-quarter">
        <div class="box">
          <h2 class="subtitle">Report Parameters</h2>
          <div class="field">
            <label class="label">Time Period</label>
            <div class="control">
              <div class="select is-fullwidth">
                <select v-model="filters.period">
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="90d">Last 90 Days</option>
                  <option value="1y">Last Year</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
            </div>
          </div>
          
          <div v-if="filters.period === 'custom'" class="field">
            <label class="label">Start Date</label>
            <div class="control">
              <input v-model="filters.startDate" type="date" class="input">
            </div>
          </div>
          
          <div v-if="filters.period === 'custom'" class="field">
            <label class="label">End Date</label>
            <div class="control">
              <input v-model="filters.endDate" type="date" class="input">
            </div>
          </div>

          <div class="field">
            <label class="label">Metrics</label>
            <div class="control">
              <label class="checkbox">
                <input v-model="filters.metrics" type="checkbox" value="loan_volume">
                Loan Volume
              </label>
            </div>
            <div class="control">
              <label class="checkbox">
                <input v-model="filters.metrics" type="checkbox" value="collection_rate">
                Collection Rate
              </label>
            </div>
            <div class="control">
              <label class="checkbox">
                <input v-model="filters.metrics" type="checkbox" value="default_rate">
                Default Rate
              </label>
            </div>
            <div class="control">
              <label class="checkbox">
                <input v-model="filters.metrics" type="checkbox" value="customer_acquisition">
                Customer Acquisition
              </label>
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
            <p>Configure report parameters and click "Generate Report" to view performance metrics.</p>
          </div>

          <div v-if="isLoading" class="notification is-primary">
            <p>Analyzing performance data...</p>
          </div>

          <div v-if="reportData && !isLoading">
            <div class="level">
              <div class="level-left">
                <div class="level-item">
                  <h2 class="subtitle">Performance Dashboard</h2>
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

            <!-- KPI Cards -->
            <div class="columns is-multiline" v-if="reportData.kpis">
              <div class="column is-3" v-for="kpi in reportData.kpis" :key="kpi.name">
                <div class="box has-text-centered">
                  <p class="heading">{{ kpi.name }}</p>
                  <p class="title is-4" :class="getKpiClass(kpi.trend)">
                    {{ formatKpiValue(kpi.value, kpi.type) }}
                  </p>
                  <p class="help" :class="getTrendClass(kpi.trend)">
                    <span class="icon is-small">
                      <i :class="getTrendIcon(kpi.trend)"></i>
                    </span>
                    {{ kpi.change }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Performance Trends -->
            <div v-if="reportData.trends" class="box">
              <h3 class="subtitle">Performance Trends</h3>
              <div class="table-container">
                <table class="table is-fullwidth is-striped is-hoverable">
                  <thead>
                    <tr>
                      <th>Metric</th>
                      <th>Current Period</th>
                      <th>Previous Period</th>
                      <th>Change</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="trend in reportData.trends" :key="trend.metric">
                      <td>{{ trend.metric }}</td>
                      <td>{{ formatTrendValue(trend.current, trend.type) }}</td>
                      <td>{{ formatTrendValue(trend.previous, trend.type) }}</td>
                      <td :class="getTrendClass(trend.direction)">
                        {{ trend.change }}
                      </td>
                      <td>
                        <span class="tag" :class="getStatusClass(trend.status)">
                          {{ trend.status }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Operational Metrics -->
            <div v-if="reportData.operational" class="box">
              <h3 class="subtitle">Operational Metrics</h3>
              <div class="columns is-multiline">
                <div class="column is-6" v-for="metric in reportData.operational" :key="metric.name">
                  <div class="card">
                    <div class="card-content">
                      <div class="media">
                        <div class="media-content">
                          <p class="title is-6">{{ metric.name }}</p>
                          <p class="subtitle is-7">{{ metric.description }}</p>
                        </div>
                      </div>
                      <div class="content">
                        <div class="level">
                          <div class="level-left">
                            <div class="level-item">
                              <span class="tag is-large" :class="getMetricClass(metric.performance)">
                                {{ metric.value }}
                              </span>
                            </div>
                          </div>
                          <div class="level-right">
                            <div class="level-item">
                              <small>Target: {{ metric.target }}</small>
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
    </div>
  </div>
</template>

<script>
import api from '../../../services/api';

export default {
  name: 'PerformanceReports',
  data() {
    return {
      filters: {
        period: '30d',
        startDate: '',
        endDate: '',
        metrics: ['loan_volume', 'collection_rate']
      },
      reportData: null,
      isLoading: false
    };
  },
  methods: {
    async generateReport() {
      this.isLoading = true;
      try {
        const response = await api.get('/reports/performance', {
          params: this.filters
        });
        this.reportData = response.data;
      } catch (error) {
        console.error('Error generating performance report:', error);
        this.reportData = {
          error: 'Failed to generate report. Please try again.',
          kpis: [],
          trends: [],
          operational: []
        };
      } finally {
        this.isLoading = false;
      }
    },
    exportReport() {
      if (!this.reportData) return;
      
      const dataStr = JSON.stringify(this.reportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `performance-report-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    },
    formatKpiValue(value, type) {
      switch (type) {
        case 'currency':
          return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
          }).format(value);
        case 'percentage':
          return `${value}%`;
        case 'number':
          return new Intl.NumberFormat('en-US').format(value);
        default:
          return value;
      }
    },
    formatTrendValue(value, type) {
      return this.formatKpiValue(value, type);
    },
    getKpiClass(trend) {
      switch (trend) {
        case 'up': return 'has-text-success';
        case 'down': return 'has-text-danger';
        default: return 'has-text-info';
      }
    },
    getTrendClass(trend) {
      switch (trend) {
        case 'up': return 'has-text-success';
        case 'down': return 'has-text-danger';
        default: return 'has-text-grey';
      }
    },
    getTrendIcon(trend) {
      switch (trend) {
        case 'up': return 'fas fa-arrow-up';
        case 'down': return 'fas fa-arrow-down';
        default: return 'fas fa-minus';
      }
    },
    getStatusClass(status) {
      switch (status.toLowerCase()) {
        case 'excellent': return 'is-success';
        case 'good': return 'is-primary';
        case 'warning': return 'is-warning';
        case 'poor': return 'is-danger';
        default: return 'is-light';
      }
    },
    getMetricClass(performance) {
      switch (performance.toLowerCase()) {
        case 'above': return 'is-success';
        case 'meeting': return 'is-primary';
        case 'below': return 'is-warning';
        case 'poor': return 'is-danger';
        default: return 'is-light';
      }
    }
  }
};
</script>

