import User from "./user.mysql.model.js";
import Application from "./application.mysql.model.js";

User.hasMany(Application, { as: "applications", foreignKey: "applicant" });
Application.belongsTo(User, { as: "applicantUser", foreignKey: "applicant" });
