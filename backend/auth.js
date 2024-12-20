const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const path = require("path");
const jwt = require("jsonwebtoken");

const jwtpassword = "g1234";
const authMiddleware = (req,res,next) => {

    const auhtHeader = req.headers.authorization


    if(!auhtHeader){
        return res.status(403).json({msg: "auth missing"})
    }

    const token = auhtHeader.split(' ')[1]
    try{
    const verify = jwt.verify(token, jwtpassword)
    console.log(verify.userId)

    if(verify.userId){
        req.userId = verify.userId
        next();
    }else{
        res.status(403).json({})
    }
    
}catch(err){
    return res.status(404).send("wrong auth")

}}

module.export = {authMiddleware};