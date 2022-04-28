const cheerio = require('cheerio');
const request = require('request-promise');
const fs = require('fs-extra');
const writeStream = fs.createWriteStream('quotes.csv');

async function init() {

    const $ = await request({
        uri: 'https://quotes.toscrape.com/',
        transform: body => cheerio.load(body)   //agarro todo lo que esta en la url y se lo paso a cheerio para analizarlo
    })
    const websiteTitle = $('title');
    console.log(websiteTitle.html())

    const websiteHead = $('h1');
    console.log(websiteHead.text().trim())

    const quote = $('.quote').find('a');
    console.log(quote.html());

    const fourthQuote = $('.quote').next().next().next();
    console.log(fourthQuote.html());

    const containerClass = $('.row .col-md-8').parent().next()  //me trae un div que tenga clase row y dentro de este, un div con clase col-md-8
    console.log(containerClass.html());

    const quotes = $('.quote span.text').each((index, element) => {
        console.log(index, $(element).text())
    });


    writeStream.write('Quote|Author|Tags\n')

    $('.quote').each((i, el) => {
        const text = $(el).find('span.text').text();
        console.log(text);
        const author = $(el).find('span small.author');
        console.log(author.text())
        const tags = [];
        $(el).find('.tags a.tag').each((i, el) => tags.push($(el).text()));
        console.log(tags)
        writeStream.write(`${text}|${author}|${tags}\n`)
    })

}


init()