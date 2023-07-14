import { customAlphabet } from "nanoid";

const letters = "abcdefghijklmnopqrstuvwxyz";
const alphabet = `${letters}${letters.toUpperCase()}0123456789`;

export const uid = customAlphabet(alphabet, 16);
