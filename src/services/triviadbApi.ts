import { decode } from "html-entities";
import axios from "axios";
import { nanoid } from "nanoid";

import type {
  TriviaQuestion,
  QuestionData,
  TriviaAPI,
} from "../types/trivia-db";

const SESSION_TOKEN_KEY = "trivia_session_token";

const getStoredToken = (): string | null => {
  return localStorage.getItem(SESSION_TOKEN_KEY);
};

const saveToken = (token: string) => {
  localStorage.setItem(SESSION_TOKEN_KEY, token);
};

const clearToken = () => {
  localStorage.removeItem(SESSION_TOKEN_KEY);
};

//* ====== Get new session token ======
const getNewSessionToken = async (): Promise<string> => {
  try {
    const response = await axios.get(
      "https://opentdb.com/api_token.php?command=request",
    );
    const token = response.data.token;
    saveToken(token);
    return token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Failed to get token (Axios):",
        error.response?.status,
        error.message,
      );
    } else if (error instanceof Error) {
      console.error("Failed to get token (Error):", error.message);
    } else {
      console.error("Failed to get token (Unknown):", error);
    }
    throw error;
  }
};

//* ====== Fetch trivia data from API ======
const fetchTriviaData = async (
  amount: string,
  category: string,
  difficulty: "easy" | "medium" | "hard" | "Any",
): Promise<TriviaQuestion[]> => {
  let token = getStoredToken();

  if (!token) {
    token = await getNewSessionToken();
  }

  const params: Record<string, string> = {
    amount,
    token,
  };

  if (category !== "Any") params.category = category;
  if (difficulty !== "Any") params.difficulty = difficulty;

  try {
    const response = await axios.get<TriviaAPI>("https://opentdb.com/api.php", {
      params,
    });

    const { response_code, results } = response.data;

    //* Token empty / expired → get new one and retry once
    //* Token not found (3) or empty (4) → get new one and retry
    if (response_code === 3 || response_code === 4) {
      console.log(`Token issue (code ${response_code}), refreshing...`);
      clearToken();
      await getNewSessionToken();
      return fetchTriviaData(amount, category, difficulty);
    }

    //* API Error
    if (response_code !== 0) {
      throw new Error(`API Error ${response_code}`);
    }

    //* Success
    return results.map(
      (questionData: QuestionData): TriviaQuestion => ({
        ...questionData,
        question: decode(questionData.question),
        correct_answer: decode(questionData.correct_answer),
        incorrect_answers: questionData.incorrect_answers.map(
          (answer: string) => decode(answer),
        ),
        category: decode(questionData.category),
        id: nanoid(),
      }),
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Trivia API request failed:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.message,
      });
    } else if (error instanceof Error) {
      console.error("Error fetching trivia data:", error.message);
    } else {
      console.error("Unknown error fetching trivia data:", error);
    }
    throw error; //* Re-throw for App.tsx to handle
  }
};

export default { fetchTriviaData };
