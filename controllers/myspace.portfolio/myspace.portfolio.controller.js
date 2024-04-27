const POOL = require('../../db/sql/connection');
const { successMsgRetrieve } = require('../../utils/commonSyntaxes');

exports.getMyspacePortfolioDetails = async (webReq, webRes) => {
    console.log(' hi in get myspace ');
    try {
        var personDetails = await POOL?.query('select * from portfolioblog.person_details');
        var summaryEducation = await POOL?.query('select * from portfolioblog.summary_education');
        var certifications = await POOL?.query('select * from portfolioblog.certifications');
        var pocProjects = await POOL?.query('select * from portfolioblog.poc_projects');
        var skillSet = await POOL?.query('select * from portfolioblog.skills_set');
        var workedCompanies = await POOL?.query('select * from portfolioblog.worked_companies');
        var workedProjects = await POOL?.query('select * from portfolioblog.worked_projects');
        console.log('persondetails ', personDetails?.rows);
        if (personDetails?.rowCount > 0) {
            successMsgRetrieve['data'] = {
                personDetails: personDetails?.rows,
                summaryEducation: summaryEducation?.rows,
                certifications: certifications?.rows,
                pocProjects: pocProjects?.rows,
                skillSet: skillSet?.rows,
                workedCompanies: workedCompanies?.rows,
                workedProjects: workedProjects?.rows,
            }
            webRes?.send(successMsgRetrieve)
        }
    } catch (e) {
        console.log('catch ', e)
    }
}