const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config(); // يسمح بتحميل متغيرات البيئة من .env

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.HUGGINGFACE_API_KEY; // تأكد أن المفتاح متوفر

app.post("/ask", async (req, res) => {
    const { question } = req.body;

    if (!question) {
        return res.status(400).json({ error: "يرجى إدخال السؤال" });
    }

    try {
        const response = await fetch("https://api-inference.huggingface.co/models/deepset/roberta-base-squad2", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + API_KEY // ✅ تم تصحيح السطر هنا
            },
            body: JSON.stringify({
                inputs: {
                    question: question,
                    context: "هذا نموذج ذكاء اصطناعي للإجابة على الأسئلة القانونية."
                }
            })
        });

        const data = await response.json();
        res.json({ answer: data[0]?.answer || "لم أتمكن من العثور على إجابة. حاول مرة أخرى." });
    } catch (error) {
        res.status(500).json({ error: "حدث خطأ أثناء الاتصال بالخادم." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(3000);
});