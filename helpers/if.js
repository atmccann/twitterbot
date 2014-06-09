var Q = require("q");
var monk = require('monk')
var _ = require('underscore')
var t = require('./tweet.js')
var twitter = new t()
var p = require('./tweet_parse.js')
var parse = new p()


var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost:27017/fcc_database';

var db = monk(mongoUri)
var comments = db.get('comments')


var IfThen = function() {

  var self = this

  this.getFcc = function() {
    var deferred = Q.defer()
    var re = /\bif[ ][a-zA-Z  ']+,/i
    comments.find({text: re}, function(e, docs) {
      docs = _.shuffle(docs)
      docs = docs.slice(0, 20)
      response = []
      docs.forEach(function(comment) {
        var text = comment.text.match(re)[0]
        if(text.length < 140) {
          response.push(text)
        }
      })
      deferred.resolve(response)
    })
    return deferred.promise
  }

  this.getTweet = function() {
    var deferred = Q.defer()
    var response = []
    twitter.tweetSearch('if then', function(data) {
      data.forEach(function(tweet) {
        var text = parse.parseTweet(tweet.text)
        if(text) {
          response.push(text)
        };
      });
    deferred.resolve(response)
    });
    return deferred.promise
  }


  this.createText = function(tweets, fcc) {
    try {
    for(var i=0; i < tweets.length; i++) {
      console.log('ENTERING FOR LOOP')
      var fccText = fcc[i].replace(/if/i, 'If')
      var tweetText = tweets[i].replace(/then/i, 'then')
      var text = fccText + ' ' + tweetText
      if(text.length < 140){
        console.log('CREATED TEXT SHORTER THAN 140 CHARS')
        return text
        break;
      }
    }
    } catch(e) {
      console.log(e)
      console.log('ERRORERRORREOREORORO')
    }
  }

  this.createTweets = function() {
    var deferred = Q.defer()
    Q.all([this.getFcc(), this.getTweet()]).then(function(data) {
      console.log('DATA RECEIVED')
      var fcc = _.shuffle(data[0])
      var flatTweets = _.flatten(data[1])
      var tweets = _.shuffle(flatTweets)
      var tweetText = self.createText(tweets, fcc)
      console.log('TWEET TEXT CREATED')
      deferred.resolve(tweetText)
    })
  return deferred.promise
  }

}


module.exports = IfThen