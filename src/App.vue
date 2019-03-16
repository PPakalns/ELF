<template>
  <div id="app">
    <h1>ELF visualiser</h1>
    <ElfFileVisualiser v-if="elf" v-bind:elf="elf" />
    <ElfFileSelector v-model="elf" v-else />
  </div>
</template>

<script>
import ElfFileSelector from './components/ElfFileSelector.vue'
import ElfFileVisualiser from './components/ElfFileVisualiser.vue'

export default {
  name: 'app',
  data() {
      return {
          elf: null,
      }
  },
  components: {
      ElfFileSelector,
      ElfFileVisualiser,
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}
</style>
