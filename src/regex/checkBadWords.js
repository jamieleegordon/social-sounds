import { Filter } from "bad-words";

// Function to normalize leetspeak (e.g., sh!t → shit)
const normalizeLeetspeak = (string) => {
    return string
        .replace(/1/g, "i")  
        .replace(/!/g, "i")  
        .replace(/@/g, "a")  
        .replace(/\$/g, "s") 
        .replace(/0/g, "o")  
        .replace(/3/g, "e")  
        .replace(/7/g, "t")  
        .replace(/2/g, "z"); 
};

// Function to check if the string contains profanity
export const checkBadWords = (string) => {
    const normalizedString = normalizeLeetspeak(string);
    
    const cleanString = normalizedString.replace(/[^a-zA-Z]/g, ""); // Remove special characters, keep letters
    const filter = new Filter();

    
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

// Function to replace bad words with "####"
export const censorBadWords = (string) => {
    const filter = new Filter();
    const normalizedString = normalizeLeetspeak(string);

    // Split by word so we can check and replace individually
    const words = normalizedString.split(/\b/); // \b keeps punctuation outside words

    const censoredWords = words.map((word) => {
        // Clean the word of non-alphabetic characters for the check
        const cleanWord = word.replace(/[^a-zA-Z]/g, "");

        if (filter.isProfane(cleanWord)) {
            // Replace the whole word with `####` (length-independent)
            return "####";
        }
        return word; // Leave non-profane words untouched
    });

    return censoredWords.join("");
};

