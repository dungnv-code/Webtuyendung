const userController = require('../controller/User');
const jobsController = require('../controller/jobs');
const skillController = require('../controller/skill');
const jobLevelController = require('../controller/jobLevel');
const WorktypeController = require('../controller/worktype');
const salaryRangeController = require('./salaryRange.js');
const ExperienceController = require('./experience.js');
const PostpackageController = require('./postpackage.js');
const BusinessController = require('./business.js');
const PostJobController = require('./postjob.js');
const InvoidController = require('./invoid.js');

module.exports = {
    userController, jobsController, skillController
    , jobLevelController, WorktypeController, salaryRangeController
    , ExperienceController, PostpackageController, BusinessController,
    PostJobController, InvoidController
};