//
// hook.io-feed - Provide a feed of hook events
//
var Hook = require('hook.io').Hook,
    http = require('http'),
    util = require('util'),
    url = require('url'),
    json2xml  = require('./json2xml').json2xml;

var FeedHook = exports.FeedHook = function(options){
  Hook.call(this, options);
  var self = this;

  self.feed = [];

  self.on('hook::ready', function(){
    self.createServer();
  });
  
  self.onAny(function(data){
    if(self.feed.length >= 10) {
      self.feed.shift();
    }
    
    self.feed.push({
      event: this.event,
      data: data
    })
  });

};

// FeedHook inherits from Hook
util.inherits(FeedHook, Hook);

FeedHook.prototype.createServer = function(options, callback){
 
 var self = this;
 
 http.createServer(function(req, res){
   
   var body = '';
   var uri = url.parse(req.url);

   //
   //  / - root
   //  A list of all available feeds
   if(uri.pathname == '/') {
     body = JSON.stringify(self.feed, true, 2);
   }
   
   //
   //  /all
   //  All available events
   if(uri.pathname == '/all') {
     body = '';
   }
   
   //
   //  /all.json
   //  All available events as json
   if(uri.pathname == '/all.json') {
     body = JSON.stringify(self.feed);
   }
   
   //
   //  /all.xml
   //  All available events as xml
   if(uri.pathname == '/all.xml') {
     body = json2xml(self.feed);
   }

   res.write(body);
   res.end();

 }).listen(8000);

};
