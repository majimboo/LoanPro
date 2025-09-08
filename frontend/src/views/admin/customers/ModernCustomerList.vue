<template>
  <div class="page-container">
    <!-- Breadcrumb -->
    <div class="container mb-4">
      <nav class="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li><router-link to="/dashboard">Dashboard</router-link></li>
          <li class="is-active"><a href="#" aria-current="page">Customers</a></li>
        </ul>
      </nav>
    </div>

    <!-- Header Section -->
    <PageHeader
      title="Customer Management"
      subtitle="Manage your customers and their information"
      icon="fas fa-users"
      variant="default">
      <template #actions>
        <router-link to="/customers/new" class="button is-primary">
          <span class="icon">
            <i class="fas fa-plus"></i>
          </span>
          <span>Add Customer</span>
        </router-link>
      </template>
    </PageHeader>

    <div class="page-content">
      <!-- Filters and Search -->
      <section class="section py-4">
        <div class="container">
          <div class="card">
            <div class="card-content py-4">
              <div class="columns is-vcentered">
                <div class="column is-7">
                  <div class="field">
                    <div class="control has-icons-left">
                      <input 
                        class="input" 
                        type="text" 
                        placeholder="Search customers by name, email, or phone..."
                        v-model="searchQuery"
                        @input="performSearch">
                      <span class="icon is-left">
                        <i class="fas fa-search"></i>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="column is-3">
                  <div class="field">
                    <div class="control">
                      <div class="select is-fullwidth">
                        <select v-model="sortBy" @change="sortCustomers">
                          <option value="name">Sort by Name</option>
                          <option value="created_at">Sort by Date Added</option>
                          <option value="last_login">Sort by Last Activity</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="column is-2">
                  <div class="field is-grouped">
                    <div class="control">
                      <button class="button" :class="{ 'is-primary': viewMode === 'grid', 'is-light': viewMode !== 'grid' }" @click="viewMode = 'grid'" title="Grid View">
                        <span class="icon">
                          <i class="fas fa-th-large"></i>
                        </span>
                      </button>
                    </div>
                    <div class="control">
                      <button class="button" :class="{ 'is-primary': viewMode === 'list', 'is-light': viewMode !== 'list' }" @click="viewMode = 'list'" title="List View">
                        <span class="icon">
                          <i class="fas fa-list"></i>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Customer Stats -->
      <section class="section py-4">
        <div class="container">
          <div class="columns">
            <div class="column">
              <div class="card stats-card has-background-info">
                <div class="card-content">
                  <div class="media">
                    <div class="media-left">
                      <span class="icon is-large has-text-white">
                        <i class="fas fa-users fa-2x"></i>
                      </span>
                    </div>
                    <div class="media-content">
                      <p class="title is-5 has-text-white">{{ totalCustomers }}</p>
                      <p class="subtitle is-7 has-text-white-ter">Total Customers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="column">
              <div class="card stats-card has-background-success">
                <div class="card-content">
                  <div class="media">
                    <div class="media-left">
                      <span class="icon is-large has-text-white">
                        <i class="fas fa-user-plus fa-2x"></i>
                      </span>
                    </div>
                    <div class="media-content">
                      <p class="title is-5 has-text-white">{{ newCustomersThisMonth }}</p>
                      <p class="subtitle is-7 has-text-white-ter">New This Month</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="column">
              <div class="card stats-card has-background-warning">
                <div class="card-content">
                  <div class="media">
                    <div class="media-left">
                      <span class="icon is-large has-text-white">
                        <i class="fas fa-handshake fa-2x"></i>
                      </span>
                    </div>
                    <div class="media-content">
                      <p class="title is-5 has-text-white">{{ activeCustomers }}</p>
                      <p class="subtitle is-7 has-text-white-ter">Active Customers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Customer List -->
      <section class="section py-4">
        <div class="container">
          <div v-if="isLoading" class="has-text-centered py-6">
            <div class="loading-spinner"></div>
            <p class="mt-4">Loading customers...</p>
          </div>

          <div v-else-if="filteredCustomers.length === 0" class="has-text-centered py-6 px-4">
            <div class="has-text-centered py-6">
              <span class="icon is-large has-text-grey-light">
                <i class="fas fa-users fa-3x"></i>
              </span>
              <h3 class="title is-5 has-text-grey-light mt-4">
                {{ searchQuery ? 'No customers found' : 'No customers yet' }}
              </h3>
              <p class="subtitle is-7 has-text-grey">
                {{ searchQuery ? 'Try adjusting your search criteria' : 'Add your first customer to get started' }}
              </p>
              <router-link to="/customers/new" class="button is-primary" v-if="!searchQuery">
                <span class="icon">
                  <i class="fas fa-plus"></i>
                </span>
                <span>Add First Customer</span>
              </router-link>
            </div>
          </div>

          <!-- Grid View -->
          <div v-else-if="viewMode === 'grid'" class="columns is-multiline">
            <div class="column is-6-tablet is-4-desktop is-3-widescreen" v-for="customer in paginatedCustomers" :key="customer.id">
              <div class="card customer-card">
                <div class="card-content">
                  <div class="media">
                    <div class="media-left">
                      <figure class="image is-48x48">
                        <img 
                          :src="getProfilePhotoUrl(customer.profile_photo)" 
                          :alt="customer.first_name + ' ' + customer.last_name"
                          class="is-rounded"
                          @error="handleImageError">
                      </figure>
                    </div>
                    <div class="media-content">
                      <p class="title is-6 mb-1 has-text-grey-dark">{{ customer.first_name }} {{ customer.last_name }}</p>
                      <p class="subtitle is-7 has-text-grey-light">{{ customer.email || 'No email' }}</p>
                    </div>
                  </div>
                  
                  <div class="content is-small">
                    <p v-if="customer.phone" class="has-text-grey-dark">
                      <span class="icon is-small has-text-primary">
                        <i class="fas fa-phone"></i>
                      </span>
                      {{ customer.phone }}
                    </p>
                    <p v-if="customer.address" class="has-text-grey-dark">
                      <span class="icon is-small has-text-info">
                        <i class="fas fa-map-marker-alt"></i>
                      </span>
                      {{ customer.address.length > 30 ? customer.address.substring(0, 30) + '...' : customer.address }}
                    </p>
                    <p class="has-text-grey-light is-size-7 mt-2">
                      Customer since {{ formatDate(customer.created_at) }}
                    </p>
                  </div>
                </div>
                <footer class="card-footer">
                  <router-link :to="`/customers/${customer.id}`" class="card-footer-item has-text-info">
                    <span class="icon is-small">
                      <i class="fas fa-eye"></i>
                    </span>
                    <span>View</span>
                  </router-link>
                  <router-link :to="`/customers/${customer.id}/edit`" class="card-footer-item has-text-warning">
                    <span class="icon is-small">
                      <i class="fas fa-edit"></i>
                    </span>
                    <span>Edit</span>
                  </router-link>
                </footer>
              </div>
            </div>
          </div>

          <!-- List View -->
          <div v-else class="card">
            <div class="card-content">
              <div class="table-container">
                <table class="table is-fullwidth is-hoverable">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Contact Info</th>
                      <th>Location</th>
                      <th>Loans</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="customer in paginatedCustomers" :key="customer.id">
                      <td>
                        <div class="media">
                          <div class="media-left">
                            <figure class="image is-32x32">
                              <img 
                                :src="getProfilePhotoUrl(customer.profile_photo)" 
                                :alt="customer.first_name + ' ' + customer.last_name"
                                class="is-rounded"
                                @error="handleImageError">
                            </figure>
                          </div>
                          <div class="media-content">
                            <strong class="has-text-grey-dark">{{ customer.first_name }} {{ customer.last_name }}</strong>
                            <br>
                            <small class="has-text-grey-light">ID: {{ customer.id }}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <p v-if="customer.email" class="has-text-grey-dark">
                            <span class="icon is-small has-text-info">
                              <i class="fas fa-envelope"></i>
                            </span>
                            {{ customer.email }}
                          </p>
                          <p v-if="customer.phone" class="has-text-grey-dark">
                            <span class="icon is-small has-text-primary">
                              <i class="fas fa-phone"></i>
                            </span>
                            {{ customer.phone }}
                          </p>
                        </div>
                      </td>
                      <td>
                        <p v-if="customer.address" class="has-text-grey-dark">{{ customer.address.length > 40 ? customer.address.substring(0, 40) + '...' : customer.address }}</p>
                        <span v-else class="has-text-grey-light">No address</span>
                      </td>
                      <td>
                        <span class="tag is-info is-light">{{ customer.loan_count || 0 }} loans</span>
                      </td>
                      <td>
                        <time :datetime="customer.created_at" class="has-text-grey-dark">{{ formatDate(customer.created_at) }}</time>
                      </td>
                      <td>
                        <div class="buttons are-small">
                          <router-link :to="`/customers/${customer.id}`" class="button is-info">
                            <span class="icon">
                              <i class="fas fa-eye"></i>
                            </span>
                          </router-link>
                          <router-link :to="`/customers/${customer.id}/edit`" class="button is-warning">
                            <span class="icon">
                              <i class="fas fa-edit"></i>
                            </span>
                          </router-link>
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
            <button 
              class="pagination-previous" 
              :disabled="currentPage === 1"
              @click="currentPage--">
              Previous
            </button>
            <button 
              class="pagination-next" 
              :disabled="currentPage === totalPages"
              @click="currentPage++">
              Next page
            </button>
            <ul class="pagination-list">
              <li v-for="page in visiblePages" :key="page">
                <button 
                  class="pagination-link" 
                  :class="{ 'is-current': page === currentPage }"
                  @click="currentPage = page">
                  {{ page }}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </section>

      <!-- Delete Confirmation Modal -->
      <div class="modal" :class="{ 'is-active': showDeleteModal }">
        <div class="modal-background" @click="showDeleteModal = false"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">Delete Customer</p>
            <button class="delete" @click="showDeleteModal = false"></button>
          </header>
          <section class="modal-card-body">
            <p>Are you sure you want to delete <strong>{{ customerToDelete?.first_name }} {{ customerToDelete?.last_name }}</strong>?</p>
            <div class="notification is-warning mt-4">
              <p><strong>Warning:</strong> This action cannot be undone. All associated loans and data will also be deleted.</p>
            </div>
          </section>
          <footer class="modal-card-foot">
            <button class="button is-danger" @click="deleteCustomer" :class="{ 'is-loading': isDeleting }">Delete</button>
            <button class="button" @click="showDeleteModal = false">Cancel</button>
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../../services/api';
import PageHeader from '../../../components/common/PageHeader.vue';

