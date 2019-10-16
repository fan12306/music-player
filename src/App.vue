<template>
  <div id="app">
    <M-Header></M-Header>
    <TabBar></TabBar>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <play></play>
  </div>
</template>

<script>
import MHeader from './components/m-header/m-header'
import TabBar from './components/tab/tab'
import Play from './components/play/play'
export default {
  name: 'App',
  components: {
    MHeader,
    TabBar,
    Play
  }
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 11px;
  overflow: hidden;
  background-color: #222;
}
</style>
