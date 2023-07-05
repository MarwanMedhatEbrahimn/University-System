const express = require('express')
const router = express.Router()
const prisma = require('../prisma/client')
const {isAdmin} = require("../middlewares/auth")

// Subjects page - GET
router.get('/subjects',isAdmin, async (req, res, next) => {
  try {
    const subjects = await prisma.subject.findMany()
    res.render('subjects/index', { subjects: subjects, active: req.active })
  } catch (error) {
    next(error)
  }
})

// Insert subject page - GET
router.get('/subjects/Insert',isAdmin, async (req, res, next) => {
  try {
    const Departments = await prisma.Department.findMany({})
    const subjects = await prisma.subject.findMany({})
    res.render('subjects/insert_subject', { subjects:subjects,Departments:Departments,active: req.active })
  } catch (error) {
    next(error)
  }
})
// Insert subject request - POST
router.post('/subjects/Insert',isAdmin, async (req, res, next) => {
  try {
    var User = JSON.parse(req.body.Use)
    var dependencies = ""
    User.forEach(element => {
      dependencies+=element.name +',' 
    });
    const subject = await prisma.subject.create({
      data: {
        name: req.body.name,
        code: req.body.code,
        departmentId: Number(req.body.Department),
        dependencies: dependencies
      }
    })
    res.redirect('/subjects')
  } catch (error) {
    next(error)
  }
})

// Update subject page - GET
router.get('/subjects/Update/:id',isAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const subject = await prisma.Subject.findFirst({ where: { id: id } })
    const Departments = await prisma.Department.findMany({})
    const subjects = await prisma.subject.findMany({})
    var aod = subject.dependencies.split(",")
    const dependencies = subjects.filter((item)=>{
      for(i=0;i<aod.length;i++){
        if(aod[i]==item.name){
          return item
        }
      }
    })
    res.render('subjects/update_subject', {
      subject: subject,
      active: req.active,
      subjects:subjects,
      Departments:Departments,
      dependencies:dependencies
    })
  } catch (error) {
    next(error)
  }
})
// Update subject request - POST
router.post('/subjects/Update/:id',isAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    var User = JSON.parse(req.body.Use)
    var dependencies = ""
    User.forEach(element => {
      dependencies+=element.name +',' 
    });
    const subject = await prisma.subject.update({
      where: { id: id },
      data: {
        name: req.body.name,
        code: req.body.code,
        departmentId: Number(req.body.Department),
        dependencies: dependencies
      }
    })
    res.redirect('/subjects')
  } catch (error) {
    next(error)
  }
})

// Subject's students page - GET
router.get('/subjects/Show_Students/:id/:name/:num',isAdmin, async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const num = Number(req.params.num)
    const SubjectName = req.params.name
    const Students = await prisma.stateOFsub.findMany({
      where: {
        subject_id: id
        },
        include: {user:{include:{department:true}}}
    })
    let active
    if(num==1){active="home"}
    else {active=req.active}
    res.render('subjects/show_Students', {
      Students: Students,
      SubjectId: id,
      SubjectName:SubjectName,
      num: num,
      active: active
    })
  } catch (error) {
    next(error)
  }
})
router.post('/subjects/UnRegistration',isAdmin, async (req, res, next) => {
  try {
    const {SubjectId,UserId} = req.body
    await prisma.stateOFsub.deleteMany({
      where:{user_Id:Number(UserId),subject_id:Number(SubjectId)}
    })
    return res.json({ msg: "Done" })

  } catch (error) {
    console.log(error)
    return res.json({ msg: "error" })
  }
})


module.exports = router
