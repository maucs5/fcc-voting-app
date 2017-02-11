'use strict'

var m = require('mongoose')

var Poll = m.model('Poll', new m.Schema({
  name: String,
  author: String, // linked to Github ID
  // contains number of votes, should return something like {'cake no':0,
  // 'fish': 10}
  options: m.Schema.Types.Mixed
  // should have been [{option: count}] as it is easier to map with the values
  // of form select
}))

module.exports = {
  'poll': Poll
}
