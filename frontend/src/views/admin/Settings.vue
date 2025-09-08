<template>
  <div class="page-container">
    <div class="page-header">
      <div class="container">
        <div class="level">
          <div class="level-left">
            <div class="level-item">
              <div>
                <h1 class="title is-3">Settings</h1>
                <p class="subtitle is-5">Configure your application preferences</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="page-content">
      <section class="section">
        <div class="container">
          <div class="columns">
      <div class="column is-one-quarter">
        <div class="box">
          <h2 class="subtitle">Settings Categories</h2>
          <div class="menu">
            <ul class="menu-list">
              <li>
                <a @click="activeTab = 'general'" :class="{ 'is-active': activeTab === 'general' }">
                  <span class="icon"><i class="fas fa-cog"></i></span>
                  General
                </a>
              </li>
              <li>
                <a @click="activeTab = 'business'" :class="{ 'is-active': activeTab === 'business' }">
                  <span class="icon"><i class="fas fa-building"></i></span>
                  Business Info
                </a>
              </li>
              <li>
                <a @click="activeTab = 'loan'" :class="{ 'is-active': activeTab === 'loan' }">
                  <span class="icon"><i class="fas fa-percentage"></i></span>
                  Loan Settings
                </a>
              </li>
              <li>
                <a @click="activeTab = 'notifications'" :class="{ 'is-active': activeTab === 'notifications' }">
                  <span class="icon"><i class="fas fa-bell"></i></span>
                  Notifications
                </a>
              </li>
              <li>
                <a @click="activeTab = 'security'" :class="{ 'is-active': activeTab === 'security' }">
                  <span class="icon"><i class="fas fa-shield-alt"></i></span>
                  Security
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="column is-three-quarters">
        <div class="box">
          <!-- General Settings -->
          <div v-if="activeTab === 'general'">
            <h2 class="subtitle">General Settings</h2>
            <form @submit.prevent="saveSettings('general')">
              <div class="field">
                <label class="label">Application Name</label>
                <div class="control">
                  <input v-model="settings.general.appName" type="text" class="input" placeholder="Pawn Shop Management">
                </div>
              </div>
              <div class="field">
                <label class="label">Default Currency</label>
                <div class="control">
                  <div class="select is-fullwidth">
                    <select v-model="settings.general.currency">
                      <option value="USD">USD - US Dollar</option>
                      <option value="PHP">PHP - Philippine Peso</option>
                      <option value="EUR">EUR - Euro</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="field">
                <label class="label">Date Format</label>
                <div class="control">
                  <div class="select is-fullwidth">
                    <select v-model="settings.general.dateFormat">
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <button type="submit" class="button is-primary" :class="{ 'is-loading': saving.general }">
                    Save General Settings
                  </button>
                </div>
              </div>
            </form>
          </div>

          <!-- Business Information -->
          <div v-if="activeTab === 'business'">
            <h2 class="subtitle">Business Information</h2>
            <form @submit.prevent="saveSettings('business')">
              <div class="field">
                <label class="label">Business Name</label>
                <div class="control">
                  <input v-model="settings.business.name" type="text" class="input" placeholder="Your Pawn Shop Name">
                </div>
              </div>
              <div class="field">
                <label class="label">Address</label>
                <div class="control">
                  <textarea v-model="settings.business.address" class="textarea" placeholder="Business address"></textarea>
                </div>
              </div>
              <div class="field">
                <label class="label">Phone</label>
                <div class="control">
                  <input v-model="settings.business.phone" type="tel" class="input" placeholder="+1 234 567 8900">
                </div>
              </div>
              <div class="field">
                <label class="label">Email</label>
                <div class="control">
                  <input v-model="settings.business.email" type="email" class="input" placeholder="info@yourpawnshop.com">
                </div>
              </div>
              <div class="field">
                <label class="label">License Number</label>
                <div class="control">
                  <input v-model="settings.business.licenseNumber" type="text" class="input" placeholder="License #">
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <button type="submit" class="button is-primary" :class="{ 'is-loading': saving.business }">
                    Save Business Information
                  </button>
                </div>
              </div>
            </form>
          </div>

          <!-- Loan Settings -->
          <div v-if="activeTab === 'loan'">
            <h2 class="subtitle">Loan Settings</h2>
            <form @submit.prevent="saveSettings('loan')">
              <div class="field">
                <label class="label">Default Interest Rate (%)</label>
                <div class="control">
                  <input v-model.number="settings.loan.defaultInterestRate" type="number" step="0.01" min="0" max="100" class="input">
                </div>
                <p class="help">Default monthly interest rate for new loans</p>
              </div>
              <div class="field">
                <label class="label">Default Loan Term (months)</label>
                <div class="control">
                  <input v-model.number="settings.loan.defaultTerm" type="number" min="1" max="60" class="input">
                </div>
              </div>
              <div class="field">
                <label class="label">Grace Period (days)</label>
                <div class="control">
                  <input v-model.number="settings.loan.gracePeriod" type="number" min="0" max="90" class="input">
                </div>
                <p class="help">Days after maturity before penalties apply</p>
              </div>
              <div class="field">
                <label class="label">Late Fee Amount</label>
                <div class="control">
                  <input v-model.number="settings.loan.lateFee" type="number" step="0.01" min="0" class="input">
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <label class="checkbox">
                    <input v-model="settings.loan.autoCalculateInterest" type="checkbox">
                    Automatically calculate accrued interest
                  </label>
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <button type="submit" class="button is-primary" :class="{ 'is-loading': saving.loan }">
                    Save Loan Settings
                  </button>
                </div>
              </div>
            </form>
          </div>

          <!-- Notifications -->
          <div v-if="activeTab === 'notifications'">
            <h2 class="subtitle">Notification Settings</h2>
            <form @submit.prevent="saveSettings('notifications')">
              <div class="field">
                <div class="control">
                  <label class="checkbox">
                    <input v-model="settings.notifications.emailEnabled" type="checkbox">
                    Enable email notifications
                  </label>
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <label class="checkbox">
                    <input v-model="settings.notifications.smsEnabled" type="checkbox">
                    Enable SMS notifications
                  </label>
                </div>
              </div>
              <div class="field">
                <label class="label">Days Before Due Date to Notify</label>
                <div class="control">
                  <input v-model.number="settings.notifications.daysBeforeDue" type="number" min="1" max="30" class="input">
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <label class="checkbox">
                    <input v-model="settings.notifications.overdueReminders" type="checkbox">
                    Send overdue payment reminders
                  </label>
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <button type="submit" class="button is-primary" :class="{ 'is-loading': saving.notifications }">
                    Save Notification Settings
                  </button>
                </div>
              </div>
            </form>
          </div>

          <!-- Security -->
          <div v-if="activeTab === 'security'">
            <h2 class="subtitle">Security Settings</h2>
            <form @submit.prevent="saveSettings('security')">
              <div class="field">
                <label class="label">Session Timeout (minutes)</label>
                <div class="control">
                  <input v-model.number="settings.security.sessionTimeout" type="number" min="15" max="480" class="input">
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <label class="checkbox">
                    <input v-model="settings.security.requireStrongPassword" type="checkbox">
                    Require strong passwords
                  </label>
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <label class="checkbox">
                    <input v-model="settings.security.twoFactorAuth" type="checkbox">
                    Enable two-factor authentication
                  </label>
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <label class="checkbox">
                    <input v-model="settings.security.auditLogging" type="checkbox">
                    Enable audit logging
                  </label>
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <button type="submit" class="button is-primary" :class="{ 'is-loading': saving.security }">
                    Save Security Settings
                  </button>
                </div>
              </div>
            </form>
          </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import api from '../../services/api';

