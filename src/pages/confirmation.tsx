import * as React from "react";
import { Grid } from "react-bootstrap";
import { GridColumn, GridRow } from "../components/layout";
import __ from "../i18n/i18n";
import { AppNextPage } from "../store";

const Page: AppNextPage = () => (
    <p>
        {__(
            "Your account has been successfully registered. You will receive an email with a confirmation code, please follow the instructions in there."
        )}
    </p>
);

Page.getTitle = () => __("Confirmation");

export default Page;
