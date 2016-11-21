import "./login.scss";
import * as React from "react";

import { TextField } from "office-ui-fabric-react/lib/TextField";
import { Button, ButtonType } from "office-ui-fabric-react/lib/Button";

import { Grid, GridRow, GridColumn } from "../../../components/layout";

export default class extends React.Component<{}, void> {
    constructor(props) {
        super(props);
    }

    public render() {
        return <Grid className="login">
            <GridRow>
                <GridColumn className="ms-u-md6 ms-u-sm12 border-right">
                    <p>
                        {__("Sign in using your Impera account... 2")}
                    </p>

                    <div className="form">
                        <TextField label={"Username"} />
                        <TextField label={"Password"} type="password" />

                        <div className="ms-u-textAlignRight">
                            <Button buttonType={ButtonType.primary}>Login</Button>
                        </div>
                    </div>
                </GridColumn>
                <GridColumn className="ms-u-md6 ms-u-sm12 external">
                    <p>
                        ...or with an external account.
                </p>

                    <ul>
                        <li>
                            <Button buttonType={ButtonType.primary}>Facebook</Button>
                        </li>
                        <li>
                            <Button buttonType={ButtonType.primary}>Microsoft</Button>
                        </li>
                    </ul>
                </GridColumn>
            </GridRow>

            <GridRow className="ms-u-textAlignCenter">
                Recover your password or create a new account.
        </GridRow>
        </Grid>;
    }
}