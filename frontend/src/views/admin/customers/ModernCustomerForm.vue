<template>
  <div class="has-background-light is-min-height-100vh">
    <!-- Header Section -->
    <div class="has-background-white py-5 mb-5 form-header-border">
      <div class="container">
        <nav class="breadcrumb" aria-label="breadcrumbs">
          <ul>
            <li><router-link to="/dashboard">Dashboard</router-link></li>
            <li><router-link to="/customers">Customers</router-link></li>
            <li class="is-active"><a href="#" aria-current="page">{{ isEdit ? 'Edit' : 'New' }} Customer</a></li>
          </ul>
        </nav>
        
        <div class="level">
          <div class="level-left">
            <div class="level-item">
              <div>
                <h1 class="title is-3">
                  <span class="icon mr-2">
                    <i class="fas fa-user-plus"></i>
                  </span>
                  {{ isEdit ? 'Edit Customer' : 'Add New Customer' }}
                </h1>
                <p class="subtitle is-5">
                  {{ isEdit ? 'Update customer information and account details' : 'Create a new customer profile and account' }}
                </p>
              </div>
            </div>
          </div>
          <div class="level-right">
            <div class="level-item">
              <div class="field is-grouped">
                <p class="control">
                  <router-link to="/customers" class="button is-light">
                    <span class="icon">
                      <i class="fas fa-arrow-left"></i>
                    </span>
                    <span>Back to Customers</span>
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
              <!-- Personal Information -->
              <div class="card form-section">
                <header class="card-header">
                  <p class="card-header-title">
                    <span class="icon mr-2">
                      <i class="fas fa-user"></i>
                    </span>
                    Personal Information
                  </p>
                  <span class="card-header-icon">
                    <span class="tag is-primary">Step 1</span>
                  </span>
                </header>
                <div class="card-content">
                  <div class="columns">
                    <div class="column">
                      <div class="field">
                        <label class="label">
                          First Name *
                        </label>
                        <div class="control">
                          <input 
                            class="input" 
                            type="text" 
                            v-model="customer.first_name" 
                            :class="{ 'is-danger': errors.first_name }"
                            required>
                        </div>
                        <p v-if="errors.first_name" class="help is-danger">{{ errors.first_name }}</p>
                      </div>
                    </div>
                    <div class="column">
                      <div class="field">
                        <label class="label">
                          Last Name *
                        </label>
                        <div class="control">
                          <input 
                            class="input" 
                            type="text" 
                            v-model="customer.last_name" 
                            :class="{ 'is-danger': errors.last_name }"
                            required>
                        </div>
                        <p v-if="errors.last_name" class="help is-danger">{{ errors.last_name }}</p>
                      </div>
                    </div>
                  </div>

                  <div class="field">
                    <label class="label">
                      Profile Photo
                    </label>
                    <div class="profile-photo-upload">
                      <div class="current-photo" v-if="customer.profile_photo_url_existing">
                        <figure class="image is-128x128">
                          <img 
                            :src="getProfilePhotoUrl(customer.profile_photo_url_existing)" 
                            alt="Current profile photo"
                            class="is-rounded">
                        </figure>
                        <p class="help">Current photo</p>
                      </div>
                      
                      <div class="file has-name is-fullwidth">
                        <label class="file-label">
                          <input 
                            class="file-input" 
                            type="file" 
                            accept="image/*"
                            @change="handleProfilePhotoSelected">
                          <span class="file-cta">
                            <span class="file-icon">
                              <i class="fas fa-upload"></i>
                            </span>
                            <span class="file-label">
                              {{ customer.profile_photo ? 'Change photo' : 'Choose photo' }}
                            </span>
                          </span>
                          <span class="file-name" v-if="customer.profile_photo">
                            {{ customer.profile_photo.name }}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Contact Information -->
              <div class="card form-section">
                <header class="card-header">
                  <p class="card-header-title">
                    <span class="icon mr-2">
                      <i class="fas fa-address-book"></i>
                    </span>
                    Contact Information
                  </p>
                  <span class="card-header-icon">
                    <span class="tag is-primary">Step 2</span>
                  </span>
                </header>
                <div class="card-content">
                  <div class="field">
                    <label class="label">
                      Email Address *
                    </label>
                    <div class="control has-icons-left">
                      <input 
                        class="input" 
                        type="email" 
                        v-model="customer.email" 
                        :class="{ 'is-danger': errors.email }"
                        :required="!isEdit"
                        placeholder="customer@example.com">
                      <span class="icon is-small is-left">
                        <i class="fas fa-envelope"></i>
                      </span>
                    </div>
                    <p v-if="errors.email" class="help is-danger">{{ errors.email }}</p>
                    <p class="help">This will be used for account login and notifications</p>
                  </div>

                  <div class="field">
                    <label class="label">
                      Phone Number
                    </label>
                    <div class="control has-icons-left">
                      <input 
                        class="input" 
                        type="tel" 
                        v-model="customer.phone" 
                        :class="{ 'is-danger': errors.phone }"
                        placeholder="09XX XXX XXXX">
                      <span class="icon is-small is-left">
                        <i class="fas fa-phone"></i>
                      </span>
                    </div>
                    <p v-if="errors.phone" class="help is-danger">{{ errors.phone }}</p>
                  </div>

                  <div class="field">
                    <label class="label">
                      Address
                    </label>
                    <div class="control has-icons-left">
                      <textarea 
                        class="textarea" 
                        v-model="customer.address" 
                        :class="{ 'is-danger': errors.address }"
                        rows="3"
                        placeholder="Street, Barangay, City, Province">
                      </textarea>
                      <span class="icon is-small is-left">
                        <i class="fas fa-map-marker-alt"></i>
                      </span>
                    </div>
                    <p v-if="errors.address" class="help is-danger">{{ errors.address }}</p>
                  </div>
                </div>
              </div>

              <!-- Account Information -->
              <div class="card form-section" v-if="!isEdit">
                <header class="card-header">
                  <p class="card-header-title">
                    <span class="icon mr-2">
                      <i class="fas fa-key"></i>
                    </span>
                    Account Setup
                  </p>
                  <span class="card-header-icon">
                    <span class="tag is-primary">Step 3</span>
                  </span>
                </header>
                <div class="card-content">
                  <div class="field">
                    <label class="label">
                      Password *
                    </label>
                    <div class="control has-icons-left">
                      <input 
                        class="input" 
                        type="password" 
                        v-model="customer.password" 
                        :class="{ 'is-danger': errors.password }"
                        required
                        placeholder="Enter secure password">
                      <span class="icon is-small is-left">
                        <i class="fas fa-lock"></i>
                      </span>
                    </div>
                    <p v-if="errors.password" class="help is-danger">{{ errors.password }}</p>
                    <p class="help">Customer will use this password to login to their account</p>
                  </div>
                  
                  <div class="notification is-info">
                    <div class="content">
                      <p><strong>Account Creation:</strong></p>
                      <ul>
                        <li>A user account will be automatically created</li>
                        <li>Customer can login using their email and password</li>
                        <li>They can view their loans and payment history</li>
                      </ul>
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
                    <button 
                      type="submit" 
                      class="button is-primary is-fullwidth is-medium"
                      :class="{ 'is-loading': isSubmitting }"
                      :disabled="!isFormValid">
                      <span class="icon">
                        <i class="fas" :class="isEdit ? 'fa-save' : 'fa-plus'"></i>
                      </span>
                      <span>{{ isEdit ? 'Update Customer' : 'Create Customer' }}</span>
                    </button>
                  </div>
                  
                  <div class="field">
                    <router-link to="/customers" class="button is-light is-fullwidth">
                      <span class="icon">
                        <i class="fas fa-times"></i>
                      </span>
                      <span>Cancel</span>
                    </router-link>
                  </div>
                  
                  <div class="field" v-if="isEdit">
                    <router-link :to="`/loans/new?customer=${customer.id}`" class="button is-success is-fullwidth">
                      <span class="icon">
                        <i class="fas fa-file-invoice-dollar"></i>
                      </span>
                      <span>Create Loan</span>
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
                    <h6>Customer Information:</h6>
                    <ul>
                      <li><strong>Personal Info:</strong> Basic details like name and photo</li>
                      <li><strong>Contact Info:</strong> Email, phone, and address for communications</li>
                      <li><strong>Account Setup:</strong> Login credentials for customer portal access</li>
                    </ul>
                    
                    <h6>Tips:</h6>
                    <ul>
                      <li>Email address must be unique</li>
                      <li>Phone number helps with loan reminders</li>
                      <li>Complete address helps with collections</li>
                      <li>Strong passwords improve security</li>
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

