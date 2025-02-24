import { GoogleGenerativeAI } from "@google/generative-ai";
import Resume from "../model/schema.js";
import bcrypt from "bcrypt";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
import { PDFExtract } from "pdf.js-extract";
import axios from "axios";
import fs from 'fs';
// Extract Text from PDF
async function extractTextFromPDF(pdfpathOrUrl) {
  let pdfpath = pdfpathOrUrl;

  // If input is a URL, download the file first
  if (pdfpathOrUrl.startsWith("http")) {
    const response = await axios({
      url: pdfpathOrUrl,
      method: "GET",
      responseType: "arraybuffer", // Get file as binary buffer
    });

    // Save as a temporary file
    pdfpath = "./temp.pdf";
    fs.writeFileSync(pdfpath, Buffer.from(response.data));
  }


  const PDFExtracter = new PDFExtract();
  const options = {};
  const data = await PDFExtracter.extract(pdfpath, options);
  const content = data.pages.map((page) => page.content.map(item => item.str).join(" ")).join("\n\n ");
  return content;
}

// Resume Enrichment Route
export const enrichResume = async (req, res) => {
  try {
    const { url } = req.body;
    const text = await extractTextFromPDF(url);

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Extract the following information from this resume and format it as JSON:
    {
      "name": <name>,
      "email": <email>,
      "education": {
        "degree": <degree>,
        "branch": <branch>,
        "institution": <institution>,
        "year": <year>
      },
      "experience": {
        "job_title": <job_title>,
        "company": <company>,
        "start_date": <start_date>,
        "end_date": <end_date>
      },
      "skills": [<skill_1>, <skill_2>, ...],
      "summary": <write a short summary about the candidate profile>
    }

    Resume text:
    ${text}`;

    const result = await model.generateContent(prompt);

    const response = await result.response;
    let extracteddata = response.candidates[0].content.parts[0].text;

    extracteddata = extracteddata.replace(/```json|```/g, "").trim(); // Remove code block markers

    let parsedData;
    try {
      parsedData = JSON.parse(extracteddata);
    } catch (err) {
      return res.status(400).json({ error: "Invalid JSON format", details: err.message });
    }

    const resumeData = {
      name: parsedData.name,
      email: parsedData.email,
      education: {
        degree: parsedData.education.degree,
        branch: parsedData.education.specialization || "", // Some resumes may not have specialization
        institution: parsedData.education.institution,
        year: parsedData.education.year.toString(), // Ensure it's a string
      },
      experience: parsedData.experience.length > 0 ? {
        job_title: parsedData.experience[0].job_title,
        company: parsedData.experience[0].company,
      } : {},
      skills: parsedData.skills || [],
      summary: parsedData.summary,
    };

    // **Step 4: Save to MongoDB**
    const newResume = new Resume(resumeData);
    await newResume.save();

    res.status(201).json({ message: "Resume saved successfully", resume: newResume });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while processing the resume" });
  }
};

// Resume Search Route
export const searchResume = async (req, res) => {
  try {
    const { name } = req.body;
    const resumes = await Resume.find({ name: { $regex: name, $options: "i" } });
    res.status(200).json(resumes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while searching for resumes" });
  }
};
//get all resumes
export const getAllResumes = async (req, res) => {
  try {
    const resumes = await Resume.find();
    res.status(200).json(resumes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching resumes" });
  }
};

//get resume by id
export const getResumeById = async (req, res) => {
  try {
    const { id } = req.params;
    const resume = await Resume.findById(id);

    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    res.status(200).json(resume);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching the resume" });
  }
};
//delete resume by id
export const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedResume = await Resume.findByIdAndDelete(id);

    if (!deletedResume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while deleting the resume" });
  }
};
