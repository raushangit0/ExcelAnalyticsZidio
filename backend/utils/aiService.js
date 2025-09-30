const axios = require('axios');

exports.generateAIInsights = async (chartData, config) => {
  if (!process.env.OPENAI_API_KEY) {
    return 'AI insights not configured';
  }

  try {
    const prompt = `Analyze this data and provide key insights:
    Chart Type: ${config.type}
    X-Axis: ${config.xAxis}
    Y-Axis: ${config.yAxis}
    Data: ${JSON.stringify(chartData)}
    
    Provide 3-5 key insights in bullet points.`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('AI Service Error:', error.message);
    return 'Unable to generate AI insights at this time';
  }
};