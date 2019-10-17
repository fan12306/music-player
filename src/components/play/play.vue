<template>
  <div class="player">
    <transition
      name="normal"
      @enter="enter"
      @afrer-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <scroll class="normal-player" v-if="fullScreen">
        <img :src="currentSong.image" class="background" />
        <div class="top">
          <div class="back" @click="downList">
            <i class="icon-back"></i>
          </div>
          <h2 class="title">{{currentSong.name}}</h2>
          <h1 class="subTitle">{{currentSong.singer}}</h1>
        </div>
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper" ref="cdWrapper">
              <div :class="['cd', rotateing]">
                <img :src="currentSong.image" class="image" ref="normalImg" />
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric" @click='goLyric'>sdfdsfd</div>
            </div>
          </div>
        </div>
      
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{ currentTime }}</span>
            <div class="progress-bar-wrapper" @click="clickProgress" ref="progressWrapper">
              <div class="progress-bar" ref="progressBar">
                <span
                  id="ball"
                  ref="ball"
                  @touchstart="touchStart"
                  @touchmove="touchMove"
                  @touchend="touchEnd"
                ></span>
              </div>
            </div>
            <span class="time time-r">{{ formatDuration(currentSong.duration) }}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i class="icon-playlist" :class="modeChange" @click="changeMode"></i>
            </div>
            <div class="icon i-left">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center">
              <i :class="changeStyle" @click="togglePlay" ref="playingBtn"></i>
            </div>
            <div class="icon icon-right">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </scroll>
    </transition>
    <audio :src="newUrl" @autoplay="autoPlay" @timeupdate="updateTime" @ended="endSong" ref="audio"></audio>
    <transition name="mini">
      <div
        class="mini-player"
        v-if="(Object.keys(currentSong).length === 0 ? false : true) && !fullScreen"
        @click="upList"
      >
        <div class="icon" ref="icon">
          <img :src="currentSong.image" ref="img" :class="rotateing" />
        </div>
        <div class="text">
          <span class="name">{{currentSong.name}}</span>
          <span class="desc">{{currentSong.singer}}</span>
        </div>
        <div class="control">
          <circle-loop :radius="radius" :percent="percent">
            <i :class="['icon-mini', changeMiniStyle]" @click.stop="togglePlay"></i>
          </circle-loop>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import animations from "create-keyframe-animation";
