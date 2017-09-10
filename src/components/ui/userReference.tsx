import "./userReference.scss";

import * as React from "react";
import { UserReference } from "../../external/imperaClients";

export const UserRef: React.StatelessComponent<{ userRef: UserReference }> = (props: { userRef: UserReference }): JSX.Element => {
    const { userRef } = props;

    return UserName({ userName: userRef && userRef.name });
}

export const UserName: React.StatelessComponent<{ userName: string }> = (props: { userName: string }): JSX.Element => {
    const { userName } = props;

    if (!userName) {
        return <span className="UserRef--Deleted">{__("Deleted")}</span>;
    }

    return <span className="UserRef--Default">{userName}</span>;
}