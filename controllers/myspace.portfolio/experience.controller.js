const POOL = require('../../db/sql/connection');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

exports.saveWorkedCompanies = (webReq, webRes) => {
    const body = webReq?.body;
    console.log('body of the webreq ', body);
    // console.log('created ip ', webReq?.socket.remoteAddress)
    body['created_ip'] = webReq?.socket.remoteAddress;
    // let updateData = {}
    const keysAllowed = [
        'company_name',
        'designation',
        'from_date',
        'to_date',
        'email_id',
        'numberof_projects',
        'color_code',
        'comp_seq',
        'company_code',
        'created_ip'
    ]
    // const updateSQLQuery = keysAllowed.reduce((preVal, currVal, index) => {
    //     return preVal + `${currVal}='${body[currVal]}'` + (index != keysAllowed.length - 1 ? ',' : '')
    // }, '')
    // console.log('update querys => ', updateSQLQuery)
    try {
        let sqlQuery = `insert into portfolioblog.worked_companies (${keysAllowed}) values ($1, $2,$3,$4,$5,$6,$7,$8,$9,$10)`
        console.log(' query', keysAllowed)
        console.log(' query values ', Object.values(body))

        POOL.query(
            sqlQuery,
            Object.values(body),
            (err, result) => {
                console.log('result', result);
                console.log('err-', err);
                if (err) {
                    webRes.send(err?.message);
                } else {
                    webRes.send({
                        status: 'success',
                        message: 'User registered successfully.'
                    })
                }
            }
        )
    } catch (e) {
        webRes.send(e);
        console.log('e ', e)
    }
}

exports.deleteCompRecord = (webReq, webRes) => {
    console.log('hi in delete record query values ')

    let id = webReq?.params?.id;
    try {
        console.log('id query', id)

        POOL.query(
            `delete from portfolioblog.worked_companies where sl_no = ${id}`,
            (err, result) => {
                // console.log('result', result);
                // console.log('err-', err);
                if (err) {
                    webRes.send(err?.message);
                } else {
                    webRes.send({
                        status: 'success',
                        message: 'Record deleted successfully.'
                    })
                }
            }
        )
    } catch (e) {
        webRes.send(e);
        console.log('e ', e)
    }
}


exports.updateWorkCompanyRecord = (webReq, webRes) => {
    // console.log('hi in save profile function req -> ', req);
    const body = webReq?.body;
    const id = webReq?.params?.id;
    console.log('body -> , -r0', Object.keys(body));
    let updateData = {}
    const keysAllowed = [
        'company_name',
        'designation',
        'from_date',
        'to_date',
        'email_id',
        'numberof_projects',
        'color_code',
        'comp_seq',
        'company_code'
    ]
    let reqKeys = Object.keys(body)
    keysAllowed.forEach(item => {
        if (reqKeys.includes(item)) {
            updateData[item] = body[item]
        }
    })

    let x = Object.keys(updateData);
    const updateSQLQuery = x.reduce((preVal, currVal, index) => {
        return preVal + `${currVal}='${updateData[currVal]}'` + (index != x.length - 1 ? ',' : '')
    }, '')
    console.log(' string update ', updateSQLQuery);
    try {
        let updateQuery = `update portfolioblog.worked_companies set ${updateSQLQuery} where sl_no=${id}`;
        console.log(' query', updateQuery)
        POOL.query(
            updateQuery,
            (err, result) => {
                console.log('result', result);
                console.log('err-', err);
                if (err) {
                    webRes.send(err?.message);
                } else {
                    webRes.send({
                        status: 'success',
                        message: 'Record updated successfully.'
                    })
                }
            }
        )
    } catch (e) {
        res.send(e);
        console.log('e ', e)
    }
}
