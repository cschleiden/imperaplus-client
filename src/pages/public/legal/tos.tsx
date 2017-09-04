import * as React from "react";

import { Grid, GridColumn, GridRow } from "../../../components/layout";

declare var language: string;

const tos = {
    "de": () => <div>
        <h3>Impera ist ein nicht-kommerzielles Hobby Projekt und ist komplett kostenlos.</h3>

        <h2>Datenschutzerklärung</h2>
        <p>
            Die Nutzung unserer Seite ist ohne eine Angabe von personenbezogenen Daten möglich. Für die Nutzung einzelner Services unserer Seite können sich hierfür abweichende Regelungen ergeben, die in diesem Falle nachstehend gesondert erläutert werden. Ihre personenbezogenen Daten (z.B. Name, Anschrift, E-Mail, Telefonnummer, u.ä.) werden von uns nur gemäß den Bestimmungen des deutschen Datenschutzrechts verarbeitet. Daten sind dann personenbezogen, wenn sie eindeutig einer bestimmten natürlichen Person zugeordnet werden können. Die rechtlichen Grundlagen des Datenschutzes finden Sie im Bundesdatenschutzgesetz (BDSG) und dem Telemediengesetz (TMG). Nachstehende Regelungen informieren Sie insoweit über die Art, den Umfang und Zweck der Erhebung, die Nutzung und die Verarbeitung von personenbezogenen Daten durch den Anbieter
        </p>
        <p><strong>Christopher Schleiden</strong></p>
        <p><strong>[Telefonnummer des Betreibers]</strong></p>
        <p><strong>info@imperaonline.de</strong></p>

        <p>Wir weisen darauf hin, dass die internetbasierte Datenübertragung Sicherheitslücken aufweist, ein lückenloser Schutz vor Zugriffen durch Dritte somit unmöglich ist.</p>

        <h4>Cookies</h4>
        <p>
            Wir verwenden auf unserer Seite sog. Cookies zum Wiedererkennen mehrfacher Nutzung unseres Angebots, durch denselben Nutzer/Internetanschlussinhaber. Cookies sind kleine Textdateien, die Ihr Internet-Browser auf Ihrem Rechner ablegt und speichert. Sie dienen dazu, unseren Internetauftritt und unsere Angebote zu optimieren. Es handelt sich dabei zumeist um sog. "Session-Cookies", die nach dem Ende Ihres Besuches wieder gelöscht werden.<br />
            Teilweise geben diese Cookies jedoch Informationen ab, um Sie automatisch wieder zu erkennen. Diese Wiedererkennung erfolgt aufgrund der in den Cookies gespeicherten IP-Adresse. Die so erlangten Informationen dienen dazu, unsere Angebote zu optimieren und Ihnen einen leichteren Zugang auf unsere Seite zu ermöglichen.<br />
            Sie können die Installation der Cookies durch eine entsprechende Einstellung Ihres Browsers verhindern; wir weisen Sie jedoch darauf hin, dass Sie in diesem Fall gegebenenfalls nicht sämtliche Funktionen unserer Website vollumfänglich nutzen können.
        </p>

        <h4>Serverdaten</h4>
        <p>
            Aus technischen Gründen werden u.a. folgende Daten, die Ihr Internet-Browser an uns bzw. an unseren Webspace-Provider übermittelt, erfasst (sogenannte Serverlogfiles): <br />
            <br />
            - Browsertyp und -version <br />
            - verwendetes Betriebssystem <br />
            - Webseite, von der aus Sie uns besuchen (Referrer URL) <br />
            - Webseite, die Sie besuchen <br />
            - Datum und Uhrzeit Ihres Zugriffs <br />
            - Ihre Internet Protokoll (IP)-Adresse. <br />
            <br />
            Diese anonymen Daten werden getrennt von Ihren eventuell angegebenen personenbezogenen Daten gespeichert und lassen so keine Rückschlüsse auf eine bestimmte Person zu. Sie werden zu statistischen Zwecken ausgewertet, um unseren Internetauftritt und unsere Angebote optimieren zu können.
        </p>

        <h4>Registrierungsfunktion</h4>
        <p>Wir bieten Ihnen auf unserer Seite die Möglichkeit, sich dort zu registrieren. Die im Zuge dieser Registrierung eingegebenen Daten, die aus der Eingabemaske des Registrierungsformular ersichtlich sind </p>
        <ul>
            <li>Benutzername</li>
            <li>Email Adresse</li>
        </ul>
        <p>werden ausschließlich für die Verwendung unseres Angebots erhoben und gespeichert. Mit Ihrer Registrierung auf unserer Seite werden wir zudem Ihre IP-Adresse und das Datum sowie die Uhrzeit Ihrer Registrierung speichern. Dies dient in dem Fall, dass ein Dritter Ihre Daten missbraucht und sich mit diesen Daten ohne Ihr Wissen auf unserer Seite registriert, als Absicherung unsererseits.&nbsp; Eine Weitergabe an Dritte erfolgt nicht. Ein Abgleich der so erhobenen Daten mit Daten, die möglicherweise durch andere Komponenten unserer Seite erhoben werden, erfolgt ebenfalls nicht.</p>

        <h3>Auskunft/Widerruf/Löschung</h3>
        <p>Sie können sich aufgrund des Bundesdatenschutzgesetzes bei Fragen zur Erhebung, Verarbeitung oder Nutzung Ihrer personenbezogenen Daten und deren Berichtigung, Sperrung, Löschung oder einem Widerruf einer erteilten Einwilligung unentgeltlich an uns wenden. Wir weisen darauf hin, dass Ihnen ein Recht auf Berichtigung falscher Daten oder Löschung personenbezogener Daten zusteht, sollte diesem Anspruch keine gesetzliche Aufbewahrungspflicht entgegenstehen.</p>
        <p>
            Basierend auf <a target="_blank" href="https://www.ratgeberrecht.eu/leistungen/muster-datenschutzerklaerung.html">Muster-Datenschutzerklärung</a> der <a target="_blank" href="https://www.ratgeberrecht.eu/">Anwaltskanzlei Weiß &amp; Partner</a>
        </p>
        <p>
            Diese Erkl&auml;rung wurde zuletzt am 7. Juli 2017 upgedated.
        </p>

        <h2>Regeln</h2>
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
    </div>,

    "en": () => <div>
        <h3>Impera is a non-commercial hobby project and is completely free.</h3>

        <h2>Priacy Policy</h2>

        <p>This Privacy Policy governs the manner in which Impera Online collects, uses, maintains and discloses information collected from users (each, a "User") of the https://www.imperaonline.de website ("Site").</p>

        <h3>Personal identification information</h3>
        <p>We may collect personal identification information from Users in a variety of ways, including, but not limited to, when Users visit our site, register on the site, and in connection with other activities, services, features or resources we make available on our Site. Users may be asked for, as appropriate, name, email address. We will collect personal identification information from Users only if they voluntarily submit such information to us. Users can always refuse to supply personally identification information, except that it may prevent them from engaging in certain Site related activities.</p>

        <h3>Non-personal identification information</h3>
        <p>We may collect non-personal identification information about Users whenever they interact with our Site. Non-personal identification information may include the browser name, the type of computer and technical information about Users means of connection to our Site, such as the operating system and the Internet service providers utilized and other similar information.</p>

        <h3>Web browser cookies</h3>
        <p>Our Site may use "cookies" to enhance User experience. User's web browser places cookies on their hard drive for record-keeping purposes and sometimes to track information about them. User may choose to set their web browser to refuse cookies, or to alert you when cookies are being sent. If they do so, note that some parts of the Site may not function properly.</p>

        <h3>How we use collected information</h3>
        <p>Impera Online may collect and use Users personal information for the following purposes:</p>

        <ul>
            <li>
                <i>To run and operate our Site</i><br />
                We may need your information display content on the Site correctly.
            </li>
            <li>
                <i>To improve our Site</i><br />
                We may use feedback you provide to improve our products and services.
            </li>
            <li>
                <i>To send periodic emails</i><br />
                We may use the email address to respond to their inquiries, questions, and/or other requests.
            </li>
        </ul>

        <h3>How we protect your information</h3>
        <p>We adopt appropriate data collection, storage and processing practices and security measures to protect against unauthorized access, alteration, disclosure or destruction of your personal information, username, password, transaction information and data stored on our Site.</p>

        <h3>Sharing your personal information</h3>
        <p>We do not sell, trade, or rent Users personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates and advertisers for the purposes outlined above. </p>

        <h3>Compliance with children's online privacy protection act</h3>
        <p>Protecting the privacy of the very young is especially important. For that reason, we never collect or maintain information at our Site from those we actually know are under 13, and no part of our website is structured to attract anyone under 13.</p>

        <h3>Changes to this privacy policy</h3>
        <p>Impera Online has the discretion to update this privacy policy at any time. When we do, we will post a notification on the main page of our Site. We encourage Users to frequently check this page for any changes to stay informed about how we are helping to protect the personal information we collect. You acknowledge and agree that it is your responsibility to review this privacy policy periodically and become aware of modifications.</p>

        <h3>Your acceptance of these terms</h3>
        <p>By using this Site, you signify your acceptance of this policy. If you do not agree to this policy, please do not use our Site. Your continued use of the Site following the posting of changes to this policy will be deemed your acceptance of those changes. This privacy policy was built <a href="http://privacypolicies.com/" target="_blank">using the generator at http://PrivacyPolicies.com</a>.</p>

        <h3>Contacting us</h3>
        <p>If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact <a href="mailto:info@imperaonline.de">us</a>.</p>

        <p>This document was last updated on July 12, 2017</p>

        <h2>Rules</h2>
        <ol>
            <li>You have to enter a valid email address to play.</li>
            <li>You can delete your account at any time.</li>
            <li>If you haven't logged in for 3 months, your account will be deleted automatically.</li>
            <li>You have to be at least 13 years old to play Impera.</li>
            <li>Every player may only have on account at the same time.</li>
            <li>Accounts may be deleted without prior notice.</li>
            <li>Account names must not be offensive.</li>
        </ol>

        <h2>Content</h2>
        <ol>
            <li>Impera is only a platform, users are responsible for any messages they send or content they post.</li>
        </ol>
    </div>
};

export default (() =>
    <Grid>
        <GridRow>
            <GridColumn className="col-xs-12">
                <h1>
                    {__("Terms of service")}
                </h1>
                {tos[language]()}


                <i>{__("This privacy policy was last updated on August 26th 2017.")}</i>
            </GridColumn>
        </GridRow>
    </Grid>
) as React.StatelessComponent<void>;