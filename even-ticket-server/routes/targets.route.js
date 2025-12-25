
import express from "express";
import { health, headers, targets, getById, createTarget, search } from "../controllers/targets.controller.js";

const router = express.Router()

router.route('/health')
    .get(health)

router.route('/headers')
    .get(headers)

router.route('/')
    .get(targets)
    .post(createTarget)

router.route('/:id')
    .get(getById)

router.route('/search/:search')
    .get(search)


export default router