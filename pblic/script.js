async function fetchAndDisplayGIF() {
    const textInput = document.getElementById('textInput').value.split('\n');
    const gifContainer = document.getElementById('gifContainer');
    gifContainer.innerHTML = ''; // 清空之前的内容

    for (let line of textInput) {
        const lineDiv = document.createElement('div');
        lineDiv.style.display = 'flex';
        lineDiv.style.justifyContent = 'center';
        lineDiv.style.alignItems = 'center';
        lineDiv.style.flexWrap = 'wrap';

        const characters = Array.from(line);
        const gifs = await Promise.all(characters.map(char => fetchGif(char)));

        gifs.forEach(gif => {
            if (gif) {
                const img = document.createElement('img');
                img.src = URL.createObjectURL(gif);
                img.style.maxHeight = '100px'; // 自动匹配屏幕大小
                lineDiv.appendChild(img);
            }
        });

        gifContainer.appendChild(lineDiv);
    }
}

async function fetchGif(character) {
    const response = await fetch(`/api/fetch_gif?char=${encodeURIComponent(character)}`, {
        method: 'GET'
    });
    if (response.ok) {
        return await response.blob();
    } else {
        console.error('Error fetching GIF:', await response.text());
    }
}

document.getElementById('submitButton').addEventListener('click', fetchAndDisplayGIF);
