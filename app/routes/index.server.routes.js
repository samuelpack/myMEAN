//the module.exports approach exposes a single (anonymous?) function


module.exports = function(app) {
    const index = require ('../controllers/index.server.controller');
    app.get('/', index.render);
};