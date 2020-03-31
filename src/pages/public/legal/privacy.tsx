import * as React from "react";
import { Grid, GridColumn, GridRow } from "../../../components/layout";
import "./privacy.scss";

// Set by page
declare var language: string;

const privacy = {
    de: () => (
        <div className="tos">
            <p className="disclaimer">
                Impera ist ein nicht-kommerzielles Hobby Projekt und ist
                komplett kostenlos.
            </p>

            <h4>
                Anbieter und verantwortliche Stelle im Sinne des
                Datenschutzgesetzes
            </h4>

            <p>
                Christopher Schleiden
                <br />
                6672 161st Ave SE Unit A<br />
                WA 98006 Bellevue
                <br />
                USA
            </p>

            <h4>Geltungsbereich</h4>

            <p>
                Nutzer erhalten mit dieser Datenschutzerklärung Information über
                die Art, den Umfang und Zweck der Erhebung und Verwendung ihrer
                Daten durch den verantwortlichen Anbieter erhoben und verwendet
                werden.
            </p>

            <p>
                Den rechtlichen Rahmen für den Datenschutz bilden das
                Bundesdatenschutzgesetz (BDSG) und das Telemediengesetz (TMG).
            </p>

            <h4>Umgang mit personenbezogenen Daten</h4>

            <p>
                Definition: Als personenbezogene Daten gelten alle
                Informationen, anhand derer eine Person eindeutig
                identifizierbar ist. Es handelt sich somit um Daten, die zu
                einer Person zurückverfolgt werden können.
            </p>

            <p>
                Zu diesen personenbezogenen Daten zählen der Vorname und der
                Name, die Telefonnummer sowie die E-Mail-Adresse. Ebenso als
                personenbezogene Daten gelten Informationen zu Hobbies,
                Mitgliedschaften und Vorlieben sowie Internetseiten, die
                aufgerufen wurden.
            </p>

            <p>
                Diese Daten werden vom Anbieter nur erhoben, genutzt und
                gegebenenfalls weitergegeben, sofern der Gesetzgeber dies
                ausdrücklich erlaubt oder aber der Nutzer in die Erhebung,
                Bearbeitung, Nutzung und Weitergabe der Daten einwilligt.
            </p>

            <h4>Registrierung auf unserer Webseite</h4>

            <p>
                Registrieren Sie sich auf unserer Webseite, um personalisierte
                Leistungen in Anspruch zu nehmen, werden personenbezogene Daten
                erhoben. Dazu zählen ein Pseudonym, sowie die E-Mail-Adresse als
                Kontakt- und Kommunikationsdaten.
            </p>

            <p>
                Die Anmeldung ermöglicht den Zugriff auf Leistungen und Inhalte,
                die nur registrierten Nutzern zur Verfügung stehen. Bei Bedarf
                haben angemeldete Nutzer die Möglichkeit, die im Rahmen der
                Registrierung genannten Daten jederzeit zu ändern oder zu
                löschen. Auf Wunsch teilen wir Ihnen selbstverständlich mit,
                welche personenbezogenen Daten erhoben und gespeichert wurden.
                Darüber hinaus berichtigen oder löschen wir die Daten auf
                Anfrage, vorausgesetzt dem Anliegen stehen keine gesetzlichen
                Aufbewahrungspflichten entgegen. Für Rückfragen sowie ihre Bitte
                um Korrektur oder Löschung der Daten nutzen Sie bitte die in
                dieser Datenschutzerklärung genannten Kontaktdaten.
            </p>

            <h4>Kommentarfunktion</h4>

            <p>
                Werden Kommentare oder sonstige Beiträge auf unserem Angebot
                verfasst und veröffentlicht, speichern wir den Nutzernamen und
                den Zeitpunkt der Erstellung. Diese Daten werden aus
                Sicherheitsgründen erhoben, da der Anbieter für rechtswidrige
                Inhalte (verbotene Propaganda, Beleidigungen u.a.) belangt
                werden kann, auch wenn sie von dritter Seite erstellt wurden. In
                einem solchen Fall dienen die Informationen dazu, die Identität
                des Verfassers zu ermitteln.
            </p>

            <h4>Cookies</h4>

            <p>
                Diese Webseite verwendet sogenannte Cookies. Das sind
                Textdateien, die vom Server aus auf Ihrem Rechner gespeichert
                werden. Sie enthalten Informationen zum Browser, zur IP-Adresse,
                dem Betriebssystem und zur Internetverbindung. Diese Daten
                werden von uns nicht an Dritte weitergegeben oder ohne ihre
                Zustimmung mit personenbezogenen Daten verknüpft.
            </p>

            <p>
                Cookies erfüllen vor allem zwei Aufgaben. Sie helfen uns, Ihnen
                die Navigation durch unser Angebot zu erleichtern, und
                ermöglichen die korrekte Darstellung der Webseite. Sie werden
                nicht dazu genutzt, Viren einzuschleusen oder Programme zu
                starten.
            </p>

            <p>
                Nutzer haben die Möglichkeit, unser Angebot auch ohne Cookies
                aufzurufen. Dazu müssen im Browser die entsprechenden
                Einstellungen geändert werden. Informieren Sie sich bitte über
                die Hilfsfunktion Ihres Browsers, wie Cookies deaktiviert
                werden. Wir weisen allerdings darauf hin, dass dadurch einige
                Funktionen dieser Webseite möglicherweise beeinträchtigt werden
                und der Nutzungskomfort eingeschränkt wird. Die Seiten
                http://www.aboutads.info/choices/ (USA) und
                http://www.youronlinechoices.com/uk/your-ad-choices/ (Europa)
                erlauben es Ihnen, Online-Anzeigen-Cookies zu verwalten.
            </p>

            <h4>Datensparsamkeit</h4>

            <p>
                Personenbezogene Daten speichern wir gemäß den Grundsätzen der
                Datenvermeidung und Datensparsamkeit nur so lange, wie es
                erforderlich ist oder vom Gesetzgeber her vorgeschrieben wird
                (gesetzliche Speicherfrist). Entfällt der Zweck der erhobenen
                Informationen oder endet die Speicherfrist, sperren oder löschen
                wir die Daten.
            </p>

            <h4>Änderung unserer Datenschutzerklärung</h4>

            <p>
                Um zu gewährleisten, dass unsere Datenschutzerklärung stets den
                aktuellen gesetzlichen Vorgaben entspricht, behalten wir uns
                jederzeit Änderungen vor. Das gilt auch für den Fall, dass die
                Datenschutzerklärung aufgrund neuer oder überarbeiteter
                Leistungen, zum Beispiel neuer Serviceleistungen, angepasst
                werden muss. Die neue Datenschutzerklärung greift dann bei Ihrem
                nächsten Besuch auf unserem Angebot.
            </p>

            <p>
                Quelle: Datenschutz-Konfigurator von{" "}
                <a href="https://www.mein-datenschutzbeauftragter.de">
                    https://www.mein-datenschutzbeauftragter.de
                </a>
            </p>

            <p>
                Diese Erkl&auml;rung wurde zuletzt am 9. September 2017
                aktualisiert.
            </p>
        </div>
    ),

    en: () => (
        <div className="tos">
            <p className="disclaimer">
                <b>
                    Impera is a non-commercial hobby project and is completely
                    free.
                </b>
            </p>

            <p>
                This Privacy Policy governs the manner in which Impera Online
                collects, uses, maintains and discloses information collected
                from users (each, a "User") of the https://www.imperaonline.de
                website ("Site").
            </p>

            <h4>Personal identification information</h4>
            <p>
                We may collect personal identification information from Users in
                a variety of ways, including, but not limited to, when Users
                visit our site, register on the site, and in connection with
                other activities, services, features or resources we make
                available on our Site. Users may be asked for, as appropriate,
                user name and email address. We will collect personal
                identification information from Users only if they voluntarily
                submit such information to us. Users can always refuse to supply
                personally identification information, except that it may
                prevent them from engaging in certain Site related activities.
            </p>

            <h4>Non-personal identification information</h4>
            <p>
                We may collect non-personal identification information about
                Users whenever they interact with our Site. Non-personal
                identification information may include the browser name, the
                type of computer and technical information about Users means of
                connection to our Site, such as the operating system and the
                Internet service providers utilized and other similar
                information.
            </p>

            <h4>Web browser cookies</h4>
            <p>
                Our Site may use "cookies" to enhance User experience. User's
                web browser places cookies on their hard drive for
                record-keeping purposes and sometimes to track information about
                them. User may choose to set their web browser to refuse
                cookies, or to alert you when cookies are being sent. If they do
                so, note that some parts of the Site may not function properly.
            </p>

            <h4>How we use collected information</h4>
            <p>
                Impera Online may collect and use Users personal information for
                the following purposes:
            </p>

            <ul>
                <li>
                    <i>To run and operate our Site</i>
                    <br />
                    We may need your information display content on the Site
                    correctly.
                </li>
                <li>
                    <i>To improve our Site</i>
                    <br />
                    We may use feedback you provide to improve our products and
                    services.
                </li>
                <li>
                    <i>To send periodic emails</i>
                    <br />
                    We may use the email address to respond to their inquiries,
                    questions, and/or other requests.
                </li>
            </ul>

            <h4>How we protect your information</h4>
            <p>
                We adopt appropriate data collection, storage and processing
                practices and security measures to protect against unauthorized
                access, alteration, disclosure or destruction of your personal
                information, username, password, transaction information and
                data stored on our Site.
            </p>

            <h4>Sharing your personal information</h4>
            <p>
                We do not sell, trade, or rent Users personal identification
                information to others. We may share generic aggregated
                demographic information not linked to any personal
                identification information regarding visitors and users with our
                business partners, trusted affiliates and advertisers for the
                purposes outlined above.{" "}
            </p>

            <h4>Compliance with children's online privacy protection act</h4>
            <p>
                Protecting the privacy of the very young is especially
                important. For that reason, we never collect or maintain
                information at our Site from those we actually know are under
                13, and no part of our website is structured to attract anyone
                under 13.
            </p>

            <h4>Changes to this privacy policy</h4>
            <p>
                Impera Online has the discretion to update this privacy policy
                at any time. When we do, we will post a notification on the main
                page of our Site. We encourage Users to frequently check this
                page for any changes to stay informed about how we are helping
                to protect the personal information we collect. You acknowledge
                and agree that it is your responsibility to review this privacy
                policy periodically and become aware of modifications.
            </p>

            <h4>Your acceptance of these terms</h4>
            <p>
                By using this Site, you signify your acceptance of this policy.
                If you do not agree to this policy, please do not use our Site.
                Your continued use of the Site following the posting of changes
                to this policy will be deemed your acceptance of those changes.
                This privacy policy was built{" "}
                <a href="http://privacypolicies.com/" target="_blank">
                    using the generator at http://PrivacyPolicies.com
                </a>
                .
            </p>

            <h4>Contacting us</h4>
            <p>
                If you have any questions about this Privacy Policy, the
                practices of this site, or your dealings with this site, please
                contact <a href="mailto:info@imperaonline.de">us</a>.
            </p>

            <p>This document was last updated on September 9th, 2017</p>
        </div>
    ),
};

export default (() => (
    <Grid>
        <GridRow>
            <GridColumn className="col-xs-12">{privacy[language]()}</GridColumn>
        </GridRow>
    </Grid>
)) as React.StatelessComponent<void>;
