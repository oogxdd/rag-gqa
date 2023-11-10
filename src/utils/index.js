export * from "./createEmbedding";
export * from "./createQAEmbedding";
export * from "./addQAToHasura";

export function generateUniqueId() {
  const timestamp = Date.now();
  const randomPart = Math.floor(Math.random() * 1000); // Generates a random number between 0 and 999
  return `${timestamp}-${randomPart}`;
}
