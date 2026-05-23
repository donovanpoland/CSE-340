const PROJECT_TIME_ZONE = "America/Denver";

const projectDateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: PROJECT_TIME_ZONE,
  timeZoneName: "short",
});

function formatProjectDateTime(value) {
  if (!value) {
    return "";
  }

  return projectDateTimeFormatter.format(new Date(value));
}

export { formatProjectDateTime };
