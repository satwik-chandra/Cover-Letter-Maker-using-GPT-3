const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
const jsonStringifySafe = require('json-stringify-safe');
const app = express();
const port = process.env.PORT || 3001;
//const port = process.env.PORT;

var cors = require('cors');
app.use(cors());

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);
const chat_model = "gpt-3.5-turbo";


app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  //res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// Cover letter generator api

app.get("/generate", async (req, res) => {

  //personal details
  const name = req.query.name || "";
  const email = req.query.email || "";
  const phoneNumber = req.query.phoneNumber || "";

  // Education history, Degree, Major, GPA, Graduation year
  let educationHistory = "";
  const degree = req.query.degrees ? req.query.degrees.split(",") : [];
  const university = req.query.universities ? req.query.universities.split(",") : [];
  const major = req.query.major ? req.query.major.split(",") : [];
  const gpa = req.query.gpa ? req.query.gpa.split(",") : [];
  const graduationYear = req.query.graduationYear ? req.query.graduationYear.split(",") : [];

  //past experiences
  let pastExperience = "";
  const pastRoles = req.query.pastRoles ? req.query.pastRoles.split(",") : [];
  const pastProjects = req.query.pastProjects ? req.query.pastProjects.split(",") : [];
  const pastCompanies = req.query.pastCompanies ? req.query.pastCompanies.split(",") : [];

  //Skills: Programming languages, Frameworks, Databases, Tools, etc.
  let skillsString = "";
  const skills = req.query.skills ? req.query.skills.split(",") : [];

  //expected place of employment
  const company = req.query.company || "";
  const job = req.query.job || "";
  const job_description = req.query.job_description || "";

  // map past roles and companies and experiences to a string
  if (pastCompanies.length > 0 && pastRoles.length > 0) {
    const pastExperienceArr = pastCompanies.map(
      (company, index) => `${company} as a ${pastRoles[index]}`
    );
    pastExperience = pastExperienceArr.join(", ");
  }

  if (pastProjects.length > 0) {
    pastExperience += ` Completed various projects such as ${pastProjects.join(
      ", "
    )}. `;
  }

  //map education history to a string

  if (degree.length > 0 && university.length > 0) {
    const educationArr = degree.map(
      (degree, index) => `${degree} in ${major[index]} from ${university[index]}, GPA: ${gpa[index]}, Graduated: ${graduationYear[index]}`
    );
    educationHistory = educationArr.join(", ");
  }

  //map skills to a string
  if (skills.length > 0) {
    skillsString = `Proficient in ${skills.join(", ")} `;
  }

  const system_message = "You are a cover letter writer. Your job is to recieve the profile information about the user and write a cover letter for a prospective company where the user is applying for a job. Be sure to only include and talk about the information that the user has provided. Try to find a way to connect the user's skills and past experiences to the job description.";
  const promptTextInput = `Write a cover letter for ${name} for the role of ${job} at ${company}. The job posting is: ${job_description}. ${skillsString}. ${educationHistory} ${pastExperience}Please contact me at ${email} or ${phoneNumber} if you have any further questions. The cover letter should be at least 250 words or more.`;
  const response = await openai.createChatCompletion({
    model: chat_model,
    messages: [
      {"role": "system", "content": system_message},
      {"role": "user", "content": promptTextInput},
    ],
    temperature: req.query.temperature || 0.7,
    max_tokens: req.query.max_tokens || 1900,
    top_p: req.query.top_p || 1,
    frequency_penalty: req.query.frequency_penalty || 0,
    presence_penalty: req.query.presence_penalty || 0,
  });


  res.json(jsonStringifySafe(response.data.choices[0].message.content));

});



// Cover letter editor api
app.get("/regenerate", async (req, res) => {

  //Cover letter
  const cover_letter = req.query.cover_letter || "";

  //Instructions: User suggested edits
  let feedback_instructions = "";
  const feedback = req.query.feedback ? req.query.feedback.split(",") : [];

  //map Feedback instructions to a string
  if (feedback.length > 0) {
    feedback_instructions = `The following are the edits I want you to make to this cover letter:  ${feedback.join(", ")} `;
  }

  const system_message = "You are a cover letter editor. The user will give you a cover letter with some instructions on what to change. Your job is to edit the cover letter and make the changes that the user has requested. Only do the edits that the user has requested.";
  const promptTextInput = `Here is the cover letter I want you to edit ${cover_letter} ---------- ${feedback_instructions} `;
  const response = await openai.createChatCompletion({
    model: chat_model,
    messages: [
      {"role": "system", "content": system_message},
      {"role": "user", "content": promptTextInput},
    ],
    temperature: req.query.temperature || 0.7,
    max_tokens: req.query.max_tokens || 1900,
    top_p: req.query.top_p || 1,
    frequency_penalty: req.query.frequency_penalty || 0,
    presence_penalty: req.query.presence_penalty || 0,
  });


  res.json(jsonStringifySafe(response.data.choices[0].message.content));

});



app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});

module.exports = app;
