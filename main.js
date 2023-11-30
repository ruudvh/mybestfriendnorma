var songs = [
	{
		title: "Transition",
		artist: "BASTE",
		cover_url: "static/covers/transition.jpg",
		audio_url: "static/audio/BASTE - Transition.mp3",
		color: "#c3af50"
	},
	{
		title: "The New World",
		artist: "BASTE",
		cover_url: "static/covers/the-new-world.jpg",
		audio_url: "static/audio/BASTE - The new world.mp3",
		color: "#25323b"
	},
	{
		title: "Flower Girl",
		artist: "Ruben Young x BASTE",
		cover_url: "static/covers/flower-girl.jpg",
		audio_url: "static/audio/Ruben Young - Flower Girl (BASTE Remix).mp3",
		color: "#c1c1c1"
	},
	{
		title: "Orange Heart",
		artist: "Headhunterz x BASTE",
		cover_url: "static/covers/orange-heart.jpg",
		audio_url: "static/audio/Headhunterz - Orange Heart (BASTE edit).mp3",
		color: "rgb(80, 125, 195)"
	},
	{
		title: "Reason Why",
		artist: "BASTE",
		cover_url: "static/covers/reason-why.jpg",
		audio_url: "static/audio/BASTE - Reason why (extended mix).mp3",
		color: "#5d0126"
	},
	{
		title: "Defining Mysterie",
		artist: "BASTE",
		cover_url: "static/covers/defining-mysterie.jpg",
		audio_url: "static/audio/BASTE - Defining Mysterie.mp3",
		color: "rgb(1, 20, 93)"
	}
];

var audioPlayer = document.querySelector('#audio-player');
var player = audioPlayer.querySelector('audio');
var playpausebtn = audioPlayer.querySelector('#play-btn');
var nextbtn = audioPlayer.querySelector('#next-btn');
var prevbtn = audioPlayer.querySelector('#previous-btn');
var subcontrols = audioPlayer.querySelectorAll('#sub-controls i');
var progress = audioPlayer.querySelector('.progress');
var sliders = audioPlayer.querySelectorAll('.slider');
var currentTime = audioPlayer.querySelector('#current-time');
var totalTime = audioPlayer.querySelector('#total-time');
var playlist_index = 0;

// Previous
prevbtn.addEventListener("click", prevSong);
function prevSong() {
	playlist_index--;
	if (playlist_index < 0) {
		playlist_index = songs.length - 1;
	}

	fetchMusicDetail();
	restartPlayer();
};

// Next
nextbtn.addEventListener("click", nextSong);
function nextSong() {
	if (document.querySelector(".fa-random").classList.contains('active')) {
		let randomSong = Math.floor(Math.random() * songs.length - 1) + 1;
		playlist_index = randomSong;
	} else {
		playlist_index++;
	}

	if (playlist_index > songs.length - 1) {
		playlist_index = 0;
	}

	fetchMusicDetail();
	restartPlayer();
};

// Sub controls
subcontrols.forEach(control => {
	control.addEventListener("click", (e) => {
		e.target.classList.toggle('active');
	});
});

// Play/Pause
playpausebtn.addEventListener('click', togglePlay);
function togglePlay() {
	if (player.paused) {
		playerPlay();
	} else {
		playerPause();
	}
}

function loadPlayer() {
	player.load();
	player.volume = 0.5;
	player.currentTime = 0;
}
function restartPlayer() {
	if (player.paused) {
		loadPlayer();
		playerPause();
	} else {
		loadPlayer();
		playerPlay();
	}
}
function playerPlay() {
	document.querySelector("#play-btn i").classList.remove('fa-play');
	document.querySelector("#play-btn i").classList.add('fa-pause');
	document.querySelector("#song .vinyl").classList.remove('paused');

	player.play();
}
function playerPause() {
	document.querySelector("#play-btn i").classList.add('fa-play');
	document.querySelector("#play-btn i").classList.remove('fa-pause');
	document.querySelector("#song .vinyl").classList.add('paused');

	player.pause();
}

