<template>
  <div class="container">
    <div class="columns is-centered">
      <div class="column is-half">
        <div class="box">
          <h1 class="title has-text-centered">Login</h1>
          <form @submit.prevent="handleLogin">
            <div class="field">
              <label class="label">Username</label>
              <div class="control">
                <input class="input" type="text" v-model="username" required>
              </div>
            </div>

            <div class="field">
              <label class="label">Password</label>
              <div class="control">
                <input class="input" type="password" v-model="password" required>
              </div>
            </div>

            <div class="field">
              <div class="control">
                <label class="switch">
                  <input type="checkbox" v-model="rememberMe">
                  <span class="slider round"></span>
                </label>
                <span class="ml-2">Remember Me</span>
              </div>
            </div>

            <div class="field">
              <div class="control">
                <button class="button is-primary is-fullwidth" :class="{ 'is-loading': isLoading }" type="submit">Login</button>
              </div>
            </div>

            <div v-if="errorMessage" class="notification is-danger is-light">
              {{ errorMessage }}
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api'; // Import the API service

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      rememberMe: false, // New data property
      isLoading: false,
      errorMessage: '',
    };
  },
  methods: {
    async handleLogin() {
      this.isLoading = true;
      this.errorMessage = '';
      try {
        const response = await api.post('/auth/login', {
          username: this.username,
          password: this.password,
          rememberMe: this.rememberMe,
        });
        
        const { token, user } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        if (user.role === 'ADMIN') {
          this.$router.push('/admin/dashboard');
        } else if (user.role === 'CUSTOMER') {
          this.$router.push('/customer/dashboard');
        } else {
          this.$router.push('/');
        }

        window.location.reload();

      } catch (error) {
        console.error('Login error:', error);
        if (error.response && error.response.data && error.response.data.message) {
          this.errorMessage = error.response.data.message;
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again.';
        }
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

