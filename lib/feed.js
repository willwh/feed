//
// hook.io-feed - Provide a feed of hook events
//
var Hook = require('hook.io').Hook,
    http = require('http'),
    util = require('util'),
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
   
   //
   //  / - root
   //  A list of all available feeds
   body = JSON.stringify(self.feed, true, 2);
   
   //
   //  /all
   //  All available events

   //
   //  /all.json
   //  All available events as json
   body = self.feed;

   //
   //  /all.xml
   //  All available events as xml
   body = json2xml(self.feed);
   
   res.write(body);
   res.end();

 }).listen(8000);

};
