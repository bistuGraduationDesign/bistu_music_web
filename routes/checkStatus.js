exports.checkLogin = function(req, res, next) {
	if (!req.session.user) {
		return res.redirect('/signin');
	}
	next();
};
exports.checkNotLogin = function(req, res, next) {
	if (!!req.session.user) {
		return res.redirect('/music');
	}
	next();
};