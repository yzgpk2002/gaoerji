async function loadGifs(text) {
    const characters = Array.from(text);
    const gifs = await Promise.all(characters.map(char => fetchGif(char)));

    // 假设有一个用于显示GIF的元素
    const container = document.getElementById('gif-container');
    gifs.forEach(gif => {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(gif);
        container.appendChild(img);
    });
}

async function fetchGif(character) {
    const response = await fetch(`/api/fetch_gif?char=${character}`);
    return await response.blob();
}
