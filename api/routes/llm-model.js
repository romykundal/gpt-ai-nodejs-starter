import express from "express";
import axios from 'axios';
import dotenv from 'dotenv';
import OpenAI from "openai";
import fs from "fs";
import path from "path";


dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const Organization_API_KEY = process.env.Organization_API_KEY
const router = express.Router();

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY, // This is the default and can be omitted
});
// const openai = new OpenAI({
//   organization: Organization_API_KEY,
// });

/**
 * Name: Chat Completions API
 * method: GET
 * Description: Chat models take a list of messages as input and return a model-generated message as output.
 * Ref: https://platform.openai.com/docs/guides/text-generation/chat-completions-api?lang=node.js
 * Package: https://www.npmjs.com/package/openai
 */
router.route('/chat-completions-api').get(async (req, res, next) => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ "role": "system", "content": "You are a helpful assistant." },
      { "role": "user", "content": "Who won the world series in 2020?" },
      { "role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020." },
      { "role": "user", "content": "Where was it played?" }],
      model: "gpt-3.5-turbo",
    });

    // Return relevant information as JSON
    const jsonResponse = {
      "code": 200,
      "status": "success",
      "data": completion.choices[0]
    };
    res.json(jsonResponse);

  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    if (error) {
      res.status(500).json({ error: error });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }

  }
});

/**
 * Name: Text to speech
 * method: GET
 * Description: The Audio API provides a speech endpoint based on our TTS (text-to-speech) model.
 * Ref: https://platform.openai.com/docs/guides/text-to-speech/text-to-speech
 * Package: https://www.npmjs.com/package/openai
 */
router.route('/text-to-speech').get(async (req, res, next) => {
  try {
    const speechFile = path.resolve("./speech.mp3");
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy", // Experiment with different voices (alloy, echo, fable, onyx, nova, and shimmer)
      input: "Today is a wonderful day to build something people love!",
    });
    console.log(speechFile);
    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(speechFile, buffer);

    // Auto download file

  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    if (error) {
      res.status(500).json({ error: error });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }

  }
});

/**
 * Name: Speech to text
 * method: GET
 * Description: The Audio API provides two speech to text endpoints, transcriptions and translations, based on our state-of-the-art open source large-v2 Whisper model.
 * Term for formats: File uploads are currently limited to 25 MB and the following input file types are supported: mp3, mp4, mpeg, mpga, m4a, wav, and webm. 
 * Ref: https://platform.openai.com/docs/guides/speech-to-text/speech-to-text
 * Package: https://www.npmjs.com/package/openai
 */
router.route('/speech-to-text').post(async (req, res, next) => {
  const OPENAI_API_URL = 'https://api.openai.com/v1/engines/davinci/codex/completions'; // Update with the correct OpenAI API endpoint

  let audioData = req.file.buffer;
  try {
    const response = await axios.post(OPENAI_API_URL, {
      prompt: audioData,
      max_tokens: 500, // Adjust as needed
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
    });

    const transcript = response.data.choices[0].text.trim();

    // Return relevant information as JSON
    const jsonResponse = {
      "code": 200,
      "status": "success",
      "data": transcript
    };
    res.json(jsonResponse);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: 'Failed to convert speech to text' });

  }

});



export default router;