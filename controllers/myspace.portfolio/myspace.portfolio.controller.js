const POOL = require('../../db/sql/connection');
const { successMsgRetrieve } = require('../../utils/commonSyntaxes');

exports.getMyspacePortfolioDetails = async (webReq, webRes) => {
    console.log(' hi in get myspace ');
    try {
        var personDetails = await POOL?.query('select * from portfolioblog.person_details');
        var summaryEducation = await POOL?.query('select * from portfolioblog.summary_education');
        var certifications = await POOL?.query('select * from portfolioblog.certifications order by certify_seq asc');
        var pocProjects = await POOL?.query('select * from portfolioblog.poc_projects order by project_seq asc');
        var skillSet = await POOL?.query('select * from portfolioblog.skills_set');
        var workedCompanies = await POOL?.query('select * from portfolioblog.worked_companies order by comp_seq desc');
        var workedProjects = await POOL?.query('select * from portfolioblog.worked_projects ');
        var skillsKeys = await POOL?.query('select * from portfolioblog.skillset_keys');
        var mySkills = await POOL?.query('select * from portfolioblog.my_skills ');
        var studies = await POOL?.query('select * from portfolioblog.studies ');
        var usedTechsOfPoc = await POOL?.query('select * from portfolioblog.used_techsofpoc');
        
        // console.log('persondetails ', personDetails?.rows);
        if (personDetails?.rowCount > 0) {
            successMsgRetrieve['data'] = {
                personDetails: personDetails?.rows,
                summaryEducation: summaryEducation?.rows,
                certifications: certifications?.rows,
                pocProjects: pocProjects?.rows,
                skillSet: skillSet?.rows,
                workedCompanies: workedCompanies?.rows,
                workedProjects: workedProjects?.rows,
                skillsKeys: skillsKeys?.rows,
                mySkills: mySkills?.rows,
                myStudies: studies?.rows,
                usedTechsOfPoc: usedTechsOfPoc?.rows
            }
            webRes?.send(successMsgRetrieve)
        }
    } catch (e) {
        console.log('catch ', e)
    }
}

exports.saveFeedbackform = async (webReq, webRes) => {
    console.log(' console log ', webReq.body);
    let queryStr = `insert into portfolioblog.feedback_form (likes, dislikes, description) values (${webReq.body.like},${webReq.body.unlike},'${webReq.body.feedbackDesc}')`
    console.log(' query ', queryStr)
    POOL.query(queryStr,
        (err, result) => {
            console.log('result', result);
            console.log('err-', err);
            if (err) {
                webRes.send(err?.message);
            } else {
                webRes.send({
                    status: 'success',
                    message: 'feedback registered successfully.'
                })
            }
        }
    )
}