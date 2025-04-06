# Flash Study

A **full-stack** Flashcard application built with **Node.js + Express + SQLite** on the backend and **React + Tailwind CSS + React Router** on the frontend. This app allows you to:

- **Import** flashcards via JSON (both text-based and file-based).

- **Manage** categories and flashcards (add categories, add flashcards).

- **Start Quizzes** in two modes:

   - **Reveal Mode**: Show or hide the answer, then choose "I Don't Know" or "I Got It Right."

   - **Type-in Mode**: Type your answer manually and check correctness.

## Features

- **Two JSON Import Options**  
  - Paste JSON directly into a text area.  
  - Upload a `.json` file.
  
- **Add Categories**  
  - Create custom categories to group flashcards.

- **Add Flashcards**  
  - Add questions/answers under any existing category.

- **Two Quiz Modes**  
  - **Reveal Mode**: Reveal answer, then mark correct or skip.  
  - **Type-in Mode**: Manually enter the answer and get immediate feedback.

- **Results**  
  - Track how many answers you got right for each quiz session.

- **Multiple Pages** (using **React Router**)  
  - **Import JSON**  
  - **Manage** (Categories & Flashcards)  
  - **Quiz** (Start and run quizzes)

- **Modern UI**  
  - Uses **Tailwind CSS** for a visually appealing design.

## Tech Stack

- **Backend**  
  - **Node.js** + **Express** for the server.  
  - **SQLite** for a simple, file-based database.

- **Frontend**  
  - **React** + **React Router** for the SPA.  
  - **Axios** for HTTP requests.  
  - **Tailwind CSS** for styling.

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/swissmarley/flashstudy.git
   cd flashstudy
   ```

2.	**Setup & Run the Server**

    ```bash
    cd server
    npm install
    node index.js
    ```

    •	Runs on http://localhost:4000

	•	Creates a flashcards.db file if it doesn’t exist.


3.	**Setup & Run the Client**

    ```bash
    cd ../client
    npm install
    npm start
    ```

    •	Starts the React app on http://localhost:3000.


## Run with Docker

Execute this command for running the app in a docker container.

```bash
docker run -d \
	-p 4000:4000 \
	-p 3000:3000 \
	ghcr.io/swissmarley/flashstudy:latest
```
	


## Usage

1.	Import JSON

	•	Go to Import JSON (default route /).

	•	You can paste valid JSON into the textarea and click Import JSON (Text), or

	•	Use the file upload option to import a .json file.

	•	Example JSON structure:

    ```json
        {
            "categories": [
                {
                "categoryName": "Sample Category",
                "flashcards": [
                    { "question": "Q1?", "answer": "A1" },
                    { "question": "Q2?", "answer": "A2" }
                ]
                }
            ]
        }
    ```

2.	Manage
   
	•	Click Manage in the nav bar or go to /manage.

	•	Add Category: Enter a category name, then click Add.

	•	Add Flashcard: Choose a category, type question & answer, click Add Flashcard.

4.	Quiz

	•	Click Quiz in the nav bar or go to /quiz.

	•	Select a category.

	•	Choose how many flashcards to quiz on (5, 10, 20, or 50).

	•	Select quiz mode:

	•	Reveal: Show the answer, then mark correct or skip.

	•	Type: Type your answer and click Check.

	•	Click Start Quiz to begin.

	•	When done, the app displays how many you got right.



## Contributing

Feel free to open issues or pull requests. Contributions are welcome!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
