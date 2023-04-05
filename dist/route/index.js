"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
exports.router = (0, express_1.Router)()
    .get('/', (req, res) => res.render("mainIndex"))
    .get('*', (req, res) => res.render("error"))
    .get('/bot', (req, res) => res.redirect("https://discord.com/oauth2/authorize?client_id=1038253512355741787&scope=bot&permissions=8"));
exports.default = exports.router;
