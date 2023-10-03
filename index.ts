import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const PORT = 3000;
const TEAMS_WEBHOOK_URL = process.env.TEAMS_WEBHOOK_URL!;

app.use(bodyParser.json());

app.post("/vercel-webhook", async (req, res) => {
    console.log(req.body)
  const deployInfo = req.body;

  const message = {
    "@context": "https://schema.org/extensions",
    "@type": "MessageCard",
    themeColor: deployInfo.deployment.status === "ready" ? "0076D7" : "FF0000",
    title: "Vercel Deployment Bilgisi",
    text: `Proje: ${deployInfo.deployment.url} durumu: ${deployInfo.deployment.status}`,
  };

  try {
    await axios.post(TEAMS_WEBHOOK_URL, message);
    res.status(200).send("Bilgi başarıyla Teams'e gönderildi.");
  } catch (error) {
    console.error("Teams'e mesaj gönderilirken hata:", error);
    res.status(500).send("Bir hata oluştu.");
  }
});

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda başlatıldı.`);
});
