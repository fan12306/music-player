import {playMode} from 'common/js/config'

const state = {
  singer: {},
  fullScreen: false,
  playing: false,
  currentIndex: -1,
  playlist: {},
  sequenceList: {},
  mode: playMode.sequence,
  newUrl: ''
}

export default state
