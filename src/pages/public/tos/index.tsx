import * as React from "react";

import { Grid, GridColumn, GridRow } from "../../../components/layout";

declare var language: string;

const tos = {
    "de": () => <div>
        <h2>Datenschutzerkl&auml;rung</h2>

        <p>
            Wir nehmen den Schutz Ihrer pers&ouml;nlichen Daten sehr ernst und halten uns strikt an die Regeln der Datenschutzgesetze. Personenbezogene Daten werden auf dieser Webseite nur im technisch notwendigen Umfang erhoben. In keinem Fall werden die erhobenen Daten verkauft oder aus anderen Gr&uuml;nden an Dritte weitergegeben.
        </p>
        <p>
            Die nachfolgende Erkl&auml;rung gibt Ihnen einen &Uuml;berblick dar&uuml;ber, wie wir diesen Schutz gew&auml;hrleisten und welche Art von Daten zu welchem Zweck erhoben werden.
        </p>

        <h4>Datenverarbeitung auf dieser Internetseite</h4>
        <p>
            Um ein faires und ausgeglichenes Spiel f&uuml;r alle Spieler zu erm&ouml;glichen, werden die Logins f&uuml;r einen Zeitraum von 24 Stunden protokolliert. Dabei werden folgende Daten gespeichert und nach Ablauf der 24 Stunden r&uuml;ckstandslos gel&ouml;scht:
        </p>
        <ol>
            <li>Benutzername</li>
            <li>Uhrzeit</li>
            <li>IP-Adresse als Hash-Wert (dies erlaubt keinerlei R&uuml;ckschl&uuml;&szlig;e auf den Besitzer der IP)</li>
        </ol>
        <p>
            Diese Daten werden innerhalb der 24 Stunden nur intern verwendet und <b>niemals</b> an Dritte weitergegeben.
        </p>

        <h4>Cookies</h4>
        <p>
            Die Internetseiten verwenden an mehreren Stellen so genannte Cookies. Sie dienen dazu, unser Angebot nutzerfreundlicher, effektiver und sicherer zu machen. Cookies sind kleine Textdateien, die auf Ihrem Rechner abgelegt werden und die Ihr Browser speichert. Die meisten der von uns verwendeten Cookies sind so genannte "Session-Cookies". Sie werden nach Ende Ihres Besuchs bzw. mit dem Ausloggen automatisch gel&ouml;scht. Cookies richten auf Ihrem Rechner keinen Schaden an und enthalten keine Viren.
        </p>
        <p>
            Da auf dieser Seite Werbung durch Google Adsense angezeigt wird, speichert Ihr Browser eventuell ein von Google Inc. oder Dritten gesendetes Cookie. Dieses Cookie kann durch Google Inc. oder Dritten ausgelesen werden. Um dieses Cookie zu l&ouml;schen oder die Cookiebehandlung generell zu ver&auml;ndern, konsultieren Sie bitte die Hilfe Ihres Browsers. In der Regel finden sich diese Einstellungen unter Extras -&gt; Einstellungen Datenschutz (Firefox) oder unter Extras -&gt; Internetoptionen -&gt; Datenschutz (Internet Explorer).
        </p>
        <p>
            Wir greifen auf Drittanbieter zur&uuml;ck, um Anzeigen zu schalten, wenn Sie unsere Webseite besuchen. Diese Unternehmen nutzen m�glicherweise Informationen �ber Besucher dieser und anderer Webseiten, damit Anzeigen zu Produkten und Diensten geschaltet werden k�nnen, die Besucher interessieren. Daten wie Name, Adresse, Telefonnummer und Emailadresse werden jedoch nicht weitergegeben. Falls Sie mehr �ber die Methoden der Drittanbieter erfahren m�chten oder wissen m�chten, welche M�glichkeiten Sie haben, damit diese Informationen nicht von diesen verwendet werden k�nnen, besuchen Sie bitte die Webseite der <a href="http://www.networkadvertising.org/">Network Advertising Initiative (NAI)</a>.
        </p>

        <h4>Auskunftsrecht</h4>
        <p>
            Sie haben jederzeit das Recht auf Auskunft &uuml;ber die bez&uuml;glich Ihrer Person gespeicherten Daten, deren Herkunft und Empf&auml;nger sowie den Zweck der Speicherung. Auskunft &uuml;ber die gespeicherten Daten k&ouml;nnen Sie per E-Mail unter <i>info@imperaonline.de</i> erhalten.
        </p>

        <h4>Weitere Informationen</h4>
        <p>
            Ihr Vertrauen ist uns wichtig. Daher m&ouml;chten wir Ihnen jederzeit Rede und Antwort bez&uuml;glich der Verarbeitung Ihrer personenbezogenen Daten stehen. Wenn Sie Fragen haben, die Ihnen diese Datenschutzerkl&auml;rung nicht beantworten konnte oder wenn Sie zu einem Punkt vertiefte Informationen w&uuml;nschen, wenden Sie sich bitte jederzeit an das Impera Team (z.B. per E-Mail an info@imperaonline.de).
        </p>

        <h2>Nutzungsbedingungen</h2>

        &sect;1 <b>Angebot</b>
        &sect;1.1 Um an Impera Online, im folgenden IO genannt, teilzunehmen, ist es notwendig den Nutzungsbedingungen zuzustimmen. Diese Nutzungsbedingungen beziehen sich auf das gesamte Angebot von Impera Online<br />
        &sect;1.1 Die Nutzung des Angebots bei IO ist kostenfrei!<br />
        <br />
        &sect;2 <b>Mitgliedschaft</b> <br />
        &sect;2.1 Beginn der Mitgliedschaft: Die Mitgliedschaft beginnt, nachdem ein Spielaccount angelegt wurde. Der Nutzer ist verpflichtet, eine g&uuml;ltige E-mail Adresse anzugeben. IO beh&auml;lt sich das Recht vor, dieses zu jeder Zeit zu &uuml;berpr&uuml;fen.<br />
        &sect;2.2 K&uuml;ndigung der Mitgliedschaft: Die Mitgliedschaft kann jederzeit durch den Nutzer in den Profileinstellungen gek&uuml;ndigt werden.<br />
        &sect;2.3 Automatische K&uuml;ndigung: Nach einer dreimonatigen Inaktivit&auml;t des Nutzers wird die Mitgliedschaft automatisch gek&uuml;ndigt.<br />
        &sect;2.4 Nutzer m&uuml;ssen das 13. Lebensjahr vollendet haben um bei IO Mitglied zu werden.<br />
        <br />
        &sect;3 <b>Datenschutz</b> <br />
        &sect;3.1 Der Betreiber beh&auml;lt sich das Recht vor, Daten der Nutzer zu speichern, um die Einhaltung der Regeln und des geltenden Rechtes zu &uuml;berwachen. Es werden IPs in Verbindung mit Nutzungszeiten, die bei der Anmeldung angegebene e-mail Adresse und die auf freiwilliger Basis vom Benutzer im Profil eingetragenen Daten gespeichert.<br />
        &sect;3.2 Die gespeicherten Nutzerdaten dienen allein der Spielorganisation und werden in keiner Weise und Form an Dritte weitergegeben.<br />
        &sect;3.3 Bei der K&uuml;ndigung der Mitgliedschaft werden alle Zugangs- und Benutzerdaten restlos gel&ouml;scht.<br />
        <br />
        &sect;4 <b>Inhalte/Verantwortlichkeit</b> <br />
        &sect;4.1 Hinsichtlich der Kommunikation zwischen den Nutzern, stellt IO nur eine Plattform zur Verf&uuml;gung, &uuml;ber die sich die Nutzer untereinander verst&auml;ndigen k&ouml;nnen. F&uuml;r den Inhalt dieser Kommunikation sind die Nutzer selbst verantwortlich. Pornographische, rassistische, beleidigende, oder gegen geltendes Recht verstossende Inhalte liegen nicht in der Verantwortung des Betreibers. Verst&ouml;&szlig;e werden zur sofortigen Sperrung oder L&ouml;schung f&uuml;hren!<br />
        &sect;4.2 Spielernamen d&uuml;rfen weder beleidigend noch anst&ouml;&szlig;ig sein. Insbesondere politische, pornographische, rassistische oder gegen geltendes Recht versto&szlig;ende Namen f&uuml;hren zur Sperrung oder L&ouml;schung des Accounts.<br />
        &sect;4.3 Von jedem Spieler wird gutes Benehmen und Anstand erwartet.<br />
        <br />
        &sect;5 <b>Nicht genehmigte Eingriffe</b> <br />
        &sect;5.1 Der Nutzer ist nicht berechtigt, Ma&szlig;nahmen, Mechanismen oder Software in Verbindung mit IO zu verwenden, die die Funktion und den Spielablauf st&ouml;ren k&ouml;nnen. Der Nutzer darf keine Ma&szlig;nahmen ergreifen, die eine unzumutbare oder &uuml;berm&auml;&szlig;ige Belastung der technischen Kapazit&auml;ten zur Folge haben k&ouml;nnen.<br />
        &sect;5.2 Der Missbrauch der PN- und Chat-Funktion durch Spamming, Flooding, Scripting oder anderen Formen der Bel&auml;stigung anderer Spieler ist untersagt.<br />
        <br />
        &sect;6 <b>Nutzungsbeschr&auml;nkung</b> <br />
        &sect;6.1 Jeder Nutzer verpflichtet sich, nur einen Account zu nutzen. Sogenannte 'Multis' sind nicht erlaubt und k&ouml;nnen ohne Warnung gel&ouml;scht werden!<br />
        &sect;6.2 Kein Nutzer hat Anspruch auf eine Teilnahme bei IO. Der Betreiber beh&auml;lt sich das Recht vor, Spieler ohne genauere Begr&uuml;ndung vom Spiel auszuschlie&szlig;en.<br />
        &sect;6.3 Die gemeinsame Nutzung eines Accounts durch zwei oder mehr Nutzer ist nicht gestattet. Eine Ausnahme davon stellt die Urlaubsvertretung dar (siehe &sect;7).<br />
        &sect;6.4 Sperrungen k&ouml;nnen nach Ermessen des Betreibers dauerhaft oder tempor&auml;r sein.<br />
        &sect;6.5 Verboten in Einzelspielen sind: Nichtangriffspakte, Spielabsprachen und Teambildungen in denen zwei oder mehr Spieler gemeinsam die anderen Mitspieler angreifen, um diese vom Spielfeld zu nehmen, um  den Spielsieg unter sich auszumachen.<br />
        <br />
        &sect;7 <b>Urlaubsvertretung</b> <br />
        &sect;7.1 Die Laufzeit einer Urlaubsvertretung hat mindestens 1 Tag zu betragen. Die maximale Dauer einer Urlaubsvertretung betr&auml;gt vier Wochen. <br />
        &sect;7.2 Die Urlaubsvertretung ist im Forum im Bereich 'Urlaubsvertretung' vom zu vertretenden Spieler, mit Angabe von Grund und Laufzeit einzutragen und muss vom vertretenden Spieler best&auml;tigt werden. <br />
        &sect;7.3 Dem Vertreter ist es nicht gestattet, w&auml;hrend der Urlaubsvertretung mit dem zu vertretenden Account Spielen beizutreten, Spiele  zu erstellen oder &Auml;nderungen an den Einstellungen des Profils vorzunehmen. Eine Ausnahme stellt das Beitreten von Teamturnieren und der Teamliga dar, denen nach Absprache mit den Admins, beigetreten werden darf. <br />
        <br />
        &sect;8 <b>Haftung</b> <br />
        &sect;8.1 IO &uuml;bernimmt grunds&auml;tzlich keine Haftung f&uuml;r Sch&auml;den, die durch die Benutzung des Spieles entstanden sind.<br />
        <br />
        &sect;9 <b>&Auml;nderungsklausel</b> <br />
        &sect;9.1 Sollte einer dieser &sect;&sect; ung&uuml;ltig sein, wird die Wirksamkeit der anderen &sect;&sect; dadurch nicht ber&uuml;hrt. <br />
        &sect;9.2 Der Betreiber beh&auml;lt sich das Recht vor, diese Nutzungsbedingungen jederzeit zu &auml;ndern oder zu erweitern.
    </div>,

    "en": () => <div>
        <p>
            english test
        </p>
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
            </GridColumn>
        </GridRow>
    </Grid>
) as React.StatelessComponent<void>;