# AI Educational Chat App (StudyBot)

This is an AI-powered educational chat app that allows users to interact with an intelligent assistant for various academic tasks. The app is designed to help students with their course modules by providing answers, summaries, flashcards, quizzes, questions, study guides, and more, based on user input and selected options.

## Features

- **Customizable Course Information**: Users can select the module, course language, and education level (e.g., undergraduate first year, second year, master's, PhD).
- **File Upload**: Users can upload PDFs of their course modules, and the app will process these documents to generate relevant study materials.
- **AI Chat Integration**: The app uses AI to respond to questions and generate content based on the selected course information and user options.
- **Interactive Study Tools**: Users can choose from a range of options such as:
  - **Summaries**: Generate concise summaries of course material.
  - **Flashcards**: Create flashcards based on the course content.
  - **Quizzes**: Generate quizzes for practice based on the material.
  - **Questions**: Generate potential exam questions for study.
  - **Study Guide**: Create a customized study guide tailored to the course.

The AI chat system leverages the user's course information and their preferences to generate responses in an interactive, engaging, and informative manner.

## Technologies Used

- React.js (with TypeScript)
- Tailwind CSS
- Fetch API (for API calls)
- Lucide React Icons
- Custom form and button components
- AI model integration (via an API to generate educational content)

## Getting Started

To get started with this project, follow the instructions below:

### Prerequisites

- **Node.js** and **npm** installed on your machine.
- An API key for the AI service used to generate content (you can integrate OpenAI or another service).

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/overwatch-coder/studybot
   cd studybot
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file at the root of the project and add your AI API key:

   ```
   VITE_OPENAI_API_KEY=your_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

The app should now be running on `http://localhost:3000`.

### Usage

1. **Select Course Information**:

   - Choose your module (e.g., "Physics", "Mathematics").
   - Select the course language (e.g., English, French).
   - Choose your education level (e.g., Undergraduate, Master's, PhD).

2. **Interact with AI**:
   - Ask questions about your course, and the AI will provide answers based on the module, language, and education level you've selected.
   - Upload PDFs to generate study materials such as flashcards, summaries, or quizzes.
3. **Choose Study Tools**:

   - Pick from various options such as generating flashcards, summaries, or quizzes. The AI will create the corresponding content for you.

4. **Chat with the Assistant**:
   - You can continue the conversation by asking more questions related to your course material.

## Example Workflow

1. The user enters the module "Physics", selects "English" as the language, and chooses "Undergraduate First Year" as the education level.
2. The user uploads a PDF of their Physics module.
3. The user asks the AI to generate a quiz or flashcards based on the uploaded PDF.
4. The AI processes the PDF and generates the requested content in an interactive format.

## NB: The Initial Prototype was made with the help of [Lovable](https://lovable.dev)
