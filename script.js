var $tl = $('#timeline');
var $tm = $('.tomato');
var isDragging = false;
var oldPosX = 0;
var pixelPos = 0;
var timePos = 0;
var pixelWidth = 630;
var secondsWidth = 25;
var timeMultiplier = 1000 * 60;
var tickSound = new Howl({
		urls: ['https://reneroth.xyz/files/codepen/pomodoro_tick.ogg', 'https://reneroth.xyz/files/codepen/pomodoro_tick.mp3'],
		loop: true,
	volume:0.5
});
var turnSound = new Howl({
		urls: ['https://reneroth.xyz/files/codepen/pomodoro_turn.ogg', 'https://reneroth.xyz/files/codepen/pomodoro_turn.mp3']
});
var isTickPlaying = false;
var turnSoundDist = 25 / 2;
var ringSound = new Howl({
		urls: ['https://reneroth.xyz/files/codepen/pomodoro_ring.ogg', 'https://reneroth.xyz/files/codepen/pomodoro_ring.mp3'],
		volume: 1.0
});

function renderTime() {
		$tl.css('transform', 'translateX(-' + pixelPos + 'px)');
		$tl.css('-ms-transform', 'translateX(-' + pixelPos + 'px)');
		$tl.css('-moz-transform', 'translateX(-' + pixelPos + 'px)');
		$tl.css('-webkit-transform', 'translateX(-' + pixelPos + 'px)');
}
$tm.mousedown(function(e) {
		e.preventDefault();
		isDragging = true;
});
var lastTurnPos = 0;
$(document).mousemove(function(e) {
		e.preventDefault();
		if (isDragging) {
				var moveX = e.pageX - oldPosX;
				pixelPos -= moveX;
				pixelPos = Math.max(0, Math.min(pixelPos, pixelWidth));
				timePos = Math.ceil(pixelPos * secondsWidth / pixelWidth * timeMultiplier);
				renderTime();
				if (moveX > 0) {
						lastTurnPos = e.pageX;
				}
				if (e.pageX - lastTurnPos < -turnSoundDist) {
						if (pixelPos < pixelWidth) {
								turnSound.play();
						}
						lastTurnPos = e.pageX;
				}
		} else {
				lastTurnPos = e.pageX;
		}
		oldPosX = e.pageX;
}).mouseup(function(e) {
		isDragging = false;
});

var lastTick = Date.now();

function doTick() {
		//requestAnimationFrame(doTick);
		setTimeout(doTick, 10); //setTimeout so the timer will continue running even if in the background
		var tickDuration = Date.now() - lastTick;
		lastTick = Date.now();
		if (isDragging || timePos <= 0) {
				if (isTickPlaying) {
						tickSound.stop();
						isTickPlaying = false;
				}
				return;
		}
		if (!isTickPlaying) {
				tickSound.play();
				isTickPlaying = true;
		}
		timePos -= tickDuration;
		timePos = Math.max(0, Math.min(timePos, secondsWidth * timeMultiplier));
		pixelPos = timePos / secondsWidth * pixelWidth / timeMultiplier;
		renderTime();
		if (timePos == 0) {
				wiggle($('.main'));
				ringSound.stop().play();
		}
}
doTick();

function wiggle(element) {

		/**************
			Rotation
		**************/
		TweenMax.fromTo(element, .07, {
				x: -4
		}, {
				x: 4,
				ease: Power1.easeInOut,
				yoyo: true,
				repeat: 21,
				onCompleteParams: [element],
				onComplete: resetWiggle
		});
}

function resetWiggle(element) {
		TweenMax.to(element, .05, {
				x: 0,
				ease: Power1.easeInOut
		});
}

$('.sound').click(function(e) {
	e.preventDefault();
	if($(this).hasClass('mute')) {
		$(this).removeClass('mute');
		tickSound.volume(0.5);
	} else {
		$(this).addClass('mute');
		tickSound.volume(0.0);
	}
});