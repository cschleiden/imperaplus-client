import * as React from "react";
import { MessageFolder } from "../../../external/imperaClients";

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