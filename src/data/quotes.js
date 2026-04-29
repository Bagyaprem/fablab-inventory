export const quotes = [
  "The best way to predict the future is to invent it. — Alan Kay",
  "Design is not just what it looks like and feels like. Design is how it works. — Steve Jobs",
  "Scientists study the world as it is; engineers create the world that has never been. — Theodore von Kármán",
  "Innovation distinguishes between a leader and a follower. — Steve Jobs",
  "The art of simplicity is the puzzle of complexity. — Douglas Horton",
  "Your project is a reflection of your curiosity. Keep exploring!"
];

export const getRandomQuote = () => quotes[Math.floor(Math.random() * quotes.length)];