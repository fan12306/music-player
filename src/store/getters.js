import jsonp from '../common/js/jsonp'
export const singer = state => state.singer

export const fullScreen = state => state.fullScreen

export const playing = state => state.playing

export const currentIndex = state => state.currentIndex

export const playlist = state => state.playlist

export const sequenceList = state => state.sequenceList

export const mode = state => state.mode

export const newUrl = state => state.newUrl

export const currentSong = (state) => {
  return state.playlist[state.currentIndex] || {}
}

// export const newUrl = (state) => {
//   console.log(currentSong.url)
//   jsonp(currentSong.url).then((res) => {
//     return `${res.req_0.data.sip[0]}${res.req_0.data.midurlinfo[0].purl}`
//   })
// }
// 参数为state