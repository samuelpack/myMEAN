const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    username: {
        type: String,
        trim: true
    },
    password: String,

    created: {
        type: Date,
        default: Date.now
    },
    website: {
        type: String,
        get: function(url){
            if(!url){
                return url;
            }else{
                if(url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0){
                    url = 'http://' + url;
                }

                return url;
            }
        }
    },

});

// Set the 'fullname' virtual property
UserSchema.virtual('fullName').get(function() {
    return this.firstName + '' + this.lastName;
}).set(function(fullName) {
    const splitName = fullName.split('');
    this.firstName = splitName[0] || '';
    this.lastName = splitName[1] || '';
}); 

// Configure the 'UserSchema' to use getters and virtuals when transforming to JSON
UserSchema.set('toJSON', {
    getters:true,
    virtuals:true
});

// Create the 'User' model out of the 'UserSchema'
mongoose.model('User', UserSchema);