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
                        console.log('r result inside ', r?.rows[0]?.password, password)
                        if (bcrypt.compareSync(password, r?.rows[0]?.password)) {
                            // console.log(' hi there', process.env.SECRET_KEY)
                            let payload = {
                                "user_id": r?.rows[0]?.user_id,
                                "email": r?.rows[0]?.email,
                                "username": r?.rows[0]?.username,
                                'created_ip': r?.rows[0]?.created_ip
                            }
                            let token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1min' })
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

exports.loginSimple = (req, res) => {
    console.log( 'req, ', req)
    let { emailId, password } = req?.body;
    POOL.query(
        'SELECT email_id FROM master_data.allowed_users',
        (err, result) => {
            if (err) return console.log(err);
            console.log('result outside ', result?.rows)
            console.log('result body ', emailId)
            console.log('result body ', result?.rows?.find(item => item?.email_id == emailId));
            if (result?.rows?.find(item => item?.email_id == emailId)) {
                POOL.query('SELECT * from master_data.allowed_users where email_id =$1', [emailId], (e, r) => {
                    if (e) return console.log(e);
                    console.log('r result inside ', r?.rows[0]?.user_password, password)
                    if (password === r?.rows[0]?.user_password) {
                        // console.log(' hi there', process.env.SECRET_KEY)
                        let payload = {
                            "user_id": r?.rows[0]?.user_id,
                            "email": r?.rows[0]?.email,
                            "username": r?.rows[0]?.username,
                            'created_ip': r?.rows[0]?.created_ip
                        }
                        let token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1min' })
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
            } else {
                res?.send({
                    status: 'failed',
                    message: 'login failed. Unauthorized access.',
                    auth_token: null
                })
            }
        }
    )
}

exports.saveProfileDetails = (req, res) => {
    // console.log('hi in save profile function req -> ', req);
    const body = req?.body;
    console.log('body -> , -r0', Object.keys(body).slice(1,), req?.files['profile_pic']);
    let updateData = {}
    const keysAllowed = ['first_name',
        'last_name',
        'roleof_person',
        'mobile_no',
        'email_id',
        'created_ip',
        'created_at',
        'welcome_text',
        'person_designation'
    ]
    let reqKeys = Object.keys(body)
    keysAllowed.forEach(item => {
        if (reqKeys.includes(item)) {
            updateData[item] = body[item]
        }
    })
    if (req?.files['profile_pic'] && req?.files['profile_pic'].length > 0) {
        updateData['profile_pic'] = req?.files['profile_pic'][0]['location']
    }
    if (req?.files['resume'] && req?.files['resume'].length > 0) {
        updateData['resume'] = req?.files['resume'][0]['location']
    }
    let x = Object.keys(updateData);
    const updateSQLQuery = x.reduce((preVal, currVal, index) => {
        return preVal + `${currVal}='${updateData[currVal]}'` + (index != x.length - 1 ? ',' : '')
    }, '')

    // let userKeys = Object.keys(body).slice(1,);
    // let userData = [];
    // userKeys.forEach(item => {
    //     userData.push(req?.body[item])
    // })
    // userKeys.push('profile_pic');
    // userKeys.push('resume');
    // userData.push(req?.files['profile_pic'][0]['location'])
    // userData.push(req?.files['resume'][0]['location'])
    // console.log(userData)
    // console.log(userKeys)

    try {
        let updateQuery = `update portfolioblog.person_details set 
            ${updateSQLQuery}
                where sl_no=${body?.sl_no}
             `
        console.log(' query', updateQuery)
        POOL.query(
            updateQuery
            ,
            (err, result) => {
                console.log('result', result);
                console.log('err-', err);
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
    } catch (e) {
        res.send(e);
        console.log('e ', e)
    }
}




{
    /**
     * 
     * first_name='${body?.first_name}',
                last_name='${body?.last_name}',
                roleof_person='${body?.roleof_person}',
                mobile_no='${body?.mobile_no}',
                created_ip='${body?.created_ip}',
                welcome_text='${body?.welcome_text}',
                person_designation='${body?.person_designation}'
                ${req?.files['profile_pic'] && req?.files['profile_pic'].length > 0 ? ',profile_pic=\'' + req?.files['profile_pic'][0]['location'] + '\'' + (req?.files['resume'] ? ',' : '') : ''}
                ${req?.files['resume'] && req?.files['resume'].length > 0 ? (req?.files['profile_pic'] ? '' : ',') + 'resume=\'' + req?.files['resume'][0]['location'] + '\'' : ''}
                
     */
}