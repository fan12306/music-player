export function shuffle(arr) {
  let length = arr.length
  let temp
  let randomIndex
  while (length) {
    randomIndex = Math.floor(Math.random() * (length--))
    temp = arr[randomIndex]
    arr[randomIndex] = arr[length]
    arr[length] = temp
  }
  return arr
}

export function debounce(func, delay) {
  let timer

  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
