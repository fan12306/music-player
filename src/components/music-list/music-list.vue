<template>
  <div class="music-list">
    <div class="back" @click="back" v-show="songs">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div class="play" ref="playBtn">
          <div class="icon-play"></div>
          <div class="text">randomPlay</div>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll
      :data="songs"
      class="list"
      ref="songlist"
      :listenScroll="isListenScroll"
      :probe-type="probeType"
      @scroll="scroll"
    >
      <div class="song-list-wrapper">
        <songlist :songs="songs" ref="songs" @select="selectItem"></songlist>
        <div class="loading-container">
          <loading v-show="!songs.length"></loading>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from "base/scroll/scroll";
import Songlist from "base/song-list/song-list";
import { setTimeout } from "timers";
import Loading from "base/loading/loading";
import { mapActions } from "vuex";
import jsonp from "../../common/js/jsonp";
import { getSongs } from "../../common/js/song";

const RESERVE_HEIGHT = 42;
export default {
  data() {
    return {
      scrollY: -1
    };
  },
  props: {
    songs: {
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: ""
    },
    bgImage: {
      type: String,
      default: ""
    }
  },
  methods: {
    selectItem(item, index) {
      getSongs(item).then(res => {
        this.selectPlay({
          list: this.songs,
          index,
          newUrl: res
        })
      });
    },
    back() {
      this.$router.back();
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    ...mapActions(["selectPlay"])
  },
  created() {
    this.isListenScroll = true;
    this.probeType = 3;
    this.newUrl = "";
  },
  computed: {
    bgStyle() {
      return `background-image : url(${this.bgImage})`;
    }
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight;
    this.mintranslateY = -this.imageHeight + RESERVE_HEIGHT;
    // 重新计算list的高度
    this.$refs.songlist.$el.style.top = `${this.imageHeight}px`;
  },
  watch: {
    scrollY(newY) {
      this.maxHeight = Math.max(newY, this.mintranslateY);
      this.$refs.layer.style.transform = `translate3d(0, ${this.maxHeight}px, 0)`;
      let zIndex = 0;
      let scale = 1;
      let blur = 15;
      let precent = Math.abs(newY / this.imageHeight);
      blur = Math.min(precent * blur, blur);
      scale += precent;
      if (newY < this.mintranslateY) {
        zIndex = 10;
        this.$refs.bgImage.style.paddingTop = 0;
        this.$refs.bgImage.style.height = `${RESERVE_HEIGHT}px`;
        this.$refs.playBtn.style.display = `none`;
      } else {
        this.$refs.bgImage.style.paddingTop = `70%`;
        this.$refs.bgImage.style.height = 0;
        this.$refs.playBtn.style.display = ``;
      }
      this.$refs.filter.style["backdrop-filter"] = `blur(${blur}px)`;
      if (newY > 0) {
        this.$refs.bgImage.style.transform = `scale(${scale})`;
        zIndex = 10;
      }
      this.$refs.bgImage.style.zIndex = zIndex;
    }
  },
  components: {
    Scroll,
    Songlist,
    Loading
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.music-list {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;

  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;

    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;

      :before {
        content: '\e910';
      }
    }
  }

  .title {
    position: absolute;
    top: 0;
    left: 10%;
    z-index: 40;
    width: 80%;
    no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }

  .bg-image {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 70%;
    transform-origin: top;
    background-size: cover;

    .play-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 50;
      width: 100%;

      .play {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        font-size: 0;

        .icon-play {
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
          font-size: $font-size-medium-x;
        }

        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-small;
        }
      }
    }

    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }

  .bg-layer {
    position: relative;
    height: 100%;
    background: $color-background;
  }

  .list {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    background: $color-background;

    .song-list-wrapper {
      padding: 20px 30px;
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>