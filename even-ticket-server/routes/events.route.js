import express from "express";
import { createEvent } from "../controllers/events.controller.js";

const router = express.Router()


router.route('/events')
    .post(createEvent)

export default router