import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema({
    name: String,
    email: String,
    education: {
        degree: String,
        branch: String,
        institution: String,
        year: String
    },
    experience: {
        job_title: String,
        company: String
    },
    skills: [String],
    summary: String
});
const Resume = mongoose.model("Resume", ResumeSchema);
export default Resume;