window.onload = function(){ 
    if (window.location.hash) { 
        id=window.location.hash.replace('#','');
        if(id) element = document.getElementById(id);
        else element = '';
        if(element) doScroll(element);
    }
}
var duration = 5000;
var timer = setTimeout( nextSlide, duration );

document.addEventListener("DOMContentLoaded", documentReady);
window.addEventListener("resize", resizeAll);
window.addEventListener("scroll",windowScroll);

function nextSlide() {
    clearTimeout(timer);
    timer = setTimeout( nextSlide, duration );
    var elements = document.querySelectorAll('.dot.active');
    elements.forEach(element => {
        if(element.nextElementSibling) element.nextElementSibling.click();
        else element.parentNode.querySelector('.dot').click();
    });
}


function prevSlide() {
    clearTimeout(timer);
    timer = setTimeout( nextSlide, duration );
    var elements = document.querySelectorAll('.dot.active');
    elements.forEach(element => {
        if(element.previousElementSibling) element.previousElementSibling.click();
        else element.parentNode.querySelector('.dot:last-child').click();
    });
}

function doScroll(element) {
    window.scroll({
        behavior: 'smooth',
        left: 0,
        top: element.offsetTop - 60
    });
    history.pushState(null, null, '#'+element.getAttribute('id'));
}
function scrollPageTo(event) {
    event.preventDefault(); 
    var id = event.target.getAttribute('href').replace('#','').replace('/','');
    if(id) element = document.getElementById(id);
    else element = '';
    if(element) doScroll(element);
    else {
        if(id=='portfolio') window.location.href='/#'+id;
        else window.location.href='/'+id;
    }
    menuToggle();
}
function resizeAll() {
}
function documentReady() {
    showinphone();
}
function showinphone() {
    // Create the measurement node
    var scrollDiv = document.createElement("div");
    scrollDiv.className = "scrollbar-measure";
    document.body.appendChild(scrollDiv);
    // Get the scrollbar width
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    // Delete the DIV 
    document.body.removeChild(scrollDiv);
    
    if(window.innerWidth > 1000 && window.innerHeight > 600) {
        if(!document.body.contains(document.getElementById('phone'))) {
            var iframewidth = 400 + scrollbarWidth;
            document.getElementById('body').innerHTML = "<iframe id='phone' src='"+window.location.href +"' style='width: "+iframewidth+"px; border: 0; position: fixed; height: 700px; overflow: hidden; overflow-y: scroll; left: 50%; top: 50%; margin-left: -193px; margin-top: -347px; overflow-y: scroll;'></iframe>";
        }
    }
}
function windowScroll() {
    var top = window.pageYOffset || document.documentElement.scrollTop;
    if (top > 100) {
        document.body.classList.add('scrolled');
    } else {
        document.body.classList.remove('scrolled');
    }
}
function formToggle() {
    document.getElementById('toggleformdiv').style.display='none';
    document.getElementById('toggleform').style.display='block';
}
function menuToggle() {
    var img = document.getElementById('menutoggle');
    var menu = img.nextElementSibling;
    if(menu.style.display!='block') {
        img.setAttribute('src','/img/close.svg');
        menu.style.display='block';
        document.body.classList.add('menuopen');
    } else {
        img.setAttribute('src','/img/menu.svg');
        menu.style.display='none';
        var top = window.pageYOffset || document.documentElement.scrollTop;
        document.body.classList.remove('menuopen');
    }
}
function setCarousel(el,num) {
    clearTimeout(timer);
    timer = setTimeout( nextSlide, duration );
    el.closest('.carousel').querySelector('.slides_container').style.marginLeft = '-'+(num*400)+'px';
    var elements = el.parentNode.querySelectorAll('.dot');
    elements.forEach(element => {
        element.classList.remove('active');
    });
    el.classList.add('active');
}
function setGallery(el) {
    var elements = el.closest('.gallery').querySelectorAll('.gallerythumbnail');
    elements.forEach(element => {
        element.classList.remove('active');
    });
    el.classList.add('active');
    var bgimg = el.style.backgroundImage;
    el.closest('.gallery').previousElementSibling.style.backgroundImage=bgimg;
}
function getElementIndex(node) {
    var index = 1;
    while ( (node = node.previousElementSibling) ) {
        index++;
    }
    return index;
}

var startx = 0;
var starty = 0;
var distx = 0;
var disty = 0;
var originalPosition = 0;
var activeslidenumber = 0;
var amountofslides = 0;

var courousels = document.querySelectorAll('.slides_container');
courousels.forEach(courousel => {

    courousel.addEventListener('touchstart', function(e){
        activeslidenumber = getElementIndex(courousel.previousElementSibling.querySelector('.dot.active'));
        amountofslides = courousel.children.length;
        courousel.classList.add('touch');
        var touchobj = e.changedTouches[0]; // reference first touch point (ie: first finger)
        startx = parseInt(touchobj.clientX); // get x position of touch point relative to left edge of browser
        starty = parseInt(touchobj.clientY); // get x position of touch point relative to left edge of browser
        originalXposition = parseInt(courousel.style.marginLeft);
        clearTimeout(timer);
    }, false);

    courousel.addEventListener('touchmove', function(e){
        var touchobj = e.changedTouches[0]; // reference first touch point for this event
        distx = parseInt(touchobj.clientX) - startx;
        disty = parseInt(touchobj.clientY) - starty;
        if(Math.abs(distx) > Math.abs(disty)) { 
            var move = true;
            if(activeslidenumber == amountofslides && distx<0) move = false;
            if(activeslidenumber == 1 && distx>0) move = false;
            if(move) courousel.style.marginLeft = originalXposition + distx + 'px';
        }
        else {
            courousel.style.marginLeft = originalXposition + 'px';
        }
        
    }, false);

    courousel.addEventListener('touchend', function(e){
        courousel.classList.remove('touch');
        var touchobj = e.changedTouches[0]; // reference first touch point for this event

        var move = true;
        if(activeslidenumber == amountofslides && distx<0) move = false;
        if(activeslidenumber == 1 && distx>0) move = false;

        if(distx < -100 && move) {
            courousel.classList.remove('touch');
            nextSlide();
        }
        if(distx > 100 && move) {
            courousel.classList.remove('touch');
            prevSlide();
        }

        clearTimeout(timer);
        timer = setTimeout( nextSlide, duration );
        var elements = document.querySelectorAll('.dot.active');
        elements.forEach(element => {
            element.click();
        });
        
    }, false);

});
