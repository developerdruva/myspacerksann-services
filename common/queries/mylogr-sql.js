const getProfileQueries = {
  personDetails: "select * from portfolioblog.person_details",
  summaryEducation: "select * from portfolioblog.summary_education",
  certifications:
    "select * from portfolioblog.certifications order by certify_seq asc",
  pocProjects:
    "select * from portfolioblog.poc_projects order by project_seq asc",
  skillSet: "select * from portfolioblog.skills_set",
  workedCompanies:
    "select * from portfolioblog.worked_companies where is_delete=false order by comp_seq desc",
  workedProjects:
    "select * from portfolioblog.worked_projects order by display_no desc",
  skillsKeys:
    "select * from portfolioblog.skillset_keys order by key_sequence asc",
  mySkills: "select * from portfolioblog.skills_list order by skill_seq asc",
  myStudies: "select * from portfolioblog.studies order by study_seq desc",
  usedTechsOfPoc: "select * from portfolioblog.used_techsofpoc",
  skillsByCategory:
    "SELECT st.id as skill_type_id, st.label_name AS skill_type_name, array_agg( json_build_object( 'sl_no', ms.sl_no, 'skill_name', ms.skill_name ) ) AS skills FROM portfolioblog.myskills ms JOIN master_data.skill_types st ON st.id = ms.skill_type_id GROUP BY st.id, st.label_name ORDER BY st.id ASC",
};

const temp = {
  name: "rajesh",
};

module.exports = { getProfileQueries, temp };
