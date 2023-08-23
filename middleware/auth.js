"use strict";

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");



// authenticate user, if token, verify and store payload on res.locals
function authenticateJWT(req, res, next) {
    try{
        const authHeader = req.headers && req.headers.authorization;
        if(authHeader){
            const token = authHeader.replace(/^[Bb]earer /, "").trim();
            res.locals.user = jwt.verify(token, SECRET_KEY);
        }
        return next();
    } catch(err){
        return next();
    }
};

// ensure user is logged in when required
function ensureLoggedIn(req, res, next) {
    try{
        if(!res.locals.user) throw new UnauthorizedError();
        return next();
    } catch (err) {
        return next(err);
    }
};

// ensure user has admin privilege when required
function ensureAdmin(req, res, next) {
    try{
        if(!res.locals.user || !res.locals.user.isAdmin){
            throw new UnauthorizedError();
        }
        return next();
    } catch(err){
        return next(err);
    }
};

// ensure correct store owner
function ensureCorrectStoreOwnerOrAdmin(req, res, next) {
  try {
    const owner = res.locals.user;
    if (!(owner && (owner.isAdmin || owner.ownerId === +req.params.ownerId))) {
      throw new UnauthorizedError();
    }
    return next();
  } catch (err) {
    return next(err);
  }
}

// ensure valid token and user.username is matching when required
function ensureCorrectUserOrAdmin(req, res, next) {
    try {
        const user = res.locals.user;
        if(!(user && (user.isAdmin || user.userId === +req.params.userId))){
            throw new UnauthorizedError();
        }
        return next();
    }catch (err) {
        return next(err);
    }
};

module.exports = {
    authenticateJWT,
    ensureLoggedIn,
    ensureAdmin,
    ensureCorrectUserOrAdmin,
    ensureCorrectStoreOwnerOrAdmin,
};