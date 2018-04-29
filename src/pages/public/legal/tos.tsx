import "./privacy.scss";

import * as React from "react";
import { Grid, GridColumn, GridRow } from "../../../components/layout";

declare var language: string;

const tos = {
    "de": () => (
        <div className="tos">
            <p className="disclaimer">
                Impera ist ein nicht-kommerzielles Hobby Projekt und ist komplett kostenlos.
        </p>

            <ol>
                <li>Du musst eine g&uuml;ltige Email Adresse angeben.</li>
                <li>Du kannst deinen Account jederzeit l&ouml;schen.</li>
                <li>Wenn du dich 3 Monate lang nicht einloggst, wird dein Account automatisch gel&ouml;scht.</li>
                <li>Du musst mindestens 13 Jahre alt sein um Impera zu spielen.</li>
                <li>Jeder Spieler darf nur einen aktiven Account haben.</li>
                <li>Accounts k&ouml;nnen jederzeit ohne Angeben von Gr&uuml;nden gel&ouml;scht werden.</li>
                <li>Account Namen d&uuml;rfen nicht anst&ouml;ssig sein.</li>
                <li>Nutzer sind selbst verantwortlich f&uum;r Nachrichten die sie senden.</li>
            </ol>

            <h4>Content</h4>
            <ol>
                <li>Impera ist lediglich eine Plattform, Nutzer sind selber verantwortlich für Nachrichten die sie senden oder Kommentare die sie hinterlassen.</li>
            </ol>

            <h4>Änderungen</h4>
            <p>
                Wir behalten uns das Recht vor, diese Regeln jederzeit zu ändern oder zu ergänzen. Grundlegende Änderungen werden 30 Tage im voraus angekündigt.
            </p>

            <h4>Kontakt</h4>
            <p>
                Bei Fragen bitte kontaktiere <a href="mailto:info@imperaonline.de">uns</a>.
        </p>
        </div>
    ),

    "en": () => (
        <div className="tos">
            <p className="disclaimer">
                <b>Impera is a non-commercial hobby project and is completely free.</b>
            </p>

            <ol>
                <li>You have to enter a valid email address to play.</li>
                <li>You can delete your account at any time.</li>
                <li>If you haven't logged in for 3 months, your account will be deleted automatically.</li>
                <li>You have to be at least 13 years old to play Impera.</li>
                <li>Every player may only have on account at the same time.</li>
                <li>Accounts may be deleted without prior notice.</li>
                <li>Account names must not be offensive.</li>
            </ol>

            <h4>Content</h4>
            <ol>
                <li>Impera is only a platform, users are responsible for any messages they send or content they post.</li>
            </ol>

            <h4>Changes</h4>

            <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>

            <p>By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.</p>

            <h4>Contact Us</h4>

            <p>If you have any questions about these Terms, please contact <a href="mailto:info@imperaonline.de">us</a>.</p>
        </div>
    )
};

export default (() =>
    (
        <Grid>
            <GridRow>
                <GridColumn className="col-xs-12">
                    {tos[language]()}

                    <i>{__("Terms of service were last updated on September 9th 2017.")}</i>
                </GridColumn>
            </GridRow>
        </Grid>
    )
) as React.StatelessComponent<void>;