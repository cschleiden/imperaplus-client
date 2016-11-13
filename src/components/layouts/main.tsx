import * as React from "react";

import "./main.scss";

export default ({ nav, content }): JSX.Element => {
    return <div className="ms-Grid layout">
        <div className="ms-Grid-row header">
            <div className="ms-Grid-col ms-u-sm12 ms-u-md5 logo">
                <img src="https://impera-dev.azurewebsites.net/assets/logo_150.png" />
            </div>
            <div className="ms-Grid-col ms-u-sm12 ms-u-md7 navigation">
                { nav }
            </div>
        </div>

        <div className="ms-Grid-row content">
            {content}
        </div>

        <div className="footer">
            2003-2016 © Christopher Schleiden and the Impera team. All Rights Reserved. <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a> | <a href="#">User Voice</a>
        </div>
    </div>;
};