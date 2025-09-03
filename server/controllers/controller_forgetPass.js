const db = require('./../db/config.db');
const nodemailer = require('nodemailer');
// c'est le module qui permet d'envoyer un mail pour le reset et bien d'autre 
const crypto = require('crypto'); // C'est le une module de node et utilie pour cree le token ou clée 
//  Le joi pour après 

const forgetPassword = 