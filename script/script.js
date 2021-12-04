
class Player {
    constructor(selector) {
        this.player = document.querySelector(selector);
        this.video = this.player.querySelector('video');
        this.hidePanel = true;
        this.timer;
        this.playVideo();
    }

    playVideo() {
        this.video.addEventListener('click', this.toggleVideo.bind(this));
        this.player.querySelector('.left__icon-play').addEventListener('click', this.toggleVideo.bind(this));
        this.player.querySelector('.circle').addEventListener('click', this.toggleVideo.bind(this));
        this.video.addEventListener('dblclick', this.toggleFullscreen.bind(this));
        this.player.querySelector('.video__fullscreen').addEventListener('click', this.toggleFullscreen.bind(this));
        this.player.querySelector('.volume__mute').addEventListener('click', this.toggleVolume.bind(this));
        this.player.querySelector('.volume__slider').addEventListener('input', this.setVolume.bind(this));
        this.player.querySelector('.right__video-speed').addEventListener('input', this.setSpeed.bind(this));
        this.video.addEventListener('loadedmetadata', this.setVideoTime.bind(this));
        this.video.addEventListener('timeupdate', this.currentVideoTime.bind(this));
        this.player.querySelector('.panel__line').addEventListener('click', this.setLinePos.bind(this));

    }

    toggleVideo() {
        this.playing = !this.playing;
        const playIcon = this.player.querySelector('.left__icon-play .fad');
        const playCircle = this.player.querySelector('.circle');
        playIcon.classList.toggle('fa-play', !this.playing);
        playIcon.classList.toggle('fa-pause', this.playing);

        if (this.playing) {
            this.video.play();
            playCircle.style.display = 'none'
            setTimeout(() => {
                document.querySelector('.player__panel').style.opacity = '0';
            }, 4000);
        }
        else {
            this.video.pause();
            playCircle.style.display = 'block'
            document.querySelector('.player__panel').style.opacity = '1';
        }
    }

    toggleFullscreen() {
        const full = document.fullscreenElement;
        const fullIcon = this.player.querySelector('.video__fullscreen .fad')
        const iconPlay = this.player.querySelector('.items__right-play');

        fullIcon.classList.toggle('fa-expand', full);
        fullIcon.classList.toggle('fa-compress', !full);

        if (!full) {
            this.player.requestFullscreen();
            iconPlay.style.left = '59rem';
            iconPlay.style.top = '32rem';
        }
        else {
            document.exitFullscreen();
            iconPlay.style.left = '16rem';
            iconPlay.style.top = '12rem';
        }
    }

    toggleVolume() {
        this.sounding = !this.sounding;
        const muteVolume = this.player.querySelector('.volume__mute .fad');
        const volumeSlider = this.player.querySelector('.volume__slider');

        muteVolume.classList.toggle('fa-volume-up', !this.sounding);
        muteVolume.classList.toggle('fa-volume-mute', this.sounding);

        if (this.sounding) {
            this.video.muted = true;
            volumeSlider.setAttribute('data-volume', volumeSlider.value);
            volumeSlider.value = 0;
        }
        else {
            this.video.muted = false;
            volumeSlider.value = volumeSlider.getAttribute('data-volume');
        }
    }

    setVolume() {
        this.video.volume = this.player.querySelector('.volume__slider').value / 100;
    }

    setSpeed() {
        this.video.playbackRate = this.player.querySelector('.right__video-speed').value;
    }

    setVideoTime() {
        const duration = Math.floor(this.video.duration);
        this.player.querySelector('.video__time-duration').innerHTML = `${Math.floor(duration / 60)}:${Math.floor(duration % 60)}`;

    }

    currentVideoTime() {
        const duration = Math.floor(this.video.duration);
        const current = Math.floor(this.video.currentTime);
        let seconds = 0;

        if (current % 60 < 10) {
            seconds = `0${current % 60}`;
        }
        else {
            seconds = `${current % 60}`
        }

        this.player.querySelector('.video__time-current').innerHTML = `${Math.floor(current / 60)}:${seconds}`;
        this.player.querySelector('.panel__line-pos').style.width = `${current / duration * 100}%`;

        if (this.hidePanel) {
            this.hidePanel = false;
            this.timer = setTimeout(() => {
                this.player.querySelector('.player__panel').style.opacity = '0';
            }, 4000);
        }
        this.video.addEventListener('mousemove', this.hide.bind(this));
    }

    hide() {
        this.hidePanel = true;
        clearTimeout(this.timer);
        document.querySelector('.player__panel').style.opacity = '1';
    }

    setLinePos(event) {
        const lineWidth = this.player.querySelector('.panel__line').clientWidth;
        const pos = event.offsetX;
        const duration = Math.floor(this.video.duration);

        this.player.querySelector('.panel__line-pos').style.width = `${pos / lineWidth * 100}%`;
        this.video.currentTime = pos / lineWidth * duration;

    }
}
new Player('.player__items-right');

// ====================================================================

