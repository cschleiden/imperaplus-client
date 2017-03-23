export function setDocumentTitle(title: string) {
    if (title) {
        document.title = `Impera - ${title}`;
    } else {
        document.title = "Impera";
    }
}