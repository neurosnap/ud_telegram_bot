'use strict';

var TelegramBot = require('node-telegram-bot-api');
var request = require('request');
var cheerio = require('cheerio');

var token = process.env.UD_TOKEN;
var bot = new TelegramBot(token, { polling: true });

bot.getMe().then(function(obj) {
  console.log(obj);
}).catch(function(err) {
  throw err;
});

bot.on('text', function(msg) {
  var chatId = msg.chat.id;
  var messageId = msg.message_id;

  var define = msg.text.indexOf("/define");
  if (define == -1) return;

  var term = msg.text.slice(define + 7).trim();
  var ud = "http://www.urbandictionary.com/define.php?term=" + term;
  request.get(ud, function(e, r, body) {
    var message = getDef(term, body);
    bot.sendMessage(chatId, message);
  });
});

function getDef(term, body) {
  var $ = cheerio.load(body);
  var meaning = $('.meaning').first().text();
  var example = $('.example').first().text();
  var message = "Term: " + term + "\n";
  message += meaning + "\n";
  if (example) message += "Example: " + example;

  return message;
}
