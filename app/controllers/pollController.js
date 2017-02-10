var a = require('../models/polls');
var Poll = a.poll;

module.exports = {
  reload: function() {
    Poll.find().remove((err, d) => {
      var a = new Poll({
	name: 'What about dogs?',
	author: '1415703',
	options: {
	  'what?': 4,
	  'yes': 9,
	  'no': 4
	}
      });
      var b = new Poll({
	name: 'Another one of those polls',
	author: '9999',
	options: {
	  'Really?': 3,
	  'Believe it': 0
	}
      });
      var c = new Poll({
	name: 'How are you doing?',
	author: '1415703',
	options: {
	  'I am fine': 5,
	  'Sunny day': 100
	}
      });
      Poll.insertMany([a,b,c], (err, docs) => {
	console.log("Database reloaded");
      });
    });
  },

  list_all: function(cb) {
    Poll.find({}, (err, polls) => {
      var data = polls.reverse().map((v) => {
	return v.name;
      })
      var data = polls;
      cb(data);
    });
  },

  list_one: function(id, cb) {
    Poll.findOne({_id: id}, (err, poll) => {
      cb(poll);
    });
  },

  delete_one: function(id, user, cb) {
    Poll.findOne({_id: id}, (err, poll) => {
      if (poll.author === user)
	Poll.remove({_id: id}, (err, poll) => {
	  cb();
	});
    });
  },

  add_vote: function(id, fields, cb) {
    Poll.findOne({_id: id}, (err, poll) => {
      var o = poll.options;
      if (typeof o[fields.select] !== 'undefined') o[fields.select]++;
      else if (typeof o[fields.custom] !== 'undefined') o[fields.custom]++;
      else o[fields.custom] = 1;
      poll.update({$set: {options: o}}, (err, p) => {
	cb();
      });
    });
  },

  user_polls: function(user, cb) {
    Poll.find({author: user}, (err, polls) => {
      cb(polls.reverse())
    })
  },

  create_poll: function(user, name, options, cb) {
    var a = new Poll({
      name: name,
      author: user,
      options: options
    })
    a.save((err, poll) => {
      cb(poll._id)
    })
  }
}
