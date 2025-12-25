
import express from "express";
import { health, createUser, buyTickets, userSammary, search } from "../controllers/users.controller.js";

const router = express.Router()

router.route('/health')
    .get(health)


router.route('/register')
    .post(createUser)

router.route('/tickets/buy')
    .post(buyTickets)

router.route('/:username/summary')
    .get(userSammary)

router.route('/search/:search')
    .get(search)


export default router