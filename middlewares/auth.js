function isStudent(req, res, next){
   if (req.session.user && req.session.user.isStudent) {
      // If the user is an Student, proceed to the next middleware function
      next();
    } else {
      // If the user is not an Student, return an error response
      res.status(403).send('Access denied');
    }
}
function isAdmin(req, res, next) {
   if (req.session.user && req.session.user.isAdmin) {
     // If the user is an administrator, proceed to the next middleware function
     next();
   } else {
     // If the user is not an administrator, return an error response
     res.status(403).send('Access denied');
   }
 }
 function isDoctor(req, res, next) {
   if (req.session.user && req.session.user.isDoctor) {
     // If the user is an Doctor, proceed to the next middleware function
     next();
   } else {
     // If the user is not an Doctor, return an error response
     res.status(403).send('Access denied');
   }
 }

function checkSign(req, res, next){
   if(req.session.user){
      next();     //If session exists, proceed to page
   } else {
      res.redirect("/login")
   }
}



module.exports = {isStudent, isDoctor, isAdmin, checkSign}
