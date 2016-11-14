import "./signup.scss";

import * as React from "react";

import { TextField } from "office-ui-fabric-react/lib/TextField";
import { Button, ButtonType } from "office-ui-fabric-react/lib/Button";
import { Checkbox } from "office-ui-fabric-react/lib/Checkbox";

import { Grid, GridRow, GridColumn } from "../../../components/layout";

export default (): JSX.Element => {
    return <Grid className="signup">
        <GridRow>
            <GridColumn className="ms-u-md6 ms-u-sm12 border-right">
                <p>
                    Register a new account. It is completely free.
                </p>

                <div className="form">
                    <TextField
                        label={"Username"} placeholder={"Enter username"} />
                    <TextField
                        label={"Email"} placeholder={"Enter email"} />
                    <TextField
                        label={"Password"} type="password" />
                    <TextField
                        label={"Password (repeat)"} type="password" />
                    <Checkbox
                        label="I agree to the TOS" />

                    <div className="ms-u-textAlignRight">
                        <Button buttonType={ButtonType.primary}>Register</Button>
                    </div>
                </div>
            </GridColumn>
            <GridColumn className="ms-u-md6 ms-u-sm12 external">
                <p>
                    Or sign in using an existing account.
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
};