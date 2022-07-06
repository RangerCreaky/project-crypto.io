const express=require('express');
const mongoose = require('mongoose');
const UserSchema = require('../schema/UserSchema');
const router= express.Router();

router.get('',(req,res)=>{
    res.render('users/register');
})

router.post('',async(req,res)=>
{
    const {username,email,password}=req.body;
    const user=new UserSchema({username,email});
    const registeredUser = await UserSchema.register(user, password);
    res.redirect('/signup');
})
module.exports = router;