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

const { successMsgRetrieve, successMsgInsert, errorMsgInsert } = require('../../utils/commonSyntaxes');
const myskillsModel = require('../../models/myspaceblog/myskills.model');
const skill_setkeysModel = require('../../models/myspaceblog/skill_setkeys.model');
const feedbackModel = require('../../models/myspaceblog/feedback.model');
// const skills_setModel = require('../../models/myspaceblog/skills_set.model');

exports.getPersonalBlogDetails = async (req, res) => {
    console.log(' get personal blog details');
    try {
        let usedTechsOfPoc = await usedTechsOfPocModel.find();
        let personDetails = await personModel.find();
        let certifications = await certificationsModel.find();
        let pocProjects = await pocProjectsModel.find();
        let projectDetails = await workedProjectModel.find();
        let skillSet = await skillSetModel.find();
        let summeryEducation = await summeryEducationModel.find();
        let workedCompanies = await workedCompaniesModel.find().sort({ orderCode: -1 });
        let mystudies = await mystudiesModel.find();
        let mySkills = await myskillsModel.find().sort({skill_seq: 1});
        let skillsKeys = await skill_setkeysModel.find();

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

exports.saveFeedbackDetails = async (req, res) => {
    console.log(' inside save feed back details', req.body)
    let feedbackInfo = req.body
    let feedbackSave = new feedbackModel(feedbackInfo);
    try {
        let saveRes = await feedbackSave.save();
        // console.log('save res ', saveRes)
        if (saveRes._id) {
            res.send(successMsgInsert)
        } else {
            res.send(errorMsgInsert)
        }
    } catch (error) {
        console.log(error)
    }
}