<template>
  <div class="hero is-fullheight">
    <div class="hero-body">
      <div class="container has-text-centered">
        <div class="columns is-vcentered">
          <div class="column is-5">
            <figure class="image is-4by3">
              <img src="/404-illustration.svg" alt="404 Not Found" style="max-width: 100%; height: auto;">
            </figure>
          </div>
          <div class="column is-6 is-offset-1">
            <h1 class="title is-1 has-text-grey-light">
              404
            </h1>
            <h2 class="subtitle is-3 has-text-grey">
              Page Not Found
            </h2>
            <p class="has-text-grey mb-5">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <div class="buttons is-centered">
              <router-link to="/" class="button is-primary is-large">
                <span class="icon">
                  <i class="fas fa-home"></i>
                </span>
                <span>Go Home</span>
              </router-link>
              <button @click="goBack" class="button is-light is-large">
                <span class="icon">
                  <i class="fas fa-arrow-left"></i>
                </span>
                <span>Go Back</span>
              </button>
            </div>
            
            <hr class="my-6">
            
            <div class="content">
              <h3 class="subtitle is-5">Quick Links</h3>
              <div class="columns is-mobile">
                <div class="column">
                  <router-link to="/dashboard" class="button is-text">
                    <span class="icon">
                      <i class="fas fa-tachometer-alt"></i>
                    </span>
                    <span>Dashboard</span>
                  </router-link>
                </div>
                <div class="column">
                  <router-link to="/loans" class="button is-text">
                    <span class="icon">
                      <i class="fas fa-coins"></i>
                    </span>
                    <span>Loans</span>
                  </router-link>
                </div>
                <div class="column">
                  <router-link to="/customers" class="button is-text">
                    <span class="icon">
                      <i class="fas fa-users"></i>
                    </span>
                    <span>Customers</span>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mt-6">
          <p class="is-size-7 has-text-grey-light">
            Error Code: {{ $route.path }} | 
            Time: {{ new Date().toLocaleString() }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  methods: {
    goBack() {
      // Check if there's a previous page in history
      if (window.history.length > 1) {
        this.$router.back();
      } else {
        // Fallback to home page if no history
        this.$router.push('/');
      }
    }
  },
  mounted() {
    // Log 404 errors for analytics (optional)
    console.warn(`404 Error: Page not found - ${this.$route.path}`);
    
    // You could also send this to an analytics service
    // analytics.track('404_error', { path: this.$route.path });
  }
};
</script>

