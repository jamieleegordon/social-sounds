import { Filter } from "bad-words";

// Function to normalize leetspeak (e.g., sh!t → shit)
const normalizeLeetspeak = (string) => {
    return string
        .replace(/1/g, "i")  // Replace '1' with 'i'
        .replace(/!/g, "i")  // Replace '!' with 'i'
        .replace(/@/g, "a")  // Replace '@' with 'a'
        .replace(/\$/g, "s") // Replace '$' with 's'
        .replace(/0/g, "o")  // Replace '0' with 'o'
        .replace(/3/g, "e")  // Replace '3' with 'e'
        .replace(/7/g, "t")  // Replace '7' with 't'
        .replace(/2/g, "z"); // Replace '2' with 'z' 
};

// Function to check if the string contains profanity
export const checkBadWords = (string) => {
    const normalizedString = normalizeLeetspeak(string);
    // Clean the string by removing non-alphabetic characters
    const cleanString = normalizedString.replace(/[^a-zA-Z]/g, ""); // Remove special characters, keep letters
    const filter = new Filter();

    // Check if the normalized string contains bad words
    let containsProfanity = filter.isProfane(cleanString);

    // Handle edge case where the string contains numbers (like "shit123")
    // Check if the original string has numbers and may still be considered profane
    if (!containsProfanity) {
        // This check ensures that we don't miss cases like "shit123"
        const cleanOriginal = string.replace(/[^a-zA-Z]/g, ""); // Remove numbers, keep letters
        containsProfanity = filter.isProfane(cleanOriginal);
    }

    return containsProfanity;
};