import { MessageFolder } from "../../external/imperaClients";
import __ from "../../i18n/i18n";

export const FolderName = (folder: MessageFolder): string => {
    let folderName = "";

    switch (folder) {
        case MessageFolder.Inbox:
            folderName = __("Inbox");
            break;

        case MessageFolder.Sent:
            folderName = __("Sent");
            break;
    }

    return folderName;
};
