const DEFAULT_KEYWORDS = "community service, volunteering, local organizations";
const DEFAULT_DESC = "Find local service projects, categories, and partner organizations.";

function getMetaData(title, keywords, desc) {
  if (!keywords) {
    keywords = DEFAULT_KEYWORDS;
  }

  if (!desc) {
    desc = DEFAULT_DESC;
  }

  if (Array.isArray(keywords)) {
    keywords = keywords.join(", ");
  }

  return {
    title: title,
    keywords: keywords,
    desc: desc,
  };
}

export { getMetaData };
