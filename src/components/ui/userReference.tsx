import * as React from "react";
import { UserReference } from "../../external/imperaClients";
import style from "./userReference.module.scss";
import __ from "../../i18n/i18n";

export const UserRef: React.StatelessComponent<{
    userRef: UserReference;
}> = (props: { userRef: UserReference }): JSX.Element => {
    const { userRef } = props;

    return UserName({ userName: userRef && userRef.name });
};

export const UserName: React.StatelessComponent<{
    userName: string;
}> = (props: { userName: string }): JSX.Element => {
    const { userName } = props;

    if (!userName) {
        return <span className={style.deleted}>{__("Deleted")}</span>;
    }

    return <span className="UserRef--Default">{userName}</span>;
};
