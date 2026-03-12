//  Config for BareBones's javascript sizings

img_src_fallback_height = 300;

var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

// Height of images on the grid system that dont have a sibling element to
// reference their height off of.
mobile_condense = 700;
// Width of page when it jumps to mobile

function documentOnResize(){
  divImgEqualToParent()
  showcaseSizing()
}

function documentOnLoad(){
  divImgEqualToParent()
  setupAnimateElLoads()
  setupAnchors()
  calcWidthOfShowcase()
  showcaseSizing()
  animateElLoads()
}

window.onscroll = function(){
  animateElLoads()
  //navAnimation()
};

function divImgEqualToParent(){
  var list = document.querySelectorAll("div[img-src]");
  let body_elem = document.getElementsByTagName('body')[0];

  for (var i = 0; i < list.length; i++) {
    var u = list[i].getAttribute('img-src');
    var img = new Image;
    img.src = u;
    var ratio = img.height/img.width;
    var alt_u = list[i].getAttribute('img-src-hori');
    var alt_img = new Image;
    alt_img.src = alt_u;
    var alt_ratio = alt_img.height/alt_img.width;
    // Handles the height of the image's element
    var parentElem = list[i].parentElement;
    if(body_elem.clientWidth >= mobile_condense || list[i].hasAttribute('mobile')){
      let siblings = parentElem.getElementsByTagName('div');
      let largest_sibling = 0;
      for (var j = 0; j < siblings.length; j++){
        if(siblings[j].hasAttribute("img-src") == false){
          if(siblings[j].clientHeight > largest_sibling){
            largest_sibling = siblings[j].clientHeight;
          }
        }
      }
      if(largest_sibling == 0){
        if(list[i].getAttribute('img-height') != null){
          largest_sibling = list[i].getAttribute('img-height');
        }else{
          largest_sibling = img_src_fallback_height;
        }
      }
      list[i].style.height = largest_sibling + "px";
    }else{
      if(list[i].hasAttribute("img-height")){
        list[i].style.height = list[i].getAttribute("img-height") + "px";
      }else{
        list[i].style.height = (body_elem.clientWidth * alt_ratio) + "px";
      }
    }

    // Handles giving the element a background specified by the attr `img-src`
    list[i].style.backgroundImage = "url('" + list[i].getAttribute('img-src') + "')";
    if(body_elem.clientWidth < mobile_condense && list[i].getAttribute('img-src-hori') != null){
      list[i].style.backgroundImage = "url('" + list[i].getAttribute('img-src-hori') + "')";
    }
  }
}

function setupAnimateElLoads(){
  var list = document.querySelectorAll("div[onload-rise]");
  for (var i = 0; i < list.length; i++) {
    list[i].style.transform = "translateY(50px)"
    list[i].style.opacity = "0"
  }
}

function animateElLoads(){
  var list = document.querySelectorAll("div[onload-rise]");
  for (var i = 0; i < list.length; i++) {
    if(isViewportVisible(list[i])){
      list[i].style.transform = "translateY(0)"
      list[i].style.opacity = "1"
    }
  }
}

function setupAnchors(){
  var anchors = document.getElementsByTagName("anchor");
  for (var i = 0; i < anchors.length; i++){
    var anchor_id = anchors[i].getAttribute("id");
    var child = document.createElement("div");
    var child_a = document.createElement("div");
    child_a.setAttribute("anchor_id", anchor_id);
    child_a.innerHTML = "#"+anchor_id;
    child.appendChild(child_a);
    anchors[i].appendChild(child);
    anchors[i].onclick = function(e) {
      let anchor = window.location.origin+window.location.pathname+this.textContent;

      var p = document.getElementsByTagName('body');
      var newElement = document.createElement('textarea');
      newElement.setAttribute('id', 'copytextarea');
      newElement.innerHTML = anchor;
      p[0].appendChild(newElement);

      newElement.select();
      try {
        link = document.execCommand('copy');
      } catch (err) {
      }
      var element = document.getElementById('copytextarea');
      element.parentNode.removeChild(element);
    };
  }
}

