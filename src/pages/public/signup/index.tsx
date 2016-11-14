import "./signup.scss";

import * as React from "react";

import { TextField } from "office-ui-fabric-react/lib/TextField";
import { Button, ButtonType } from "office-ui-fabric-react/lib/Button";
import { Checkbox } from "office-ui-fabric-react/lib/Checkbox";

import { ProgressButton } from "../../../components/ui/progressButton";

import { Grid, GridRow, GridColumn } from "../../../components/layout";

export default class X extends React.Component<{}, { isActive: boolean }> {
    constructor() {
        super();

        this.state = { isActive: false };
    }

    public render(): JSX.Element {
        return <Grid className="signup">
            <GridRow>
                <GridColumn className="ms-u-md6 ms-u-sm12 border-right">
                    <p>
                        {__("Register a new account. It is completely free.")}
                    </p>

                    <div className="form">
                        <TextField
                            label={__("Username")} placeholder={__("Enter username")} />
                        <TextField
                            label={__("Email")} placeholder={__("Enter email")} />
                        <TextField
                            label={__("Password")} placeholder={__("Enter password")} type="password" />
                        <TextField
                            label={__("Password (repeat)")} placeholder={__("Repeat password")} type="password" />
                        <Checkbox
                            label={__("I agree to the TOS")} />

                        <div className="ms-u-textAlignRight">
                            <ProgressButton buttonType={ButtonType.primary} isActive={this.state.isActive} onClick={() => this.setState({ isActive: true}, () => setTimeout(() => this.setState({isActive: false}), 1000))}>Register</ProgressButton>
                        </div>
                    </div>
                </GridColumn>
                <GridColumn className="ms-u-md6 ms-u-sm12 external">
                    <p>
                        {__("Or sign in using an existing account.")}
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
                {__("Recover your password or create a new account.")}
            </GridRow>
        </Grid>;
    }
}