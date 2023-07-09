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
        dependencies: dependencies,
        state:"Open"
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
        subject_id: id,
        },
        include: {user:{include:{department:true}}}
    })
    //succeeded, failure, registered
    let succeeded = []
    let failure = []
    let registered = []
    Students.forEach((ele)=>{
      if(ele.state=="succeeded"){succeeded.push(ele)}
      else if(ele.state=="failure"){failure.push(ele)}
      else {registered.push(ele)}
    })
    let active
    if(num==1){active="home"}
    else {active=req.active}
    res.render('subjects/show_Students', {
      SubjectId: id,
      succeeded:succeeded,
      failure:failure,
      registered:registered,
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
    await prisma.user.update({where:{id:Number(UserId)},data:{registered:{ decrement: 1 }}})
    await prisma.stateOFsub.deleteMany({
      where:{user_Id:Number(UserId),subject_id:Number(SubjectId)}
    })
    return res.json({ msg: "Done" })

  } catch (error) {
    console.log(error)
    return res.json({ msg: "error" })
  }
})
async function Search(id){
  const Subject = await prisma.subject.findFirst({where:{id:id},select:{dependencies:true,name:true}})
  let dependencies = Subject.dependencies
  dependencies=dependencies.split(',')
  //6 48 
  let Students = await prisma.user.findMany({
    where:{isStudent:true,registered:{lt:6},succeeded:{lt:48}},
    include:{
      stateOFsub:{include:{subject:{select:{name:true}}}},
      department:true
    }
  })
  Students=Students.filter(element => {
    let f = true
    let MapArray=[]
    element.stateOFsub.forEach(subject => {
      if(subject.subject.name==Subject.name&&(subject.state=="registered"||subject.state=="succeeded")){
        f=false
        return
      }
      MapArray[subject.subject.name]=subject.state
    });
    element.stateOFsub=MapArray
    if(f){
      for(i=0;i<dependencies.length-1;i++){
        if(element.stateOFsub[dependencies[i]]!="succeeded"){
          f=0 
          break
        }
      }
      if(f){
        element.stateOFsub=""
        return element
      }   
    }
  });
  return Students
}

router.post('/subjects/Search',isAdmin, async (req, res, next)=>{
  try {
    const id = Number(req.body.SubjectId)
    const Students = await Search(id)
    return res.json({ Students: Students })
  } catch (error) {
    console.log(error)
    return res.json({ Students: [] })
  }
})

router.post('/subjects/Registration',isAdmin, async (req, res, next) => {
  try {
    const {SubjectId,UserId} = req.body
    await prisma.user.update({where:{id:Number(UserId)},data:{registered:{ increment: 1 }}})
    await prisma.stateOFsub.create({
      data:{user_Id:Number(UserId) , subject_id:Number(SubjectId),state:"registered"}
    })
    return res.json({ msg: "Done" })

  } catch (error) {
    console.log(error)
    return res.json({ msg: "error" })
  }
})

router.post('/subjects/Close_Open',isAdmin, async (req, res, next) => {
  try {
    const id = Number(req.body.id)
    let state=req.body.state;
    if(state=="Open"){state="Close"}
    else{state="Open"}
    const flag = await prisma.Subject.update({where:{id:id},data:{state:state}}) 
    return res.json({ state: state })
  } catch (error) {
    next(error)
  }
})

module.exports = router