function fetchMusicDetail() {
	let artist = songs[playlist_index].artist;
	let title = songs[playlist_index].title;
	let cover_url = songs[playlist_index].cover_url;
	let audio_url = songs[playlist_index].audio_url;
	let backgroundColor = songs[playlist_index].color;

	// Set body color
	document.querySelector("body").style.background = backgroundColor;

	// Set background image
	document.querySelector("#background").style["background-image"] = "url('" + cover_url + "')";

	// Set song info
	document.querySelector("#song img.album-cover").src = cover_url;
	document.querySelector("#song img.vinyl-cover").src = cover_url;
	document.querySelector("#song p.artist").innerHTML = artist;
	document.querySelector("#song p.title").innerHTML = title;

	// Set audio
	document.querySelector("#audio-player source").src = audio_url;
};

init();
function init() {
	playlist_index = 0;
	fetchMusicDetail();
	loadPlayer();
};

/*
 * Music Player
 * By Greg Hovanesyan
 * https://codepen.io/gregh/pen/NdVvbm
 */
var draggableClasses = ['pin'];
var currentlyDragged = null;

window.addEventListener('mousedown', function (event) {
	if (!isDraggable(event.target)) return false;

	currentlyDragged = event.target;
	let handleMethod = currentlyDragged.dataset.method;

	this.addEventListener('mousemove', window[handleMethod], false);

	window.addEventListener('mouseup', () => {
		currentlyDragged = false;
		window.removeEventListener('mousemove', window[handleMethod], false);
	}, false);
});

player.addEventListener('timeupdate', updateProgress);
player.addEventListener('loadedmetadata', () => {
	totalTime.textContent = formatTime(player.duration);
});
player.addEventListener('ended', function () {
	player.currentTime = 0;

	if (document.querySelector(".fa-refresh").classList.contains('active')) {
		togglePlay();
	} else {
		nextSong();
	}
});

sliders.forEach(slider => {
	let pin = slider.querySelector('.pin');
	slider.addEventListener('click', window[pin.dataset.method]);
});

function isDraggable(el) {
	let canDrag = false;
	let classes = Array.from(el.classList);
	draggableClasses.forEach(draggable => {
		if (classes.indexOf(draggable) !== -1)
			canDrag = true;
	})
	return canDrag;
}

function inRange(event) {
	let rangeBox = getRangeBox(event);
	let direction = rangeBox.dataset.direction;
	let screenOffset = document.querySelector("#content-wrap").offsetLeft + 26;
	var min = screenOffset - rangeBox.offsetLeft;
	var max = min + rangeBox.offsetWidth;
	if (event.clientX < min || event.clientX > max) { return false };
	return true;
}

function updateProgress() {
	var current = player.currentTime;
	var percent = (current / player.duration) * 100;
	progress.style.width = percent + '%';

	currentTime.textContent = formatTime(current);
}

function getRangeBox(event) {
	let rangeBox = event.target;
	let el = currentlyDragged;
	if (event.type == 'click' && isDraggable(event.target)) {
		rangeBox = event.target.parentElement.parentElement;
	}
	if (event.type == 'mousemove') {
		rangeBox = el.parentElement.parentElement;
	}
	return rangeBox;
}

function getCoefficient(event) {
	let slider = getRangeBox(event);
	let screenOffset = document.querySelector("#content-wrap").offsetLeft + 26;
	let K = 0;
	let offsetX = event.clientX - screenOffset;
	let width = slider.clientWidth;
	K = offsetX / width;
	return K;
}

function rewind(event) {
	if (inRange(event)) {
		player.currentTime = player.duration * getCoefficient(event);
	}
}

function formatTime(time) {
	var min = Math.floor(time / 60);
	var sec = Math.floor(time % 60);
	return min + ':' + ((sec < 10) ? ('0' + sec) : sec);
}