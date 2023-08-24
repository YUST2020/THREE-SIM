<template>
  <div id="app">
    <div ref="container" style="width: 100vw;height: 100vh;">
</div>
  </div>
</template>

<script>
import Four from './four/four'
export default {
  name: 'App',
  mounted() {
    new Four(this.$refs.container)
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
