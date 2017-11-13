module.exports = {
    db: 'mongodb://localhost/mean-book',
    sessionSecret: 'developmentSessionSecret',

    //Facebook
    facebook: {
        clientID:'949617241788998',
        clientSecret: '33cd2b9b0669550e62d8f213242ff9b1',
        callbackURL:  'http://localhost:3000/oauth/facebook/callback'
    }
};