const express = require('express')
const router = express.Router()
const prisma = require('../prisma/client')
const {isAdmin} = require("../middlewares/auth")

router.get('/departments',isAdmin, async (req, res, next) => {
  try {
    const departments = await prisma.Department.findMany({}) 
    res.render('departments/index',{departments : departments, active: req.active})
  } catch (error) {
    next(error)
  }
})

router.post('/department/Close_Open',isAdmin, async (req, res, next) => {
  try {
    const id = Number(req.body.id)
    let state=req.body.state;
    if(state=="Open"){state="Close"}
    else{state="Open"}
    const flag = await prisma.Department.update({where:{id:id},data:{state:state}}) 
    return res.json({ state: state })
  } catch (error) {
    next(error)
  }
})

router.get('/departments/Show_Subjects/:id/:name',isAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const name = req.params.name
    const Subjects = await prisma.Subject.findMany({where:{departmentId:id}}) 
    res.render('departments/Show_Subjects',{Subjects : Subjects,Name:name, active: req.active})
  } catch (error) {
    next(error)
  }
})

router.get('/departments/Show_Students/:id/:name',isAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const name = req.params.name
    const Students = await prisma.User.findMany({where:{departmentId:id , isStudent:true}})
    const department =await prisma.Department.findMany({where:{id:id}});
    res.render('departments/Show_Students',{Students : Students,department:department[0],Name:name, active: req.active})
  } catch (error) {
    next(error)
  }
})

router.get('/department/Insert',isAdmin, async (req, res, next) => {
  try {
    res.render('departments/Insert_department',{active: req.active})
  } catch (error) {
    next(error)
  }
})

router.post('/department/Insert',isAdmin, async (req, res, next) => {
  try {
    const department= await prisma.department.create({
      data :{
        name:req.body.name,
        code:req.body.code,
        state:"Open"
      }
    })
    res.redirect('/departments')
  } catch (error) {
    next(error)
  }
})

router.get('/departments/Update/:id',isAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const department = await prisma.Department.findFirst({where:{id:id}}) 
    res.render('departments/Update_department',{department:department,active: req.active})
  } catch (error) {
    next(error)
  }
})

router.post('/departments/Update/:id',isAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const department = await prisma.Department.update({data:{name:req.body.name,code:req.body.code},where:{id:id}}) 
    res.redirect('/departments')
  } catch (error) {
    next(error)
  }
})

router.post('/asdasdasd',isAdmin,async()=>{
  try{

  }
  catch(error){

  }
})

module.exports = router
