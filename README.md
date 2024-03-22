# Cover-Letter-Maker-using-GPT-3
# Deployments
### Application deployment (live link accessible for both desktop and mobile)

https://coverlettergenerator2023.vercel.app/
<br />
*Note this is deployed using vercel with the exact code from the cover-letter-maker folder but with a different repo in order to be able to use the free version of vercel as a single collaborator*

___
### API deployment (connected to the live vercel link)
```diff
https://coverlettermaker.herokuapp.com/
```
<br />
*Note, this is deployed on heroku on a different repo called "coverlettermakerAPI", which contains the same code as in the Backend section of this repo. This was done to seperate the api from the deployed application, so that the vercel deployed application has access to both the coverletterGenerator and the coverLetterRe-generator API.*

# Step by Step
```diff
- 1. Open Cover-Letter-Maker-using-GPT-3 in a terminal
- 2. Navigate to the "Back-end" directory.
- 3. Run `npm update`in the command line.
- 4. Run `npm start` in the command line.
- 5. Open Cover-Letter-Maker-using-GPT-3 in a new seperate terminal.
- 6. Navigate to the "cover-letter-maker" directory.
- 7. Run `npm install` in the command line.
- 8. Run `npm start` in the command line.
- 9. Navigate to `http://localhost:3000` to see the React application.
```

***
# Run Cover letter Generator API

This API allows you to generate a cover letter from user information.

### Test the API is running correctly
```diff
- 1. Navigate to the "Back-end" directory.
- 2. Run `npm update`in the command line.
- 3. Run `npm start` in the command line.
- 4. Navigate to `http://localhost:3001`, in your browser and after the `/generate` include the following test prompt to test it:
```
PROMPT Guidelines: 
The call should include the following parameters for a satisfactory response:

1. `name` (string): The name of the applicant.
2. `email` (string): The email address of the applicant.
3. `phoneNumber` (string): The phone number of the applicant.
4. `pastRoles` (string): A comma-separated list of the applicant's past job roles.
5. `pastProjects` (string): A comma-separated list of the applicant's past projects.
6. `pastCompanies` (string): A comma-separated list of the applicant's past companies.
7. `company` (string): The name of the company the applicant is applying to.
8. `job` (string): The name of the job the applicant is applying for.
9. `job_description`:A brief description of the job the applicant is applying for.
```diff
- 10. `degree` (string): The highest degree attained by the applicant. 
- 11. `university` (string):  The name of the university the applicant attended.
- 12. `major` (string): The applicant's major field of study.
- 13. `gpa` (string): The applicant's grade point average.
- 14. `graduationYear` (string): The year the applicant graduated from university.
- 15. `skills` (string): A comma-separated list of the applicant's skills relevant to the job they are applying for
```

Example PROMPT:
``` 
http://localhost:3001/generate?name:John Doe&email:johndoe@example.com&phoneNumber:555-555-5555&pastRoles:Software Developer, Systems Analyst, Project Manager&pastProjects:Online Marketplace, Customer Relationship Management System, Financial Reporting System&pastCompanies:ABC Company, XYZ Inc., 123 Corporation&company:XYZ Corp&job:Software Engineer&jobDescription:We are looking for a skilled Software Engineer to join our team at XYZ Corp. As a Software Engineer, you will be responsible for designing, developing, and maintaining software applications. You will work collaboratively with other engineers to ensure our software products meet high-quality standards and are delivered on time. The ideal candidate will have experience in software development and a passion for staying up-to-date with the latest technologies and trends. If you are a team player with excellent problem-solving skills, we encourage you to apply for this exciting opportunity!&degree:Bachelor of Science&university: University of California,Los Angeles&major:Computer Science&gpa:3.8&graduationYear:2021&skills:Java, Python, JavaScript, React, SQL
```

The response will be posted on the screen. 
 
> It might look a bit small in text length since we are not providing a lot of extra information due to the restriction of parameters) 

> If not getting expected output, try changing model to  `"gpt-4"` For better results.

***
# Run Cover letter RE-Generator API

This API allows you to edit a cover letter based on user-suggested edits.

### Test the API is running correctly
```diff
- 1. Navigate to the "Back-end" directory.
- 2. Run `npm update`in the command line.
- 3. Run `npm start` in the command line.
- 4. Navigate to `http://localhost:3001`, in your browser and after the `/regenerate` include the following test prompt to test it:
```
Example PORMPT:
``` 
http://localhost:3001/regenerate?cover_letter=Dear Hiring Manager,

I am excited to apply for the position of Senior Software Engineer at XYZ Company. As an experienced software engineer with over 8 years of experience, I am confident in my ability to contribute to the development of innovative and high-quality software.

In my current role at ABC Company, I have been responsible for developing and implementing software solutions for a wide range of clients. My expertise in various programming languages and technologies, including Java, Python, and AWS, has enabled me to deliver effective solutions that have met and exceeded client expectations.

I am particularly excited about the opportunity to work at XYZ Company because of the company's reputation for innovation and excellence in the software industry. I am confident that my skills and experience make me an ideal candidate for the position.

Thank you for your consideration.

Sincerely,
John Adams 

&feedback=Please add a sentence that highlights your experience with developing scalable software solutions that have met specific business requirements. Also, provide more details on your experience with AWS services such as EC2, S3, and Lambda functions. Lastly, mention your experience in agile methodologies and how you have used them in your previous projects.

```
The response will be the edited cover letter.

### API details
This API uses the OpenAI GPT-3.5 model to edit the cover letter based on user-suggested edits. The API takes in two parameters: `cover_letter` and `feedback`. `cover_letter` is the cover letter to be edited and `feedback` is a comma-separated list of user-suggested edits.

The API returns the edited cover letter as a response.




# Run React Application Front-End
This application facilitates all user interaction.
```diff
- 1. Navigate to the "cover-letter-maker" directory.

- 2. Run `npm install` in the command line.

- 3. Run `npm start` in the command line.

- 4. Navigate to `http://localhost:3000`
```


# Backends
## Database used: firebase
Note : botterweck@gmail.com and mittermm@tcd.ie are invited as viewer of the project. If you have any problems accessing the firebase project or need different rights, contact gaudetb@tcd.ie 

1. Go to firebase website https://console.firebase.google.com/

2. Select the project CoverLetterSoftware

### Limitate user access in firestore using rules

**Use Firestore rules to restrict which users can read, write, or update your data.**

1. Click Firestore Database

2. Select the "Rules" tab in the Firestore panel.

3. Write rules.

4. Test the rules to ensure they work as expected.

5. Save the rules in Firestore Database.

**In our project, we are using**

```service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/covers/{document=**} {
      allow read, update, delete: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null;
    }
  }
}
```


Read, update and delete are only allowed when the uid in the request matches userID. 

The rules only allow operation in the collection named "covers". 







