function capitalizeFirstLetter(value) {
  if (!value) {
    return "";
  }

  const text = String(value).trim();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function toTitleCase(value) {
  if (!value) {
    return "";
  }

  return String(value)
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export { capitalizeFirstLetter, toTitleCase };
