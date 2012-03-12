var fs = require('fs'),
    util = require('util'),
    events = require('events'),
    md = require('robotskirt'),
    cnf = {
        meta:  {
            defaultTitle: 'Markdown Blog', 
            description: 'Markdown Blog with node.js',
            keywords: '',
            generator: 'markdown 0.0.1'
        },
        host: 'nodejs.kr',
        articles: process.cwd() +'/articles',
        authors: process.cwd() +'/authors',
        disqus: ''
    };

function Blog() {
    function loadArticle(name) {
        return fs.readFileSync(cnf.articles +'/'+ name +'.markdown', 'utf8'); 
    }

    function loadAuthor(name) {
        return fs.readFileSync(cnf.authors +'/'+ name +'.markdown', 'utf8');
    }

    function parseArticleHeader(header) {
        return JSON.parse(header);
    }

    function parseAuthor(author) {
        return JSON.parse(author);
    }

    return {
        setConfig: function(key, value) {
                       cnf[key] = value;
                   },
        getConfig: function(key) {
                       return cnf[key];
                   },

        /**
         * 인자로 전달된 기사의 고유한 아이디값으로 markdown 파일을 읽어 객체 형태로 반환한다.
         * @param aid {string} 기사 고유한 아이디 값
         * @return {object} markdown 을 분석해서 객체 형태로 반환한다.
         */
        loadArticle: function(aid) {
                          var article = loadArticle(aid);
                          var parts = article.split('\n\n');
                          var header = parts.shift();
                          var body = parts.join('\n\n');
                          var author, authorInfo; 

                          header = parseArticleHeader(header);
                          body = md.toHtmlSync(body);

                          author = loadAuthor(header.author);
                          author = author.split('\n\n');
                          authorInfo = parseAuthor(author[0]);
                          authorInfo.intro = md.toHtmlSync(author[1]);

                          return {
                              header: header,
                              article: body,
                              author: authorInfo 
                          };
                      }
        
        };
}

var blog = Blog();
util.inherits(blog, events.EventEmitter);

module.exports = blog;
