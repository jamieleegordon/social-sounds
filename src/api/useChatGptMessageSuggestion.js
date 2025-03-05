import axios from 'axios';

const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const API_URL = 'https://api.openai.com/v1/chat/completions';

const useChatGptMessageSuggestion = () => {

  const chatGptMessageSuggestion = async (text) => {
    try {
      const response = await axios.post(
        API_URL,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: "You are an AI assistant that helps users come up with friendly and conversational message suggestions for a social media app for music lovers.",
            },
            {
              role: 'user',
              content: `Suggest what to say after this message:\n\n${text}, make it music related too, as this is for a social media app for music lovers, and just return the message, don't return anything else apart from the message you are suggesting`,
            },
          ],
          max_tokens: 150,
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );

      return response.data.choices[0]?.message?.content?.trim();
    } catch (error) {
      console.error('OpenAI API error:', error.response?.data || error.message);
      
      throw error;
    } finally {
     
    }
  };

  return { chatGptMessageSuggestion };
};

export default useChatGptMessageSuggestion;
