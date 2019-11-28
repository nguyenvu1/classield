var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');
var memberSchema = new Schema({
    info: {
        firstname: String,
        lastname: String,
        phone: String,
        company: String,
        address: String,
        cities: [{type: Schema.ObjectId, ref: 'City'}],
        countries: [{type: Schema.ObjectId, ref: 'Country'}]
    },
    local: { // Use local
        email: String,
        password: String,
        adminPin: String,
        activeToken: String,
        activeExpires: Date,
        resetPasswordToken: String,
        resetPasswordExpires: Date
    },
    facebook: { // Use passport facebook
        id: String,
        token: String,
        email: String,
        name: String,
        photo: String
    },
    google: { // Use passport google 
        id: String,
        token: String,
        email: String,
        name: String,
        photo: String
    },
    newletter: Boolean,
    roles: String, //ADMIN, MOD, MEMBER, VIP
    status: String, //ACTIVE, INACTIVE, SUSPENDED

     
});
// encrypt password
memberSchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
}
// decrypt password
memberSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.local.password);
}
module.exports = mongoose.model('Member', memberSchema);