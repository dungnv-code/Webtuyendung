const UserRouter = require("./User")
const JobsRouter = require("./jobs")
const SkillRouter = require("./skill")
const JobLevelRouter = require("./JobLevel")
const WorkTypeRouter = require("./WorkType")
const SalaryRangeRouter = require("./salaryRange")
const ExperienceRouter = require("./Experience")
const JobPostPackageRouter = require("./Postpackage")

const { notFound, errHandler } = require("../middleware/ErrHanler");
const Root = (app) => {
    app.use("/api/user", UserRouter)
    app.use("/api/jobs", JobsRouter)
    app.use("/api/skill", SkillRouter)
    app.use("/api/level", JobLevelRouter)
    app.use("/api/worktype", WorkTypeRouter)
    app.use("/api/salaryrange", SalaryRangeRouter)
    app.use("/api/experience", ExperienceRouter)
    app.use("/api/postpackage", JobPostPackageRouter)
    app.use(notFound)
    app.use(errHandler)
}


module.exports = Root;