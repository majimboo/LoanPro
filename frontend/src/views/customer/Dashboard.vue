<template>
  <div class="page-container">
    <div class="page-header">
      <div class="container">
        <div class="level">
          <div class="level-left">
            <div class="level-item">
              <div>
                <h1 class="title is-3">Customer Dashboard</h1>
                <p class="subtitle is-5">Welcome, {{ customerName }}! Here's a summary of your pawn tickets.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="page-content">
      <section class="section">
        <div class="container">
          <div class="box">
            <h2 class="title is-5">Your Active Tickets</h2>
            <div v-if="isLoading" class="has-text-centered py-6">
              <div class="loading-spinner"></div>
              <p>Loading your tickets...</p>
            </div>
            <div v-else-if="pawnTickets.length === 0" class="has-text-centered py-6">
              <span class="icon is-large has-text-grey-light">
                <i class="fas fa-ticket-alt fa-3x"></i>
              </span>
              <p class="title is-5 has-text-grey-light mt-4">No pawn tickets found</p>
              <p class="subtitle is-6 has-text-grey">You don't have any active pawn tickets at the moment.</p>
            </div>
            <table v-else class="table is-fullwidth is-striped">
              <thead>
                <tr>
                  <th>Ticket #</th>
                  <th>Issue Date</th>
                  <th>Maturity Date</th>
                  <th>Principal</th>
                  <th>Outstanding</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ticket in pawnTickets" :key="ticket.id">
                  <td>{{ ticket.ticket_number }}</td>
                  <td>{{ formatDate(ticket.created_at) }}</td>
                  <td>{{ formatDate(ticket.maturity_date) }}</td>
                  <td>₱{{ formatCurrency(ticket.principal_amount) }}</td>
                  <td>₱{{ formatCurrency(ticket.outstanding_principal) }}</td>
                  <td>
                    <span class="tag" :class="getStatusClass(ticket.status)">
                      {{ formatStatus(ticket.status) }}
                    </span>
                  </td>
                  <td>
                    <router-link :to="`/customer/tickets/${ticket.id}`" class="button is-small is-info">
                      View Details
                    </router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import api from '../../services/api';

export default {
  name: 'CustomerDashboard',
  data() {
    return {
      customerName: 'Customer',
      pawnTickets: [],
      isLoading: true
    };
  },
  async created() {
    await this.loadCustomerData();
  },
  methods: {
    async loadCustomerData() {
      this.isLoading = true;
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          this.customerName = user.first_name || user.name || user.email || 'Customer';
        }

        // Load customer's pawn tickets
        const response = await api.get('/pawn-tickets');
        this.pawnTickets = response.data || [];
      } catch (error) {
        console.error('Error loading customer data:', error);
        // Handle error gracefully
      } finally {
        this.isLoading = false;
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
        year: 'numeric',
        month: 'short',
        day: 'numeric'
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
    }
  }
};
</script>

