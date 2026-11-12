<template>
  <div class="loader">
    Preparant la sorpresa... 🎂🎈<br />
    <span class="countdown-number">
      {{ countdown > 0 ? countdown : '🎉' }}
    </span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  countdown: number
}

defineProps<Props>()
</script>

<style scoped>
.loader {
  font-size: 2rem;
  color: white;
  background: rgba(0, 0, 0, 0.6);
  padding: 2rem 3rem;
  margin: 0 2rem;
  border-radius: 20px;
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
  text-align: center;
  z-index: 10;
  animation: fadeIn 1s ease-out;
}

@keyframes fadeIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.countdown-number {
  display: block;
  font-size: 5rem;
  margin-top: 1rem;
  animation: pop 0.5s ease-in;
}

@keyframes pop {
  0% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
}
</style>
