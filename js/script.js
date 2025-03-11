let cureentsong = new Audio();
let currfolder;
// let songs;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSong(folder) {
    currfolder = folder;
    let a = await fetch(`Projects/${folder}/`);// here you can add your file path
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");
    songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            let songName = decodeURIComponent(element.href.split('/').pop().replace(".mp3", ""));
            songs.push(songName);
        }
    }

    //showing the playlist
    let songul = document.querySelector(".song ul");
    songul.innerHTML = ""
    for (const song of songs) {
        songul.innerHTML += `<li>
            <img class="invert" src="img/music.svg" alt="">
            <div class="info">
                <div>${song}</div>
                <div>song Artist</div>
            </div>
            <div class="playnow">
                <span>play now</span>
                <img class="invert" src="img/play.svg" alt="">
            </div>
        </li>`;
    }

    Array.from(document.querySelector(".song").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            let songName = e.querySelector(".info").firstElementChild.innerHTML.trim();
            playmusic(songName);
        });
    });
}

const playmusic = (track, pause = false) => {
    console.log("Playing track:", track);
    cureentsong.src = `Projects/${currfolder}/${encodeURIComponent(track)}.mp3`;
    cureentsong.load();

    if (!pause) {
        cureentsong.play();
        document.getElementById("play").src = "img/pause.svg";
    }

    const songInfoElement = document.querySelector(".songinfo");
    if (songInfoElement) {
        songInfoElement.innerHTML = decodeURIComponent(track);
    }

    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}
async function displayalbum() {
    let a = await fetch("Projects/song/`);
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;
    let anchor = div.getElementsByTagName("a");
    let cardcont = document.querySelector(".cards");
    let array = Array.from(anchor);

    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("/song")) {
            let folder = e.href.split("/").slice(-2)[0];
            let a = await fetch(`Projects/song/${folder}/info.json`);
            let response = await a.json();

            cardcont.innerHTML += `<div data-folder="${folder}" class="card"> 
                <div class="play">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#000">
                        <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="#000000" stroke-width="1.5" stroke-linejoin="round"/>
                    </svg>
                </div>
                <img src="http://127.0.0.1:3000/Projects/song/${folder}/cover.jpg" alt="">
                <h2>${response.title}</h2>
                <p>${response.description}</p>
            </div>`;
        }
    }

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log("Selected folder:", item.currentTarget.dataset.folder);
            await getSong(`song/${item.currentTarget.dataset.folder}`);
            playmusic(songs[0])
        });
    });
    return songs
}

async function main() {
    await getSong("song/copyright song");
    playmusic(songs[0], true);
    console.log(songs);
    //displaying albums
    displayalbum()


    const playButton = document.getElementById("play");
    playButton.addEventListener("click", () => {
        if (cureentsong.paused) {
            cureentsong.play();
            playButton.src = "img/pause.svg";
        } else {
            cureentsong.pause();
            playButton.src = "img/play.svg";
        }
    });

    cureentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(cureentsong.currentTime)}/${secondsToMinutesSeconds(cureentsong.duration)}`;
        document.querySelector(".circle").style.left = `${(cureentsong.currentTime / cureentsong.duration) * 100}%`;
    });

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percen = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = `${percen}%`;
        cureentsong.currentTime = (cureentsong.duration * percen) / 100;
    });

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });

    const next = document.getElementById("next");
    const prev = document.getElementById("prev");

    prev.addEventListener("click", () => {
        let index = songs.indexOf(decodeURIComponent(cureentsong.src.split("/").pop().replace(".mp3", "")));
        if (index > 0) {
            playmusic(songs[index - 1]);
        }
    });

    next.addEventListener("click", () => {
        let index = songs.indexOf(decodeURIComponent(cureentsong.src.split("/").pop().replace(".mp3", "")));
        if (index < songs.length - 1) {
            playmusic(songs[index + 1]);
        }
    });
    //vol seekbar
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        cureentsong.volume = parseInt(e.target.value) / 100;
    });
    //for mute
    document.querySelector(".volume > img").addEventListener("click", e => {
        console.log(e.target)
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            cureentsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value=0;
        }
        else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            cureentsong.volume = .10
            document.querySelector(".range").getElementsByTagName("input")[0].value=10;

        }
    })

}

main();
