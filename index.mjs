import { chromium } from "playwright";

const browser = await chromium.launch({
    headless: true,
    executablePath:  "C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe", // Cambia esto si es necesario
});

const page = await browser.newPage();

await page.goto("https://www3.animeflv.net/");

await page.waitForSelector('.ListEpisodios.AX.Rows.A06.C04.D03');

// Extraer los datos
const data = await page.evaluate(() => {
    const list = document.querySelector('.ListEpisodios.AX.Rows.A06.C04.D03');
    if (!list) return [];

    const items = list.querySelectorAll('li');
    return Array.from(items).map(item => {
        const link = item.querySelector('a');
        const title = item.querySelector('.Title')?.textContent.trim();
        const episode = item.querySelector('.Capi')?.textContent.trim();
        const href = link?.getAttribute('href');
        return { title, episode, href };
    });
});

// Mostrar los datos en la consola
console.log(data);

// Cerrar el navegador
await browser.close();