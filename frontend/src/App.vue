<template>
  <div id="app">
    <router-view />
    
    <!-- Global Notification Container -->
    <div class="notifications-container">
      <div v-for="notification in notifications" 
           :key="notification.id"
           class="notification"
           :class="[`is-${notification.type}`]">
        <button class="delete" @click="removeNotification(notification.id)"></button>
        <strong v-if="notification.title">{{ notification.title }}</strong>
        <p>{{ notification.message }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      notifications: []
    };
  },
  mounted() {
    // Global event listeners for notifications
    this.$root.$on('notification', this.addNotification);
    
    // Add some default styles to body
    document.body.classList.add('has-navbar-fixed-top');
  },
  beforeUnmount() {
    this.$root.$off('notification', this.addNotification);
  },
  methods: {
    addNotification(type, title, message) {
      const id = Date.now();
      this.notifications.push({ id, type, title, message });
      
      // Auto-remove after 5 seconds
      setTimeout(() => {
        this.removeNotification(id);
      }, 5000);
    },
    removeNotification(id) {
      this.notifications = this.notifications.filter(n => n.id !== id);
    }
  }
};
</script>