export default {
  name: 'ModernCustomerList',
  components: {
    PageHeader
  },
  data() {
    return {
      customers: [],
      filteredCustomers: [],
      searchQuery: '',
      sortBy: 'name',
      viewMode: 'grid', // 'grid' or 'list'
      isLoading: true,
      currentPage: 1,
      itemsPerPage: 12,
      
      // Stats
      totalCustomers: 0,
      newCustomersThisMonth: 0,
      activeCustomers: 0,
      
      // Delete modal
      showDeleteModal: false,
      customerToDelete: null,
      isDeleting: false,
      
      defaultAvatar: '/api/placeholder/48/48'
    };
  },
  computed: {
    paginatedCustomers() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredCustomers.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredCustomers.length / this.itemsPerPage);
    },
    visiblePages() {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];
      
      for (let i = Math.max(2, this.currentPage - delta); 
           i <= Math.min(this.totalPages - 1, this.currentPage + delta); 
           i++) {
        range.push(i);
      }
      
      if (this.currentPage - delta > 2) {
        rangeWithDots.push(1, '...');
      } else {
        rangeWithDots.push(1);
      }
      
      rangeWithDots.push(...range);
      
      if (this.currentPage + delta < this.totalPages - 1) {
        rangeWithDots.push('...', this.totalPages);
      } else {
        rangeWithDots.push(this.totalPages);
      }
      
      return rangeWithDots.filter(item => item !== '...' || rangeWithDots.indexOf(item) === rangeWithDots.lastIndexOf(item));
    }
  },
  async created() {
    await this.fetchCustomers();
    this.calculateStats();
  },
  methods: {
    async fetchCustomers() {
      this.isLoading = true;
      try {
        const response = await api.get('/customers');
        this.customers = response.data || [];
        this.filteredCustomers = [...this.customers];
        this.sortCustomers();
      } catch (error) {
        console.error('Error fetching customers:', error);
        this.$emit('notification', 'error', 'Error', 'Failed to load customers');
      } finally {
        this.isLoading = false;
      }
    },
    
    performSearch() {
      if (!this.searchQuery.trim()) {
        this.filteredCustomers = [...this.customers];
      } else {
        const query = this.searchQuery.toLowerCase();
        this.filteredCustomers = this.customers.filter(customer => 
          customer.first_name.toLowerCase().includes(query) ||
          customer.last_name.toLowerCase().includes(query) ||
          (customer.email && customer.email.toLowerCase().includes(query)) ||
          (customer.phone && customer.phone.includes(query))
        );
      }
      this.currentPage = 1;
    },
    
    sortCustomers() {
      this.filteredCustomers.sort((a, b) => {
        switch (this.sortBy) {
          case 'name':
            return (a.first_name + ' ' + a.last_name).localeCompare(b.first_name + ' ' + b.last_name);
          case 'created_at':
            return new Date(b.created_at) - new Date(a.created_at);
          case 'last_login':
            return new Date(b.last_login || 0) - new Date(a.last_login || 0);
          default:
            return 0;
        }
      });
    },
    
    calculateStats() {
      this.totalCustomers = this.customers.length;
      
      // Calculate new customers this month
      const thisMonth = new Date().getMonth();
      const thisYear = new Date().getFullYear();
      this.newCustomersThisMonth = this.customers.filter(customer => {
        const createdDate = new Date(customer.created_at);
        return createdDate.getMonth() === thisMonth && createdDate.getFullYear() === thisYear;
      }).length;
      
      // For now, assume all customers are active. In a real app, you'd have logic for this
      this.activeCustomers = this.customers.filter(customer => customer.loan_count > 0).length;
    },
    
    confirmDelete(customer) {
      this.customerToDelete = customer;
      this.showDeleteModal = true;
    },
    
    async deleteCustomer() {
      if (!this.customerToDelete) return;
      
      this.isDeleting = true;
      try {
        await api.delete(`/customers/${this.customerToDelete.id}`);
        this.$emit('notification', 'success', 'Success', 'Customer deleted successfully');
        this.showDeleteModal = false;
        this.customerToDelete = null;
        await this.fetchCustomers();
        this.calculateStats();
      } catch (error) {
        console.error('Error deleting customer:', error);
        this.$emit('notification', 'error', 'Error', 'Failed to delete customer');
      } finally {
        this.isDeleting = false;
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
    }
  }
};
</script>


