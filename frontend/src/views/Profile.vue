<template>
  <div class="container is-fluid">
    <h1 class="title">My Profile</h1>

    <div class="columns">
      <div class="column is-one-third">
        <div class="box">
          <div class="has-text-centered">
            <figure class="image is-128x128 is-inline-block">
              <img class="is-rounded" :src="user.avatar || '/default-avatar.png'" alt="Profile Picture">
            </figure>
            <h2 class="title is-4 mt-4">{{ user.first_name }} {{ user.last_name }}</h2>
            <p class="subtitle is-6">{{ user.role }}</p>
            <p class="has-text-grey">{{ user.email }}</p>
          </div>

          <hr>

          <div class="field">
            <label class="label">Upload New Avatar</label>
            <div class="control">
              <input @change="uploadAvatar" type="file" accept="image/*" class="input">
            </div>
          </div>
        </div>

        <div class="box">
          <h3 class="subtitle">Account Statistics</h3>
          <div class="content">
            <p><strong>Member Since:</strong> {{ formatDate(user.created_at) }}</p>
            <p><strong>Last Login:</strong> {{ formatDate(user.last_login) }}</p>
            <p v-if="user.role === 'ADMIN'"><strong>Total Loans Processed:</strong> {{ stats.loansProcessed || 0 }}</p>
            <p v-if="user.role === 'CUSTOMER'"><strong>Active Loans:</strong> {{ stats.activeLoans || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="column is-two-thirds">
        <div class="box">
          <div class="tabs">
            <ul>
              <li :class="{ 'is-active': activeTab === 'profile' }">
                <a @click="activeTab = 'profile'">Profile Information</a>
              </li>
              <li :class="{ 'is-active': activeTab === 'security' }">
                <a @click="activeTab = 'security'">Security</a>
              </li>
              <li :class="{ 'is-active': activeTab === 'preferences' }">
                <a @click="activeTab = 'preferences'">Preferences</a>
              </li>
            </ul>
          </div>

          <!-- Profile Information Tab -->
          <div v-if="activeTab === 'profile'">
            <h3 class="subtitle">Profile Information</h3>
            <form @submit.prevent="updateProfile">
              <div class="columns">
                <div class="column">
                  <div class="field">
                    <label class="label">First Name</label>
                    <div class="control">
                      <input v-model="profileForm.first_name" type="text" class="input" required>
                    </div>
                  </div>
                </div>
                <div class="column">
                  <div class="field">
                    <label class="label">Last Name</label>
                    <div class="control">
                      <input v-model="profileForm.last_name" type="text" class="input" required>
                    </div>
                  </div>
                </div>
              </div>

              <div class="field">
                <label class="label">Email</label>
                <div class="control">
                  <input v-model="profileForm.email" type="email" class="input" required>
                </div>
              </div>

              <div class="field">
                <label class="label">Phone</label>
                <div class="control">
                  <input v-model="profileForm.phone" type="tel" class="input">
                </div>
              </div>

              <div class="field">
                <label class="label">Address</label>
                <div class="control">
                  <textarea v-model="profileForm.address" class="textarea" rows="3"></textarea>
                </div>
              </div>

              <div class="field">
                <div class="control">
                  <button type="submit" class="button is-primary" :class="{ 'is-loading': updating.profile }">
                    Update Profile
                  </button>
                </div>
              </div>
            </form>
          </div>

          <!-- Security Tab -->
          <div v-if="activeTab === 'security'">
            <h3 class="subtitle">Security Settings</h3>
            <form @submit.prevent="changePassword">
              <div class="field">
                <label class="label">Current Password</label>
                <div class="control">
                  <input v-model="passwordForm.currentPassword" type="password" class="input" required>
                </div>
              </div>

              <div class="field">
                <label class="label">New Password</label>
                <div class="control">
                  <input v-model="passwordForm.newPassword" type="password" class="input" required>
                </div>
                <p class="help">Password must be at least 8 characters long</p>
              </div>

              <div class="field">
                <label class="label">Confirm New Password</label>
                <div class="control">
                  <input v-model="passwordForm.confirmPassword" type="password" class="input" required>
                </div>
              </div>

              <div class="field">
                <div class="control">
                  <button type="submit" class="button is-primary" :class="{ 'is-loading': updating.password }">
                    Change Password
                  </button>
                </div>
              </div>
            </form>

            <hr>

            <h4 class="subtitle is-6">Two-Factor Authentication</h4>
            <div class="field">
              <div class="control">
                <label class="checkbox">
                  <input v-model="securitySettings.twoFactorEnabled" @change="toggleTwoFactor" type="checkbox">
                  Enable Two-Factor Authentication
                </label>
              </div>
              <p class="help">Adds an extra layer of security to your account</p>
            </div>
          </div>

          <!-- Preferences Tab -->
          <div v-if="activeTab === 'preferences'">
            <h3 class="subtitle">Preferences</h3>
            <form @submit.prevent="updatePreferences">
              <div class="field">
                <label class="label">Language</label>
                <div class="control">
                  <div class="select is-fullwidth">
                    <select v-model="preferences.language">
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="field">
                <label class="label">Timezone</label>
                <div class="control">
                  <div class="select is-fullwidth">
                    <select v-model="preferences.timezone">
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="field">
                <label class="label">Date Format</label>
                <div class="control">
                  <div class="select is-fullwidth">
                    <select v-model="preferences.dateFormat">
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </div>

              <h4 class="subtitle is-6 mt-5">Email Notifications</h4>
              <div class="field">
                <div class="control">
                  <label class="checkbox">
                    <input v-model="preferences.emailNotifications.dueDateReminders" type="checkbox">
                    Due date reminders
                  </label>
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <label class="checkbox">
                    <input v-model="preferences.emailNotifications.paymentConfirmations" type="checkbox">
                    Payment confirmations
                  </label>
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <label class="checkbox">
                    <input v-model="preferences.emailNotifications.systemUpdates" type="checkbox">
                    System updates and announcements
                  </label>
                </div>
              </div>

              <div class="field">
                <div class="control">
                  <button type="submit" class="button is-primary" :class="{ 'is-loading': updating.preferences }">
                    Save Preferences
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'Profile',
  data() {
    return {
      activeTab: 'profile',
      user: {
        first_name: '',
        last_name: '',
        email: '',
        role: '',
        phone: '',
        address: '',
        avatar: '',
        created_at: '',
        last_login: ''
      },
      profileForm: {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: ''
      },
      passwordForm: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      preferences: {
        language: 'en',
        timezone: 'America/New_York',
        dateFormat: 'MM/DD/YYYY',
        emailNotifications: {
          dueDateReminders: true,
          paymentConfirmations: true,
          systemUpdates: false
        }
      },
      securitySettings: {
        twoFactorEnabled: false
      },
      stats: {
        loansProcessed: 0,
        activeLoans: 0
      },
      updating: {
        profile: false,
        password: false,
        preferences: false
      }
    };
  },
  created() {
    this.loadProfile();
    this.loadStats();
  },
  methods: {
    async loadProfile() {
      try {
        const response = await api.get('/profile');
        this.user = response.data;
        this.profileForm = { ...response.data };
        
        if (response.data.preferences) {
          this.preferences = { ...this.preferences, ...response.data.preferences };
        }
        
        if (response.data.security_settings) {
          this.securitySettings = { ...this.securitySettings, ...response.data.security_settings };
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    },
    async loadStats() {
      try {
        const response = await api.get('/profile/stats');
        this.stats = response.data;
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    },
    async updateProfile() {
      this.updating.profile = true;
      try {
        await api.put('/profile', this.profileForm);
        this.user = { ...this.user, ...this.profileForm };
        alert('Profile updated successfully!');
      } catch (error) {
        console.error('Error updating profile:', error);
        alert('Failed to update profile');
      } finally {
        this.updating.profile = false;
      }
    },
    async changePassword() {
      if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
        alert('New passwords do not match');
        return;
      }

      if (this.passwordForm.newPassword.length < 8) {
        alert('Password must be at least 8 characters long');
        return;
      }

      this.updating.password = true;
      try {
        await api.put('/profile/password', {
          current_password: this.passwordForm.currentPassword,
          new_password: this.passwordForm.newPassword
        });
        
        this.passwordForm = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        };
        
        alert('Password changed successfully!');
      } catch (error) {
        console.error('Error changing password:', error);
        alert('Failed to change password. Please check your current password.');
      } finally {
        this.updating.password = false;
      }
    },
    async updatePreferences() {
      this.updating.preferences = true;
      try {
        await api.put('/profile/preferences', this.preferences);
        alert('Preferences saved successfully!');
      } catch (error) {
        console.error('Error updating preferences:', error);
        alert('Failed to save preferences');
      } finally {
        this.updating.preferences = false;
      }
    },
    async toggleTwoFactor() {
      try {
        await api.put('/profile/two-factor', {
          enabled: this.securitySettings.twoFactorEnabled
        });
        
        if (this.securitySettings.twoFactorEnabled) {
          alert('Two-factor authentication enabled. Please check your email for setup instructions.');
        } else {
          alert('Two-factor authentication disabled.');
        }
      } catch (error) {
        console.error('Error toggling two-factor authentication:', error);
        this.securitySettings.twoFactorEnabled = !this.securitySettings.twoFactorEnabled;
        alert('Failed to update two-factor authentication setting');
      }
    },
    async uploadAvatar(event) {
      const file = event.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('avatar', file);

      try {
        const response = await api.post('/profile/avatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        this.user.avatar = response.data.avatar_url;
        alert('Avatar updated successfully!');
      } catch (error) {
        console.error('Error uploading avatar:', error);
        alert('Failed to upload avatar');
      }
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString();
    }
  }
};
</script>