export default {
  name: 'Settings',
  data() {
    return {
      activeTab: 'general',
      settings: {
        general: {
          appName: 'Pawn Shop Management',
          currency: 'USD',
          dateFormat: 'MM/DD/YYYY'
        },
        business: {
          name: '',
          address: '',
          phone: '',
          email: '',
          licenseNumber: ''
        },
        loan: {
          defaultInterestRate: 5.0,
          defaultTerm: 3,
          gracePeriod: 7,
          lateFee: 25.00,
          autoCalculateInterest: true
        },
        notifications: {
          emailEnabled: true,
          smsEnabled: false,
          daysBeforeDue: 7,
          overdueReminders: true
        },
        security: {
          sessionTimeout: 120,
          requireStrongPassword: true,
          twoFactorAuth: false,
          auditLogging: true
        }
      },
      saving: {
        general: false,
        business: false,
        loan: false,
        notifications: false,
        security: false
      }
    };
  },
  created() {
    this.loadSettings();
  },
  methods: {
    async loadSettings() {
      try {
        const response = await api.get('/settings');
        this.settings = { ...this.settings, ...response.data };
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    },
    async saveSettings(category) {
      this.saving[category] = true;
      try {
        await api.put(`/settings/${category}`, this.settings[category]);
        this.$toast.success(`${category} settings saved successfully!`);
      } catch (error) {
        console.error(`Error saving ${category} settings:`, error);
        this.$toast.error(`Failed to save ${category} settings`);
      } finally {
        this.saving[category] = false;
      }
    }
  }
};
</script>

