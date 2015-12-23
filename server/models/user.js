/*jslint node: true, nomen: true  */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

var UserSchema = new Schema(
    {
        email           :   { type : String, required : true, unique : true },
        firstName       :   { type : String, required : true },
        lastName        :   { type : String, required : true },
        hashedPassword  :   { type : String, required : true },
        salt            :   { type : String, required : true },
        editor          :   { type : Boolean },
        admin           :   { type : Boolean },
        approved        :   { type : Boolean, required : true },
        groupId         :   { type : Schema.Types.ObjectId }
    },
    {
        collection: 'users'
    }
);

/**
 * Virtuals
 */
UserSchema
    .virtual('password')
    .set(function (password) {
        'use strict';
        this._password = password;
        this.salt = this.makeSalt();
        this.hashedPassword = this.encryptPassword(password);
    })

    .get(function () {
        'use strict';
        return this._password;
    });

UserSchema
    .virtual('user_info')
    .get(function () {
        'use strict';
        return { '_id'      : this._id,
                 'firstName': this.firstName,
                 'lastName' : this.lastName,
                 'email'    : this.email,
                 'admin'    : this.admin,
                 'editor'   : this.editor,
                 'groupId'  : this.groupId};
    });

/**
 * Validations
 */

var validatePresenceOf = function (value) {
    'use strict';
    return value && value.length;
};

UserSchema.path('email').validate(function (email) {
    'use strict';
    var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email);
}, 'The specified email is invalid.');

UserSchema.path('email').validate(function (value, respond) {
    'use strict';
    mongoose.models.User.findOne({email: value}, function (err, user) {
        if (err) {
            throw err;
        }
        if (user) {
            return respond(false);
        }
        respond(true);
    });
}, 'The specified email address is already in use.');

/**
 * Pre-save hook
 */

UserSchema.pre('save', function (next) {
    'use strict';
    if (!this.isNew) {
        return next();
    }

    if (!validatePresenceOf(this.password)) {
        next(new Error('Invalid password'));
    } else {
        next();
    }
});

/**
 * Methods
 */

UserSchema.methods = {

  /**
   * Authenticate - check if the passwords are the same
   */

    authenticate: function (plainText) {
        'use strict';
        return this.encryptPassword(plainText) === this.hashedPassword;
    },

  /**
   * Make salt
   */

    makeSalt: function () {
        'use strict';
        return crypto.randomBytes(16).toString('base64');
    },

  /**
   * Encrypt password
   */

    encryptPassword: function (password) {
        'use strict';
        if (!password || !this.salt) {
            return '';
        }
        var salt = new Buffer(this.salt, 'base64');
        return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
    }
};

mongoose.model('User', UserSchema);
