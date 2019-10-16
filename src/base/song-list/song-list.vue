<template>
    <div class="song-list">
        <div class="content" v-for="(song, index) in songs" :key='song.id' @click= 'selectItem(song, index)'>
            <span class="name">{{ song.name }}</span>
            <h3 class="desc">{{getDesc(song)}}</h3>
        </div>
    </div>
</template>

<script>
export default {
  props: {
    songs: {
      type: Array,
      default: []
    }
  },
  methods: {
    getDesc(song) {
      return `${song.singer} --- ${song.album}`
    },
    selectItem(item, index) {
      this.$emit('select', item, index)
    }
  }
}
</script>

<style lang="scss">
.song-list {
  .content {
    text-align: left;
    .name {
      color: rgba(255, 255, 255, 1);
      font-size: 15px;
      padding: 0;
      margin: 10px;
    }
    .desc {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
      padding: 0;
      margin: 0;
      margin: 10px;
    }
  }
}
</style>