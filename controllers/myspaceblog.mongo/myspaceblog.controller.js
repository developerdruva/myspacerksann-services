const personModel = require('../../models/myspaceblog/person.model');
const certificationsModel = require('../../models/myspaceblog/certifications.model');
const pocProjectsModel = require('../../models/myspaceblog/pocprojects.model');
const workedProjectModel = require('../../models/myspaceblog/project_details.model');
const skillSetModel = require('../../models/myspaceblog/skills_set.model');
const summeryEducationModel = require('../../models/myspaceblog/summeryEducation.model');
const workedCompaniesModel = require('../../models/myspaceblog/workedcompanies.model');
const mystudiesModel = require('../../models/myspaceblog/mystudies.model');
const usedTechsOfPocModel = require('../../models/myspaceblog/techOfPoc.model');
// const mySkillsModel = require('../../models/myspaceblog/myskills.model');

const { successMsgRetrieve } = require('../../utils/commonSyntaxes');
const myskillsModel = require('../../models/myspaceblog/myskills.model');
const skill_setkeysModel = require('../../models/myspaceblog/skill_setkeys.model');
// const skills_setModel = require('../../models/myspaceblog/skills_set.model');

exports.getPersonalBlogDetails = async (req, res) => {
    try {
        let usedTechsOfPoc = await usedTechsOfPocModel.find();
        let personDetails = await personModel.find();
        let certifications = await certificationsModel.find();
        let pocProjects = await pocProjectsModel.find();
        let projectDetails = await workedProjectModel.find();
        let skillSet = await skillSetModel.find();
        let summeryEducation = await summeryEducationModel.find();
        let workedCompanies = await workedCompaniesModel.find();
        let mystudies = await mystudiesModel.find();
        let mySkills = await myskillsModel.find();
        let skillsKeys = await skill_setkeysModel.find();
        console.log('skills set  ', skillSet);

        successMsgRetrieve['data'] = {
            personDetails: personDetails,
            summaryEducation: summeryEducation,
            certifications: certifications,
            pocProjects: pocProjects,
            skillSet: skillSet,
            workedCompanies: workedCompanies,
            workedProjects: projectDetails,
            skillsKeys: skillsKeys,
            mySkills: mySkills,
            myStudies: mystudies,
            usedTechsOfPoc: usedTechsOfPoc
        }
        res?.send(successMsgRetrieve)
    } catch (e) {
        console.log(e)
    }
}
