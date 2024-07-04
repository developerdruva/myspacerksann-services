const POOL = require('../../db/sql/connection');
const { successMsgRetrieve } = require('../../utils/commonSyntaxes');

exports.getSampleRecord  = async (webReq, webRes) => {
    successMsgRetrieve['data'] = 'Hi there how are you ?.  '
    webRes?.send(successMsgRetrieve)
}

exports.getEmployees = async (request, response) => {
    let res = await POOL.query(`SELECT * FROM public.employee`);
    response?.send(res?.rows)
}

exports.getEmployeeById = async (request, response) => {
    let empId = request?.params?.id
    let res = await POOL.query(`SELECT * FROM public.employee where employeeid = ${empId}`);
    response?.send(res?.rows[0])
}

exports.insertEmployee = async (req, res) => {
    let { employeeid, FirstName, LastName, EMail, Phone, HireDate, Salary } = req?.body;
    POOL.query(
        'INSERT INTO public.employee values ($1, $2, $3, $4, $5, $6, $7)',
        [employeeid, FirstName, LastName, EMail, Phone, HireDate, Salary],
        (err, result) => {
            if (err) {
                console.log('err  ', err)
                res.send(err?.message);
            } else {
                res.send('inserted.')
            }
        }
    );

}