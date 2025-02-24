import express from "express"
import { deleteResume, enrichResume, getAllResumes, getResumeById, searchResume } from "../controllers/resume.js"
import { authenticateToken } from "../middelware/authmiddelware.js"

const router = express.Router()
//create a application using pdf url
router.post("/enrich", authenticateToken, enrichResume)
//search a application using name
router.post("/search", searchResume)
//get all applications
router.get("/getAllResumes", getAllResumes)
//get application by id
router.get("/getresumebyid/:id", getResumeById)
//delete application by id
router.delete("/deleteresumebyid/:id", deleteResume)

export default router

