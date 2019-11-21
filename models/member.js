var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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

module.exports = mongoose.model('Member', memberSchema);