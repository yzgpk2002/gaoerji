const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/fetch_gif', async (req, res) => {
    const { char: character } = req.query;
    if (!character || !/^[\u4e00-\u9fff]+$/.test(character)) {
        return res.status(400).send('Invalid character');
    }

    const gifPath = path.join(__dirname, 'tmp', `${character}.gif`);

    try {
        if (!fs.existsSync(gifPath)) {
            const gifData = await downloadGIF(character);
            if (gifData) {
                fs.writeFileSync(gifPath, gifData, 'binary');
            } else {
                return res.status(404).send('GIF not found');
            }
        }
        res.sendFile(gifPath);
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).send('Internal server error');
    }
});

async function downloadGIF(character) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://hanyu.baidu.com/');

    try {
        await page.type('#kw', character);
        await page.click('#su');
        await page.waitForNavigation();
        await page.waitForSelector('img', { timeout: 10000 });

        const gifUrl = await page.evaluate(() => {
            const img = document.querySelector('img[src*=".gif"]');
            return img ? img.src : null;
        });

        if (gifUrl) {
            const viewSource = await page.goto(gifUrl);
            return await viewSource.buffer();
        }
    } catch (error) {
        console.error('Failed to download GIF:', error);
    } finally {
        await browser.close();
    }
    return null;
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
