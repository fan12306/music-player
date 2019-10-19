import {
  commonParams
} from './config'
import axios from 'axios'

export function getLyric(mid) {
  let url = 'api/lyric'

  let data = Object.assign({}, commonParams, {
    songmid: mid,
    hostUin: 0,
    platform: 'yqq',
    pcachetime: +new Date(),
    format: 'json',
    nobase64: 1
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    return res
  }).catch(err => {
    console.log('err', err)
  })
}
