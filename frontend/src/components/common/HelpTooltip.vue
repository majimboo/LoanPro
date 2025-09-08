<template>
  <span class="help-tooltip" @mouseenter="showTooltip" @mouseleave="hideTooltip" @click="toggleTooltip">
    <span class="icon is-small has-text-info">
      <i class="fas fa-question-circle"></i>
    </span>
    
    <!-- Tooltip content -->
    <div class="tooltip-content" :class="{ 'is-active': isVisible }">
      <div class="tooltip-arrow"></div>
      <div class="tooltip-inner">
        {{ message }}
      </div>
    </div>
  </span>
</template>

<script>
export default {
  name: 'HelpTooltip',
  props: {
    message: {
      type: String,
      required: true
    },
    position: {
      type: String,
      default: 'top',
      validator: value => ['top', 'bottom', 'left', 'right'].includes(value)
    }
  },
  data() {
    return {
      isVisible: false,
      isMobile: false
    };
  },
  mounted() {
    this.checkIfMobile();
    window.addEventListener('resize', this.checkIfMobile);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkIfMobile);
  },
  methods: {
    showTooltip() {
      if (!this.isMobile) {
        this.isVisible = true;
      }
    },
    hideTooltip() {
      if (!this.isMobile) {
        this.isVisible = false;
      }
    },
    toggleTooltip() {
      if (this.isMobile) {
        this.isVisible = !this.isVisible;
      }
    },
    checkIfMobile() {
      this.isMobile = window.innerWidth <= 768;
    }
  }
};
</script>

