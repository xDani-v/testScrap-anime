 import { chromium } from "playwright";

export const getAnimeEpisodes = async (req, res) => {
    let browser;
    try {
        browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto("https://www3.animeflv.net/");
        await page.waitForSelector('.ListEpisodios.AX.Rows.A06.C04.D03');

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

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (browser) await browser.close();
    }
};

export const getBrowser = async (req, res) => {
    let browser;
    try {
        browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(`https://www3.animeflv.net/browse`);
        await page.waitForSelector('.ListAnimes');

        const data = await page.evaluate(() => {
            const list = document.querySelector('.ListAnimes');
            if (!list) return [];
            const items = list.querySelectorAll('li');
            return Array.from(items).map(item => {
                const article = item.querySelector('article.Anime');
                const link = article?.querySelector('a');
                const href = link?.getAttribute('href');
                const title = article?.querySelector('h3.Title')?.textContent.trim();
                const img = article?.querySelector('figure img')?.getAttribute('src');
                const type = article?.querySelector('.Type')?.textContent.trim();
                const description = article?.querySelector('.Description p')?.textContent.trim();
                const followers = article?.querySelector('.Flwrs span')?.textContent.trim();
                return { title, href, img, type, description, followers };
            });
        });

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (browser) await browser.close();
    }
};


export const getBusqueda = async (req, res) => {
    let browser;
    const query = req.query.q || '';
    try {
        browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(`https://www3.animeflv.net/browse?q=${encodeURIComponent(query)}`);
        await page.waitForSelector('.ListAnimes');

        const data = await page.evaluate(() => {
            const list = document.querySelector('.ListAnimes');
            if (!list) return [];
            const items = list.querySelectorAll('li');
            return Array.from(items).map(item => {
                const article = item.querySelector('article.Anime');
                const link = article?.querySelector('a');
                const href = link?.getAttribute('href');
                const title = article?.querySelector('h3.Title')?.textContent.trim();
                const img = article?.querySelector('figure img')?.getAttribute('src');
                const type = article?.querySelector('.Type')?.textContent.trim();
                const description = article?.querySelector('.Description p')?.textContent.trim();
                const followers = article?.querySelector('.Flwrs span')?.textContent.trim();
                return { title, href, img, type, description, followers };
            });
        });

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (browser) await browser.close();
    }
};

 export const getAnimeDetalle = async (req, res) => {
    const path = req.query.path; // Ejemplo: "anime/shoushimin-series"
    let browser;
    try {
        browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();

        const fullUrl = `https://www3.animeflv.net/${path}`;
        console.log(`Navigating to: ${fullUrl}`);
        await page.goto(fullUrl);
        await page.waitForSelector('.Ficha.fchlt');

        const data = await page.evaluate(() => {
            const ficha = document.querySelector('.Ficha.fchlt');
            const container = ficha?.querySelector('.Container');
            const aside = document.querySelector('.SidebarA.BFixed');
            const main = document.querySelector('main.Main');

            // Título y tipo
            const title = container?.querySelector('h1.Title')?.textContent.trim();
            const type = container?.querySelector('span.Type')?.textContent.trim();

            // Títulos alternativos
            const altTitles = Array.from(container?.querySelectorAll('.TxtAlt') || []).map(e => e.textContent.trim());

            // Imagen de portada y banner
            const banner = ficha?.querySelector('.Bg')?.style.backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/, '$1');
            const img = aside?.querySelector('.AnimeCover img')?.getAttribute('src');

            // Estado
            const status = aside?.querySelector('.AnmStts span')?.textContent.trim();

            // Seguidores
            const followers = aside?.querySelector('.WdgtCn .Top .Title span')?.textContent.trim();

            // Sinopsis
            const synopsis = main?.querySelector('.WdgtCn .Description p')?.textContent.trim();

            // Géneros
            const genres = Array.from(main?.querySelectorAll('.Nvgnrs a') || []).map(a => a.textContent.trim());

            // Votos y puntuación
            const votes = container?.querySelector('#votes_nmbr')?.textContent.trim();
            const score = container?.querySelector('#votes_prmd')?.textContent.trim();

            // Episodios
            const episodes = Array.from(main?.querySelectorAll('.ListCaps li.fa-play-circle a') || []).map(a => ({
                title: a.querySelector('h3.Title')?.textContent.trim(),
                episode: a.querySelector('p')?.textContent.trim(),
                url: a.getAttribute('href'),
                img: a.querySelector('figure img')?.getAttribute('data-src') || a.querySelector('figure img')?.getAttribute('src')
            }));

            return {
                title,
                type,
                altTitles,
                banner,
                img,
                status,
                followers,
                synopsis,
                genres,
                votes,
                score,
                episodes
            };
        });

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (browser) await browser.close();
    }
};


export const getVerEpisodio = async (req, res) => {
    const path = req.query.path; // Ejemplo: "ver/shoushimin-series-17"
    let browser;
    try {
        browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();

        const fullUrl = `https://www3.animeflv.net/${path}`;
        await page.goto(fullUrl);
        await page.waitForSelector('.CpCnA .CapiTop', { timeout: 60000 });

        const data = await page.evaluate(() => {
            // Título y episodio
            const title = document.querySelector('.CapiTop h1.Title')?.textContent.trim();
            const episode = document.querySelector('.CapiTop h2.SubTitle')?.textContent.trim();

            // Video iframe (puede haber varias opciones)
            const videoIframes = Array.from(document.querySelectorAll('.CapiTcn iframe')).map(iframe => ({
                src: iframe.getAttribute('src')
            }));

            // Opciones de descarga
            const downloads = Array.from(document.querySelectorAll('.DwsldCnTbl tbody tr')).map(row => {
                const cells = row.querySelectorAll('td');
                return {
                    servidor: cells[0]?.textContent.trim(),
                    formato: cells[1]?.textContent.trim(),
                    subtitulos: cells[2]?.textContent.trim(),
                    url: cells[3]?.querySelector('a')?.getAttribute('href')
                };
            });

            // Navegación entre episodios
            const anterior = document.querySelector('.CapNvPv')?.getAttribute('href');
            const siguiente = document.querySelector('.CapNvNx')?.getAttribute('href');
            const lista = document.querySelector('.CapNvLs')?.getAttribute('href');

            return {
                title,
                episode,
                videoIframes,
                downloads,
                navigation: {
                    anterior,
                    siguiente,
                    lista
                }
            };
        });

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (browser) await browser.close();
    }
};