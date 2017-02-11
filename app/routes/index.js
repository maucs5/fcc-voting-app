'use strict';

var path = process.cwd();
var controller = require('../controllers/pollController.js');

module.exports = function (app, passport) {

  if (process.env.RELOAD) {
    // reload the database with fresh data
    controller.reload();
  }

  function isLoggedIn (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/');
    }
  }

  app.get('/', (req, res) => {
    var auth;
    var name;
    if (req.isAuthenticated())
      name = req.user.github.displayName;
    controller.list_all((r) => {
      res.render('index', {
	data: r,
	auth: req.isAuthenticated(),
	name: name
      });
    });

  });

  app.route('/polls/:id')
    .get((req, res, next) => {
      var name;
      var is_author = false;
      controller.list_one(req.params.id, (r) => {
	if (req.isAuthenticated()) {
	  name = req.user.github.displayName;
	  is_author = r.author === req.user.github.id;
	};
	res.render('poll', {
	  data: r,
	  auth: req.isAuthenticated(),
	  is_author: is_author,
	  name: name
	});
      });
    })
    .post((req, res, next) => {
      controller.add_vote(req.params.id, req.body, () => {
      	res.send('');
      });
    })
    .delete((req, res) => {
      controller.delete_one(req.params.id, req.user.github.id, () => {
	res.send('The poll has been deleted.');
      });
    });

  app.get('/polls/:id/chart', (req, res) => {
    controller.list_one(req.params.id, (r) => {
      if (r.options) res.json(r.options);
      else res.json({error: 'Invalid ID'});
    });
  });

  app.get('/mypolls', isLoggedIn, (req, res) => {
    controller.user_polls(req.user.github.id, (r) => {
      res.render('mypolls', {
	data: r,
	auth: req.isAuthenticated(),
	name: req.user.github.displayName
      })
    })
  })

  app.route('/newpoll')
    .get(isLoggedIn, (req, res) => {
      res.render('newpoll', {
	auth: req.isAuthenticated(),
	name: req.user.github.displayName
      });
    })
    .post(isLoggedIn, (req, res) => {
      var name = req.body.name.trim()
      var t = req.body.options.trim().split(/\r?\n/)
      var options = {}
      t.forEach((v) => {
	options[v] = 0
      });
      controller.create_poll(req.user.github.id, name, options, (id) => {
	res.redirect('/polls/' + id)
      });
    });

  app.route('/logout')
    .get(function (req, res) {
      req.logout();
      res.redirect('/');
    });

  app.route('/auth/github')
    .get(passport.authenticate('github'));

  app.route('/auth/github/callback')
    .get(passport.authenticate('github', {
      successRedirect: '/',
      failureRedirect: '/'
    }));
};
