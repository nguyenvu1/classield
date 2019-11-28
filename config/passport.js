var validator = require('express-validator');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var settings = require('../config/settings');
var Member = require('../models/member')

var provider = null;
passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    Member.findById(id, function (err, member) {

        var newMember = member.toObject();
        newMember['provider'] = provider;

        done(err, newMember);
    });
});

passport.use('local.register', new LocalStrategy({
    usernameField: 'email', //
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done){
    // validator các input từ trang đăng kí
    req.checkBody('firstname', req.__('Please input first name.')).notEmpty();
    req.checkBody('lastname', req.__('Please input last name.')).notEmpty();
    req.checkBody('email', req.__('Email address invalid, please check again.')).notEmpty().isEmail();
    req.checkBody('password', req.__('Password invalid, password must be at least %d charaters or more', settings.passwordLength)).notEmpty().isLength({
        min: settings.passwordLength
    });
    req.checkBody('password', req.__('Confirm password is not the same, please check again.')).equals(req.body.confirmpassword);
    req.checkBody('accept', req.__('You have to accept with our terms to continue.')).equals('1');

    var errors = req.validationErrors();
    if(errors) {
        var messages = [];
        errors.forEach(function(error){
            messages.push(error.msg)
        });
        return done(null, false, req.flash('error', messages));
    }
    Member.findOne({
        'local.email': email
    }, function(err, member){
        if(err){
            return done(err);
        }
        if(member){
            return done(null, false, {
                message: req.__('Email address used, please enter another email.')
            });
        }
        var newMember = new Member();
        newMember.info.firstname = req.body.firstname;
        newMember.info.lastname = req.body.lastname;
        newMember.local.email = req.body.email;
        newMember.local.password = newMember.encryptPassword(req.body.password);
        newMember.newsletter = req.body.newsletter;
        newMember.roles = 'MEMBER';
        //Nếu yêu cầu xác thực tài khoản qua email thì trạng thái tài khoản là INACTIVE
        newMember.status = (settings.confirmRegister == 1) ? 'INACTIVE' : 'ACTIVE';

        newMember.save(function(err, result) {
            if(err) {
                return done(err);
            }
            else{
                //Nếu yêu cầu kích hoạt tài khoản qua email thì chỉ đăng kí mà không tự động đăng nhập
                if(settings.confirmRegister == 1){
                    return done(null, newMember);
                }
                else{
                    //Tự động đăng nhập cho thành viên mới đăng kí khi không yêu cầu xác thực tài khoản qua email
                    req.logIn(newMember, function(err){
                        provider = 'local';
                        return done(err, newMember);
                    })
                }
            }
        });
    });
}
));