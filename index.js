const token = 'BQABv8AMyQMWGXhIXGfmXMP6BVK2vvdSBEQ3Mq5TboIMcQSEd9hgA4d2itkhn1z4z6S89zFYdO3IjX0BpTiV2TOsIu1-9hMnYqfcehIWRCNt1BndJkPrPc35ivovvBWJd0Ec13kg5CWOZWMmiB0Ez4GThmsf_WcfpaVdqFl83YUPGC_OeaLpJUNOhsfEfkeYCojMz3563A4JjrneewAroHPxgy540ZWAL0HwsUjMI1dsNXbUJ5eIJFWYZMg16ImwNcO9iSgXHdm-xu8PCdwbvMYI';

async function fetchWebApi(endpoint, method, body) {
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method,
        body: JSON.stringify(body)
    });
    return await res.json();
}

async function getTopTracks() {
    return (await fetchWebApi(
        'v1/me/top/tracks?time_range=short_term&limit=5',
        'GET'
    )).items;
}

// Sonuçları HTML'e ekleme
async function showTopTracks() {
    const topTracks = await getTopTracks();
    const topTracksList = document.getElementById('top-tracks');
    topTracksList.innerHTML = ''; // Şarkı listesini temizle

    topTracks.forEach(track => {
        const li = document.createElement('li');
        const img = document.createElement('img');
        const span = document.createElement('span');

        img.src = track.album.images[0].url; // İlk resmin URL'sini al
        span.textContent = `${track.name} by ${track.artists.map(artist => artist.name).join(', ')}`;

        li.appendChild(img);
        li.appendChild(span);
        topTracksList.appendChild(li);
    });
}

window.addEventListener('load', () => {
    showTopTracks();
});
