import * as types from './mutation-types'
const mutations = {
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  },
  [types.set_fullScreen](state, flag) {
    state.fullScreen = flag
  },
  [types.currentIndex](state, index) {
    state.currentIndex = index
  },
  [types.set_playing](state, flag) {
    state.playing = flag
  },
  [types.set_sequenceList](state, list) {
    state.sequenceList = list
  },
  [types.set_playlist] (state, list) {
    state.playlist = list
  },
  [types.set_mode] (state, mode) {
    state.mode = mode
  },
  [types.set_url](state, newUrl) {
    state.newUrl = newUrl
  }
}

export default mutations
