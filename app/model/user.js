// Import
var uuid = require('node-uuid'),
    thinky = require(__dirname+'/../util/thinky.js'),
    r = thinky.r,
    type = thinky.type;

var User = thinky.createModel('user', {
    id: type.string(),
    name: type.string().required(),
    email: type.string().required(),
    mobile: type.number(),
    address: type.string(),
    createdOn: type.date().default(r.now),
    createdBy: type.string(),
    updatedBy: type.string(),
    updatedOn: type.date(),
    status: type.string().enum(["active", "inactive"]).required().default("active")
});

module.exports = User;


User.ensureIndex("createdOn");
User.ensureIndex("name");

User.pre('save', function(next) {
    if(this.mobile != undefined && this.mobile !== null && this.mobile !== '' && this.mobile !== NaN){
       User.filter({mobile:parseInt(this.mobile)}).run().then(function(result) {
            if(result.length > 0){
                next(new Error("This user already exists."));
            }else{
                next();
            }
        }); 
   }else{
        next(); 
   }
   
});

