// shim layer with setTimeout fallback
window.reqAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60)
          }
})()

var isBackgroundMoving = false
var secTimestamp = null
var requestId = null
var stopReqAnim = false
var inview = new Waypoint.Inview({
    element: document.getElementById("dummy-sec-1"),
    enter: function(direction) {
      console.log('Enter triggered with direction ' + direction)
      scaleImage()
    },
    entered: function(direction) {
      console.log('Entered triggered with direction ' + direction)
      if(direction === 'up') {
        document.getElementById("sec-3").classList.remove('fixed')
        secTimestamp = null
      }

    },
    exit: function(direction) {
      console.log('Exit triggered with direction ' + direction)
      if(direction === 'down') {
        document.getElementById("sec-3").classList.add('fixed')
        secTimestamp = new Date().getTime()
        startTransform()
      }
      if(direction === 'up') {
        document.getElementById("sec-3").classList.remove('fixed')
        secTimestamp = null
      }
    },
    exited: function(direction) {
      console.log('Exited triggered with direction ' + direction)
      if(direction === 'up') {
        document.getElementById("sec-3").classList.remove('fixed')
        secTimestamp = null
      }
      stopScaling()
    }
  })


  var inview = new Waypoint.Inview({
    element: document.getElementById("dummy-sec-2"),
    enter: function(direction) {
      console.log('Sec2 Enter triggered with direction ' + direction)
      var newTime = new Date().getTime()
      var elem = document.getElementById('sec-3')
      if((newTime - secTimestamp) >= 2000){
        changeFixedSec3('add')
      }
    },
    entered: function(direction) {
      console.log('Sec2 Entered triggered with direction ' + direction)
      //new section
      changeFixedSec3('add')
    },
    exit: function(direction) {
      console.log('Sec2 Exit triggered with direction ' + direction)
      if(direction === 'down') {
        changeFixedSec3('add')
      }
      if(direction === 'up') {
        changeFixedSec3('remove')
      }
    },
    exited: function(direction) {
      console.log('Sec2 Exited triggered with direction ' + direction)
      if (direction === 'up') {
        changeFixedSec3('add')
      }
    }
  })


  function changeFixedSec3(action){
    var elem = document.getElementById('sec-3')
    if(action === 'add' && elem.classList.contains('fixed')) {
      elem.classList.add('sec-4')
    } else if (action === 'remove') {
        elem.classList.remove('sec-4')
    }
  }
    

  function startTransform () {
      var backElem = document.querySelector('.sec-3-content')
      if (!isBackgroundMoving) {
        scrollToY (366, -84, 5000, backElem)
        //   for(i=366; i>= 164; i=i-1){
        //     backElem.style.transform = 'translateY('+i+'px)'
        //   }
      }
  }

  function runOnScroll (elem, startScrollPos, height) {
    return function(){
        reqAnimFrame(()=>{
            var scrollPos = window.pageYOffset
            var endScroll = startScrollPos + height
            if (scrollPos <= endScroll) {
                var perPixelVal = (1.5 / height)
                var pixelsScrolled = endScroll - scrollPos
                var scaleVal = 1 + (pixelsScrolled * perPixelVal)
                elem.style.transform = 'translateX(-50%) translateY(50%) scale('+scaleVal+')'
            }
        })
    }
  }

  function scaleImage () {
    var startScrollPos = window.pageYOffset
    var height = window.innerHeight
    var elem = document.querySelector('.herm-chair')
    window.addEventListener("scroll", runOnScroll(elem, startScrollPos, height))
    
  }

  function stopScaling () {

  }

function changeScale (elem) {
    var curTransform = new WebKitCSSMatrix(window.getComputedStyle(elem).webkitTransform);
    const currentScale = parseInt(curTransform.a)
    if(currentScale > 1) {
        elem.style.transform = 'translateX(-50%) scale('+currentScale - 0.1+')'
    }
}

  function stopScrollToY () {
      stopReqAnim = true
      if (requestId & window.cancelAnimationFrame) {
        window.cancelAnimationFrame(requestId)
      }
  }

  function scrollToY (scrollFrom, scrollTo, totaltime, element) { // int, int, in milliseconds
      var easing = 'easeOutSine'
      var startTime = Date.now()
      function tick () {
        var cTime = Date.now()
        var timeDiff = cTime - startTime
        var pos = timeDiff / totaltime
        var t = getEasing(easing, pos)
        var scrollPoss = scrollFrom + ((scrollTo - scrollFrom) * t)
  
        if (pos < 1 && !stopReqAnim) {
          requestId = reqAnimFrame(tick)
          if(!stopReqAnim){
            element.style.transform = 'translateY('+scrollPoss+'px)'
          }
        } else if (!stopReqAnim) {
          element.style.transform = 'translateY(-84px)'
        }
      }
      tick()
    }

    var easingEquations = {
        easeOutSine: function (pos) {
        return Math.sin(pos * (Math.PI / 2))
        },
        easeInOutSine: function (pos) {
        return (-0.5 * (Math.cos(Math.PI * pos) - 1))
        },
        easeInOutQuint: function (pos) {
        if ((pos /= 0.5) < 1) {
            return 0.5 * Math.pow(pos, 5)
        }
        return 0.5 * (Math.pow((pos - 2), 5) + 2)
        }
    }
  
  function getEasing (easing, pos) {
    if (easingEquations[easing]) {
      return easingEquations[easing](pos)
    } else {
      throw new Error('Easing type ' + easing + ' not supported yet.')
    }
  }