function fetchAndDisplayGIF() {
    const textInput = document.getElementById('textInput').value;
    const url = 'https://your-backend-api.com/fetch_gif'; // 更改为你的API地址
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: textInput })
    })
    .then(response => response.json())
    .then(data => {
        const gifContainer = document.getElementById('gifContainer');
        gifContainer.innerHTML = ''; // 清空之前的内容
        data.gifs.forEach(gif => {
            const img = document.createElement('img');
            img.src = gif; // 假设返回的是GIF的直接URL
            gifContainer.appendChild(img);
        });
    })
    .catch(error => console.error('Error fetching GIF:', error));
}
