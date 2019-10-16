import * as types from './mutation-types'
import {playMode} from 'common/js/config'

export const selectPlay = function({commit}, {list, index, newUrl}) {
  commit(types.set_fullScreen, true)
  commit(types.set_mode, playMode.sequence)
  commit(types.set_playing, true)
  commit(types.currentIndex, index)
  commit(types.set_playlist, list)
  commit(types.set_sequenceList, list)
  commit(types.set_url, newUrl)
}