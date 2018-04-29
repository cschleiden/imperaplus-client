import * as React from "react";
import Chat from "../../common/chat/chat";

export default (props): JSX.Element => {
    return (
        <div>
            {React.Children.only(props.children)}

            <Chat />
        </div>
    );
};