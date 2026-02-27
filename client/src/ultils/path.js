import Dashboard from "../page/business/Dashboard/Dashboard";

const path = {
    // public
    PUBLIC: "/",
    HOME: "/",
    ALL: "*",
    LOGIN: "/login",
    REGISTER: "/register",
    INTRODUCTION: "/introduction",
    JOB: "/job",
    COMPANY: "/company",
    FORGOT_PASSWORD: "/forgot-password",
    // business
    BUSINESS: "/business",
    DASHBOARDBUSINESS: "/business/dashboard",
    CREATEBUSINESS: "/business/createBusiness",
    BUSINESSBUYPOSTJOB: "/business/buypostjob",
    BUSINESSPOSTJOB: "/business/postjob",
    HISTORYBUY: "/business/historybuy",
    MANAGERSTAFF: "/business/managerstaff",
    MANAGERINFOBUSI: "/business/managerinfobusiness",
    CREATESTAFF: "/business/createstaff",
    // admin
    ADMIN: "/admin",
    DASHBOARDADMIN: "/admin/dashboard",
    LEVELADMIN: "/admin/level",
    JOBADMIN: "/admin/job",
    SKILLADMIN: "/admin/skill",
    EXPADMIN: "/admin/exp",
    STYLEJOBADMIN: "/admin/style-job",
    SALARYRANGEADMIN: "/admin/salary-range",
    PACKETPOSTADMIN: "/admin/packet-post",
    USERADMIN: "/admin/user",
    GRAPHADMIN: "/admin/graph",
    COMPANYADMIN: "/admin/company",
    COMPANYADMINDETAIL: "/admin/company/:idb",
    POSTADMIN: "/admin/post",
    POSTADMINDETAIL: "/admin/post/:idp",
}

export default path;