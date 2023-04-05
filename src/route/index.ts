import { Router } from "express";

export const router = Router()
    .get('/', (req, res) => res.render("mainIndex"))
    .get('*', (req, res) => res.render("error"))
    .get('/bot', (req, res) => res.redirect("https://discord.com/oauth2/authorize?client_id=1038253512355741787&scope=bot&permissions=8"))

export default router;