function calcWidthOfShowcase(){
  document.getElementById('showcase-cont').style.width = document.querySelectorAll('.showcase-item').length * 400 + "px";
}

if(iOS){
  document.getElementById('showcase-slider').addEventListener("mousemove", showcaseHover);
}

var showcasePos = 0;
var scroll_loop = 0;
var scrolling = false;
var raw_curs_pos;

function showcaseHover(){
  raw_curs_pos = event.clientX;
  var curs_pos = raw_curs_pos - window.innerWidth/2;
  var rect = document.getElementById('showcase-slider').getBoundingClientRect();
  var rightx = rect.x + rect.width;

  if(raw_curs_pos > window.innerWidth - window.innerWidth/5){
    scroll_loop = 1;
    if(scrolling == false && document.querySelectorAll('.showcase-cont')[0].scrollLeft < rect.width - window.innerWidth){
      scrolling = true;
      var slideTimer = setInterval(function(){
        document.querySelectorAll('.showcase-cont')[0].scrollLeft += Math.round(Math.abs(raw_curs_pos - window.innerWidth/2)-window.innerWidth/3.3333)/5;
        if(scroll_loop != 1 || document.querySelectorAll('.showcase-cont')[0].scrollLeft >= rect.width - window.innerWidth){
          scrolling = false;
          window.clearInterval(slideTimer);
        }
      }, 10);
    }
  }else if(raw_curs_pos < window.innerWidth/5){
    scroll_loop = -1;
    if(scrolling == false && document.querySelectorAll('.showcase-cont')[0].scrollLeft > 0){
      scrolling = true;
      var slideTimer = setInterval(function(){
        document.querySelectorAll('.showcase-cont')[0].scrollLeft -= Math.round(Math.abs(raw_curs_pos - window.innerWidth/2)-window.innerWidth/3.3333)/5;
        if(scroll_loop != -1 || document.querySelectorAll('.showcase-cont')[0].scrollLeft <= 0){
          scrolling = false;
          window.clearInterval(slideTimer);
        }
      }, 10);
    }
  }else{
    scroll_loop = 0;
  }

}

function showcaseSizing(){
  var rect = document.getElementById('showcase-slider').getBoundingClientRect();
  if(document.querySelectorAll('.showcase-item').length * 400 < window.innerWidth){
    var elem_width = window.innerWidth/document.querySelectorAll('.showcase-item').length;
    for(i = 0; i < document.querySelectorAll('.showcase-item').length; i += 1){
      document.querySelectorAll('.showcase-item')[i].style.width = elem_width + "px";
    }
    document.getElementById('showcase-cont').style.width = document.querySelectorAll('.showcase-item').length * elem_width + "px";
  }
  if(rect.x+rect.width < window.innerWidth){
    document.getElementById('showcase-slider').style.left = 0;
  }
}

function navAnimation(){
  var nav_bar = document.getElementById('navigation-id');
  if (window.pageYOffset > 0 || document.documentElement.scrollTop > 0 || document.body.scrollTop > 0) {
      nav_bar.className = "nav-cont nav-scrolled";
  }
  else {
      nav_bar.className = "nav-cont nav-unscrolled";
  }
}

function getViewportSize(w) {
    var w = w || window;
    if(w.innerWidth != null) return {w:w.innerWidth, h:w.innerHeight};
    var d = w.document;
    if (document.compatMode == "CSS1Compat") {
        return {
            w: d.documentElement.clientWidth,
            h: d.documentElement.clientHeight
        };
    }
    return { w: d.body.clientWidth, h: d.body.clientWidth };
}

function isViewportVisible(e) {
    var box = e.getBoundingClientRect();
    var height = box.height || (box.bottom - box.top);
    var width = box.width || (box.right - box.left);
    var viewport = getViewportSize();
    if(!height || !width) return false;
    if((box.top + box.height/4) > viewport.h || box.bottom < 0) return false;
    if(box.right < 0 || box.left > viewport.w) return false;
    return true;
}
