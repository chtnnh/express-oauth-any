import { google } from 'googleapis';

export class Google {
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
			callbackUrl = hostWithProtocol + "/oauth-any/google/callback"
		}
		if (!this.goog) {
			this.goog = new google.auth.OAuth2(
				this.options.key,
				this.options.secret,
				callbackUrl
			);
		}

		req.session.oauthanygooglestate = req.query.state
		const url = this.goog.generateAuthUrl({
			access_type: 'offline',
			prompt: 'consent', // access type and approval prompt will force a new refresh token to be made each time signs in
			scope: ['https://www.googleapis.com/auth/plus.me', 'https://www.googleapis.com/auth/userinfo.email',]
		});
		res.redirect(url)
	}

	async callback(req, res, _) {
		this.goog.setCredentials((await this.goog.getToken(req.query.code)).tokens)
		google.oauth2("v2").userinfo.v2.me.get({ auth: this.goog }, (_, profile) => {
			req.session.google = profile.data
			res.redirect(req.session.oauthanygooglestate)
			delete req.session.oauthanygooglestate
		});

	}

}
