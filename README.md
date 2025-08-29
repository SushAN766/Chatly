# Chatly AI

**Chatly** is a sleek AI-powered conversation developed with **React**, styled with **Tailwind CSS**, and powered by the **Puter.js** SDK for intelligent interactions.

Available online via [Vercel](https://chatly-3xw5.vercel.app/)


##  Features


- AI chat powered by `window.puter.ai.chat`  
- Dark & Light mode toggle
- Emoji reactions for messages
- Smooth animations and scrolling
- Modern, responsive design

##  Tech Stack

- **Frontend**: React, Vite  
- **Styling**: Tailwind CSS  
- **AI Engine**: Puter.js  





##  Deployment (Vercel)

You can deploy **Chatly** for free using Vercel:

1. Push your code to GitHub.  
2. Go to [vercel.com/import](https://vercel.com/import) and import your GitHub repository.  
3. Vercel will auto-detect the **Vite/React** setup.  
4. Set the build command to `npm run build` and output directory to `dist` if not auto-detected.  
5. Click **Deploy** and your app will be live on a Vercel URL.  

**Manual Deployment:**  

```bash
npm run build
# Then upload the contents of the dist/ folder to Vercel dashboard
```





## Installation

```bash
git clone <your-repo-url>
cd chatly
npm install
# or
yarn install
npm run dev
# or
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.




##  Future Enhancements

- **Multimodal AI Model Selection**: We plan to integrate multiple AI models, allowing users to choose from options such as:

| Model Name       | Provider | Description                                             |
|-----------------|----------|---------------------------------------------------------|
| GPT-4o           | OpenAI   | Most advanced OpenAI model with multimodal capabilities |
| GPT-4o Mini      | OpenAI   | Lightweight, faster and more efficient                  |
| Gemini Flash     | Google   | Google's fast and efficient language model             |
| Mistral Large    | Mistral  | High-performance European AI model                     |
| DeepSeek Chat    | DeepSeek | Advanced reasoning and coding capabilities             |

> Note: Model selection is not yet implemented in the current version.
  

Created by **Sushanth BS**
