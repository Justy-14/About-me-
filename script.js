// DARK MODE LOGIC (WITH MEMORY)
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// 1. Check if user previously saved a theme preference
const savedTheme = localStorage.getItem('theme');

// If they saved 'dark', apply the dark mode class and change the icon immediately
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.textContent = '☀️';
}

// 2. Listen for click event on toggle button
themeToggle.addEventListener('click', () => {
    // Toggle dark mode class
    body.classList.toggle('dark-mode');
    
    // Check if dark mode is active
    if (body.classList.contains('dark-mode')) {
        themeToggle.textContent = '☀️';
        // Save preference to device
        localStorage.setItem('theme', 'dark');
    } else {
        themeToggle.textContent = '🌙';
        // Save preference to device
        localStorage.setItem('theme', 'light');
    }
});

// LIVE LAST.FM / SPOTIFY TRACKER

const LASTFM_USERNAME = 'Justy142'; 
const LASTFM_API_KEY = '3bfaa8358a7aaf9d883ec106421c822c';

const trackNameEl = document.getElementById('track-name');
const artistNameEl = document.getElementById('artist-name');
const albumCoverEl = document.getElementById('album-cover');
const artistListEl = document.getElementById('artist-list');
const nowPlayingTextEl = document.querySelector('.now-playing-text');

// 1. Fetch Currently Playing (or Last Played) Track
async function fetchNowPlaying() {
    try {
        const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USERNAME}&api_key=${LASTFM_API_KEY}&format=json&limit=1`;
        const response = await fetch(url);
        const data = await response.json();
        
        const track = data.recenttracks.track[0];
        const isPlaying = track['@attr'] && track['@attr'].nowplaying === 'true';
        
        // Update Text
        nowPlayingTextEl.textContent = isPlaying ? '▶ NOW SPINNING' : '⏸ LAST PLAYED';
        nowPlayingTextEl.style.color = isPlaying ? '#1db954' : '#888';
        
        trackNameEl.textContent = track.name;
        artistNameEl.textContent = track.artist['#text'];
        
        // Update Album Art (Use profile pic as fallback)
        const coverUrl = track.image[3]['#text']; 
        albumCoverEl.src = coverUrl ? coverUrl : 'profilepicture.jpeg';
        
    } catch (error) {
        console.error('Error fetching live track:', error);
        trackNameEl.textContent = "Offline";
        artistNameEl.textContent = "Cannot connect to Last.fm";
    }
}

// 2. Fetch All-Time Top Artists
async function fetchTopArtists() {
    try {
        const url = `https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${LASTFM_USERNAME}&api_key=${LASTFM_API_KEY}&format=json&limit=3&period=overall`;
        const response = await fetch(url);
        const data = await response.json();
        
        const artists = data.topartists.artist;
        artistListEl.innerHTML = ''; // Clear loading text
        
        // Loop through the top 3 and add them to the list
        artists.forEach((artist, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}. ${artist.name}`;
            artistListEl.appendChild(li);
        });
        
    } catch (error) {
        console.error('Error fetching top artists:', error);
        artistListEl.innerHTML = '<li>Unavailable</li>';
    }
}

// Initialize on page load
fetchNowPlaying();
fetchTopArtists();

setInterval(fetchNowPlaying, 10000);