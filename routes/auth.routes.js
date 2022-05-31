const authController=require('../controllers/auth.controller');
const {verifySignup} = require("../middlewares");


module.exports= (app)=>{

  app.post("/crm/api/v1/auth/login", authController.login);
  app.post("/crm/api/v1/auth/signup",[verifySignup.validateSignUpRequest], authController.signUp);
  }
