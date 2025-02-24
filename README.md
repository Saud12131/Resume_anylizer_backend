Resume Analysis API

Overview

This API allows users to analyze and manage resumes by extracting text from PDFs and converting it into structured JSON data using the Google Gemini API. It includes authentication middleware and follows RESTful principles.

Features

Extract Text from PDFs: Uses pdf-extract-js to extract text from PDF resumes.

Enrich Resume Data: Converts extracted text into structured JSON using Google Gemini API.

Resume Management: Store, retrieve, search, and delete resumes.

Authentication: Uses JWT for secure access.

Technologies Used

Node.js with Express.js for the backend

MongoDB (Cloud version) for storing resumes

Google Gemini API for text-to-JSON conversion

pdf-extract-js for extracting text from PDFs

JWT Authentication for securing API routes
