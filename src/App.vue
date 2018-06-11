<template>
  <div id="app">
    <TopBar />
    <router-view/>
    <FootBar />
  </div>
</template>

<script>
import TopBar from '@/components/TopBar';
import FootBar from '@/components/FootBar';

export default {
  name: 'App',
  components: {
    TopBar,
    FootBar
  }
}
</script>

<style lang="scss">
@import "@/assets/styles/main.scss";

body {
  background: #ECF0F3;
}
.card {
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.18);
  margin-bottom: 2rem;
}
</style>
