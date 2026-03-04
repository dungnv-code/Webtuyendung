

const path = {
    // public
    PUBLIC: "/",
    HOME: "/",
    ALL: "*",
    LOGIN: "/login",
    REGISTER: "/register",
    INTRODUCTION: "/introduction",
    JOB: "/job",
    DETAILJOB: "/job/:idp",
    COMPANY: "/company",
    DETAILCOMPANY: "/company/:idb",
    FORGOT_PASSWORD: "/forgot-password",

    CHANGEPASSWORD: "/changepassword",
    CVLIST: "/listcv",
    USERINFO: "/userinfo",
    WISHLISTJOB: "/wishlistjob",
    WISHLISTBUSINESS: "/wishlistbusiness",

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
    MANAGERPOSTJOB: "/business/managerpostjob",
    UPDATEPOSTJOB: "/business/managerpostjob/:idp",
    CVPOSTJOB: "/business/cvpostjob",
    CVPOSTJOBMAIN: "/business/cvpostjob/:idp",
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