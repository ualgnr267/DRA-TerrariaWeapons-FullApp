const cheerio = require('cheerio');
const fetch = require('node-fetch');
const fs = require('fs');

async function getSimplePage(webpage){
    const web = await fetch(webpage);
    return await web.text();
}

async function init(){
    try {
        const web = await getSimplePage("https://terraria.wiki.gg/wiki/Weapons");
        const $ = cheerio.load(web);
        
        const resultado = {};
        const mainContent = $('#mw-content-text > div.mw-content-ltr.mw-parser-output');
        
        const h3Headers = mainContent.find('> h3');
        
        h3Headers.each((index, h3Element) => {
            const tipoNombre = $(h3Element).find('span').first().text().trim();
            
            if (!tipoNombre) return;
            
            resultado[tipoNombre] = { modos: [] };
            
            // Buscar todas las divisiones infocard después de este h3 y antes del siguiente h3
            let currentElement = $(h3Element).next();
            
            while (currentElement.length > 0 && currentElement.prop('tagName') !== 'H3') {
                const clases = currentElement.attr('class') || '';
                
                if (clases.includes('infocard')) {
                    // Cada main-heading dentro de la infocard define un modo distinto (si existen)
                    const mainHeadings = currentElement.find('.main-heading');

                    mainHeadings.each((_, mainHeadingElement) => {
                        const mainNode = $(mainHeadingElement).find('.hgroup .main').first();
                        let modoNombre = '';

                        if (mainNode.length) {
                            const mainClone = mainNode.clone();
                            mainClone.children().remove();
                            modoNombre = mainClone.text().trim();
                        }

                        if (!modoNombre) {
                            modoNombre = $(mainHeadingElement).text().trim();
                        }

                        if (!modoNombre) {
                            return;
                        }

                        const modo = {
                            nombre: modoNombre
                        };

                        // Recorrer los hermanos que siguen al main-heading hasta el siguiente main-heading
                        let sibling = $(mainHeadingElement).next();
                        let haySubtipos = false;

                        while (sibling.length > 0 && !sibling.hasClass('main-heading')) {
                            if (sibling.hasClass('heading')) {
                                if (!modo.subtipos) {
                                    modo.subtipos = [];
                                }
                                haySubtipos = true;

                                const subtipoNombre = sibling.text().trim();
                                const itemlist = sibling.next('.itemlist');
                                const armas = extraerArmas($, itemlist);

                                modo.subtipos.push({
                                    nombre: subtipoNombre,
                                    armas: armas
                                });

                                sibling = itemlist.next();
                                continue;
                            }

                            if (sibling.hasClass('itemlist') && !haySubtipos) {
                                const armas = extraerArmas($, sibling);
                                if (armas.length > 0) {
                                    modo.armas = armas;
                                }
                            }

                            sibling = sibling.next();
                        }

                        resultado[tipoNombre].modos.push(modo);
                    });

                    // Caso especial: infocard sin main-heading, solo una o varias listas de armas
                    if (mainHeadings.length === 0) {
                        const itemlists = currentElement.find('.itemlist');
                        itemlists.each((_, itemlistElement) => {
                            const armasDirectas = extraerArmas($, $(itemlistElement));
                            if (armasDirectas.length > 0) {
                                if (!resultado[tipoNombre].armas) {
                                    resultado[tipoNombre].armas = [];
                                }
                                resultado[tipoNombre].armas = resultado[tipoNombre].armas.concat(armasDirectas);
                            }
                        });
                    }
                }
                
                currentElement = currentElement.next();
            }
        });
        
        fs.writeFileSync('terraria-weapons.json', JSON.stringify(resultado, null, 2), 'utf-8');
        console.log('Datos guardados en terraria-weapons.json');
        
    } catch (error) {
        console.error('Error al hacer scraping:', error);
    }
}

function extraerArmas($, itemlistElement) {
    const armas = [];
    
    if (itemlistElement.length === 0) return armas;
    
    const items = itemlistElement.find('ul > li');
    
    items.each((idx, item) => {
        const linkElement = $(item).find('span > span > span > a');
        const imgElement = $(item).find('span > a > img');
        
        const nombre = linkElement.attr('title');
        
        let imagenUrl = imgElement.attr('data-src') || 
                       imgElement.attr('src') || 
                       imgElement.attr('data-url');
        
        if (imagenUrl && !imagenUrl.startsWith('http')) {
            imagenUrl = 'https://terraria.wiki.gg' + imagenUrl;
        }
        
        if (nombre) {
            armas.push({
                nombre: nombre,
                imagen: imagenUrl || null
            });
        }
    });
    
    return armas;
}

init();
