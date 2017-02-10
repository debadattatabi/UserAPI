var thinky = require(__dirname+'/../util/thinky.js'),
    r = thinky.r;
    
    exports.log=function logger(req,res,next){
    
      next()
    };