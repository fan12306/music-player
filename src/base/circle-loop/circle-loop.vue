<template>
  <div class="progress-circle">
    <svg
      :width="radius"
      :height="radius"
      viewBox="0 0 100 100"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle class="progress-background" r="50" cx="50" cy="50" fill="none" />
      <circle
        class="progress-bar"
        r="50"
        cx="50"
        cy="50"
        fill="none"
        :stroke-dasharray="dashArray"
        :stroke-dashoffset="dashoffset"
      />
    </svg>
    <slot class="btn"></slot>
  </div>
</template>

<script>
export default {
  props: {
    radius: {
      type: String,
      default: "0.32rem"
    },
    percent: {
      type: Number,
      default: 0
    }
  },
  computed: {
    dashArray() {
      return Math.PI * 100;
    },
    dashoffset() {
      return (1 - this.percent) * this.dashArray;
    }
  }
};
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.progress-circle {
  display: flex;
  align-content: center;
  justify-content: center;

  circle {
    stroke-width: 8px;
    transform-origin: center;

    &.progress-background {
      transform: scale(0.9);
      stroke: $color-theme-d;
    }

    &.progress-bar {
      transform: scale(0.9) rotate(-90deg);
      stroke: $color-theme;
    }
  }

  btn {
    position: absolute;
  }
}
</style>