export default {
  name: 'ModernCustomerForm',
  data() {
    return {
      isEdit: false,
      isSubmitting: false,
      customer: {
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        address: '',
        phone: '',
        profile_photo: null,
        profile_photo_url_existing: null,
      },
      errors: {}
    };
  },
  computed: {
    isFormValid() {
      return this.customer.first_name && 
             this.customer.last_name && 
             this.customer.email && 
             (this.isEdit || this.customer.password) &&
             Object.keys(this.errors).length === 0;
    }
  },
  created() {
    this.checkIfEdit();
    if (this.isEdit) {
      this.fetchCustomer();
    }
  },
  methods: {
    checkIfEdit() {
      this.isEdit = this.$route.params.id !== undefined;
    },
    
    async fetchCustomer() {
      try {
        const response = await api.get(`/customers/${this.$route.params.id}`);
        this.customer = {
          ...response.data,
          email: response.data.user ? response.data.user.email : '',
          profile_photo_url_existing: response.data.profile_photo ? 
            response.data.profile_photo : null,
        };
      } catch (error) {
        console.error('Error fetching customer:', error);
        this.$emit('notification', 'error', 'Error', 'Failed to load customer data');
        this.$router.push('/customers');
      }
    },
    
    handleProfilePhotoSelected(event) {
      const file = event.target.files[0];
      if (file) {
        this.customer.profile_photo = file;
      }
    },
    
    validateField(field) {
      delete this.errors[field];
      
      switch (field) {
        case 'first_name':
          if (!this.customer.first_name?.trim()) {
            this.errors.first_name = 'First name is required';
          }
          break;
        case 'last_name':
          if (!this.customer.last_name?.trim()) {
            this.errors.last_name = 'Last name is required';
          }
          break;
        case 'email':
          if (!this.customer.email?.trim()) {
            this.errors.email = 'Email is required';
          } else if (!this.isValidEmail(this.customer.email)) {
            this.errors.email = 'Please enter a valid email address';
          }
          break;
        case 'password':
          if (!this.isEdit && !this.customer.password) {
            this.errors.password = 'Password is required';
          } else if (this.customer.password && this.customer.password.length < 6) {
            this.errors.password = 'Password must be at least 6 characters';
          }
          break;
      }
    },
    
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    
    async handleSubmit() {
      // Validate all fields
      this.validateField('first_name');
      this.validateField('last_name');
      this.validateField('email');
      if (!this.isEdit) {
        this.validateField('password');
      }
      
      if (!this.isFormValid) {
        this.$emit('notification', 'error', 'Validation Error', 'Please fix the errors below');
        return;
      }
      
      this.isSubmitting = true;
      
      try {
        const formData = new FormData();
        formData.append('first_name', this.customer.first_name);
        formData.append('last_name', this.customer.last_name);
        formData.append('email', this.customer.email);
        formData.append('phone', this.customer.phone || '');
        formData.append('address', this.customer.address || '');
        
        if (!this.isEdit && this.customer.password) {
          formData.append('password', this.customer.password);
        }
        
        if (this.customer.profile_photo) {
          formData.append('profile_photo', this.customer.profile_photo);
        }
        
        let response;
        if (this.isEdit) {
          response = await api.put(`/customers/${this.$route.params.id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        } else {
          response = await api.post('/customers', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }
        
        this.$emit('notification', 'success', 'Success', 
          `Customer ${this.isEdit ? 'updated' : 'created'} successfully!`);
        
        this.$router.push('/customers');
        
      } catch (error) {
        console.error('Error saving customer:', error);
        if (error.response?.data?.errors) {
          this.errors = error.response.data.errors;
        } else {
          this.$emit('notification', 'error', 'Error', 
            `Failed to ${this.isEdit ? 'update' : 'create'} customer`);
        }
      } finally {
        this.isSubmitting = false;
      }
    },
    
    getProfilePhotoUrl(profilePhoto) {
      if (!profilePhoto) return '/api/placeholder/128/128';
      if (profilePhoto.startsWith('http')) return profilePhoto;
      return `http://localhost:3000${profilePhoto}`;
    }
  }
};
</script>
