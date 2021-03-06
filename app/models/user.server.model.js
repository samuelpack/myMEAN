const mongoose = require('mongoose');
const crypto = require('crypto');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        index: true,
        match: [/.+\@.+\..+/, "Please fill in a valid e-mail address"]
    },
    username: {
        type: String,
        unique: true,
        required: 'Username is required',
        trim: true
    },
    password: {
        type: String,
        validate: [
            (password) => password && password.length > 6,
            'Password should be longer'
        ]
    },
    salt: {
        type: String
    },
    provider: {
        type: String,
        required: 'Provider is required'
    },
    providerId: String,
    providerData: {},
    created: {
        type: Date,
        default: Date.now
    }
});

// Set the 'fullname' virtual property
UserSchema.virtual('fullName').get(function() {
    return this.firstName + '' + this.lastName;
}).set(function(fullName) {
    const splitName = fullName.split('');
    this.firstName = splitName[0] || '';
    this.lastName = splitName[1] || '';
});

// Use a pre-save middleware to hash the password
UserSchema.pre('save', function(next) {
    if (this.password) {
        this.salt = Buffer.fromy(crypto.randomBytes(16).toString('base64'), 'base64');
        // this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
        // crypto.pbkdf2Sync(password, new Buffer(this.salt,'binary'),10000,64,'sha1').toString('base64');
        this.password = this.hashPassword(this.password);
    }    

    next();
});

// Create an instance method for hashing a password
UserSchema.methods.hashPassword = function(password) {
    return crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha1').toString('base64');
};

// Create an instance method for authenticating user
UserSchema.methods.authenticate = function(password) {
    return this.password === this.hashPassword(password);
};

// Find possible not used username
UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
    const possibleUsername = username + (suffix || '');

    //Use the 'User' model 'findOne' method to find an available unique username
    this.findOne({
        username: possibleUsername
    }, (err, user) => {
        if (!err) {
            if (!user) {
                callback(possibleUsername);
            } else {
                return this.findUniqueUsername(username, (suffix || 0) + 1, callback);
            }
            } else {
                callback(null);
            }
        });
    },

// Configure the 'UserSchema' to use getters and virtuals when transforming to JSON
UserSchema.set('toJSON', {
    getters:true,
    virtuals:true
});

// Create the 'User' model out of the 'UserSchema'
mongoose.model('User', UserSchema);