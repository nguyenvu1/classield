var passport = require('passport');
exports.get_register = function(req, res, next) {
    var messages = req.flash('error');
    res.render('frontend/member/register', {
        pageTitle: req.__ ('Member Register'),
        csrfToken: req.csrfToken(),
        messages: messages,
        hasError: messages.length > 0
    });
};

// POST Register
exports.post_register = passport.authenticate('local.register', {
    successRedirect: 'thanh-vien/tai-khoan',
    failureRedirect: 'thanh-vien/dang-ky',
    failureFlash: true
});