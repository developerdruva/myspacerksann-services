const POOL = require('../../db/sql/connection');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

exports.registerUser = async (req, res) => {
    var salt = bcrypt.genSaltSync(10);
    let userData = [
        req?.body?.user_id,
        req?.body?.username,
        bcrypt.hashSync(req?.body?.password, salt),
        req?.body?.email,
        req?.body?.is_admin,
        req?.body?.first_name,
        req?.body?.last_name,
        req?.body?.city,
        req?.body?.created_ip,
        new Date()
    ]

    POOL.query(
        'INSERT INTO public.user_accounts values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
        userData,
        (err, result) => {
            if (err) {
                res.send(err?.message);
            } else {
                res.send({
                    status: 'success',
                    message: 'User registered successfully.'
                })
            }
        }
    )
}

exports.loginUser = (req, res) => {
    let { email, password } = req?.body;
    POOL.query(
        'SELECT email FROM public.user_accounts',
        (err, result) => {
            if (err) return console.log(err);
            console.log('result outside ', result?.rows)
            result?.rows?.forEach(item => {
                if (item['email'] === email) {
                    POOL.query('SELECT * from public.user_accounts where email =$1', [email], (e, r) => {
                        if (e) return console.log(e);
                        console.log('r result inside ', r?.rows[0]?.password, password )
                        if (bcrypt.compareSync(password, r?.rows[0]?.password)) {
                            // console.log(' hi there', process.env.SECRET_KEY)
                            let payload = {
                                "user_id": r?.rows[0]?.user_id,
                                "email": r?.rows[0]?.email,
                                "username": r?.rows[0]?.username,
                                'created_ip': r?.rows[0]?.created_ip
                            }
                            let token = jwt.sign(payload, process.env.SECRET_KEY, {expiresIn : '1min'})
                            res?.send({
                                status: 'success',
                                message: 'User logged in',
                                auth_token: token
                            })
                        } else {
                            res?.send({
                                status: 'failed',
                                message: 'login failed. Unauthorized access.',
                                auth_token: null
                            })
                        }
                    })
                }
            })
        }
    )
}