import { getSongs } from "../../common/js/song";
import circleLoop from "base/circle-loop/circle-loop";
import { playMode } from "../../common/js/config";
import { shuffle } from "../../common/js/util";
import scroll from 'base/scroll/scroll'
export default {
  data() {
    return {
      currentTime: 0.0,
      nonFormatTime: 0.0,
      radius: "32",
      percent: 0
    };
  },
  computed: {
    ...mapGetters([
      "playing",
      "fullScreen",
      "singer",
      "currentSong",
      "currentIndex",
      "playlist",
      "newUrl",
      "mode",
      "sequenceList"
    ]),
    changeStyle() {
      return this.playing ? "icon-pause" : "icon-play";
    },
    rotateing() {
      //必须两个类名同时存在才不会重置图片的旋转位置
      return this.playing ? "play" : "pause" + " " + "play";
    },
    changeMiniStyle() {
      return this.playing ? "icon-pause-mini" : "icon-play-mini";
    },
    modeChange() {
      return this.mode === 0
        ? "icon-sequence"
        : this.mode === 1
        ? "icon-loop"
        : "icon-random";
    }
  },
  methods: {
    enter(el, done) {
      let { x, y, scale } = this.getPosAndScale();
      let animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0, 0, 0) scale(1)`
        }
      };
      animations.registerAnimation({
        name: "move",
        animation,
        presets: {
          duration: 600,
          easing: "linear"
        }
      });

      animations.runAnimation(this.$refs.cdWrapper, "move", done);
    },
    afterEnter() {
      animations.unregisterAnimation("move");
      this.$refs.cdWrapper.style.animation = "";
    },
    leave(el, done) {
      this.$refs.cdWrapper.style.transition = `all 5s ease`;
      let { x, y, scale } = this.getPosAndScale();
      this.$refs.cdWrapper.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      this.$refs.cdWrapper.addEventListener("transitionend", done());
    },
    afterLeave() {
      this.$refs.cdWrapper.style.transition = "";
      this.$refs.cdWrapper.style["transform"] = "";
    },
    downList() {
      this.setFullScreen(false);
    },
    upList() {
      this.setFullScreen(true);
    },
    getPosAndScale() {
      const miniWidth = 40;
      const paddingLeft = 40;
      const paddingBottom = 30;
      const paddingTop = 80;
      const width = window.innerWidth * 0.8;
      const scale = miniWidth / width;
      const x = -(width - 2 * paddingLeft) / 2;
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
      return { x, y, scale };
    },
    togglePlay() {
      this.setPlaying(!this.playing);
      if (this.playing) {
        this.$refs.audio.play();
      } else {
        this.$refs.audio.pause();
      }
    },
    autoPlay() {
      this.$nextTick(() => {
        this.$refs.audio.play();
      });
    },
    prev() {
      this.setCurrentIndex(this.currentIndex - 1);
      if (this.currentIndex <= 0) {
        this.setCurrentIndex(this.playlist.length - 1);
      }
      this.getSongUrl(this.currentIndex);
    },
    next() {
      this.setCurrentIndex(this.currentIndex + 1);
      if (this.currentIndex > this.playlist.length - 1) {
        this.setCurrentIndex(1);
      }
      this.getSongUrl(this.currentSong);
    },
    clickProgress(e) {
      const startPos = this.$refs.progressWrapper.getBoundingClientRect().left;
      let progressBarWidth = this.$refs.progressWrapper.clientWidth;
      let percent = (e.clientX - startPos) / progressBarWidth;
      let duration = this.currentSong.duration;
      this.nonFormatTime = percent * duration;
      this.$refs.audio.currentTime = percent * duration;
    },
    touchStart() {
      this.$refs.audio.pause();
    },
    touchMove(e) {
      this.moveItem.endPoint = e.changedTouches[0].clientX;
      let progressBarWidth = this.$refs.progressWrapper.clientWidth;
      const startPos = this.$refs.progressWrapper.getBoundingClientRect().left;
      let percent = (this.moveItem.endPoint - startPos) / progressBarWidth;
      this.movingBall(percent);
    },
    touchEnd(e) {
      this.$refs.audio.play();
      let endPos = e.changedTouches[0].clientX;
      const startPos = this.$refs.progressWrapper.getBoundingClientRect().left;
      const progressBarWidth = this.$refs.progressWrapper.clientWidth;
      let percent = (endPos - startPos) / progressBarWidth;
      this.movingBall(percent);
    },
    updateTime() {
      this.currentTime = this.formatDuration(this.$refs.audio.currentTime);
      this.nonFormatTime = this.$refs.audio.currentTime;
    },
    formatDuration(t) {
      let clock = (t / 60) | 0;
      let second = (t - clock * 60) | 0;
      if (second < 10) {
        second = `0${second}`;
      }
      return `${clock}:${second}`;
    },
    movingBall(percent) {
      let duration = this.currentSong.duration;
      this.$refs.audio.currentTime = percent * duration;
      this.nonFormatTime = percent * this.currentSong.duration;
    },
    endSong() {
      if (this.mode === playMode.sequence) {
        // 直接是顺序歌单，直接播放下一首
        this.setPlaylist(this.playlist)
        this.next();
      } else if (this.mode === playMode.loop) {
        //循环的时候，顺序歌单，直接将这首歌的currentTime设置为0，并且播放
        this.setPlaylist(this.playlist)
        this.$refs.audio.currentTime = 0;
        this.$refs.audio.play();
      } else if (this.mode === playMode.random) {
        //乱序的时候，打乱歌曲的顺序，接着播放下一首
        let newArr = shuffle(this.playlist)
        this.setPlaylist(newArr)
        this.next()
      }
    },
    changeMode() {
      let count = this.mode;
      count += 1;
      let newMode = count % 3;
      this.setMode(newMode);
    },
    getSongUrl(item) {
      getSongs(item).then(res => {
        this.setUrl(res);
        setTimeout(() => {
          this.$refs.audio.play();
        });
      });
    },
    goLyric(mid) {
      this.$router.push({path: `/singer/${this.currentSong.mid}`})
    },
    ...mapMutations({
      setFullScreen: "set_fullScreen",
      setPlaying: "set_playing",
      setCurrentIndex: "currentIndex",
      setUrl: "set_url",
      setMode: "set_mode",
      setPlaylist: "set_playlist"
    })
  },
  mounted() {
    this.moveItem = {};
  },
  watch: {
    nonFormatTime(newTime) {
      let percent = newTime / this.currentSong.duration;
      let Width = percent * 100;
      this.percent = percent;
      if (this.fullScreen) {
        const progressBar = this.$refs.progressWrapper.clientWidth;
        let count = progressBar * percent;
        this.$refs.progressBar.style.width = `${Width}%`;
        this.$refs.ball.style.left = `${count}px`;
      }
    },
    playing(newValue) {
      this.$nextTick(() => {
        if (newValue) {
          this.$refs.audio.play();
        } else {
          this.$refs.audio.pause();
        }
      });
    },
    percent(newPercent) {
      return (this.percent = newPercent);
    }
  },
  components: {
    circleLoop,
    scroll
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;

    p {
      padding: 0;
      margin: 0;
      font-size: 25px;
    }

    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
    }

    .top {
      position: relative;
      margin-bottom: 25px;

      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;

        .icon-back {
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
      }

      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }

      .subTitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        font-size: 13px;
        color: $color-text;
        padding: 0;
        margin: 0;
      }
    }

    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;

      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;

        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          height: 100%;

          .cd {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border: 10px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;

            &.play {
              animation: rotate 20s linear infinite;
            }

            &.pause {
              -webkit-animation-play-state: running;
              animation-play-state: paused;
            }

            .image {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
        }

        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;

          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }

      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;

        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;

          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;

            &.current {
              color: $color-text;
            }
          }
        }
      }
    }

    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;

      .dot-wrapper {
        text-align: center;
        font-size: 0;

        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;

          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }

      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;

        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 30px;
          line-height: 30px;
          width: 30px;

          &.time-l {
            text-align: left;
          }

          &.time-r {
            text-align: right;
          }
        }

        .progress-bar-wrapper {
          flex: 1;
          width: 100%;
          height: 0.5em;
          background-color: $color-theme-d;

          .progress-bar {
            height: 0.4em;
            background-color: $color-theme;
            position: relative;
          }

          #ball {
            position: absolute;
            top: 0;
            left: 50px;
            right: 0;
            bottom: 0;
            margin: auto 0;
            width: 10px;
            height: 10px;
            display: inline-block;
            border-radius: 50%;
            background-color: $color-theme;
          }
        }
      }

      .operators {
        display: flex;
        align-items: center;

        .icon {
          flex: 1;
          color: $color-theme;

          &.disable {
            color: $color-theme-d;
          }

          i {
            font-size: 30px;
          }
        }

        .i-left {
          text-align: right;
        }

        .i-center {
          padding-left: 20px;
          text-align: center;

          i {
            font-size: 40px;
          }
        }

        .i-right {
          text-align: left;
          padding-left: 16px;
        }

        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }

    &.normal-enter-active, &.normal-leave-active {
      transition: all 0.4s;

      .top, .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }

    &.normal-enter, &.normal-leave-to {
      opacity: 0;

      .top {
        transform: translate3d(0, -100px, 0);
      }

      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }

  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: $color-highlight-background;

    &.mini-enter-active, &.mini-leave-active {
      transition: all 0.4s;
    }

    &.mini-enter, &.mini-leave-to {
      opacity: 0;
    }

    .icon {
      flex: 0 0 40px;
      width: 40px;
      padding: 0 10px 0 20px;

      img {
        border-radius: 50%;
        display: inline-block;
        width: 45px;
        height: 45px;

        &.play {
          animation: rotate 10s linear infinite;
        }

        &.pause {
          animation-play-state: paused;
        }
      }
    }

    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      text-align: left;
      margin-left: 3px;

      .name {
        no-wrap();
        font-size: $font-size-medium;
        color: $color-text;
      }

      .desc {
        no-wrap();
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }

    .control {
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;
      display: flex;
      align-items: center;
      justify-content: center;

      .icon-play-mini, .icon-pause-mini, .icon-playlist {
        font-size: 30px;
        color: $color-theme-d;
      }

      .icon-mini {
        font-size: 32px;
        display: flex;
        align-items: center;
      }
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>