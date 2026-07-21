// import axios from "axios";

// const FASTAPI_URL = process.env.FASTAPI_URL || "http://localhost:8000";

// export const sendMessage = async (req, res) => {
//   console.log("BODY RECEIVED:", req.body);
//   try {
//     const { message, topic } = req.body;

//     const response = await axios.post(`${FASTAPI_URL}/chat`, {
//       question: message,
//       subject_choice: topic,
//     });

//     res.status(200).json(response.data);
//   } catch (err) {
//     console.error("FastAPI relay error:", err.message);
//     return res.status(err.response?.status || 500).json({
//       error: "Failed to reach AI service",
//       detail: err.response?.data || err.message,
//     });
//   }
// };

// import axios from "axios";

// const FASTAPI_URL = process.env.FASTAPI_URL || "http://localhost:8000";

// export const sendMessage = async (req, res) => {
//   console.log("BODY RECEIVED:", req.body, "FILE:", req.file?.originalname);
//   try {
//     const { message, topic } = req.body;

//     const payload = {
//       question: message,
//       subject_choice: topic,
//     };

//     if (req.file) {
//       payload.image_base64 = req.file.buffer.toString("base64");
//       payload.image_media_type = req.file.mimetype;
//     }

//     const response = await axios.post(`${FASTAPI_URL}/chat`, payload);

//     res.status(200).json(response.data);
//   } catch (err) {
//     console.error("FastAPI relay error:", err.message);
//     return res.status(err.response?.status || 500).json({
//       error: "Failed to reach AI service",
//       detail: err.response?.data || err.message,
//     });
//   }
// };



import axios from "axios";
import FormData from "form-data";

const FASTAPI_URL = process.env.FASTAPI_URL || "http://localhost:8000";

export const sendMessage = async (req, res) => {
  console.log("BODY RECEIVED:", req.body, "FILE:", req.file?.originalname);
  try {
    const { message, topic } = req.body;

    if (req.file) {
      const formData = new FormData();
      formData.append("file", req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });

      const response = await axios.post(`${FASTAPI_URL}/chat/image`, formData, {
        headers: formData.getHeaders(),
      });

      return res.status(200).json(response.data);
    }

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