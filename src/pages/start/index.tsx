import * as React from "react";
import { connect } from "react-redux";

export const StartComponent = (props): JSX.Element => {
    return <div>
        Hello {props.userInfo && props.userInfo.userName}
    </div>;
};

export default connect(state => ({
    userInfo: state.session.data.userInfo
}))(StartComponent);