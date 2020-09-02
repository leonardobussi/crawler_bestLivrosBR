const express  = require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static('public'))

var Crawler = {
	request : null,
	cheerio : null,
	fs      : null,
	init : function(){
		Crawler.request = require('request');
		Crawler.cheerio = require('cheerio');
		//Crawler.fs      = require('fs');
		Crawler.getMovies();

	},
	getMovies: function(dados = []){
		Crawler.request('https://www.saraiva.com.br/listas/livros/mais-vendidos-veja/ficcao', function(err, res, body){
			if(err)
				console.log('Error: ' + err);
			var $ = Crawler.cheerio.load(body);
			$('.shell .section__inner .section__content .product-list .main .vitrine .product').each(function(){
				var title  = $(this).find('.product h3 a').text().trim();
				var price = $(this).find('.product__price').text().trim();
				if (price == ''){
					price = 'Fora de estoque'
				}
				
				var response = {title, price}
				dados.push(response)
				
			});
			
		
			console.log(dados)

			app.get('/', function(req, res){ 
				return res.render('index', {dados: dados})
			}) 
		});
	}
};
Crawler.init();

app.listen(3000, (err) => {
    if(err) {
        console.log('==> [-]  falha na aplicação');
    } else {
        console.log('==> [+] aplicação funcionando ');
    }
});