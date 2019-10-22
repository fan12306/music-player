<template>
  <scroll
    class="lyric-container"
    :data="lyricList.lyric"
    v-if="lyricList"
    :probeType="probeType"
    ref="lyricList"
  >
    <ul class="lyric-ul" ref="ul">
      <li
        v-for="(item,idx) in lyricList"
        :key="item.id"
        class="lyric-li"
        :class="{'lyric-show' : currentIndex === idx}"
        :ref="'lyricLine' + idx"
      >{{ item.lyric }}</li>
    </ul>
  </scroll>
</template>


<script>
import scroll from "base/scroll/scroll";
import { getLyric } from "api/song";
import { mapGetters } from "vuex";
import Lyric from "lyric-parser";
export default {
  data() {
    return {
      lyricList: [],
      newLyricList: [],
      probeType: 3,
      isListen: true,
      scrollY: -1,
      currentIndex: 0,
      currentMid: ""
    };
  },
  computed: {
    ...mapGetters(["playing"])
  },
  props: {
    mid: {
      type: String,
      default: ""
    },
    time: {
      type: Number,
      default: 0
    }
  },
  created() {
    this.currentMid = this.mid;
    this.getAllLyric();
  },
  methods: {
    getAllLyric() {
      getLyric(this.currentMid).then(res => {
        if (res.data.code === 0) {
          this.getRightTime();
          this.lyricList = this.normalizeLyric(res.data.lyric);
        }
      });
    },
    getRightTime() {
      let timer = null;
      timer = setInterval(() => {
        if (this.lyricList.length === 0) {
          return;
        }
        let nTime = this.time;
        for (let i = 0; i < this.lyricList.length - 1; i++) {
          let t1 = this.lyricList[i].time;
          let t2 = this.lyricList[i + 1].time;
          if (t2 > nTime && t1 < nTime) {
            this.currentIndex = i;
            let currentItem = this.$refs["lyricLine" + i];
            let moveStep = this.getOffsetTop(currentItem);
            this.$refs.ul.paddingTop = `${-moveStep}px`;
            if (moveStep < 0) {
              this.$refs.lyricList.scrollTo(0, -moveStep);
            } else if (moveStep >= 0) {
              this.$refs.lyricList.scrollTo(0, -moveStep);
            }
          }
        }
      }, 1000);
    },
    getOffsetTop(item) {
      let offTop = item[0].offsetTop;
      const midScreenHeight = window.innerHeight / 2 - 100;
      return offTop - midScreenHeight;
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
  watch: {
    mid(newMid, oldMid) {
      this.currentMid = newMid;
      getLyric(this.currentMid).then(res => {
        if (res.data.code === 0) {
          this.lyricList = this.normalizeLyric(res.data.lyric);
        }
      });
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
  height: 30%;
  color: $color-text-d;
  font-size: $font-size-medium;
  display: inline-block;

  .lyric-ul {
    padding-top: 80%;
    padding-bottom: 90%;

    .lyric-li {
      margin-bottom: 6px;
    }

    .lyric-show {
      color: white;
    }
  }
}
</style>