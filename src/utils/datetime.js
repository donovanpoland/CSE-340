const DEFAULT_PROJECT_TIME_ZONE = "America/Denver";

function formatProjectDateTime(value, timeZone = DEFAULT_PROJECT_TIME_ZONE) {
  if (!value) {
    return "";
  }

  const projectDateTimeFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone,
    timeZoneName: "short",
  });

  return projectDateTimeFormatter.format(new Date(value));
}

function formatDateTimeLocalInput(value, timeZone = DEFAULT_PROJECT_TIME_ZONE) {
    if (!value) {
      return "";
    }

    const parts = new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone,
    }).formatToParts(new Date(value));

    const dateParts = Object.fromEntries(
      parts.map(({ type, value }) => [type, value])
    );

    return `${dateParts.year}-${dateParts.month}-${dateParts.day}T${dateParts.hour}:${dateParts.minute}`;
  }


export { formatProjectDateTime, formatDateTimeLocalInput };
