export function replaceSpacesWithPlus(church: string, address: string): string {
  const combinedAddress = church + " Church " + address;
  return combinedAddress.replace(/ /g, "+").replace("/", "");
}

export function formatTimeIfNoLetters(input: string | null): string | null {
  if (!input) {
    return null;
  }
  // Check if the input contains any alphabetic characters
  if (/[a-zA-Z]/.test(input)) {
    return input; // Return the original string if it contains letters
  }

  // Split the input into hour, minute, and second components
  const [hours, minutes] = input.split(":").map(Number);

  // Convert to 12-hour format
  let hour12 = hours % 12 || 12; // Handle 12am/12pm correctly
  const ampm = hours >= 12 ? "pm" : "am";

  // Format the time in 12-hour clock format (e.g., "9am", "12pm", "11pm")
  return `${hour12}:${minutes}${ampm}`;
}
