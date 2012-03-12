var haroo = require('../'),
    express = require('express'),
    config = require('./config');

haroo.setConfig('articles', config.articles);
haroo.setConfig('authors', config.authors);

var article = haroo.loadArticle('sample');
    console.log(article);
