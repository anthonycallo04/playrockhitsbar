// Crear un elemento de audio
let audioPlayer = new Audio();

// Url del logo por defecto
const logoUrl = "assets/logorh.webp";

// Función para alternar entre reproducción y pausa
function togglePlay() {
    if (audioPlayer.paused) {
        audioPlayer.src = "https://live.radiorockhits.online/listen/radiorockhits/radio.mp3";
        audioPlayer.play();
        document.getElementById('playIcon').src = "assets/stop-icon35px.png";
    } else {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
        document.getElementById('playIcon').src = "assets/play-icon35px.png";
    }
}

// Agregar evento de clic al botón de reproducción
document.getElementById('playBtn').addEventListener('click', togglePlay);

// Función para actualizar la información de la canción
function updateSongInfo() {
    $.get('https://live.radiorockhits.online/api/nowplaying/radiorockhits')
        .done(function(data) {
            document.getElementById('songTitle').textContent = data.now_playing.song.text;
            
            // Cargar la carátula de la canción si está disponible, de lo contrario mostrar el logo
            const coverImage = document.getElementById('coverImage');
            const songArtUrl = data.now_playing.song.art;

            if (songArtUrl) {
                // Intentar cargar la carátula de la canción
                coverImage.src = songArtUrl;

                // Si falla la carga de la carátula, usar el logo
                coverImage.onerror = function() {
                    coverImage.src = logoUrl;
                };
            } else {
                // Si no hay carátula, mostrar el logo por defecto
                coverImage.src = logoUrl;
            }
        })
        .fail(function() {
            // Si la solicitud falla, mostrar el logo por defecto
            document.getElementById('coverImage').src = logoUrl;
        });
}

// Actualizar la información de la canción cada 2 segundos
setInterval(updateSongInfo, 2000);

// Guardar el estado del reproductor en el almacenamiento local
function savePlayerState() {
    localStorage.setItem('audioPlayerState', JSON.stringify({
        isPlaying: !audioPlayer.paused,
        currentTime: audioPlayer.currentTime
    }));
}

// Cargar el estado del reproductor desde el almacenamiento local
function loadPlayerState() {
    const state = JSON.parse(localStorage.getItem('audioPlayerState'));
    if (state) {
        if (state.isPlaying) {
            togglePlay();
        }
        audioPlayer.currentTime = state.currentTime;
    }
}

// Guardar el estado del reproductor antes de que la página se cierre o se actualice
window.addEventListener('beforeunload', savePlayerState);

// Cargar el estado del reproductor cuando la página se carga
window.addEventListener('load', loadPlayerState);

// Actualizar el estado del reproductor periódicamente
setInterval(savePlayerState, 1000);
