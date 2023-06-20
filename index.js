const clientId = 'cd6b2d7ecd214129bf548e7cf4fa1c23';
const clientSecret = '6549c8a8178c4888a87f636e95de585f';

async function getToken() {
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    },
    body: 'grant_type=client_credentials',
  });
  const data = await res.json();
  return data.access_token;
}

async function fetchWebApi(endpoint, method, body) {
  const token = await getToken();
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
    body: JSON.stringify(body),
  });
  return await res.json();
}

async function getTopTracks() {
  return (await fetchWebApi(
    'v1/me/top/tracks?time_range=short_term&limit=5',
    'GET'
  )).items;
}

async function showTopTracks() {
  const topTracks = await getTopTracks();
  const topTracksList = document.getElementById('top-tracks');
  topTracksList.innerHTML = '';

  topTracks.forEach(track => {
    const li = document.createElement('li');
    const img = document.createElement('img');
    const span = document.createElement('span');

    img.src = track.album.images[0].url;
    span.textContent = `${track.name} by ${track.artists.map(artist => artist.name).join(', ')}`;

    li.appendChild(img);
    li.appendChild(span);
    topTracksList.appendChild(li);
  });
}

window.addEventListener('load', () => {
  showTopTracks();
});
