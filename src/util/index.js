function autoFontSize() {
  window.onresize = function() {
    let el = document.documentElement
    let cw = el.clientWidth
    if(cw >= 1920) {
      el.style.fontSize = '100px'
    } else {
      el.style.fontSize = 100 * (cw / 1920) + 'px'
    }
  }
  window.onresize();
}

export {
  autoFontSize
}
