import * as React from "react";
import { FolderInformation, MessageFolder } from "../../../external/imperaClients";
import { ListGroup, ListGroupItem, Badge } from "react-bootstrap";
import { FolderName } from "./FolderName";

export interface IFolderListProps {
    folders: FolderInformation[];

    selectedFolder: MessageFolder;

    onFolderSelect: (folder: FolderInformation) => void;
}

export class FolderList extends React.Component<IFolderListProps, void> {
    public render() {
        const { folders } = this.props;

        return <div className="folder-list">
            <ListGroup>
                {folders && folders.map(folder => this._renderFolder(folder))}
            </ListGroup>
        </div>;
    }

    private _renderFolder(folder: FolderInformation) {
        return <ListGroupItem
            key={folder.folder}
            onClick={() => this.props.onFolderSelect(folder)}
            active={folder.folder === this.props.selectedFolder}>
            {FolderName(folder.folder)}
            <Badge>{folder.unreadCount} / {folder.count}</Badge>
        </ListGroupItem>;
    }
}