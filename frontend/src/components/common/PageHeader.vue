<template>
  <div class="page-header" :class="headerClass">
    <div class="container">
      <div class="level is-mobile">
        <div class="level-left">
          <div class="level-item">
            <div>
              <h1 class="title is-4 mb-1" :class="titleClass">
                <span class="icon-text" v-if="icon">
                  <span class="icon">
                    <i :class="icon"></i>
                  </span>
                  <span>{{ title }}</span>
                </span>
                <span v-else>{{ title }}</span>
              </h1>
              <p class="subtitle is-6 mb-0" v-if="subtitle" :class="subtitleClass">
                {{ subtitle }}
              </p>
            </div>
          </div>
        </div>
        <div class="level-right" v-if="$slots.actions">
          <div class="level-item">
            <div class="buttons">
              <slot name="actions"></slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageHeader',
  props: {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: null
    },
    icon: {
      type: String,
      default: null
    },
    variant: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'form', 'hero'].includes(value)
    },
    titleClass: {
      type: String,
      default: ''
    },
    subtitleClass: {
      type: String,
      default: 'has-text-grey'
    }
  },
  computed: {
    headerClass() {
      switch (this.variant) {
        case 'form':
          return 'has-background-white py-5 mb-5 form-header-border';
        case 'hero':
          return 'dashboard-hero has-background-primary has-text-white py-6 mb-6';
        default:
          return 'has-background-white py-4 mb-5 has-shadow-light';
      }
    }
  }
}
</script>

<style scoped>
.page-header {
  border-bottom: 1px solid #e8e8e8;
}

.form-header-border {
  border-bottom: 2px solid #3273dc;
}

.dashboard-hero .title {
  color: white !important;
}

.dashboard-hero .subtitle {
  color: rgba(255, 255, 255, 0.9) !important;
}

.has-shadow-light {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>