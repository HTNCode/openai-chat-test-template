import dotenv from "dotenv";
import OpenAI from "openai";
import readline from "readline";

dotenv.config();

// punycodeの警告が表示されてたのが邪魔だったので無効化
process.removeAllListeners("warning");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// readline インターフェースの設定
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// チャット履歴を保持する配列
const messages = [];

async function chat() {
  console.log("チャットを開始します。終了するには 'quit' と入力してください。");

  const askQuestion = async () => {
    rl.question("あなた: ", async (input) => {
      if (input.toLowerCase() === "quit") {
        rl.close();
        return;
      }

      messages.push({
        role: "user",
        content: input,
      });

      try {
        const chatCompletion = await client.chat.completions.create({
          messages: messages,
          model: "o3-mini",
        });

        const response = chatCompletion.choices[0].message.content;
        console.log("\no3-mini: " + response + "\n");

        messages.push({
          role: "assistant",
          content: response,
        });

        askQuestion();
      } catch (error) {
        console.error("エラーが発生しました:", error);
        askQuestion();
      }
    });
  };

  askQuestion();
}

chat();
