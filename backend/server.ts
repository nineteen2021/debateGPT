import express from "express";
import { Configuration, OpenAIApi } from "openai";

require('dotenv').config()
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);



const app: express.Express = express();
const port = 8000;

app.get("/", async (req: express.Request, res: express.Response) => {
  res.send("Hello, world!");
  console.log(req.body)
})

// GETメソッドにした理由
// サイトをブックマークするときや、友だちにサイトをおすすめするときに大きなメリットがあります。
// URLにパラメータを含むので、毎回同じ結果を得ることができます。

// ex):
// http://localhost:8000/debate/?title=ペット&comparison_0=犬&cpmparison_1=猫
app.get("/debate", async (req: express.Request, res: express.Response) => {
  const title = req.query.title;
  const comparison_0 = req.query.comparison_0;
  const comparison_1 = req.query.comparison_1;
  const response = openai.createCompletion({
    model: "text-davinci-003",
    // prompt: "ペットは犬と猫どれが適しているかディベートをします。会話形式で行ってください。登場人物は犬派のAさん、猫派のBさんです。それぞれの意見を引用しながら意見を述べてください。",
    prompt: title + "は" + comparison_0 + "と" + comparison_1 + "どれが適しているかディベートをします。会話形式で行ってください。登場人物は" + comparison_0 + "派のAさん、" + comparison_1 + "派のBさんです。それぞれの意見を引用しながら意見を述べてください。",
    max_tokens: 3000,
  });
  res.send((await response).data.choices[0].text)
  // res.send("どう？" + title + comparison_0 + comparison_1)
})

app.listen(port, () => {
  console.log(`port ${port} でサーバー起動中`);
});