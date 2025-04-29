import { chromium } from "playwright";

const browser = await chromium.launch({
    headless: true,
    executablePath: "C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe",
});

const page = await browser.newPage();
await page.goto("https://monoschinos2.net/ver/shiunji-ke-no-kodomotachi-episodio-4");

// Esperar a que los botones de reproductores estén disponibles
await page.waitForSelector('.play-video');

// Obtener todos los botones de reproductores
const reproductores = await page.$$eval('.play-video', (buttons) => 
    buttons.map(button => ({
        isActive: button.classList.contains('active'),
        provider: button.textContent.trim(),
        encodedUrl: button.dataset.player
    }))
);

// Encontrar el reproductor activo
const reproductorActivo = reproductores.find(r => r.isActive);

if (reproductorActivo) {
    // Decodificar la URL base64
    const decodedUrl = Buffer.from(reproductorActivo.encodedUrl, 'base64').toString('utf-8');
    
    // Obtener el iframe actualizado
    const iframeSrc = await page.$eval('iframe.embed-responsive-item', iframe => iframe.src);
    
    console.log({
        proveedor: reproductorActivo.provider,
        urlDecodificada: decodedUrl,
        iframeSrc: iframeSrc
    });
}

// Opcional: Cambiar a otro reproductor
async function cambiarReproductor(providerName) {
    await page.click(`.play-video:has-text("${providerName}")`);
    await page.waitForTimeout(1000); // Esperar que cargue el iframe
    
    const nuevoSrc = await page.$eval('iframe.embed-responsive-item', iframe => iframe.src);
    console.log(`Nuevo reproductor (${providerName}):`, nuevoSrc);
}

// Ejemplo: Cambiar a streamtape
// await cambiarReproductor('streamtape');
const todosReproductores = reproductores.map(r => ({
    proveedor: r.provider,
    url: Buffer.from(r.encodedUrl, 'base64').toString('utf-8')
}));

console.log('Todos los reproductores disponibles:', todosReproductores);

await browser.close();