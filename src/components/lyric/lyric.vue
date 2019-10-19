<template>
  <scroll
    class="lyric-container"
    :data="lyricList.lyric"
    v-if="lyricList"
    :probeType="probeType"
    :listenScroll="isListen"
    @scroll="scroll"
  >
    <ul class="lyric-ul" ref="ul">
      <li v-for="item in lyricList" :key="item.time" class="lyric-li">{{ item.lyric }}</li>
    </ul>
  </scroll>
</template>


<script>
import scroll from "base/scroll/scroll";
import { getLyric } from "api/song";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      lyricList: [],
      probeType: 3,
      isListen: true,
      scrollY: -1
    };
  },
  props: {
    mid: {
      type: String,
      default: ""
    },
    percent: {
      type: Number,
      default: 0
    }
  },
  created() {
    this.getAllLyric();
  },
  mounted() {
    this.getRightTime();
  },
  methods: {
    scroll(pos) {
      this.scrollY = pos.y;
    },
    getRightTime() {
      let timer = null;
      setInterval(() => {
        if (this.lyricList.length === 0) {
          return;
        }
        for(let i = 0; i < this.lyricList.length; i++) {
            // console.log(this.lyriclist)
        }
      }, 1000);
    },
    getAllLyric() {
      getLyric(this.mid).then(res => {
        if (res.data.code === 0) {
          this.lyricList = this.normalizeLyric(res.data.lyric);
        }
      });
    },
    normalizeLyric(lyric) {
      let newLyric = lyric.split("\n");
      let lyricArr = [];
      newLyric.forEach(item => {
        lyricArr.push({
          time: item.split("]")[0].slice(1),
          lyric: item.split("]")[1]
        });
      });
      // 去除无用的部分
      lyricArr = lyricArr.filter(item => {
        return item.lyric !== "";
      });
      // 修正时间
      lyricArr.map(item => {
        return (item.time =
          parseInt(item.time.split(":")[0]) * 60 +
          Number(item.time.split(":")[1]));
      });
      return lyricArr;
    }
  },
  components: {
    scroll
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.lyric-container {
  width: 100%;
  height: 100%;
  color: $color-text-d;
  font-size: $font-size-medium;
  display: inline-block;
  position: relative;

  .lyric-ul {
    padding-top: 50%;
    padding-bottom: 120%;

    .lyric-li {
      margin-bottom: 6px;
    }
  }
}
</style>