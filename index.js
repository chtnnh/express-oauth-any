import { Twitter } from './twitter';
import { Google } from './google';
import { GitHub } from './github';

export function registerOauth (app, options) {
  console.log(options);

  if (options.twitter) {
    const twitter = new Twitter(options.twitter);
    app.get('/oauth-any/twitter/login', (req, res) => twitter.login(req, res));
    app.get('/oauth-any/twitter/callback', (req, res) => twitter.callback(req, res));
  }

  if (options.google) {
    const google = new Google(options.google);
    console.log(google)
    app.get('/oauth-any/google/login', (req, res) => google.login(req, res));
    app.get('/oauth-any/google/callback', (req, res) => google.callback(req, res));
  }

  if (options.github) {
    const github = new GitHub(options.github);
    console.log(github)
    app.get('/oauth-any/github/login', (req, res) => github.login(req, res));
    app.get('/oauth-any/github/callback', (req, res) => github.callback(req, res));
  }

}
