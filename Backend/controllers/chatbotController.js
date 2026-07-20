import axios from "axios";

const FASTAPI_URL = process.env.FASTAPI_URL || "http://localhost:8000";

export const sendMessage = async (req, res) => {
  console.log("BODY RECEIVED:", req.body);
  try {
    const { message, topic } = req.body;

    const response = await axios.post(`${FASTAPI_URL}/chat`, {
      question: message,
      subject_choice: topic,
    });

    res.status(200).json(response.data);
  } catch (err) {
    console.error("FastAPI relay error:", err.message);
    return res.status(err.response?.status || 500).json({
      error: "Failed to reach AI service",
      detail: err.response?.data || err.message,
    });
  }
};