class SLIDER {
    constructor(options) {
        this.slider = document.querySelector(options.slider);
        this.sliderLine = document.querySelector('.main__slider-slide');
        this.slides = [...this.sliderLine.children];
        this.prev = document.querySelector('.prev');
        this.next = document.querySelector('.next');
        this.dotsPanel = document.querySelector('.slider__left-dots');
        this.dots = [...this.dotsPanel.children];

        this.dir = options.direction.toUpperCase() == 'X' ? 'X' : 'Y';
        this.timeMove = options.time ?? 1000;
        this.width = this.slider.clientWidth;
        this.height = this.slider.clientHeight;
        this.moveSize = this.dir === 'X' ? this.width : this.height;
        this.interval = options.interval ?? 3500;

        this.active = 0;
        this.sliderLine.style = `position: relative;
                                 overflow: hidden;`;

        for (let i = 0; i < this.slides.length; i++) {
            let slide = this.slides[i];
            slide.style = `    position: absolute;
                                top:0;
                                left:0;`;
            if (i != this.active) {
                slide.style.transform = `translate${this.dir}(${this.moveSize}px)`;
            }
            if (i === this.slides.length - 1) {
                slide.style.transform = `translate${this.dir}(${-this.moveSize}px)`;
            }
        }

        this.prev.addEventListener('click', () => {
            this.move(this.prev);
            this.activeDot()
        });
        this.next.addEventListener('click', () => {
            this.move(this.next);
            this.activeDot()
        });
    }
    move(btn) {
        this.disabled();

        let btnLeftOrRight = btn == this.next ? this.moveSize * -1 : this.moveSize;
        for (let i = 0; i < this.slides.length; i++) {
            let slide = this.slides[i];
            slide.style.transition = '0ms';
            if (i != this.active) {
                slide.style.transform = `translate${this.dir}(${btnLeftOrRight * -1}px)`;
            }
        }
        this.slides[this.active].style.transform = `translate${this.dir}(${btnLeftOrRight}px)`;
        this.slides[this.active].style.transition = this.timeMove + 'ms';

        if (btn == this.next) {
            this.active++;
        }
        if (this.active == this.slides.length) {
            this.active = 0;
        } else if (btn == this.prev) {
            this.active--;
            if (this.active < 0) {
                this.active = this.slides.length - 1;
            }
        }
        this.slides[this.active].style.transform = `translate${this.dir}(0px)`;
        this.slides[this.active].style.transition = this.timeMove + 'ms';

    }

    activeDot() {
        this.dots.forEach(element => {
            element.classList.remove('active');
        });

        for (let i = 2; i < this.dots.length; i++) {
            let dots = this.dots[this.active];
            if (dots.classList.contains('active')) {
                dots.classList.remove('active')
            } else {
                dots.classList.add('active')
            }
        }
    }


    disabled() {
        this.next.disabled = true;
        this.prev.disabled = true;
        setTimeout(() => {
            this.next.disabled = false;
            this.prev.disabled = false;
        }, this.timeMove);
    }

}

let slider = new SLIDER({
    slider: '.main__slider-slide',
    direction: 'x',
    time: 1000,
    autoplay: true,
    interval: 3000
});

// ====================================================================

const stars = document.querySelectorAll('.stars');
for (let x = 0; x < stars.length; x++) {
    let starSmall = stars[x].querySelectorAll('.star');
    for (let i = 0; i < starSmall.length; i++) {
        starSmall[i].addEventListener('click', () => {
            for (let k = 0; k < starSmall.length; k++) {
                starSmall[k].style = 'background: rgba(151, 151, 28, 0.391);';

            }
            for (let j = 0; j <= i; j++) {
                starSmall[j].style = 'background: yellow;';

            }
        })

    }
}
// ====================================================================

let burger = document.querySelector('.header__burger');
burger.addEventListener('click', function () {
    burger.classList.toggle('active');
})

// ====================================================================

let headerBg = document.querySelector('.header'),
    title = document.querySelector('.content__info-title'),
    paragraph = document.querySelectorAll('.content__info-text'),
    links = document.querySelectorAll('.header__link'),
    spans = document.querySelectorAll('.content__info-cust .info__cust-text span'),
    tab1 = document.querySelector('.tab-1'),
    tab2 = document.querySelector('.tab-2'),
    tab3 = document.querySelector('.tab-3');

tab1.addEventListener('click', changeTab1);
tab2.addEventListener('click', changeTab2);
tab3.addEventListener('click', changeTab3);

function changeTab1() {
    headerBg.style = 'background: #EBFFE4';
    headerBg.classList.remove('red-active');
    title.style = 'color: ;';
    spans.forEach(span => span.style = 'color: ;');
    paragraph.forEach(element => element.style = 'color: ;');
    links.forEach(text => text.style = 'color: ;');
}
function changeTab2() {
    headerBg.style.background = '';
    headerBg.classList.add('red-active');
    title.style = 'color: ;';
    spans.forEach(span => span.style = 'color: ;');
    paragraph.forEach(element => element.style = 'color: ;');
    links.forEach(text => text.style = 'color: #5cbe3a; opacity: 1;');
}
function changeTab3() {
    headerBg.style = 'background: black';
    headerBg.classList.remove('red-active');
    title.style = 'color:white;';
    spans.forEach(span => span.style = 'color: white;');
    paragraph.forEach(element => element.style = 'color:#3b7925;');
    links.forEach(text => text.style = 'color: white;');
}