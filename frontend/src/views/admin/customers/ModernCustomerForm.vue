<template>
  <div class="page-container">
    <!-- Breadcrumb -->
    <div class="container mb-4">
      <nav class="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li><router-link to="/dashboard">Dashboard</router-link></li>
          <li><router-link to="/customers">Customers</router-link></li>
          <li class="is-active"><a href="#" aria-current="page">{{ isEdit ? 'Edit' : 'New' }} Customer</a></li>
        </ul>
      </nav>
    </div>

    <!-- Header Section -->
    <PageHeader
      :title="isEdit ? 'Edit Customer' : 'Add New Customer'"
      :subtitle="isEdit ? 'Update customer information and account details' : 'Create a new customer profile and account'"
      icon="fas fa-user-plus"
      variant="form">
      <template #actions>
        <router-link to="/customers" class="button is-light">
          <span class="icon">
            <i class="fas fa-arrow-left"></i>
          </span>
          <span>Back to Customers</span>
        </router-link>
      </template>
    </PageHeader>

    <!-- Form Content -->
    <div class="page-content">
      <section class="section">
        <div class="container">
        <form @submit.prevent="handleSubmit">
          <div class="columns">
            <!-- Main Form Column -->
            <div class="column is-8">
              <!-- Personal Information -->
              <div class="card form-section no-hover">
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
                        <label class="label modern-label">
                          <i class="fas fa-user icon-label"></i>
                          First Name *
                        </label>
                        <div class="control has-icons-left">
                          <input 
                            class="input modern-input" 
                            type="text" 
                            v-model="customer.first_name" 
                            :class="{ 'is-danger': errors.first_name }"
                            placeholder="Enter first name"
                            required>
                          <span class="icon is-small is-left">
                            <i class="fas fa-user"></i>
                          </span>
                        </div>
                        <p v-if="errors.first_name" class="help is-danger">{{ errors.first_name }}</p>
                      </div>
                    </div>
                    <div class="column">
                      <div class="field">
                        <label class="label modern-label">
                          <i class="fas fa-user-tag icon-label"></i>
                          Last Name *
                        </label>
                        <div class="control has-icons-left">
                          <input 
                            class="input modern-input" 
                            type="text" 
                            v-model="customer.last_name" 
                            :class="{ 'is-danger': errors.last_name }"
                            placeholder="Enter last name"
                            required>
                          <span class="icon is-small is-left">
                            <i class="fas fa-user-tag"></i>
                          </span>
                        </div>
                        <p v-if="errors.last_name" class="help is-danger">{{ errors.last_name }}</p>
                      </div>
                    </div>
                  </div>

                  <div class="field">
                    <label class="label modern-label">
                      <i class="fas fa-camera icon-label"></i>
                      Profile Photo
                    </label>
                    <div class="profile-photo-section">
                      <div class="photo-preview" v-if="customer.profile_photo_url_existing || customer.profile_photo">
                        <div class="avatar-container">
                          <img 
                            :src="profilePhotoUrl" 
                            alt="Profile photo"
                            class="avatar-preview">
                          <div class="avatar-overlay">
                            <i class="fas fa-camera"></i>
                          </div>
                        </div>
                        <p class="photo-status">{{ customer.profile_photo ? 'New photo selected' : 'Current photo' }}</p>
                      </div>
                      
                      <div class="upload-area" :class="{ 'has-photo': customer.profile_photo_url_existing || customer.profile_photo }">
                        <label class="upload-label">
                          <input 
                            class="file-input" 
                            type="file" 
                            accept="image/*"
                            @change="handleProfilePhotoSelected">
                          <div class="upload-content">
                            <i class="fas fa-cloud-upload-alt upload-icon"></i>
                            <span class="upload-text">
                              {{ customer.profile_photo || customer.profile_photo_url_existing ? 'Change Photo' : 'Upload Photo' }}
                            </span>
                            <span class="upload-hint">JPG, PNG or GIF (Max 5MB)</span>
                          </div>
                        </label>
                        <span class="file-name-display" v-if="customer.profile_photo">
                          <i class="fas fa-file-image"></i>
                          {{ customer.profile_photo.name }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Contact Information -->
              <div class="card form-section no-hover">
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
                    <label class="label modern-label">
                      <i class="fas fa-envelope icon-label"></i>
                      Email Address *
                    </label>
                    <div class="control has-icons-left has-icons-right">
                      <input 
                        class="input modern-input" 
                        type="email" 
                        v-model="customer.email" 
                        :class="{ 'is-danger': errors.email, 'is-success': customer.email && !errors.email }"
                        :required="!isEdit"
                        placeholder="customer@example.com">
                      <span class="icon is-small is-left">
                        <i class="fas fa-envelope"></i>
                      </span>
                      <span class="icon is-small is-right" v-if="customer.email && !errors.email">
                        <i class="fas fa-check has-text-success"></i>
                      </span>
                    </div>
                    <p v-if="errors.email" class="help is-danger">{{ errors.email }}</p>
                    <p class="help modern-help">This will be used for account login and notifications</p>
                  </div>

                  <div class="field">
                    <label class="label modern-label">
                      <i class="fas fa-phone icon-label"></i>
                      Phone Number
                    </label>
                    <div class="control has-icons-left has-icons-right">
                      <input 
                        class="input modern-input" 
                        type="tel" 
                        v-model="customer.phone" 
                        :class="{ 'is-danger': errors.phone, 'is-success': customer.phone && !errors.phone }"
                        placeholder="09XX XXX XXXX">
                      <span class="icon is-small is-left">
                        <i class="fas fa-phone"></i>
                      </span>
                      <span class="icon is-small is-right" v-if="customer.phone && !errors.phone">
                        <i class="fas fa-check has-text-success"></i>
                      </span>
                    </div>
                    <p v-if="errors.phone" class="help is-danger">{{ errors.phone }}</p>
                  </div>

                  <div class="field">
                    <label class="label modern-label">
                      <i class="fas fa-map-marker-alt icon-label"></i>
                      Address
                    </label>
                    <div class="control">
                      <textarea 
                        class="textarea modern-textarea" 
                        v-model="customer.address" 
                        :class="{ 'is-danger': errors.address, 'is-success': customer.address && !errors.address }"
                        rows="3"
                        placeholder="Street, Barangay, City, Province">
                      </textarea>
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
                    <label class="label modern-label">
                      <i class="fas fa-lock icon-label"></i>
                      Password *
                    </label>
                    <div class="control has-icons-left has-icons-right">
                      <input 
                        class="input modern-input" 
                        :type="showPassword ? 'text' : 'password'" 
                        v-model="customer.password" 
                        :class="{ 'is-danger': errors.password, 'is-success': customer.password && !errors.password }"
                        required
                        placeholder="Enter secure password">
                      <span class="icon is-small is-left">
                        <i class="fas fa-lock"></i>
                      </span>
                      <span class="icon is-small is-right password-toggle" @click="showPassword = !showPassword">
                        <i class="fas" :class="showPassword ? 'fa-eye-slash' : 'fa-eye'"></i>
                      </span>
                    </div>
                    <div class="password-strength" v-if="customer.password">
                      <div class="strength-bar">
                        <div class="strength-fill" :class="passwordStrength.class" :style="{width: passwordStrength.width}"></div>
                      </div>
                      <span class="strength-text" :class="passwordStrength.class">{{ passwordStrength.text }}</span>
                    </div>
                    <p v-if="errors.password" class="help is-danger">{{ errors.password }}</p>
                    <p class="help modern-help">Customer will use this password to login to their account</p>
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
                  <div class="action-buttons">
                    <button 
                      type="submit" 
                      class="button modern-button primary"
                      :class="{ 'is-loading': isSubmitting }"
                      :disabled="!isFormValid">
                      <span class="button-icon">
                        <i class="fas" :class="isEdit ? 'fa-save' : 'fa-plus'"></i>
                      </span>
                      <span class="button-text">{{ isEdit ? 'Update Customer' : 'Create Customer' }}</span>
                    </button>
                    
                    <router-link to="/customers" class="button modern-button secondary">
                      <span class="button-icon">
                        <i class="fas fa-arrow-left"></i>
                      </span>
                      <span class="button-text">Cancel</span>
                    </router-link>
                    
                    <router-link v-if="isEdit" :to="`/loans/new?customer=${customer.id}`" class="button modern-button success">
                      <span class="button-icon">
                        <i class="fas fa-file-invoice-dollar"></i>
                      </span>
                      <span class="button-text">Create Loan</span>
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
      </section>
    </div>
  </div>
</template>

<script>
import api from '../../../services/api';
import PageHeader from '../../../components/common/PageHeader.vue';

export default {
  name: 'ModernCustomerForm',
  components: {
    PageHeader
  },
  data() {
    return {
      isEdit: false,
      isSubmitting: false,
      showPassword: false,
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
    },
    
    passwordStrength() {
      if (!this.customer.password) return { width: '0%', class: '', text: '' };
      
      const password = this.customer.password;
      let score = 0;
      
      // Length check
      if (password.length >= 8) score += 2;
      else if (password.length >= 6) score += 1;
      
      // Character variety checks
      if (/[a-z]/.test(password)) score += 1;
      if (/[A-Z]/.test(password)) score += 1;
      if (/[0-9]/.test(password)) score += 1;
      if (/[^A-Za-z0-9]/.test(password)) score += 1;
      
      if (score <= 2) {
        return { width: '25%', class: 'is-danger', text: 'Weak' };
      } else if (score <= 4) {
        return { width: '50%', class: 'is-warning', text: 'Fair' };
      } else if (score <= 5) {
        return { width: '75%', class: 'is-info', text: 'Good' };
      } else {
        return { width: '100%', class: 'is-success', text: 'Strong' };
      }
    },

    profilePhotoUrl() {
      if (this.customer.profile_photo && typeof this.customer.profile_photo === 'object') {
        return URL.createObjectURL(this.customer.profile_photo);
      } else if (this.customer.profile_photo_url_existing) {
        return this.getProfilePhotoUrl(this.customer.profile_photo_url_existing);
      }
      return null;
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
        console.log('Fetching customer with ID:', this.$route.params.id);
        const response = await api.get(`/customers/${this.$route.params.id}`);
        console.log('Customer data response:', response.data);
        
        this.customer = {
          ...response.data,
          email: response.data.user ? response.data.user.email : response.data.email || '',
          profile_photo_url_existing: response.data.profile_photo ? 
            response.data.profile_photo : null,
          // Ensure password is empty for edit mode
          password: ''
        };
        
        console.log('Customer object after setting:', this.customer);
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

<style scoped>
/* Consistent with site design system */

/* Form Labels - Match existing design */
.modern-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--dashboard-gray-800, #2c3e50);
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
}

.icon-label {
  color: var(--dashboard-gray-500, #7a7a7a);
  font-size: 0.75rem;
}

/* Form Inputs - Match Bulma with site enhancements */
.modern-input {
  border: 1px solid #dbdbdb;
  border-radius: 4px;
  padding: 0.625rem 0.75rem;
  padding-left: 2.5rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.modern-input:focus {
  border-color: #3273dc;
  box-shadow: 0 0 0 0.125em rgba(50, 115, 220, 0.25);
}

.modern-input:hover:not(:focus) {
  border-color: #b5b5b5;
}

.modern-input.is-success {
  border-color: #48c774;
}

.modern-input.is-danger {
  border-color: #ff3860;
  animation: shake 0.5s ease-in-out;
}

.modern-textarea {
  border: 1px solid #dbdbdb;
  border-radius: 4px;
  padding: 0.625rem 0.75rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  resize: vertical;
  min-height: 120px;
}

.modern-textarea:focus {
  border-color: #3273dc;
  box-shadow: 0 0 0 0.125em rgba(50, 115, 220, 0.25);
}

.modern-help {
  color: #7a7a7a;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

/* Profile Photo Section - Consistent with site avatars */
.profile-photo-section {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  flex-wrap: wrap;
}

.photo-preview {
  text-align: center;
}

.avatar-container {
  position: relative;
  width: 128px;
  height: 128px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #e8e8e8;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.avatar-container:hover {
  border-color: #3273dc;
  transform: scale(1.02);
}

.avatar-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(50, 115, 220, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.avatar-container:hover .avatar-overlay {
  opacity: 1;
}

.avatar-overlay i {
  color: white;
  font-size: 1.5rem;
}

.photo-status {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #7a7a7a;
  font-weight: 500;
}

.upload-area {
  flex: 1;
  min-width: 280px;
}

.upload-area.has-photo {
  flex: none;
  width: 300px;
}

.upload-label {
  display: block;
  cursor: pointer;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  background: #fafafa;
}

.upload-label:hover {
  border-color: #3273dc;
  background: #f0f7ff;
}

.file-input {
  display: none;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.upload-icon {
  font-size: 2rem;
  color: #7a7a7a;
  transition: color 0.3s ease;
}

.upload-label:hover .upload-icon {
  color: #3273dc;
}

.upload-text {
  font-weight: 600;
  color: #2c3e50;
  font-size: 1rem;
}

.upload-hint {
  font-size: 0.875rem;
  color: #7a7a7a;
}

.file-name-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #f8f9fa;
  border-radius: 4px;
  font-size: 0.875rem;
  color: #2c3e50;
  border: 1px solid #e8e8e8;
}

/* Password Field - Match site form styling */
.password-toggle {
  cursor: pointer;
  color: #7a7a7a;
  transition: color 0.2s ease;
}

.password-toggle:hover {
  color: #2c3e50;
}

.password-strength {
  margin-top: 0.75rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.strength-bar {
  flex: 1;
  height: 4px;
  background: #e8e8e8;
  border-radius: 2px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.strength-fill.is-danger {
  background: #ff3860;
}

.strength-fill.is-warning {
  background: #ffdd57;
}

.strength-fill.is-info {
  background: #3298dc;
}

.strength-fill.is-success {
  background: #48c774;
}

.strength-text {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.strength-text.is-danger {
  color: #ff3860;
}

.strength-text.is-warning {
  color: #947600;
}

.strength-text.is-info {
  color: #3298dc;
}

.strength-text.is-success {
  color: #48c774;
}

/* Button Styles - Match existing site buttons */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.modern-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  cursor: pointer;
  width: 100%;
}

.modern-button.primary {
  background: #3273dc;
  color: white;
  border-color: #3273dc;
}

.modern-button.primary:hover:not(:disabled) {
  background: #2366d1;
  border-color: #2366d1;
  color: white;
}

.modern-button.primary:disabled {
  background: #dbdbdb;
  color: #7a7a7a;
  border-color: #dbdbdb;
  cursor: not-allowed;
}

.modern-button.secondary {
  background: #f5f5f5;
  color: #363636;
  border-color: #dbdbdb;
}

.modern-button.secondary:hover {
  background: #eeeeee;
  border-color: #b5b5b5;
  color: #363636;
}

.modern-button.success {
  background: #48c774;
  color: white;
  border-color: #48c774;
}

.modern-button.success:hover {
  background: #3ec46d;
  border-color: #3ec46d;
  color: white;
}

.button-icon {
  font-size: 1rem;
}

.button-text {
  font-weight: 600;
}

/* Form Sections - Match site card styling */
.form-section {
  margin-bottom: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  border: none;
  overflow: hidden;
  transition: all 0.3s ease;
}

.form-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.15);
}

.form-section .card-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #fff 100%);
  border-bottom: 1px solid #e8e8e8;
  padding: 1.25rem;
}

.form-section .card-content {
  padding: 1.5rem;
}

/* Animations */
@keyframes shake {
  0%, 20%, 50%, 80%, 100% { transform: translateX(0); }
  10%, 30%, 70%, 90% { transform: translateX(-5px); }
  40%, 60% { transform: translateX(5px); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .profile-photo-section {
    flex-direction: column;
    align-items: center;
  }
  
  .upload-area.has-photo {
    width: 100%;
  }
  
  .form-section .card-content {
    padding: 1rem;
  }
  
  .form-section .card-header {
    padding: 1rem;
  }
}

/* Loading Animation - Match Bulma */
.is-loading {
  position: relative;
}

.is-loading .button-text,
.is-loading .button-icon {
  opacity: 0;
}

.is-loading::after {
  animation: spinAround 500ms infinite linear;
  border: 2px solid #dbdbdb;
  border-radius: 50%;
  border-right-color: transparent;
  border-top-color: transparent;
  content: "";
  display: block;
  height: 1rem;
  position: absolute;
  width: 1rem;
  left: calc(50% - 0.5rem);
  top: calc(50% - 0.5rem);
}

@keyframes spinAround {
  from { transform: rotate(0deg); }
  to { transform: rotate(359deg); }
}
</style>
