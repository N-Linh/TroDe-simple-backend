const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password : process.env.DATABASE_PASSWORD,
    database : process.env.DATABASE
})

exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;
        console.log(req.body);
        db.query('SELECT * FROM user WHERE email = ?', [email], async(error, results) => {
            console.log(bcrypt.compare(password, results[0].password));
            if(!results || !(await bcrypt.compare(password, results[0].password))) {
                res.status(401).render('login', {
                    message : 'email or password is incorrect'
                })
            } else {
                const id = results[0].id;
                const token = jwt.sign({id: id}, process.env.JWT_SECRET, {
                    expiresIn : process.env.JWT_EXPIRES_IN
                });
                console.log("the token is: " + token);
                const cookieOptions = {
                    expires : new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60
                    ),
                    httpOnly: true
                }
                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect('/home');
            }
        })
    } catch (error) {console.log(error)}
}

exports.signup = function(req, res) {
    console.log(req.body);
    const {username, email, password, confirmPass} = req.body;
    db.query('SELECT email FROM user WHERE email = ?', [email], async  (error, results) => {
        if(error) {conslole.log(error);}
        if(results.length > 0) {
            return res.render('signup', {
                message: 'that email is already in use'
            })
        } else if(password !== confirmPass) {
            return res.render('signup', {
                message : 'password do not match'
            })
        }
        /*else {
            db.query('SELECT name FROM user WHERE name = ?', [username], (error, results) => {
                if(error) {console.log(error);}
                if(results.length > 0) {
                    return res.render('signup', {
                        message : 'user name is already in use'
                    })
                }
            })
        }*/

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);
        db.query('INSERT INTO user SET ?', {name: username, email: email, password: hashedPassword}, (error, results) => {
            if(error) {console.log(error);}
            else {
                console.log(results);
                return res.render('signup', {
                    message : 'user registered'
                });
            }
        })
    })
}