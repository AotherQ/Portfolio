const clientId = 'e8cd444d81ec445fb3c8ebaadc28bceb';
const clientSecret = '9f1f933e0fcd45769844dc704ca251ef';
const redirectUri = 'https://aotherq.netlify.app/';

const authorizeUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user-top-read`;

async function getAccessToken(code) {
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
    }),
  });
  const data = await res.json();
  return data.access_token;
}

async function refreshToken(refreshToken) {
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });
  const data = await res.json();
  return data.access_token;
}

async function getAuthorizationCode() {
  return new Promise((resolve, reject) => {
    const authWindow = window.open(authorizeUrl, '_blank', 'width=400,height=600');

    const handleAuthorizationResponse = (event) => {
      if (event.origin === window.location.origin) {
        const code = event.data;
        if (code) {
          resolve(code);
        } else {
          reject('Authorization code not received.');
        }
        window.removeEventListener('message', handleAuthorizationResponse);
        authWindow.close();
      }
    };

    window.addEventListener('message', handleAuthorizationResponse);
  });
}

async function getToken() {
  let accessToken = localStorage.getItem('accessToken');
  let refreshToken = localStorage.getItem('refreshToken');

  if (!accessToken) {
    const code = await getAuthorizationCode();
    accessToken = await getAccessToken(code);
    localStorage.setItem('accessToken', accessToken);
  }

  if (refreshToken) {
    const tokenExpiration = Number(localStorage.getItem('tokenExpiration'));
    const currentTime = Date.now() / 1000;
    if (currentTime >= tokenExpiration) {
      accessToken = await refreshToken(refreshToken);
      localStorage.setItem('accessToken', accessToken);
    }
  }

  return accessToken;
}

async function fetchWebApi(endpoint, method, body, accessToken) {
  if (!accessToken) {
    accessToken = await getToken();
  }

  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
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
