var thinky = require(__dirname + '/../util/thinky.js'),
    r = thinky.r,
    User = require(__dirname + '/../model/user.js');

// list users
exports.listUsers = function(req, res) {
    var count;
    var pno = 1,
        offset = 0,
        limit = 10;
    if (req.query.psize != undefined && req.query.psize != null && !isNaN(req.query.psize)) {
        limit = parseInt(req.query.psize);
    }

    if (req.query.pno != undefined && req.query.pno != null && !isNaN(req.query.pno)) {
        pno = parseInt(req.query.pno);
    }

    offset = (pno - 1) * limit;

    var sort = req.query.sort;
    var pluck = req.query.pluck;

    var address = req.query.address;
    var name = req.query.name;
    var mobile = parseInt(req.query.mobile);

    var q = {
        status: 'active'
    };

    if (address != null && address != undefined) {
        q.address = address;
    }
    if (name != null && name != undefined) {
        q.name = name;
    }

    if (mobile != null && mobile != undefined && !isNaN(mobile)) {
        q.mobile = mobile;
    }

    if (sort == undefined || sort == null) {
        User.orderBy(r.desc('createdOn')).filter(q).skip(offset).limit(limit).run().then(function(users) {
            User.filter(q).count().execute().then(function(count) {
                res.json({
                    data: users,
                    total: (count != undefined ? count : 0),
                    pno: pno,
                    psize: limit
                });
            });
        }).error(handleError(res));
        handleError(res);
    } else {
        var result = sort.substring(0, 1);
        var sortLength = sort.length;
        if (result === '-') {
            field = sort.substring(1, sortLength);
            console.log("field--" + field);
            console.log(typeof field);
            User.filter(filter).match(field).run().then(function(result) {
                console.log("length--->" + result.length);
            });
            if (User.hasFields(field)) {
                User.filter(filter).count().execute().then(function(total) {
                    count = total;
                    console.log(total);
                });
                User.orderBy(r.desc(field)).filter(filter).skip(offset).limit(limit).run().then(function(users) {
                    res.json({
                        data: users,
                        total: count,
                        pno: pno,
                        psize: limit
                    });
                }).error(handleError(res));
                handleError(res);
            } else {
                res.status(500).send({
                    message: 'No field exist.'
                });
            }
        } else {
            field = sort.substring(0, sortLength);
            console.log("field--" + field);
            console.log("has field--" + User.hasFields(field));
            if (User.hasFields(field)) {
                User.filter(filter).count().execute().then(function(total) {
                    count = total;
                    console.log(total);
                });
                User.orderBy(r.asc(field)).filter(filter).skip(offset).limit(limit).run().then(function(users) {
                    res.json({
                        data: users,
                        total: count,
                        pno: pno,
                        psize: limit
                    });
                }).error(handleError(res));
                handleError(res);
            } else {
                res.status(500).send({
                    message: 'No field exist.'
                });
            }
        }
    }
};
// get by id
exports.getUser = function(req, res) {
    var id = req.params.id;
    User.get(id).getJoin({
        portfolio: true
    }).run().then(function(user) {
        res.json(user);
    }).error(handleError(res));
};

// delete by id
exports.deleteUser = function(req, res) {
    var id = req.params.id;
    User.get(id).delete().run().then(function(user) {
        res.json({
            status: "success"
        });
    }).error(handleError(res));
};

// Add user
exports.addUser = function(req, res) {
    console.log('inside adduser function');
    var newUser = new User(req.body);
    console.log('newUser is >> ', newUser);
    newUser.updatedOn = r.now();
    console.log('newUser is >> ', newUser);
    newUser.save().then(function(result) {
        res.json({
            result: result
        });
    }).error(handleError(res));
};

// update user
exports.updateUser = function(req, res) {
    var usr = new User(req.body);
    usr.updatedOn = r.now();

    User.get(usr.id).update(usr).then(function(result) {
        res.json({
            result: result
        });
    }).error(handleError(res));
};

function handleError(res) {
    return function(error) {
        console.log(error.message);
        return res.send(500, {
            error: error.message
        });
    }
}