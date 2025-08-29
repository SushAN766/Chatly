export const formatTime = (date) =>
  date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export const simulateAIResponse = async (message) => {
  // Simulated AI delay for fast UI testing
  await new Promise((r) => setTimeout(r, 300)); // 0.3s delay
  return `AI: Received "${message}"`;
};
