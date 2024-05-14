import LoginWithTwitter from 'login-with-twitter';

export class Twitter {
  constructor(options) {
    this.options = options;
  }
  login(req, res, _) {
    let callbackUrl = this.options.redirectUri;
    if (!callbackUrl) {
      const host = req.get('host');
      let hostWithProtocol = ""
      if (host.startsWith("localhost") || host.startsWith("127.0.0.1")) {
        hostWithProtocol = "http://" + host
      }
      else {
        hostWithProtocol = "https://" + host
      }
      callbackUrl = hostWithProtocol + "/oauth-any/twitter/callback"
    }
    if (!this.tw) {
      this.tw = new LoginWithTwitter({
        consumerKey: this.options.key,
        consumerSecret: this.options.secret,
        callbackUrl
      })
    }

    this.tw.login((err, tokenSecret, url) => {
      if (err) {
        console.log("error", err);
      }
      req.session.tokenSecret = tokenSecret
      req.session.oauthanytwitterstate = req.query.state
      res.redirect(url)
    })
  }

  callback(req, res, _) {
    this.tw.callback({
      oauth_token: req.query.oauth_token,
      oauth_verifier: req.query.oauth_verifier
    }, req.session.tokenSecret, (err, user) => {
      if (err) {
        console.log("error", err);
      }
      console.log(req.session.oauthanytwitterstate);
      delete req.session.tokenSecret
      req.session.twitter = { id: user.userId, name: user.userName, email: user.email };
      res.redirect(req.session.oauthanytwitterstate)
      delete req.session.oauthanytwitterstate
    });

  }

}
