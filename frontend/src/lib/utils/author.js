export function formatAuthorName(author) {
	if (author.name || author.surname) {
      let fullName = [author.name, author.surname].filter(Boolean).join(" ");
      if (author.alias) {
        fullName += ` (${author.alias})`;
      }
      return fullName;
    } else if (author.alias) {
      return author.alias;
    } else {
      return "";
    }
}