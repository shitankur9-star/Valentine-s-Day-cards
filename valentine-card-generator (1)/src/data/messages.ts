export const messages = {
  Romantic: [
    "Every moment with you is a moment I treasure. Happy Valentine's Day! ❤️",
    "You make my world brighter just by being in it. Happy Valentine's Day! 💕",
    "My favorite place is wherever there is laughter, kindness, and you. ❤️",
    "Thank you for making ordinary moments feel extraordinary. Happy Valentine's Day!"
  ],
  Cute: [
    "You're my favorite notification. Happy Valentine's Day! 💌",
    "Sending you a pocketful of hearts and a whole lot of smiles! 💕",
    "Life is sweeter with someone as wonderful as you. 🍓❤️"
  ],
  Short: [
    "You are loved. Happy Valentine's Day! ❤️",
    "All my best wishes, today and always. 💕",
    "A little card for someone truly special. ✨"
  ],
  Friendship: [
    "Grateful for your friendship and all the good memories. Happy Valentine's Day! 🌸",
    "Friends like you make life brighter. Have a wonderful Valentine's Day!"
  ],
  Funny: [
    "Roses are red, violets are blue, I made this card because I'm awesome too. 😄❤️",
    "You're pretty great. Please accept this official internet-approved Valentine. 💌"
  ]
} as const;

export const allMessages = Object.values(messages).flat();