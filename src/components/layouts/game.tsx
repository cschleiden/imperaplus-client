import * as React from "react";
import Chat from "../chat/chat";

export default (props): JSX.Element => {
    return (
        <>
            {React.Children.only(props.children)}
            Hello
            <Chat />
        </>
    );
};
