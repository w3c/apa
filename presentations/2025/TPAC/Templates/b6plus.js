/* b6plus.js $Revision: 1.153 $
 *
 * Script to simulate projection mode on browsers that don't support
 * media=projection or 'overflow-block: paged' (or ‘overflow-block:
 * optional-paged’, from the 2014 Media Queries draft) but do support
 * Javascript.
 *
 * Documentation and latest version:
 *
 *   https://www.w3.org/Talks/Tools/b6plus/
 *
 * Brief usage instructions:
 *
 * Add the script to a page with
 *
 *   <script src="b6plus.js" type="text/javascript"></script>
 *
 * The script assumes each slide starts with an H1 or is an element
 * with class "slide". The slide must be a direct child of the BODY.
 * If an H1 starts a slide, all elements until the next H1 are part of
 * that slide, except for those with a class of "comment", which are
 * hidden in slide mode.
 *
 * Elements with a class of "progress", "slidenum" or "numslides" are
 * treated specially. They can be used to display progress in the
 * slide show, as follows. Elements with a class of "numslides" will
 * have their content replaced by the total number of slides in
 * decimal. Elements with a class of "slidenum" will have their
 * content replaced by the number of the currently displayed slide in
 * decimal. The first slide is numbered 1. Elements with a class of
 * "progress" will get a 'width' property whose value is a percentage
 * between 0% and 100%, corresponding to the progress in the slide
 * show: if there are M slide in total and the currently displayed
 * slide is number N, the 'width' property will be N/M * 100%.
 *
 * There can be as many of these elements as desired. If they are
 * defined as children of the BODY, they will be visible all the time.
 * Otherwise their visibility depends on their parent.
 *
 * Usage:
 *
 * - Press A to toggle normal and slide mode. The script starts in
 *   normal mode.
 *
 * - Press Page-Down to go to the next slide. Press Page-Up, up arrow
 *   or left arrow to back-up one page.
 *
 * - Press Space, right arrow, down arrow or mouse button 1 to advance
 *   (incremental display or next slide)
 *
 * On touch screens, a tap with three fingers toggles slide mode, a
 * wipe right goes back one slide, and wipe left advances.
 *
 * TODO: don't do anything if media = projection
 *
 * TODO: option to allow clicking in the left third of a slide to go
 * back?
 *
 * TODO: Accessibility of the second window.
 *
 * TODO: Show an icon in the corner when sync mode is on?
 *
 * TODO: Allow a language for localized messages and clocks that is
 * different from the slides' language?
 *
 * TODO: More or other syntaxes for commands in syncSlide()? "all" or
 * "index" for "0"; "<", "previous" for "-"; ">", "next" for "+";
 * "last" for "$"...
 *
 * TODO: Also fill elements with class=slidenum in the preview window.
 *
 * TODO: In the table of contents, indicate the current slide?
 *
 * TODO: The help box and the table of contents explicitly stop any
 * automatic slide show, but it only resumes when the user
 * subsequently navigates to another slide or incremental element.
 *
 * TODO: Use a DIALOG for the warning box instead of a DIV?
 *
 * TODO: Include more ideas from "slipshow" presentations? Allow
 * incrementally displayed elements to align to the top or center of
 * the slide, rather than only the bottom?
 * https://presentation-slipshow-4b25b8.forge.apps.education.fr/
 *
 * TODO: Allow drawing on a slide in the preview window and
 * automatically copy the drawing to the second window?
 *
 * TODO: Include a (structured and/or text) editor?
 *
 * TODO: When the 2nd window closes, reset the volume of audio and
 * video in the 1st window to what it was before it was set to 0.01.
 *
 * TODO: An easy way to find out the URL of a slide when still in the
 * index mode (for sharing, for bookmarking) without having to open
 * the sldie fullscreen first. (Idea by Coralie.)
 *
 * TODO: A way to package a slide set as a single file for
 * distribution.
 *
 * TODO: Do not set the 'width' on .progress, but rely on the style
 * sheet to use the '--progress' property?
 *
 * TODO:  Currently the speaker notes are not accessible in slide
 * mode. Use the preview window for speech rather than the slide
 * window? A keypress to speak the notes (while keeping them invisible)?
 *
 * TODO: Move repository to GitHub, to get more feedback?
 *
 * Originally derived from code by Dave Raggett.
 *
 * Author: Bert Bos <bert@w3.org>
 * Created: May 23, 2005 (b5)
 * Modified: Jan 2012 (b5 -> b6)
 * Modified: Oct 2016 (added jump to ID; fixes bugs with Home/End key handling)
 * Modified: Apr 2018 (added touch events)
 * Modified: May 2018 (support 'overflow-block' from Media Queries 4)
 * Modified: Mar 2019 (support fixed aspect ratio, progress elements, b6 -> b6+)
 * Modified: Aug 2020 (add class=visited to past elts in incremental display)
 * Modified: Oct 2020 (start in slide mode if URL contains "?full")
 * Modified: Apr 2021 (disable navigation if URL contains ‘?static’)
 * Modified: May 2021 (rescale if window size changes while in slide mode)
 * Modified: Jun 2021 (only one incremental item active, as in Shower since 3.1)
 * Modified: Sep 2021 (a11y: added role=application and a live region)
 * Modified: Dec 2021 (added noclick option; set slide number in URL if no ID)
 * Modified: Dec 2021 (Added popup help tied to the "?" key)
 * Modified: Apr 2022 (Added support for a second window, tied to the "2" key)
 * Modified: Apr 2022 (forwarding of events in the second window to the first)
 * Modified: Aug 2022 (help popup appears in the 2nd window if requested there)
 * Modified: Nov 2022 (support server-sent events to sync slides)
 * Modified: Nov 2022 (added clocks; localized to German, French and Dutch)
 * Modified: Dec 2022 (protect against loading b6plus.js twice)
 * Modified: Sep 2023 (show buttons in index mode to go to slide mode and more)
 * Modified: Jan 2024 (swapped UI: 2nd window for slides, 1st for preview)
 * Modified: Dec 2024 (ability to show a table of contents)
 * Modified: Jan 2025 (data-timing attribute for automatic slide shows)
 * Modified: Feb 2025 (scroll incremental elements into view: "slipshow")
 * Modified: Feb 2025 (allow drawing on slides with the mouse)
 * Modified: Mar 2025 (sync videos in preview window, support autoplay videos)
 * Modified: Mar 2025 ("textfit" feature to reduce font size of long text)
 * Modified: Mar 2025 (fullscreen automatically tries to use external screen)
 * Modified: Mar 2025 ("autosize" feature to automatically reduce image size)
 * Modified: Apr 2025 (hide speaker notes by default in index mode)
 * Modified: Apr 2025 (Alt or Option key shows URLs of slides in index mode)
 *
 * Copyright 2005-2025 W3C, ERCIM
 * See http://www.w3.org/Consortium/Legal/copyright-software
 */

(function() {

"use strict";

/* Localized strings */
const translations = {
  "Remaining time. To change, add class 'duration=n' to body" : {
    de: "Restzeit. Um sie zu ändern, fügen Sie die Klasse 'duration=n' zu BODY hinzu",
    fr: "Temps restant. Pour le changer, ajoutez la classe 'duration=n' à BODY",
    nl: "Resterende tijd. Om de tijd te veranderen, voeg de class 'duration=N' toe aan BODY"},
  "min": {			// Abbreviation for "minutes"
    de: "Min",
    fr: "min",
    nl: "min"},
  "current time": {
    de: "aktuelle Uhrzeit",
    fr: "heure actuelle",
    nl: "huidige tijd"},
  "used": {
    de: "verbraucht",
    fr: "utilisé",
    nl: "gebruikt"},
  "remaining": {		// As in "remaining time"
    de: "Restzeit",
    fr: "restant",
    nl: "resterend"},
  "pause": {			// Label on a button to pause the clock
    de: "Pause",
    fr: "pause",
    nl: "pauze"},
  "resume": {			// Label in a button to pause the clock
    de: "fortsetzen",
    fr: "reprendre",
    nl: "hervatten"},
  "+1 min": {			// Label on a button to add 1 minute
    de: "+1 Min",
    fr: "+1 min",
    nl: "+1 min"},
  "−1 min": {			// Label on a button to shorten time by 1 minute
    de: "−1 Min",
    fr: "−1 min",
    nl: "−1 min"},
  "restart": {			// Label on a button to reset the clock
    de: "Neustart",
    fr: "réinitialiser",
    nl: "herstart"},
  "No navigation possible while sync mode is on.": {
    de: "Bei aktiviertem Sync-Modus ist keine Navigation möglich.",
    fr: "Aucune navigation possible lorsque le mode synchro est activé.",
    nl: "Geen navigatie mogelijk terwijl de synchronisatiemodus is ingeschakeld."},
  "Press S to toggle sync mode off.": {
    de: "Drücken Sie S, um den Sync-Modus auszuschalten.",
    fr: "Appuyez sur S pour désactiver le mode synchro.",
    nl: "Druk op S om de synchronisatiemodus uit te schakelen."},
  "Synchronization error.": {
    de: "Synchronisierungsfehler",
    fr: "Erreur de synchronisation.",
    nl :"Synchronisatiefout."},
  "You can try to turn synchronization back on with the S key.": {
    de: "Sie können versuchen, die Synchronisation mit der Taste S wieder einzuschalten.",
    fr: "Vous pouvez essayer de réactiver la synchronisation avec la touche S.",
    nl: "U kunt proberen de synchronisatie weer in te schakelen met de S-toets."},
  "An error occurred while trying to switch into fullscreen mode": {
    de: "Beim Wechsel in den Vollbildmodus ist ein Fehler aufgetreten",
    fr: "Une erreur s'est produite en essayant de passer en mode plein écran",
    nl: "Er is een fout opgetreden bij het overschakelen naar volledig scherm"},
  "Fullscreen mode is not possible": {
    de: "Der Vollbildmodus ist nicht möglich",
    fr: "Le mode plein écran est impossible",
    nl: "Volledig scherm is niet mogelijk"},
  "You can try again with the F or F1 key.": {
    de: "Sie können es mit der Taste F oder F1 erneut versuchen.",
    fr: "Vous pouvez réessayer avec la touche F ou F1.",
    nl: "U kunt het opnieuw proberen met de toets F of F1."},
  "Syncing turned OFF.\nPress S to turn syncing back on.": {
    de: "Synchronisierung ausgeschaltet.\nDrücken Sie S, um die Synchronisierung wieder einzuschalten.",
    fr: "Synchronisation désactivée\nAppuyez sur S pour réactiver la synchronisation,",
    nl: "Synchroniseren uitgeschakeld\nDruk op S om het synchroniseren weer in te schakelen"},
  "Syncing turned ON\nPress S to turn syncing off": {
    de: "Synchronisierung eingeschaltet\nDrücken Sie S, um die Synchronisierung auszuschalten",
    fr: "Synchronisation activée\nAppuyez sur S pour désactiver la synchronisation",
    nl: "Synchronisatie ingeschakeld\nDruk op S om synchronisatie uit te schakelen"},
  "Stopped.": {
    de: "Gestoppt.",
    fr: "Arrêté.",
    nl: "Gestopt."},
  "Mouse &amp; keyboard commands": {
    de: "Maus- und Tastaturbefehle",
    fr: "Commandes de la souris et du clavier",
    nl: "Muis- en toetsenbordopdrachten"},
  "<kbd>A</kbd>, double click, 3-finger touch": {
    de: "<kbd>A</kbd>, Doppelklick, 3-Finger-Touch",
    fr: "<kbd>A</kbd>, double clic, toucher à 3 doigts",
    nl: "<kbd>A</kbd>, dubbelklik, 3-vinger touch"},
  "enter slide mode": {
    de: "Dia-Modus einschalten",
    fr: "passer en mode diapo",
    nl: "naar de diamodus gaan"},
  "<kbd>A</kbd>, <kbd>Esc</kbd>, 3-finger touch": {
    de: "<kbd>A</kbd>, <kbd>Esc</kbd>, 3-Finger-Touch",
    fr: "<kbd>A</kbd>, <kbd>Esc</kbd>, toucher à 3 doigts",
    nl: "<kbd>A</kbd>, <kbd>Esc</kbd>, 3-vinger touch"},
  "leave slide mode": {
    de: "Dia-Modus ausschalten",
    fr: "quiter le mode diapo",
    nl: "diamodus verlaten"},
  "<kbd>space</kbd>, <kbd>&rarr;</kbd>, <kbd>&darr;</kbd>, swipe left": {
    de: "<kbd>Leertaste</kbd>, <kbd>&rarr;</kbd>, <kbd>&darr;</kbd>, links wischen",
    fr: "<kbd>espace</kbd>, <kbd>&rarr;</kbd>, <kbd>&darr;</kbd>, glisser vers la gauche",
    nl: "<kbd>spatie</kbd>, <kbd>&rarr;</kbd>, <kbd>&darr;</kbd>, veeg naar links",
  },
  "<kbd>space</kbd>, <kbd>&rarr;</kbd>, <kbd>&darr;</kbd>, click": {
    de: "<kbd>Leertaste</kbd>, <kbd>&rarr;</kbd>, <kbd>&darr;</kbd>, click",
    fr: "<kbd>espace</kbd>, <kbd>&rarr;</kbd>, <kbd>&darr;</kbd>, clic",
    nl: "<kbd>spatie</kbd>, <kbd>&rarr;</kbd>, <kbd>&darr;</kbd>, klik"},
  "next slide or incremental element": {
    de: "nächstes Dia oder inkrementelles Element",
    fr: "diapo suivante ou élément incrémentiel",
    nl: "volgende dia of incrementeel element"},
  "<kbd>PgDn</kbd>": {},
  "<kbd>PgDn</kbd>, swipe left": {
    de: "<kbd>PgDn</kbd>, links wischen",
    fr: "<kbd>PgDn</kbd>, glisser vers la gauche",
    nl: "<kbd>PgDn</kbd>, veeg naar links"},
  "next slide": {
    de: "nächstes Dia",
    fr: "diapo suivante",
    nl: "volgende dia"},
  "<kbd>PgUp</kbd>, <kbd>&larr;</kbd>, <kbd>&uarr;</kbd>, swipe right": {
    de: "<kbd>PgUp</kbd>, <kbd>&larr;</kbd>, <kbd>&uarr;</kbd>, rechts wischen",
    fr: "<kbd>PgUp</kbd>, <kbd>&larr;</kbd>, <kbd>&uarr;</kbd>, glisser vers la droite",
    nl: "<kbd>PgUp</kbd>, <kbd>&larr;</kbd>, <kbd>&uarr;</kbd>, veeg naar rechts"},
  "previous slide": {
    de: "vorheriges Dia",
    fr: "diapo précédente",
    nl: "vorige dia"},
  "<kbd>End</kbd>": {},
  "last slide": {
    de: "letztes Dia",
    fr: "dernière diapo",
    nl: "laatste dia"},
  "<kbd>Home</kbd>": {},
  "first slide": {
    de: "erstes Dia",
    fr: "première diapo",
    nl: "eerste dia"},
  "<kbd>F1</kbd>, <kbd>F</kbd>": {},
  "toggle fullscreen mode": {
    de: "Vollbildmodus umschalten",
    fr: "basculer le mode plein écran",
    nl: "volledig scherm aan/uit",
  },
  "<kbd>2</kbd>": {},
  "<kbd>C</kbd>": {},
  "show slides in 2nd window": {
    de: "abspielen in 2. Fenster",
    fr: "lire dans 2<sup>e</sup> fenêtre",
    nl: "afspelen in 2e venster"},
  "<kbd>?</kbd>": {},
  "this help": {
    de: "diese Hilfe",
    fr: "cette aide",
    nl: "deze hulp"},
  "<kbd>S</kbd>": {},
  "toggle sync mode on/off": {
    de: "Sync-Modus ein-/ausschalten",
    fr: "activer/désactiver le mode synchro",
    nl: "sync-modus aan/uit"},
  "(More information in the <a target=_parent href='https://www.w3.org/Talks/Tools/b6plus/'>b6+ manual</a>)": {
    de: "(Weitere Informationen im <a target=_parent href='https://www.w3.org/Talks/Tools/b6plus/'>b6+ Handbuch</a>)",
    fr: "(Plus d'informations dans <a target=_parent href='https://www.w3.org/Talks/Tools/b6plus/'>le manuel de b6+</a>)",
    nl: "(Meer informatie in <a target=_parent href='https://www.w3.org/Talks/Tools/b6plus/'>de b6+ handleiding</a>)"},
  "▶\uFE0E": {},
  "play slides or stop playing": {
    de: "Dias abspielen oder halten",
    fr: "lancer les diapos ou arrêter",
    nl: "dia's afspelen of stoppen"},
  "play/<wbr>stop": {
    de: "abspielen/<wbr>halten",
    fr: "lire/<wbr>arrêter",
    nl: "afspelen/<wbr>stoppen"},
  "⧉": {},
  "play in 2nd window": {
    de: "abspielen in 2. Fenster",
    fr: "lire dans 2eme fenêtre",
    nl: "afspelen in 2de venster"},
  "play/stop slides in a 2nd window": {
    de: "Dias abspielen/halten in einem zweiten Fenster",
    fr: "lancer/arrêter les diapos dans une 2eme fenêtre",
    nl: "dia's afspelen/stoppen in een 2de venster"},
  "❮": {},
  "back": {
    de: "zurück",
    fr: "précédent",
    nl: "terug"},
  "❯": {},
  "forward": {
    de: "vorwärts",
    fr: "suivant",
    nl: "vooruit"},
  "?": {},
  "help": {
    de: "Hilfe",
    fr: "aide",
    nl: "help"},
  "◑": {},
  "dark mode": {
    de: "Dunkel&shy;modus",
    fr: "mode sombre",
    nl: "donkere modus"},
  "toggle dark mode on/off": {
    de: "Dunkelmodus ein- oder ausschalten",
    fr: "activer ou désactiver le mode sombre",
    nl: "schakel de donkere modus aan of uit"},
  "notes": {
    de: "Notizen",
    fr: "notes",
    nl: "notities"},
  "(slide mode) table of contents<br>(index mode) show/hide notes": {
    de: "(Dia-modus) Inhaltsverzeichnis<br>(Indexmodus) Notizen anzeigen/ausblenden",
    fr: "(en mode diapo) table des matières<br>(en mode index) afficher/masquer les notes",
    nl: "(diamodus) inhoudsopgave<br>(index-modus) notities weergeven/verbergen"},
  "<kbd>P</kbd>, <kbd>⏯</kbd>": {},
  "pause/resume automatic slide show": {
    de: "anhalten/fortsetzen der automatischen Dias",
    fr: "pause/reprise du diapo automatique",
    nl: "pauzeer/hervat automatisch afspelen"},
  "<kbd>W</kbd>": {},
  "start/stop drawing on the slide": {
    de: "zeichnen auf dem Dia ein-/ausschalten",
    fr: "dessiner sur la diapo activer/désactiver",
    nl: "tekenen op de dia aan/uit"},
  "F and F1 only work in the window with the slides. (Browser security restriction.)": {
    de: "F und F1 funktonieren nur im Fenster mit den Dias. (Browsersicherheitsbeschränkung.)",
    fr: "F et F1 ne fonctionnent que dans la fenêtre avec les diapo. (Restriction de sécurité du navigateur.)",
    nl: "F en F1 werken alleen in het venster met de dia's. (Browser-beveiligingsbeperking.)"},
  "<kbd>Alt</kbd>, <kbd>Option</kbd>": {},
  "(index mode) show URL of slide": {
    de: "(Indexmodus) URL des Dias anzeigen",
    fr: "(en mode index) afficher l'URL de la diapo",
    nl: "(index-modus) toon URL van dia"},
  "🗊": {},
  "show/hide notes": {
    de: "Notizen anzeigen/ausblenden",
    fr: "Afficher/masquer les notes",
    nl: "Notities weergeven/verbergen"},
};

/* Logo for use on a dark background. (The border of the circle is
 * light violet.) */
const logo = '<svg viewBox="0 0 26.415 26.415" xmlns="http://www.w3.org/2000/svg"><desc>b6+</desc><circle cx="13.207" cy="13.207" fill="#98a" r="12.435" stroke="#ccd" stroke-width="1.544"/><path d="m8.242 19.168h-1.133v-12.121h1.215v4.324q.389-.595.876-.885.496-.298 1.1-.298.843 0 1.53.504.695.504 1.108 1.53.413 1.025.413 2.489 0 2.232-.934 3.448-.934 1.207-2.183 1.207-.628 0-1.133-.322-.496-.331-.86-.976zm-.017-4.457q0 1.364.248 2.042.248.678.703 1.034.455.356 1.009.356.752 0 1.331-.843.587-.852.587-2.538 0-1.728-.562-2.538-.562-.81-1.381-.81-.752 0-1.348.852-.587.843-.587 2.447z"/><g fill="#fff"><path d="m19.13 8.556-.922.124q-.066-.678-.542-.678-.31 0-.517.339-.203.339-.256 1.368.178-.256.397-.384.219-.128.484-.128.583 0 1.017.546.434.542.434 1.443 0 .959-.459 1.505-.459.546-1.137.546-.744 0-1.236-.707-.488-.711-.488-2.352 0-1.666.508-2.398.508-.732 1.306-.732.55 0 .926.376.38.372.484 1.133zm-2.154 2.534q0 .575.211.881.215.302.488.302.265 0 .438-.252.178-.252.178-.827 0-.595-.19-.868-.19-.273-.471-.273-.273 0-.463.26-.19.26-.19.777z"/><path d="m17.129 19.366v-1.575h-1.302v-1.087h1.302v-1.575h.868v1.575h1.306v1.087h-1.306v1.575z"/></g></svg>';

/* Initial inner size of the second window. */
const popupWidth = 800, popupHeight = 690;

/* A random number for the URL of the 2nd window. */
const randomnumber = Math.trunc(0x100000 * Math.random()).toString(36);

/* Global variables */
var curslide = null;
var slidemode = false;		// In slide show mode or normal mode?
var switchInProgress = false;	// True if waiting for finishToggleMode()
var incrementals = null;	// Array of incrementally displayed items
var gesture = {};		// Info about touch/pointer gesture
var numslides = 0;		// Number of slides
var stylesToLoad = 0;		// # of load events to wait for
var limit = 0;			// A time limit used by toggleMode()
var interactive = true;		// Allow navigating to a different slide?
var fullmode = false;		// Whether "?full" was in the URL
var progressElts = [];		// Elements with class=progress
var slidenumElts = [];		// Elements with class=slidenum
var numslidesElts = [];		// Elements with class=numslides
var liveregion = null;		// Element [role=region][aria-live=assertive]
var savedContent = "";		// Initial content of the liveregion
var noclick = 0;		// If != 0, mouse clicks do not advance slides
var hideMouseTime = null;	// If set, hide idle mouse pointer after N ms
var helptext = null;		// List of keyboard and mouse commands
var toctext = null;		// Table of contents
var hideMouseID = null;		// ID of timer to hide the mouse pointer
var singleClickTimer = null;	// Timeout to distinguish single & double click
var secondwindow = null;	// Optional second window for slides
var firstwindow = null;		// The window that opened this one
var syncmode = false;		// Sync mode
var syncURL = null;		// URL of sync server
var eventsource = null;		// Sync server object
var startTime = 0;		// Start time, used by displayed clocks
var pauseStartTime = 0;		// 0 = clocks not paused, > 0 = start of pause
var clockElts = null;		// Elements with class=clock
var fullclockElts = null;	// Elements with class=fullclock
var realHoursElts = null;	// Elements with wallclock time: hours
var realMinutesElts = null;	// Elements with wallclock time: minutes
var realSecondsElts = null;	// Elements with wallclock time: seconds
var usedHoursElts = null;	// Elements with used time: hours
var usedMinutesElts = null;	// Elements with used time: minutes
var usedSecondsElts = null;	// Elements with used time: seconds
var leftHoursElts = null;	// Elements with remaining time: hours
var leftMinutesElts = null;	// Elements with remaining time: minutes
var leftSecondsElts = null;	// Elements with remaining time: seconds
var clockTimer = 0;		// Interval timer for clocks
var duration = 30 * 60 * 1000;	// Default duration of a presentation 30 min
var warnTime = 5 * 60 * 1000;	// Warn 5 minutes before end of duration
var language = null;		// Language for localization
var switchFullscreen = false;	// True = toggle fullscreen but not slide mode
var hasDarkMode = false;	// Style sheet supports class=darkmode?
var incrementalsBehavior = "symmetric"; // [Experimental]
var slideTimer = null;		// Timer for automatically advancing slides
var slideTiming = 0;		// Default time to advance slides, 0 means off
var slideTimerPaused = false;	// True = do not advance slides automatically
var loopSlideShow = false;	// Whether to wrap around to the first slide
var scale = 1;			// How much to scale a slide to fill the screen
var canvas = null;		// Canvas for drawing on slides
var canvasContext = null;	// Drawing context for the canvas
var canvasX = 0;		// Most recent mouse position on the canvas...
var canvasY = 0;		// ... used for drawing lines.
var hoverOverlay = null;	// For showing the URL of a slide in index mode
var mouseX = 0, mouseY = 0;	// Last known mouse pointer location
var commentsVisible = true;	// If speaker notes are currently visible
var commentsWereVisible;	// If notes were visible when 2nd window opened
var commentsDefault = false;	// If speaker notes should start out visible
var visibleSlide;		// The last slide used in toggleComments()
var forceClocks = false;	// Update clocks even when they are paused
var clocksUpdateRequested = false; // True if a call is queued


/* _ -- return translation for text, or text, if none is available */
function _(text)
{
  return translations[text]?.[language] ?? text;
}


/* generateID -- make sure elt has a unique ID */
function generateID(elt, slide)
{
  var nextid = 0;			// For generating unique IDs

  /* This doesn't guarantee that elt has a unique ID, but only that it
   * is the first element in the document that has this ID. Which
   * should be enough to make this element scroll into view when it is
   * the target... */
  if (!elt.id) elt.id = "s" + slide.b6slidenum
  while (document.getElementById(elt.id) !== elt)
    elt.id = "s" + slide.b6slidenum + "-" + ++nextid
}


/* cloneNodeWithoutID -- deep clone a node, but not any ID attributes */
function cloneNodeWithoutID(elt)
{
  var clone, h;

  clone = elt.cloneNode(false);
  if (elt.nodeType === 1 /*Node.ELEMENT_NODE*/) {
    clone.removeAttribute("id");			// If any
    for (h = elt.firstChild; h; h = h.nextSibling)
      clone.appendChild(cloneNodeWithoutID(h));		// Recursive
  }
  return clone;
}


/* updateClocks -- update clock elements */
function updateClocks()
{
  var now, s0, m0, h0, s1, m1, h1, s2, m2, h2, used, left, factor;

  // This function is called in an animation frame, set by
  // requestClocksUpdate().

  now = new Date();

  s0 = now.getSeconds();
  m0 = now.getMinutes();
  h0 = now.getHours();

  for (const e of realHoursElts)
    e.textContent = h0.toString().padStart(2, "0");
  for (const e of realMinutesElts)
    e.textContent = m0.toString().padStart(2, "0");
  for (const e of realSecondsElts)
    e.textContent = s0.toString().padStart(2, "0");

  // Only uodate clocks if they aren't paused, or if an update is forced.
  if (pauseStartTime === 0 || forceClocks) {

    if (forceClocks) forceClocks = false; // Reset

    used = now.getTime() - startTime;
    s1 = Math.trunc(used / 1000);
    if (usedHoursElts.length != 0) { // Used hours are displayed
      h1 = Math.trunc(s1 / 60 / 60); s1 -= h1 * 60 * 60;
      m1 = Math.trunc(s1 / 60); s1 -= m1 * 60;
    } else if (usedMinutesElts.length != 0) { // No hours, but minutes are shown
      m1 = Math.trunc(s1 / 60); s1 -= m1 * 60;
    }
    for (const e of usedHoursElts)
      e.textContent = h1.toString().padStart(2, "0");
    for (const e of usedMinutesElts)
      e.textContent = m1.toString().padStart(2, "0");
    for (const e of usedSecondsElts)
      e.textContent = s1.toString().padStart(2, "0");

    left = Math.max(0, duration - used);
    s2 = Math.trunc(left / 1000);
    if (leftHoursElts.length != 0) { // Remaining hours are displayed
      h2 = Math.trunc(s2 / 60 / 60); s2 -= 60 * 60 * h2;
      m2 = Math.trunc(s2 / 60); s2 -= 60 * m2;
    } else if (leftMinutesElts.length) { // No hours, but minutes are shown
      m2 = Math.trunc(s2 / 60); s2 -= 60 * m2;
    }
    for (const e of leftHoursElts)
      e.textContent = h2.toString().padStart(2, "0");
    for (const e of leftMinutesElts)
      e.textContent = m2.toString().padStart(2, "0");
    for (const e of leftSecondsElts)
      e.textContent = s2.toString().padStart(2, "0");

    // Set a precise factor 0.0..1.0 in a CSS variable on all clock elements.
    // Set an integer percentage 00..100 in a data attribute on BODY.
    // If time left is <= warnTime, set class=time-warning on BODY.
    factor = 1 - left/duration;
    for (const e of clockElts) e.style.setProperty('--time-factor', factor);
    for (const e of fullclockElts) e.style.setProperty('--time-factor', factor);
    document.body.setAttribute("data-time-factor",
      Math.trunc(100 * factor).toString().padStart(2, "0"));
    if (left <= warnTime) document.body.classList.add("time-warning");
    else document.body.classList.remove("time-warning");
  }
}


/* requestClocksUpdate -- queue a call to updateClocks() if not already done */
function requestClocksUpdate()
{
  if (clocksUpdateRequested) return;
  clocksUpdateRequested = true;
  requestAnimationFrame(() => {clocksUpdateRequested = false; updateClocks()});
}


/* addMinute -- add 1 minute to the duration */
function addMinute(ev)
{
  duration += 60000;

  if (firstwindow)
    firstwindow.postMessage({event: "duration", v: duration});
  else if (secondwindow?.closed === false)
    secondwindow.postMessage({event: "duration", v: duration});

  forceClocks = true;
  requestClocksUpdate();		// Queue an update to the clocks

  ev.stopPropagation();
  ev.preventDefault();
}


/* subtractMinute -- subtract 1 minute from the duration */
function subtractMinute(ev)
{
  duration = Math.max(0, duration - 60000);

  if (firstwindow)
    firstwindow.postMessage({event: "duration", v: duration});
  else if (secondwindow?.closed === false)
    secondwindow.postMessage({event: "duration", v: duration});

  forceClocks = true;
  requestClocksUpdate();		// Queue an update to the clocks

  ev.stopPropagation();
  ev.preventDefault();
}


/* pauseTime -- pause or resume the clocks */
function pauseTime(ev)
{
  if (pauseStartTime) {		// We're resuming, add paused time to startTime
    startTime += Date.now() - pauseStartTime;
    pauseStartTime = 0;
    document.body.classList.remove("paused");
  } else {			// We're pausing, remember start time of pause
    pauseStartTime = Date.now();
    document.body.classList.add("paused");
  }

  forceClocks = true;
  requestClocksUpdate();		// Queue an update to the clocks

  if (firstwindow) {
    firstwindow.postMessage({event: "startTime", v: startTime});
    firstwindow.postMessage({event: "pauseStartTime", v: pauseStartTime});
  } else if (secondwindow?.closed === false) {
    secondwindow.postMessage({event: "startTime", v: startTime});
    secondwindow.postMessage({event: "pauseStartTime", v: pauseStartTime});
  }

  ev.stopPropagation();
  ev.preventDefault();
}


/* resetTime -- restart the clock */
function resetTime(ev)
{
  startTime = Date.now();

  if (firstwindow)
    firstwindow.postMessage({event: "startTime", v: startTime});
  else if (secondwindow?.closed === false)
    secondwindow.postMessage({event: "startTime", v: startTime});

  forceClocks = true;
  requestClocksUpdate();		// Queue an update to the clocks

  ev.stopPropagation();
  ev.preventDefault();
}


/* ignoreEvent -- cancel an event */
function ignoreEvent(ev)
{
  ev.stopPropagation();
  ev.preventDefault();
}


/* initClocks -- find and initialize clock elements */
function initClocks()
{
  var t;

  // Get the duration and warn time of the presentation from body.class.
  for (const c of document.body.classList) {
    if ((t = c.match(/^duration=([0-9.]+)$/))) duration = 1000 * 60 * t[1];
    if ((t = c.match(/^warn=([0-9.]+)$/))) warnTime = 1000 * 60 * t[1];
  }

  // Find and remember any clock elements. Turn the live
  // HTMLCollection into a static array for efficiency, because we
  // don't expect new clock elements to be created.
  fullclockElts = Array.from(document.getElementsByClassName("fullclock"));
  clockElts = Array.from(document.getElementsByClassName("clock"));

  // If there are elements with class=fullclock or class=clock
  // and that don't have child elements already, fill them with
  // appropriate elements to make a clock.
  for (const c of fullclockElts) {
    c.setAttribute("aria-label", "clock");
    if (!c.firstElementChild)
      c.insertAdjacentHTML("beforeend", '<i>' + _('current time') + '</i>' +
	  '<time><b class=hours-real></b>:<b class=minutes-real></b></time>' +
	  '<span><span></span></span>' +
	  '<i>' + _('used') + '</i>' +
	  '<time><b class=minutes-used></b>&#x202F;' + _('min') + '</time>' +
	  '<i>' + _('remaining') + '</i>' +
	  '<time><b class=minutes-remaining>00</b>&#x202F;' + _('min') +
	  '</time>' +
	  '<button class=timepause>' + _('pause') + '</button>' +
	  '<button class=timedec>' + _('−1 min') + '</button>' +
	  '<button class=timeinc>' + _('+1 min') + '</button>' +
	  '<button class=timereset>' + _('restart') + '</button>');
  }
  for (const c of clockElts) {
    c.setAttribute("aria-label", "clock");
    if (!c.firstElementChild)
      c.insertAdjacentHTML("beforeend",
	'<time title="' +
	  _("Remaining time. To change, add class 'duration=n' to body") +
	  '"><b class=minutes-remaining>00</b>&#x202F;min</time>' +
	  '<span><span></span></span>' +
	  '<button class=timepause><span title="' + _('resume') +
	  '">▶\uFE0E</span><span title="' + _('pause') + '">⏸\uFE0E</span></button>' +
	  '<button class=timedec title="' + _('−1 min') + '">−1</button>' +
	  '<button class=timeinc title="'  + _('+1 min') + '">+1</button>' +
	  '<button class=timereset title="' + _('restart') + '">↺</button>');
  }

  // Find all elements that will contain time.
  realHoursElts = Array.from(document.getElementsByClassName("hours-real"));
  realMinutesElts = Array.from(document.getElementsByClassName("minutes-real"));
  realSecondsElts = Array.from(document.getElementsByClassName("seconds-real"));
  usedHoursElts = Array.from(document.getElementsByClassName("hours-used"));
  usedMinutesElts = Array.from(document.getElementsByClassName("minutes-used"));
  usedSecondsElts = Array.from(document.getElementsByClassName("seconds-used"));
  leftHoursElts = Array.from(document.getElementsByClassName("hours-remaining"));
  leftMinutesElts = Array.from(document.getElementsByClassName("minutes-remaining"));
  leftSecondsElts = Array.from(document.getElementsByClassName("seconds-remaining"));

  // Find all elements that adjust the clock and install event handlers.
  for (const e of document.getElementsByClassName("timeinc")) {
    e.addEventListener("click", addMinute, true);
    e.addEventListener("dblclick", ignoreEvent, true);
  }
  for (const e of document.getElementsByClassName("timedec")) {
    e.addEventListener("click", subtractMinute, true);
    e.addEventListener("dblclick", ignoreEvent, true);
  }
  for (const e of document.getElementsByClassName("timepause")) {
    e.addEventListener("click", pauseTime, true);
    e.addEventListener("dblclick", ignoreEvent, true);
  }
  for (const e of document.getElementsByClassName("timereset")) {
    e.addEventListener("click", resetTime, true);
    e.addEventListener("dblclick", ignoreEvent, true);
  }

  // Install a timer to update the clock elements once per second, if needed.
  if (realHoursElts.length || realMinutesElts.length ||
      realSecondsElts.length || usedHoursElts.length ||
      usedMinutesElts.length || usedSecondsElts.length ||
      leftHoursElts.length || leftMinutesElts.length ||
      leftSecondsElts.length)
    clockTimer = setInterval(requestClocksUpdate, 1000, false);

  // Remember start time of presentation.
  if (clockTimer) startTime = Date.now();
}


/* initIncrementals -- find incremental elements in current slide */
function initIncrementals()
{
  var e = curslide;

  // Collect all incremental elements into array incrementals.
  //
  // The functions nextSlideOrElt() and previousSlideOrElt() maintain
  // the following invariant: If there are incrementals, there is at
  // most one of them with a class of "active". If there is an
  // "active" element, all incrementals before it, and only those,
  // have a class of "visited". If there is an "active" element,
  // incrementals[incrementals.cur] points to that element; if there
  // is not, incrementals.cur is -1.
  //
  // incrementalsBehavior is an experimental variable to evaluate
  // different behaviors when going backwards inside a slide with
  // incremental elements:
  //
  // "freeze": When you leave a slide, the incremental elements that
  // are currently displayed become frozen. When going back to that
  // slide, those elements are still displayed but can no longer be
  // removed by pressing the left arrow. This is the behavior of
  // Shower.
  //
  // "reset": Every time you enter a slide, all incremental elements
  // are in their hidden state. E.g., if you leave a slide with all
  // elements visible and then go back, all elements are hidden again.
  //
  // "symmetric": When you return to a slide, the slide is exactly as
  // you left it. Incremental elements that were displayed when you
  // left the slide are still displayed and can be hidden by pressing
  // the left arrow. This is currently the default.
  //
  // "forwardonly": When you enter a slide, all incremental elements
  // are in their hidden state (as with "reset"). In addition,
  // pressing the left arrow when some incremental elements are
  // displayed, resets all elements to their hidden state.
  //
  // Note that with all of these except "symmetric", the left arrow
  // acts very much like the PageUp key: when you go back to the
  // previous slide, every next press of the left arrow goes back one
  // slide.
  //
  incrementals = [];
  incrementals.cur = -1;
  do {
    /* Go to the next node, in document source order. */
    if (e.firstChild) {
      e = e.firstChild;
    } else {
      while (e && !e.nextSibling) e = e.parentNode;
      if (e) e = e.nextSibling;
    }
    if (!e) break;			/* End of document */
    if (e.nodeType != 1) continue;	/* Not an element */
    if (isStartOfSlide(e)) break;	/* Reached the next slide */
    if (e === liveregion) break;	/* Do not search in the liveregion */

    if (e.classList.contains("incremental") || e.classList.contains("overlay"))
      for (const c of e.children)
	if (incrementalsBehavior === "symmetric") {
	  if (c.classList.contains("active"))
	    incrementals.cur = incrementals.length; // Start at this element
	  incrementals.push(c);
	} else if (incrementalsBehavior === "reset" ||
	    incrementalsBehavior == "forwardonly") {
	  c.classList.remove("active");
	  c.classList.remove("visited");
	  incrementals.push(c);
	} else {			// "freeze"
	  if (!c.classList.contains("visited") &&
	      !c.classList.contains("active"))
	    incrementals.push(c);
	}
    if (e.classList.contains("next")) {	/* It is an incremental element */
      if (incrementalsBehavior === "symmetric") {
	if (e.classList.contains("active"))
	  incrementals.cur = incrementals.length; // Start at this element
	incrementals.push(e);
      } else if (incrementalsBehavior === "reset" ||
	  incrementalsBehavior == "forwardonly") {
	e.classList.remove("active");
	e.classList.remove("visited");
	incrementals.push(e);
      } else {				// "freeze"
	if (!e.classList.contains("visited") &&
	    !e.classList.contains("active"))
	  incrementals.push(e);
      }
    }
  } while (1);
}


/* isStartOfSlide -- check if element has class=slide, page-break or is an H1 */
function isStartOfSlide(elt)
{
  return elt.b6slidenum !== undefined || // shortcut: we already numbered it
    (elt.nodeType == 1 &&		 // it is an element
      elt.parentNode == document.body &&
      (elt.classList.contains("slide") ||
	getComputedStyle(elt).getPropertyValue('page-break-before')=='always' ||
        elt.nodeName == "H1"));
}


/* updateProgress -- update the progress bars and slide numbers, if any */
function updateProgress()
{
  var p = curslide.b6slidenum / numslides;

  /* Set the width of the progress bars */
  for (const e of progressElts) e.style.width = 100 * p + "%";

  /* Set the content of .slidenum elements to the current slide number */
  for (const e of slidenumElts) e.textContent = curslide.b6slidenum;

  /* Set a custom variable on BODY for use by style rules */
  document.body.style.setProperty('--progress', p);
}


/* initProgress -- unhide .progress, .slidenum and .numslides elements */
function initProgress()
{
  var s;

  /* Find all elements that are progress bars, unhide them. */
  if (interactive) {
    progressElts = Array.from(document.getElementsByClassName("progress"));
    for (const e of progressElts)
      if (typeof e.b6savedstyle === "string") e.style.cssText = e.b6savedstyle;
  }

  /* Find all that should contain the current slide number, unhide them. */
  slidenumElts = Array.from(document.getElementsByClassName("slidenum"));
  for (const e of slidenumElts)
    if (typeof e.b6savedstyle === "string") e.style.cssText = e.b6savedstyle;

  /* Unhide all elements that contain the # of slides. */
  for (const e of numslidesElts)
    if (typeof e.b6savedstyle === "string") e.style.cssText = e.b6savedstyle;
}


/* numberSlides -- count slides, number them, and make sure they have IDs */
function numberSlides()
{
  var s;

  // Count slides and make sure all slides have an ID.
  numslides = 0;
  for (const h of document.body.children)
    if (isStartOfSlide(h)) {
      h.b6slidenum = ++numslides;	// Save number in element
      generateID(h, h);			// If the slide has no ID, add one
      for (const v of h.querySelectorAll('VIDEO, AUDIO'))
	generateID(v, h);		// Make sure all video elts have an ID
    }

  // Set content of all elements with class=numslides to the number of slides.
  numslidesElts = Array.from(document.getElementsByClassName("numslides"));
  for (const e of numslidesElts) e.textContent = numslides;

  // Set the # of slides in a CSS counter on the BODY.
  s = window.getComputedStyle(document.body).getPropertyValue("counter-reset");
  if (s === "none") s = ""; else s += " ";
  document.body.style.setProperty('counter-reset',s + 'numslides ' + numslides);
}


/* scaleImagesIfNeeded -- maybe shrink images with class=autosize */
function scaleImagesIfNeeded(slide)
{
  var height, images, heights = [], f1, f2, f, saveHeight, saveMaxHeight;

  // Only handle slides that consist of one element.
  // TODO: Also handle other styles of markup.
  if (! slide.classList.contains('slide')) return;

  // Get all images to scale in the current slide, if any.
  images = slide.querySelectorAll('img.autosize');
  if (images.length === 0) return;

  // Get the slide's height, which presumably is the desired height.
  height = slide.getBoundingClientRect().height;

  // Save the slide's inline height and max-height properties, if
  // any, so we can restore them later. Then set them temporarily to
  // auto and none.
  saveHeight = slide.style.height;
  saveMaxHeight = slide.style.maxHeight;
  slide.style.height = 'auto';
  slide.style.maxHeight = 'none';

  // Get the height of the slide again, to see if it is bigger now.
  if (slide.getBoundingClientRect().height > height) {

    // Get the natural height of all images. Use the height of the
    // slide if the image has none.
    images.forEach((e, i) => heights[i] = e.naturalHeight || height);

    // Find a factor 0.01 < f < 1.0 to multiply the height of each
    // image by such that all slide content fits on the slide. (It may
    // not be possible to find such a height: there may be too much
    // non-image stuff on the slide already, or the author may have
    // put class=autofit on images that don't influence the slide
    // height.)
    f1 = 0.01;
    f2 = 1.0;
    while (f2 > 1.00001 * f1) {	// Until within 0.001%
      f = (f1 + f2)/2;
      images.forEach((e, i) => {
	e.style.height = (f * heights[i]) + "px"});
      if (slide.getBoundingClientRect().height > height) f2 = f; else f1 = f;
    }
  }

  // Restore the element's style sttribute.
  slide.style.height = saveHeight;
  slide.style.maxHeight = saveMaxHeight;
}


/* scaleFontIfNeeded -- if the slide has class=textfit, maybe shrink the font */
function scaleFontIfNeeded(slide)
{
  var style, height, f, f1, f2, wrapper, saveHeight, saveMaxHeight;

  // The slide only needs to be checked if it has class=textfit or if
  // the body has that class. And then only if the slide is one
  // element. TODO: Also try to handle other markup?
  if (! slide.classList.contains('slide') ||
      (! document.body.classList.contains('textfit') &&
	  ! slide.classList.contains('textfit'))) return;

  // Get the slide's height, which presumably is the desired height.
  height = slide.getBoundingClientRect().height;

  // Save the slide's inline height and max-height properties, if
  // any, so we can restore them later. Then set them temporarily to
  // auto and none.
  saveHeight = slide.style.height;
  saveMaxHeight = slide.style.maxHeight;
  slide.style.height = 'auto';
  slide.style.maxHeight = 'none';

  // Get the height of the slide again, to see if it is bigger now.
  if (slide.getBoundingClientRect().height > height) {
    // Make a wrapper for the slide's content, if we didn't already.
    // We'll then set a smaller font size on the wrapper to try and
    // reduce the height of the slide.
    wrapper = slide.firstChild;
    if (!wrapper?.b6textfitwrapper) {
      wrapper = document.createElement('div');
      wrapper.setAttribute('class', 'b6textfitwrapper');
      wrapper.style.display = 'contents'; // This DIV does not generate a box
      while (slide.firstChild) wrapper.appendChild(slide.firstChild);
      slide.appendChild(wrapper);
      wrapper.b6textfitwrapper = true;
    }

    // Find new font size between 1% and 100% of the current size.
    f1 = 0.01;
    f2 = 1.0;
    while (f2 > 1.00001 * f1) {	// Until within 0.001%
      f = (f1 + f2)/2;
      wrapper.style.fontSize = 100 * f + '%';
      if (slide.getBoundingClientRect().height > height) f2 = f; else f1 = f;
    }
    wrapper.style.setProperty('--font-scale-factor', f);
  }

  // Restore the element's style sttribute.
  slide.style.height = saveHeight;
  slide.style.maxHeight = saveMaxHeight;
}


/* textFit -- if the body or a slide has a class=textfit, make text fit */
function textFit()
{
  for (const h of document.body.children)
    if (isStartOfSlide(h)) scaleFontIfNeeded(h);
}


/* autosize -- shrink images with class=autosize if needed */
function autosize()
{
  for (const h of document.body.children)
    if (isStartOfSlide(h)) scaleImagesIfNeeded(h);
}


/* instrumentVideos -- add event handlers to all video and audio elements */
function instrumentVideos()
{
  // Stop any videos and audios that have an autoplay attribute, but
  // remember the attribute, so we can start the video/audio when
  // its slide is shown.
  for (const v of document.querySelectorAll('VIDEO, AUDIO')) {
    v.b6autoplay = v.autoplay;
    v.autoplay = false;
    v.pause();
  }

  // If a second window is open, these event handlers help to
  // synchronize the playback of videos and audios in both windows.
  // When the user starts, pauses or seeks a video in one window, a
  // message is sent to the other window to start, seek or pause the
  // video there, too. See message() for how the message is handled in
  // the receiving window.
  for (const v of document.querySelectorAll('VIDEO, AUDIO'))
    if (v.id !== "") {
      v.addEventListener('pause', ev => {
	if (ev.target.b6pausing) { // We paused because of a message
	  ev.target.b6pausing = false;
	} else {
	  firstwindow?.postMessage({event: 'pause', id: v.id}, '*');
	  secondwindow?.postMessage({event: 'pause', id: v.id}, '*');
	}
      });
      v.addEventListener('play', ev => {
	if (ev.target.b6playing) { // We started play because of a message
	  ev.target.b6playing = false;
	} else {
	  firstwindow?.postMessage({event: 'play', id: v.id}, '*');
	  secondwindow?.postMessage({event: 'play', id: v.id}, '*');
	}
      });
      v.addEventListener('seeked', ev => {
	if (ev.target.b6seeking) { // We seeked as a result of a message
	  ev.target.b6seeking = false;
	} else {
	  firstwindow?.postMessage({event: 'seeked', id: v.id,
	    v: ev.target.currentTime}, '*');
	  secondwindow?.postMessage({event: 'seeked', id: v.id,
	    v: ev.target.currentTime}, '*');
	}
      });
      v.addEventListener('volumechange', ev => {
	// We only sync muted state, not volume (which is 0 in 1st window)
	firstwindow?.postMessage({event: 'volumechange', id: ev.target.id,
	  v: ev.target.muted}, '*');
	secondwindow?.postMessage({event: 'volumechange', id: ev.target.id,
	  v: ev.target.muted}, '*');
      });
    }
}


/* hideMouse -- make the mouse pointer invisible (only in slide mode) */
function hideMouse()
{
  if (slidemode) document.body.style.cursor = 'none';
  hideMouseID = 0;		// 0 = timer has fired, cursor is hidden
}


/* hideMouseReset -- event handler for mousemove to reset the hideMouse timer */
function hideMouseReset()
{
  if (hideMouseID === 0) { // Timer has fired and hid the cursor. Unhide it.
    document.body.style.cursor = null;
    hideMouseID = null;		     // null = cursor is visible
  } else if (hideMouseID !== null) { // Timer hasn't fired yet. Remove it.
    clearTimeout(hideMouseID);
    hideMouseID = null;		     // null = cursor is visible
  }

  /* If still in slide mode, set a new timer; otherwise remove ourselves. */
  if (slidemode) hideMouseID = setTimeout(hideMouse, hideMouseTime);
  else document.removeEventListener('mousemove', hideMouseReset);
}


/* initHideMouse -- set a timeout to hide the mouse pointer when it is idle */
function initHideMouse()
{
  if (hideMouseTime === null) return;

  /* Add handler to restart the timer when the mouse moves. */
  document.addEventListener('mousemove', hideMouseReset);

  /* Remove old timer, unhide cursor if hidden, start new timer. */
  hideMouseReset();
}


/* rewindVideos -- reset any autoplaying videos on the current slide */
function rewindVideos()
{
  for (const v of curslide.querySelectorAll('VIDEO, AUDIO'))
    if (v.b6autoplay) {
      v.currentTime = 0;
      v.play();
    }
}


/* stopVideos -- stop any videos and audios on the current slide */
function stopVideos()
{
  for (const v of curslide.querySelectorAll('VIDEO, AUDIO')) v.pause();
}


/* displaySlide -- make the current slide visible */
function displaySlide()
{
  var h, url, m;

  /* curslide has class=slide, page-break-before=always or is an H1 */
  curslide.style.cssText = curslide.b6savedstyle;
  curslide.classList.add("active");		// Compatibility with Shower
  liveregion.innerHTML = "";			// Make it empty

  if (!curslide.classList.contains('slide')) {
    liveregion.appendChild(cloneNodeWithoutID(curslide));
    /* Unhide all elements until the next slide. And copy the slide to
       the live region so that it is spoken */
    for (h = curslide.nextSibling; h && ! isStartOfSlide(h); h = h.nextSibling)
      if (h !== liveregion) {
	if (h.nodeType === 1) h.style.cssText = h.b6savedstyle;
	liveregion.appendChild(cloneNodeWithoutID(h));
      }

  } else {					// class=slide
    /* Copy the contents of the slide to the live region so that it is spoken */
    for (h = curslide.firstChild; h; h = h.nextSibling)
      liveregion.appendChild(cloneNodeWithoutID(h));
  }

  updateProgress();
  initIncrementals();

  /* If there is a first window, tell it to scroll to the same slide. */
  if (firstwindow)
    firstwindow.postMessage({event: "slide", v: curslide.id}, "*");

  /* Update the URL displayed in the location bar. */
  history.replaceState({}, "", "#" + curslide.id)

  /* Remove any existing slide timer. Then, unless the automatic slide
   * show is paused, check if the slide has a data-timing attribute,
   * or failing that, use the default (from the BODY). If the result
   * is not 0, set a timeout. */
  clearTimeout(slideTimer);
  if (! slideTimerPaused &&
      (m = curslide.dataset.timing !== undefined ?
	  timeToMillisec(curslide.dataset.timing) / (incrementals.length + 1) :
	  slideTiming / (incrementals.length + 1)))
    slideTimer = setTimeout(nextSlideOrElt, m);

  /* If there are any autoplay videos or audios, start them. */
  rewindVideos();
}


/* hideSlide -- make the current slide invisible */
function hideSlide()
{
  var h;

  if (!curslide) return;

  /* If any videos are playing, stop them. */
  stopVideos();

  /* curslide has class=slide, page-break-before=always or is an H1 */
  curslide.classList.remove("active"); // Compatibility with Shower
  curslide.classList.add("visited");   // Compatibility with Shower
  curslide.style.visibility = "hidden";
  curslide.style.position = "absolute";
  curslide.style.top = "0";
  for (h = curslide.nextSibling; h && ! isStartOfSlide(h); h = h.nextSibling)
    if (h.nodeType === 1 /*Node.ELEMENT_NODE*/ && h !== liveregion) {
      h.style.visibility = "hidden";
      h.style.position = "absolute";
      h.style.top = "0";
    }
}


/* makeCurrent -- hide the previous slide, if any, and display elt */
function makeCurrent(elt)
{
  console.assert(elt);
  if (curslide != elt) {
    hideSlide();
    curslide = elt;
    displaySlide();
  }
}


/* fullscreen -- toggle fullscreen mode or turn it on ("on") or off ("off") */
async function toggleFullscreen(onoff)
{
  var s, x;

  switchFullscreen = true;	// For the fullscreenchange event handler

  if (onoff !== "on" && document.fullscreenElement)
    document.exitFullscreen();
  else if (onoff !== "off" && document.fullscreenEnabled)
    try {
      // If there is exactly one external screen, use that.
      s = "getScreenDetails" in window &&
	(x = (await getScreenDetails()).screens.filter((h) => !h.isInternal)) &&
	x.length == 1 ? x[0] : screen;
      await document.documentElement.requestFullscreen({navigationUI: "hide",
	screen: s});
    } catch (err) {
      alert(_("An error occurred while trying to switch into fullscreen mode")
	  + ' (' + err.message + ' – ' + err.name + ")\n\n" +
	  _("You can try again with the F or F1 key."));
    }
  else if (onoff !== "off")
    window.alert(_("Fullscreen mode is not possible"));
}


/* createHelpText -- fill the helptext element with help text */
function createHelpText()
{
  var iframe, button;

  /* Put the help text in an IFRAME so it is not affected by the slide style */
  iframe = document.createElement('iframe');
  iframe.setAttribute('title', _("Mouse &amp; keyboard commands"));
  iframe.srcdoc =
    "<!DOCTYPE html>" +
      "<html lang=en>" +
      "<meta charset=utf-8>" +
      "<title>" + _("Mouse &amp; keyboard commands") + "</title>" +
      "<style>" +
      " html {height: 100%}" +
      " body {background: #000; color: #FFF; font-size: 3vmin;" +
      "  height: 100%; margin: 0; display: flex; flex-direction: column;" +
      "  justify-content: center}" +
      " table {font-size: 1em; border-collapse: collapse; margin: 0 auto}" +
      " td {border: thin solid; padding: 0.3em 0.4em;" +
      "  vertical-align: baseline}" +
      " caption {font-weight: bold}" +
      " kbd {background: #CCC; color: #000; padding: 0.1em 0.2em;" +
      "  border-radius: 0.2em; box-shadow: -0.05em -0.05em 0.1em #000 inset, " +
      "  0.05em 0.05em 0.1em #fff inset}" +
      " p {text-align: center; margin: 1em 0 0}" +
      " a {color: inherit; text-decoration: underline}" +
      " svg {vertical-align: middle; height: 1.4em; margin: 0.1em 0}" +
      "</style>" +
      "<table>" +
      "<caption>" +
      "<a target=_parent href='https://www.w3.org/Talks/Tools/b6plus/'>" +
      logo + "</a> " + _("Mouse &amp; keyboard commands") + "</caption>" +
      (syncmode ? "" :
	  "<tr><td>" + _("<kbd>A</kbd>, double click, 3-finger touch") +
	  "<td>" + _("enter slide mode") +
	  "<tr><td>" + _("<kbd>A</kbd>, <kbd>Esc</kbd>, 3-finger touch") +
	  "<td>" + _("leave slide mode") +
	  "<tr><td>" +
	  (noclick ?
	      _("<kbd>space</kbd>, <kbd>&rarr;</kbd>, <kbd>&darr;</kbd>, swipe left") :
	      _("<kbd>space</kbd>, <kbd>&rarr;</kbd>, <kbd>&darr;</kbd>, click")) +
	  "<td>" + _("next slide or incremental element") +
	  "<tr><td>" +
	  (noclick ? _("<kbd>PgDn</kbd>") : _("<kbd>PgDn</kbd>, swipe left")) +
	  "<td>" + _("next slide") +
	  "<tr><td>" +
	  _("<kbd>PgUp</kbd>, <kbd>&larr;</kbd>, <kbd>&uarr;</kbd>, swipe right") +
	  "<td>" + _("previous slide") +
	  "<tr><td>" + _("<kbd>End</kbd>") +
	  "<td>" + _("last slide") +
	  "<tr><td>" + _("<kbd>Home</kbd>") +
	  "<td>" + _("first slide") +
	  "<tr><td>" + _("<kbd>F1</kbd>, <kbd>F</kbd>") +
	  "<td>" + _("toggle fullscreen mode") +
	  "<tr><td>" + _("<kbd>2</kbd>") + "<td>" +
	  _("show slides in 2nd window") +
	  (!hasDarkMode ? "" :
	      "<tr><td>" + _("<kbd>D</kbd>") +
	      "<td>" + _("toggle dark mode on/off")) +
	  "<tr><td>" + _("<kbd>C</kbd>") +
	  "<td>" + _("(slide mode) table of contents<br>(index mode) show/hide notes") +
	  "<tr><td>" + _("<kbd>W</kbd>") +
	  "<td>" + _("start/stop drawing on the slide") +
	  "<tr><td>" + _("<kbd>?</kbd>") +
	  "<td>" + _("this help") +
	  "<tr><td>" + _("<kbd>Alt</kbd>, <kbd>Option</kbd>") +
	  "<td>" + _("(index mode) show URL of slide") +
          (!slideTiming ? "" :
              "<tr><td>" + _("<kbd>P</kbd>, <kbd>⏯</kbd>") +
	      "<td>" + _("pause/resume automatic slide show"))) +
      (!syncURL ? "" :
	  "<tr><td>" + _("<kbd>S</kbd>") +
	  "<td>" + _("toggle sync mode on/off")) +
      "</table>" +
      "<p>" + _("(More information in the <a target=_parent href='https://www.w3.org/Talks/Tools/b6plus/'>b6+ manual</a>)");
  iframe.style.cssText = 'margin: 0; border: none; padding: 0; ' +
    'width: 100%; height: 100%';
  button = document.createElement('button');
  button.innerHTML = "\u274C\uFE0E"; // Cross mark
  button.style.cssText = 'position:absolute; top: 0; right: 16px';
  button.addEventListener('click',
    ev => {helptext.remove(); ev.stopPropagation()});
  // Unfortunately, when in fullscreen mode, the Escape key is
  // captured by the browser to exit fullscreen mode and we never get
  // it.
  button.setAttribute("tabindex", 0);
  button.addEventListener('keydown', ev => {
    if (ev.key == "Escape") {helptext.remove(); ev.stopPropagation()}});
  helptext = document.createElement('div');
  helptext.appendChild(iframe);
  helptext.appendChild(button);
  helptext.style.cssText = 'position: fixed; width: 100%; height: 100%; ' +
    'top: 0; left: 0; z-index: 2; background: #000; color: #FFF; ' +
    'text-align: center; visibility: visible';
  // In fullscreen mode, the Escape key is captured by the browser to
  // leave fullscreen mode, so only the second Escape press closes the
  // help text. But let's add it anyway.
  helptext.setAttribute("tabindex", 0);
  helptext.addEventListener('keydown', ev => {
    if (ev.key == "Escape") {helptext.remove(); ev.stopPropagation()}});
}


/* help -- show information about available interactive commands */
function help()
{
  // Works both on first and second windows
  clearTimeout(slideTimer);
  if (!helptext) createHelpText();
  document.body.appendChild(helptext);
  helptext.lastChild.focus();	// The button
}


/* getSlideTitle -- get the title of the slide that starts at elt */
function getSlideTitle(elt)
{
  var title;

  if (elt.nodeType == 1 && elt.nodeName.match(/^H[1-6]$/))
    return elt.innerHTML;
  else if (elt.firstChild && (title = getSlideTitle(elt.firstChild)))
    return title;
  else if (elt.nextSibling && !isStartOfSlide(elt.nextSibling))
    return getSlideTitle(elt.nextSibling);
  else
    return null;
}


/* createTOCText -- fill the toctext element with the table of contents */
function createTOCText()
{
  var button, style, items = "";

  /* Collect the titles of all slides and make them A elements inside LI. */
  for (const h of document.body.children)
    if (isStartOfSlide(h)) {
      let i = '#' + h.id.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
      let t = getSlideTitle(h); // Returns an HTML fragment or null
      items += '<li><a href="' + i + '">' + (t ?? '#' + h.b6slidenum) + '</a>';
    }

  /* Make toctext a DIALOG with class "toc" containing an OL with the links. */
  toctext = document.createElement('dialog');
  toctext.classList.add('toc');		// Allow style sheet to style it
  toctext.innerHTML = '<ol>' + items + '</ol>';

  /* A button to close the TOC. */
  button = document.createElement('button');
  button.setAttribute('autofocus', '');
  button.innerHTML = "\u274C\uFE0E"; // Cross mark
  button.addEventListener('click',
    ev => {toctext.close(); ev.stopPropagation()});
  toctext.prepend(button);

  /* When clicking a link in the TOC, also remove the TOC. */
  for (const e of toctext.getElementsByTagName('A'))
    e.addEventListener('click', ev => toctext.close());

  /* The C key works like the esc key and closes the table of contents. */
  toctext.addEventListener('keydown',
    ev => {if (ev.key == 'c') toctext.close()});

  document.body.append(toctext);
}


/* tableOfContents -- pop-up a table of contents */
function tableOfContents()
{
  clearTimeout(slideTimer);
  if (!toctext) createTOCText();
  toctext.style.visibility = 'visible'; // May have been hidden by toggleMode()
  toctext.showModal();
}


/* openSecondWindow -- open a 2nd window with the same slides */
function openSecondWindow()
{
  var url;

  console.assert(!firstwindow);	// We're on the first window

  // If we're in slide mode, go back to index mode.
  // This should never happen: the "2" key is refused in slide mode
  // and the button is invisible in slide mode.
  if (slidemode) toggleMode();

  // Open a second window if there isn't one yet. The
  // "?b6window=random" avoids that this document replaces the
  // original slides in the browser cache.
  if (secondwindow == null || secondwindow.closed) {
    url = new URL(location);
    url.searchParams.delete("full");
    url.searchParams.delete("static");
    url.searchParams.delete("sync");
    url.searchParams.set("b6window", randomnumber);
    // url.hash = "";
    secondwindow = open(url, "b6+ slide window",
      `innerWidth=${popupWidth},innerHeight=${popupHeight},resizable`);
    secondwindow.focus();
  }

  // Set the volume of any videos and audios is this window to almost
  // 0. Not 0, because that sets the mute button, white we want the
  // mute button in this window to still function to mute/unmute the
  // video in the second window.
  for (const v of document.querySelectorAll('VIDEO, AUDIO')) v.volume = 0.01;

  // The second window will send us an "init" message when it is
  // ready. At that point we'll send it some information about our
  // clocks and the currently active slide, if any. See message()
  // below.
}


/* warnSyncMode -- alert the user that sync mode is on */
function warnSyncMode()
{
  console.assert(!firstwindow);	// We're on the first window
  warningBanner(_("No navigation possible while sync mode is on."), "\n",
    _("Press S to toggle sync mode off."));
}


/* warnFullscreen -- alert the user fullscreen does not work between windows */
function warnFullscreen()
{
  console.assert(!firstwindow);	// We're on the first window
  warningBanner(_("F and F1 only work in the window with the slides. (Browser security restriction.)"));
}


/* warningBanner -- briefly show a banner with a warning */
function warningBanner(...content)
{
  var banner, elt;

  banner = document.createElement("div");
  banner.style = "position: fixed; left: 0; right: 0; z-index: 2;\
    text-align: center; font-size: 2vh; font-weight: bold;\
    white-space: pre-line;\
    font-family: sans-serif; margin: 0; padding: 0.5em; border-style: none;\
    background: hsla(0,0%,0%,0.6); color: hsl(0,0%,100%);\
    text-shadow: 1px 1px 1px #000, 1px 1px 1px #000; opacity: 1.0;\
    transition: opacity 3.0s";
  if (slidemode) {banner.style.top = "auto"; banner.style.bottom = "0";}
  else {banner.style.top = "0"; banner.style.bottom = "auto";}
  banner.append(...content);
  document.body.append(banner);

  // First let the style transition fade the dialog, then remove it.
  setTimeout(function () {banner.style.opacity = "0.0"}, 3000);
  setTimeout(function () {banner.remove()}, 6000);
}


/* errorSyncMode -- show an error message when synchronization fails */
function errorSyncMode(ev)
{
  warningBanner(_("Synchronization error."), "\n",
    _("You can try to turn synchronization off and on again with the S key."));
}


/* tryToggleSync -- toggle sync mode on or off, if possible */
function tryToggleSync()
{
  console.assert(!firstwindow);	// We're on the 1st window

  if (!syncURL) return;		// No sync server defined

  if (syncmode) {
    eventsource.close();
    syncmode = false;
    secondwindow?.postMessage({event: "sync-off"});
    warningBanner(_("Syncing turned OFF.\nPress S to turn syncing back on."));
  } else {
    eventsource = new EventSource(syncURL);
    // Listen both for "message" events (the default type) and "page" events
    eventsource.addEventListener("message", syncHandler);
    eventsource.addEventListener("page", syncHandler);
    eventsource.addEventListener("error", errorSyncMode);
    // eventsource.addEventListener("open", function (ev) {)});
    // Don't wait for the "open" event. It seems some browsers (Safari
    // and Firefox, but not Vivaldi) don't emit the event until much
    // later. (When the first message arrives?)
    syncmode = true;
    secondwindow?.postMessage({event: "sync-on"});
    warningBanner(_("Syncing turned ON\nPress S to turn syncing off"));
  }
}


/* unpauseAutomaticSlides -- resume a paused automatic slide show */
function unpauseAutomaticSlides()
{
  console.assert(slideTimerPaused);
  console.assert(slidemode);
  slideTimerPaused = false;
  requestAnimationFrame(() => {
    displaySlide();		// TODO: wasteful, only start timer instead?
    document.body.classList.remove('manual'); // The style may show an indicator
  });
}


/* pauseAutomaticSlides -- pause an automatic slide show */
function pauseAutomaticSlides()
{
  console.assert(slidemode);
  console.assert(!slideTimerPaused);
  clearTimeout(slideTimer);
  slideTimerPaused = true;
  // Set a class, so that the style can use status indicators
  requestAnimationFrame(() => document.body.classList.add('manual'));
}


/* toggleAnnotate -- show or hide a canvas on which you can draw */
function toggleAnnotate()
{
  if (!canvas) {
    // Canvas not yet created. Initialize it.
    // TODO: Can the canvas scroll with the slide in slipshow mode?
    canvas = document.createElement("canvas");
    canvas.setAttribute('class', 'b6-canvas');
    canvas.setAttribute('width', window.innerWidth);
    canvas.setAttribute('height', window.innerHeight);
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.visibility = "hidden";
    curslide.append(canvas);
    canvasContext = canvas.getContext("2d");
    canvasContext.lineCap = "round";
    canvasContext.lineWidth = 2;
    canvasContext.strokeStyle =
      window.getComputedStyle(canvas).getPropertyValue('color');
    noclick |= 2;
    // Add an event listener that follows the mouse and draws lines
    canvas.addEventListener('mousemove', (e) => {
      if (e.buttons & 1 == 1 && canvasX !== null) {
	canvasContext.beginPath();
	canvasContext.moveTo(canvasX, canvasY);
	canvasContext.lineTo(e.offsetX, e.offsetY);
	canvasContext.stroke();
      }
      canvasX = e.offsetX;
      canvasY = e.offsetY;
    });
  }
  if (canvas.style.visibility == "hidden" ||
      canvas.parentNode !== curslide) {
    // Canvas was hidden, by user pressing "w" or switching slides (or
    // it was just created).
    canvasContext.clearRect(0, 0, canvas.getBoundingClientRect().width,
      canvas.getBoundingClientRect().height); // Clear the canvas
    curslide.append(canvas);		// Move it to current slide, if needed
    canvasContext.strokeStyle = window.getComputedStyle(canvas)
      .getPropertyValue('color');	// Get the color set in the style
    canvas.style.visibility = null;	// Make sure canvas is displayed
    noclick |= 2;			// Don't let clicks advance the slide
    canvasX = null;			// Mouse coordinates not yet reliable
  } else {
    // Canvas was in use. Hide it.
    canvas.style.visibility = "hidden";
    noclick &= !2;			// Reset noclick to what it was before
  }
}


/* keyDown -- handle key presses on the BODY element */
function keyDown(event)
{
  // We only handle the key if it is not directed at a focused element.
  if (event.target.tagName !== "BODY") return;

  if (event.key === 'Alt' && !syncmode && !slidemode) {
    showURL();
    return;
  }

  // We don't handle other keys when a modifier key is pressed.
  if (event.altKey || event.ctrlKey || event.metaKey) return;

  switch (event.key) {
  case "PageDown":
    if (syncmode) warnSyncMode() 	// In sync mode: accept key, do nothing
    else if (slidemode) nextSlide()	// We're in slide mode
    else if (secondwindow?.closed !== false) return // No 2nd window
    else secondwindow?.postMessage({event: "keydown", v: event.key});
    break;
  case "PageUp":
    if (syncmode) warnSyncMode() 	// In sync mode: accept key, do nothing
    else if (slidemode) previousSlide()	// We're in slide mode
    else if (secondwindow?.closed !== false) return // No 2nd window
    else secondwindow.postMessage({event: "keydown", v: event.key});
    break;
  case "Spacebar":			// Some older browsers
  case " ":				// Fall through
  case "Right":				// Some older browsers
  case "ArrowRight":			// Fall through
  case "Down":				// Some older browsers
  case "ArrowDown":
    if (syncmode) warnSyncMode() 	// In sync mode: accept key, do nothing
    else if (slidemode) nextSlideOrElt() // We're in slide mode
    else if (secondwindow?.closed !== false) return // No 2nd window
    else secondwindow.postMessage({event: "keydown", v: event.key});
    break;
  case "Left":				// Some older browsers
  case "ArrowLeft":			// Fall through
  case "Up":				// Some older browsers
  case "ArrowUp":			// Fall through
    if (syncmode) warnSyncMode() 	// In sync mode: accept key, do nothing
    else if (slidemode) previousSlideOrElt() // We're in slide mode
    else if (secondwindow?.closed !== false) return // No 2nd window
    else secondwindow.postMessage({event: "keydown", v: event.key});
    break;
  case "Home":
    if (syncmode) warnSyncMode() 	// In sync mode: accept key, do nothing
    else if (slidemode) firstSlide()	// We're in slide mode
    else if (secondwindow?.closed !== false) return // No 2nd window
    else secondwindow.postMessage({event: "keydown", v: event.key});
    break;
  case "End":
    if (syncmode) warnSyncMode()
    else if (slidemode) lastSlide()
    else if (secondwindow?.closed !== false) return
    else secondwindow.postMessage({event: "keydown", v: event.key});
    break;
  case "a":				// Accepted even when not in slide mode
    if (syncmode) warnSyncMode()
    else if (secondwindow?.closed !== false) toggleModeAndFullscreen()
    else secondwindow.postMessage({event: "keydown", v: event.key});
    break;
  case "f":				// Fall through
  case "F1":
    if (slidemode) toggleFullscreen()	// In slide mode
    else if (secondwindow?.closed !== false) return // No 2nd window
    else warnFullscreen();
    break;
  case "Esc":				// Some older browsers
  case "Escape":
    if (syncmode) warnSyncMode()
    else if (slidemode) toggleModeAndFullscreen()
    else if (secondwindow?.closed !== false) return
    else secondwindow.postMessage({event: "keydown", v: event.key});
    break;
  case "2":
    if (slidemode) return;		// Only one window can be in slide mode
    else if (syncmode) warnSyncMode()
    else if (!firstwindow) openSecondWindow();
    else return;			// We're on the 2nd window. Ignore key
    break;
  case "?":
    help(event);
    break;
  case 'c':
    if (syncmode) warnSyncMode()
    else if (toctext?.open) toctext.close();
    else if (slidemode) tableOfContents(event);
    else if (secondwindow?.closed !== false) toggleComments() // index mode
    else secondwindow.postMessage({event: "keydown", v: event.key});
    break;
  case 'p':
  case 'MediaPlay':
    /* Note that unpausing calls displaySlide(), which resets the time. */
    if (syncmode) warnSyncMode()
    else if (slideTimerPaused) unpauseAutomaticSlides()
    else if (slidemode) pauseAutomaticSlides()
    else if (secondwindow?.closed !== false) return // No 2nd window
    else secondwindow.postMessage({event: "keydown", v: event.key});
    break;
  case 's':
    if (syncURL) tryToggleSync()	// On 1st window, sync server defined
    else if (!firstwindow) return	// On 1st window, but no sync server
    else firstwindow.postMessage({event: "keydown", v: event.key});
    break;
  case 'd':
    if (slidemode) toggleDarkMode()	// We're in slide mode
    else if (secondwindow?.closed !== false) return // No 2nd window
    else secondwindow.postMessage({event: "keydown", v: event.key});
    break;
  case 'w':
    if (syncmode) warnSyncMode()
    else if (slidemode) toggleAnnotate()
    else if (secondwindow?.closed !== false) return // No 2nd window
    else secondwindow.postMessage({event: "keydown", v: event.key});
    break;
  default:
    return;			// Other keys have their normal meaning.
  }

  event.preventDefault();
}


/* load -- handle the load event */
function load(e)
{
  if (stylesToLoad) stylesToLoad--;
  e.target.removeEventListener(e.type, load);
}


/* toggleMedia -- swap styles for projection and screen */
function toggleMedia()
{
  var i, h, s, links, styles;

  var re1 = /\(\s*overflow-block\s*:\s*(optional-)?paged\s*\)/gi;
  var sub1 = "(overflow-block: scroll)";
  var re2 = /\(\s*overflow-block\s*:\s*scroll\s*\)/gi;
  var sub2 = "(overflow-block: paged)";
  var re3 = /\bprojection\b/gi;
  var sub3 = "screen";
  var re4 = /\bscreen\b/gi;
  var sub4 = "projection";

  /* Swap projection and screen in MEDIA attributes of LINK elements */
  links = document.getElementsByTagName("link");
  for (i = 0; i < links.length; i++)
    if (links[i].rel === "stylesheet" && links[i].media) {
      if (re1.test(links[i].media)) s = links[i].media.replace(re1, sub1);
      else s = links[i].media.replace(re2, sub2);
      if (re3.test(s)) s = s.replace(re3, sub3);
      else s = s.replace(re4, sub4);
      if (s != links[i].media) {
	stylesToLoad++;
	links[i].addEventListener('load', load, false);
	links[i].media = s;
      }
    }

  /* Swap projection and screen in MEDIA attributes of STYLE elements */
  styles = document.getElementsByTagName("style");
  for (i = 0; i < styles.length; i++)
    if (styles[i].media) {
      if (re1.test(styles[i].media)) s = styles[i].media.replace(re1, sub1);
      else s = styles[i].media.replace(re2, sub2);
      if (re3.test(s)) s = s.replace(re3, sub3);
      else s = s.replace(re4, sub4);
      if (s != styles[i].media) {
	stylesToLoad++;
	styles[i].addEventListener('load', load, false);
	styles[i].media = s;
      }
    }

  /* Swap projection and screen in the MEDIA pseudo-attribute of the style PI */
  for (h = document.firstChild; h; h = h.nextSibling)
    if (h.nodeType === 7 && h.target === "xml-stylesheet") {
      if (re1.test(h.data)) s = h.data.replace(re1, sub1);
      else s = h.data.replace(re2, sub2);
      if (re3.test(s)) s = s.replace(re3, sub3);
      else s = s.replace(re4, sub4);
      if (s != h.data) {
	stylesToLoad++;
	h.addEventListener('load', load, false);	// TODO: possible?
	h.data = s;
      }
    }
}


/* scaleBody -- if the BODY has a fixed size, scale it to fit the window */
function scaleBody()
{
  var w, h, w2, h2;

  if (document.body.offsetWidth && document.body.offsetHeight) {
    w = document.body.offsetWidth;
    h = document.body.offsetHeight;
    w2 = window.visualViewport.width * window.visualViewport.scale;
    h2 = window.visualViewport.height * window.visualViewport.scale;
    scale = Math.min(w2/w, h2/h);
    // console.log(`scaleBody ${w}x${h} -> ${w2}x${h2} -> ${scale}`);
    document.body.style.transform = "scale(" + scale + ")";
    document.body.style.position = "relative";
    document.body.style.marginLeft = (w2 - w)/2 + "px";
    document.body.style.marginTop = (h2 - h)/2 + "px";
    document.body.style.top = "0";
    document.body.style.left = "0";
    /* --shower-full-scale is for style sheets written for Shower 3.1: */
    document.body.style.setProperty('--shower-full-scale', '' + scale);
  }
}


/* shrinkWindow -- give the 2nd window the same aspect ratio as the slides */
function shrinkWindow()
{
  var r, w, h, safari_fix;

  // Only do somthing if this is a 2nd window, the body has a definite
  // height, and we're not in fullscreen mode.
  if (firstwindow && document.body.offsetWidth && document.body.offsetHeight &&
      ! document.fullscreenElement) {
    r = document.body.getBoundingClientRect();
    if (window.visualViewport) {
      w = window.visualViewport.width * window.visualViewport.scale;
      h = window.visualViewport.height * window.visualViewport.scale;
    } else {
      w = window.innerWidth;
      h = window.innerHeight;
    }
    safari_fix = popupWidth / w;	// Safari reports 941.1 instead of 800??
    resizeBy((r.width - w) * safari_fix, (r.height - h) * safari_fix);
  }
}


/* finishToggleMode -- finish switching to slide mode */
function finishToggleMode()
{
  if (stylesToLoad != 0 && Date.now() < limit) {

    setTimeout(finishToggleMode, 100);	// Wait some more

  } else if (stylesToLoad == 0 && Date.now() < limit) {

    limit = 0;
    setTimeout(finishToggleMode, 100);	// Wait 100ms for styles to apply

  } else {

    stylesToLoad = 0;
    scaleBody(); // If the BODY has a fixed size, scale it to fit the window
    initProgress();		// Find and initialize progress bar, etc.
    initHideMouse();		// If requested, hide an idle mouse pointer
    shrinkWindow();		// If 2nd window, try and remove black bands

    // If we're a 2nd window, inform the 1st window that we are ready.
    if (firstwindow) firstwindow.postMessage({event: "init"});

    /* curslide can be set if we reenter slide mode or if doubleClick set it. */
    if (curslide) displaySlide();
    else if (location.hash) targetSlide(location.hash.substring(1));
    if (!curslide) firstSlide();

    /* There may be tall objects. Make sure we show the start of the
     * slide. But only if we're not inside an object, embed or iframe,
     * otherwise the outer document will be scrolled to that object or
     * iframe. */
    if (! document.body.classList.contains('framed'))
      document.body.scrollIntoView();

    /* If the slide overflows, make the last of the incrementals visible. */
    scrollSlide();

    switchInProgress = false;	// Done with the mode switch
  }
}


/* toggleMode -- toggle between slide show and normal display */
function toggleMode()
{
  /* Do nothing if we are still in the process of switching to slide mode */
  if (switchInProgress) return;

  if (! slidemode) {
    switchInProgress = true;
    slidemode = true;
    document.body.classList.add("full");		// Set .full on BODY
    document.body.setAttribute("role", "application");	// Hint to screenreaders

    /* Make all children of BODY invisible. */
    for (const h of document.body.children) {
      if (h.b6savedstyle === undefined)
	h.b6savedstyle = h.style.cssText;	// Remember properties
      h.style.visibility = "hidden";
      h.style.position = "absolute";
      h.style.top = "0";
      h.style.left = "0";
    }

    /* Except that the liveregion is visible, but cropped. */
    liveregion.style.visibility = "visible";
    liveregion.style.clip = "rect(0 0 0 0)";
    liveregion.style.clipPath = "rect(0 0 0 0)"; // Since 'clip' is deprecated

    /* Swap style sheets for projection and screen. */
    document.body.b6savedstyle = document.body.style.cssText; // Save properties
    toggleMedia();				// Swap style sheets

    /* Wait 100ms before calling a function to do the rest of the
       initialization of slide mode. That function will wait for the
       style sheets to load, but no longer than until limit, i.e., 3
       seconds */
    limit = Date.now() + 3000;
    setTimeout(finishToggleMode, 100);

  } else {

    /* Stop any videos. */
    stopVideos();

    /* If there is a first window, tell it we're not in slide mode anymore. */
    if (firstwindow) firstwindow.postMessage({event: "noslide"});

    // If we're a second window, just disappear now.
    if (firstwindow) window.close();

    /* If slides are advancing automatically, stop the timer. */
    clearTimeout(slideTimer);

    /* savedContent is what a screen reader should say on leaving slide mode */
    liveregion.innerHTML = savedContent;

    /* If there was a canvas, remove it. */
    if (canvas) {canvas.remove(); canvas = null;}

    /* Unhide all children again, except comments if commentsVisible is false */
    for (const h of document.body.children)
      if (typeof(h.b6savedstyle) === "string")
	h.style.cssText = h.b6savedstyle;
    if (! commentsVisible) {
      toggleComments();
      toggleComments();
    }

    toggleMedia(); 				// Swap style sheets
    document.body.style.cssText = document.body.b6savedstyle; // Restore style
    document.body.classList.remove("full");	// Remove .full from BODY
    document.body.removeAttribute("role");	// Remove "application"
    curslide?.classList.remove("active");	// Remove styling

    slidemode = false;

    /* Put current slide in the URL, so the index view can highlight it. */
    if (curslide) location.replace("#" + curslide.id);
  }
}


/* toggleModeAndFullscreen -- switch fullscreen slide mode and index mode */
function toggleModeAndFullscreen()
{
  toggleMode();
  toggleFullscreen(slidemode ? "on" : "off");
}


/* toggleDarkMode -- add, remove or toggle darkmode/lightmode on the BODY */
function toggleDarkMode(onoff)
{
  var darkmodeIsOn, lightmodeIsOn;

  if (! hasDarkMode) return;

  // If onoff is "on", set a class on body. If onoff is "off", unset
  // it. If onoff is undefined, toggle the class. If the OS is in dark
  // mode, this toggles class=lightmode. Otherwise this toggles
  // class=darkode.
  //
  if (matchMedia('(prefers-color-scheme: dark)').matches) {
    // The OS is currently in dark mode.
    lightmodeIsOn = document.body.classList.contains("lightmode");
    if (lightmodeIsOn && onoff !== "on") {
      document.body.classList.remove("lightmode");
      firstwindow?.postMessage({event: "lightmodeOff"});
      secondwindow?.postMessage({event: "lightmodeOff"});
    } else if (! lightmodeIsOn && onoff !== "off") {
      document.body.classList.remove("darkmode");
      document.body.classList.add("lightmode");
      firstwindow?.postMessage({event: "lightmodeOn"});
      secondwindow?.postMessage({event: "lightmodeOn"});
    }
  } else {
    // The OS is currently not in dark mode.
    darkmodeIsOn = document.body.classList.contains("darkmode");
    if (darkmodeIsOn && onoff !== "on") {
      document.body.classList.remove("darkmode");
      firstwindow?.postMessage({event: "darkmodeOff"});
      secondwindow?.postMessage({event: "darkmodeOff"});
    } else if (! darkmodeIsOn && onoff !== "off") {
      document.body.classList.remove("lightmode");
      document.body.classList.add("darkmode");
      firstwindow?.postMessage({event: "darkmodeOn"});
      secondwindow?.postMessage({event: "darkmodeOn"});
    }
  }
}


/* timeToMillisec -- convert MM:SS, DDs, DDm and DDh to milliseconds */
function timeToMillisec(s)
{
  var m;

  if ((m = /^([0-9]+):([0-9]{2})$/.exec(s))) return 60000 * m[1] + 1000 * m[2];
  else if ((m = /^([0-9]+|[0-9]*\.[0-9]+)s$/.exec(s))) return 1000 * m[1];
  else if ((m = /^([0-9]+|[0-9]*\.[0-9]+)m$/.exec(s))) return 60000 * m[1];
  else if ((m = /^([0-9]+|[0-9]*\.[0-9]+)h$/.exec(s))) return 3600000 * m[1];
  else if ((m = /^(0+|0*\.0+)$/.exec(s))) return 0;
  else return 0;
}


/* scrollSlide -- ensure visible incrementals are above the bottom */
function scrollSlide()
{
  var compStyle, i, h, border, pad, bottom;

  // Get the bottom of the current slide and the bottom padding and border.
  bottom = curslide.getBoundingClientRect().bottom;
  compStyle = window.getComputedStyle(curslide);
  border = parseFloat(compStyle.getPropertyValue("border-bottom-width"));
  pad = parseFloat(compStyle.getPropertyValue("padding-bottom"));

  // Find the bottom of the visible incremental that extends the
  // farthest down; or the top of the slide, if there are none.
  h = bottom - scale * (curslide.scrollTop + border + pad);
  for (i = 0; i <= incrementals.cur; i++)
    h = Math.max(h, incrementals[i].getBoundingClientRect().bottom);

  // Scroll the current slide.
  curslide.scroll(0, curslide.scrollTop + (h - bottom)/scale + border + pad);
}


/* nextSlideOrElt -- next incremental element or next slide if none */
function nextSlideOrElt()
{
  var m;

  console.assert(slidemode);

  if (curslide == null) return;

  if (incrementals.cur + 1 < incrementals.length) {
    /* There is a next incremental element. */

    /* Mark the current incremental element, if any, as visited. */
    if (incrementals.cur >= 0) {
      incrementals[incrementals.cur].classList.add("visited");
      incrementals[incrementals.cur].classList.remove("active");
    }

    /* Make the next one active. */
    incrementals.cur++;
    incrementals[incrementals.cur].classList.add("active");

    /* Make screen readers announce the newly displayed element */
    liveregion.innerHTML = "";		// Make it empty
    liveregion.appendChild(cloneNodeWithoutID(incrementals[incrementals.cur]));

    /* In case the slide is overflowing, scroll the contents so that
     * the newly displayed element is visible at the bottom of the
     * slide. */
    scrollSlide();

    /* If the element, slide or BODY has a timing attribute and it is
     * not 0, set a timeout. If the element itself has a data-timing
     * attribute, use that. Otherwise, if the slide has a data
     * attribute, use that, divided by the number of incrementals + 1.
     * Otherwise, use the default (from the BODY), divided by the
     * number of incrementals + 1. */
    clearTimeout(slideTimer);
    if (! slideTimerPaused &&
	(m = incrementals[incrementals.cur].dataset.timing !== undefined ?
	    timeToMillisec(incrementals[incrementals.cur].dataset.timing) :
	    curslide.dataset.timing !== undefined ?
	    timeToMillisec(curslide.dataset.timing)/(incrementals.length+1) :
	    slideTiming/(incrementals.length + 1)))
      slideTimer = setTimeout(nextSlideOrElt, m);

  } else {
    /* There is no next incremental element. So go to next slide. */
    nextSlide();
  }
}


/* nextSlide -- display the next slide, if any */
function nextSlide()
{
  var h;

  console.assert(slidemode);

  if (curslide == null) return;

  console.assert(isStartOfSlide(curslide));

  /* curslide has class=slide, page-break-before=always or is an H1 */
  h = curslide.nextSibling;
  while (h && ! isStartOfSlide(h)) h = h.nextSibling;

  if (h) makeCurrent(h);		// Found a next slide
  else if (loopSlideShow) firstSlide();	// No next slide, but loop
  else return;				// No next slide

  /* The slide may have more content than fits the slide. Scroll to
   * display the lowest of the visible incremental elements, or the
   * top of the slide, if there are none. */
  scrollSlide();
}


/* previousSlideOrElt -- next incremental element or next slide if none */
function previousSlideOrElt()
{
  console.assert(slidemode);

  if (curslide == null) return;

  if (incrementals.cur >= 0) {
    // There is an incremental element being displayed.

    // Mark the currently active element as inactive and decrement cur.
    incrementals[incrementals.cur--].classList.remove("active");
    // TODO: Remove it from the liveregion.

    if (incrementalsBehavior === "forwardonly") {
      // Hide all visited elements and set cur to -1.
      while (incrementals.cur >= 0)
	incrementals[incrementals.cur--].classList.remove("visited");
      // TODO: Remove them from the liveregion.
    } else {
      // If there is a preceding incremental element, make it active.
      if (incrementals.cur >= 0) {
	incrementals[incrementals.cur].classList.remove("visited");
	incrementals[incrementals.cur].classList.add("active");
      }
    }
    scrollSlide();	// In case the slide overflows, scroll

  } else {
    // There is no active incremental element. Go to previous slide.
    previousSlide();
  }
}


/* previousSlide -- display the next slide, if any */
function previousSlide()
{
  var h;

  console.assert(slidemode);

  if (curslide == null) return;

  console.assert(isStartOfSlide(curslide));

  h = curslide.previousSibling;
  while (h && ! isStartOfSlide(h)) h = h.previousSibling;

  if (! h) return;			// Found no previous slide
  makeCurrent(h);

  /* The slide may have more content than fits the slide. Make sure
   * the lowest of the incremental elements is above the bottom of the
   * slide. Or scroll to the top of the slide if there are no
   * incremental elements. */
  scrollSlide();
}


/* firstSlide -- display the first slide */
function firstSlide()
{
  var h;

  console.assert(slidemode);

  h = document.body.firstChild;
  while (h && ! isStartOfSlide(h)) h = h.nextSibling;

  if (h != null) makeCurrent(h);
}


/* lastSlide -- display the last slide */
function lastSlide()
{
  var h;

  console.assert(slidemode);

  h = document.body.lastChild;
  while (h && ! isStartOfSlide(h)) h = h.previousSibling;

  if (h != null) makeCurrent(h);
}


/* findSlide -- find the slide with the ID or the number "target" */
function findSlide(target)
{
  var h, n;

  if ((h = document.getElementById(target)))
    /* Find enclosing .slide or preceding start of slide */
    while (h && ! isStartOfSlide(h)) h = h.previousSibling || h.parentNode;
  else if ((n = parseInt(target)) > 0)
    /* Find the start of the n'th slide. */
    for (h = document.body.firstChild; h; h = h.nextSibling)
      if (h.b6slidenum === n) break;

  return h;
}


/* targetSlide -- display slide containing ID=target, or the target'th slide */
function targetSlide(target)
{
  var h;

  h = findSlide(target)
  /* If found, and it is not already displayed, display it */
  if (h != null) makeCurrent(h);
}


/* mouseButtonClick -- handle mouse click event */
function mouseButtonClick(e)
{
  var target = e.target;

  if (noclick) return;
  if (e.button != 0 || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
  if (e.detail != 1) return; // It's the 2nd of a double click

  if (syncmode) {    // In sync mode, accept the click but do nothing.

    // warnSyncMode();

  } else {

    // check if target is not something that probably wants clicks
    // e.g. embed, object, input, textarea, select, option
    while (target) {
      if (target.nodeName === "A" || target.nodeName === "EMBED" ||
	  target.nodeName === "OBJECT" || target.nodeName === "INPUT" ||
	  target.nodeName === "TEXTAREA" || target.nodeName === "SELECT" ||
	  target.nodeName === "SUMMARY" || target.nodeName === "OPTION") return;
      target = target.parentNode;
    }

    if (slidemode) {
      // Set a timeout to handle the click after 300 ms. If a double click
      // occurs in that period, it will remove the timeout and the click
      // will thus not do anything. The 300 ms is a compromise. The actual
      // time within which a double click occurs depends on the browser
      // and the OS. 200 ms is for fast clickers, but 400 ms would cause a
      // noticeable delay before the slide advances. Note that adding
      // class=noclick on the body disables handling of single clicks
      // completely.
      singleClickTimer = setTimeout(() => {nextSlideOrElt()}, 300);
    } else if (secondwindow?.closed === false) {
      // Not in slide mode, but there is a 2nd window, so let it
      // handle the click.
      secondwindow.postMessage({event: "click"});
    }
  }

  e.preventDefault();
  e.stopPropagation();
}


/* gestureStart -- handle start of a touch event */
function gestureStart(e)
{
  if (!gesture.on) {
    gesture.on = true;
    gesture.x2 = gesture.x1 = e.touches[0].clientX;
    gesture.y2 = gesture.y1 = e.touches[0].clientY;
    gesture.opacity = document.body.style.opacity;
  }
  gesture.touches = e.touches.length;
}


/* gestureMove -- handle move event */
function gestureMove(e)
{
  if (gesture.on && slidemode) {
    gesture.x2 = e.touches[0].clientX;
    gesture.y2 = e.touches[0].clientY;

    /* Give some visual feedback: */
    var dx = Math.abs(gesture.x2 - gesture.x1);
    var dy = Math.abs(gesture.y2 - gesture.y1);
    if (gesture.touches != 1)
      document.body.style.opacity = gesture.opacity;
    else if (dx > dy)
      document.body.style.opacity = 1 - dx / window.innerWidth;
    else
      document.body.style.opacity = 1 - (6 * dx - 5 * dy) / window.innerWidth;
  }
}


/* gestureEnd -- handle end of a touch event */
function gestureEnd(e)
{
  if (gesture.on) {
    gesture.on = false;

    /* Undo visual feedback */
    if (slidemode)
      document.body.style.opacity = gesture.opacity;

    var dx = gesture.x2 - gesture.x1;
    var dy = gesture.y2 - gesture.y1;

    if (gesture.touches > 2) {		// 3-finger gesture
      if (syncmode) warnSyncMode();
      else if (slidemode) toggleModeAndFullscreen();	// Leave slide mode
      else if (secondwindow?.closed !== false) toggleModeAndFullscreen();
      else secondwindow.postMessage({event: "keydown", v: "a"});

    } else if (gesture.touches == 2) {	// 2-finger gesture
      return;				// does nothing

    } else {				// 1-finger swipe
      // A swipe can mean previousSlide, nextSlide() or
      // nextSlideOrElt(). The latter only if clicks are disabled
      // ("noclick"). A swipe in slide mode works directly, a swipe
      // while there is a 2nd window sends an event to that window,
      // otherwise the swipe is ignored.
      if (Math.abs(dx) < window.innerWidth/3) return; // Swipe too short
      if (Math.abs(dx) < Math.abs(dy)) return; // Swipe too vertical
      if (syncmode) warnSyncMode();
      else if (slidemode) {
	if (dx > 0) previousSlide();
	else if (noclick) nextSlideOrElt();
	else nextSlide();
      } else if (secondwindow?.closed === false) {
	if (dx > 0) secondwindow.postMessage({event: "keydown", v:"ArrowLeft"});
	else if (noclick) secondwindow.postMessage({event: "keydown", v: " "});
	else secondwindow.postMessage({event: "keydown", v: "PageDown"});
      }
    }
    e.preventDefault();
    e.stopPropagation();
  }
}


/* gestureCancel -- handle cancellation of a touch event */
function gestureCancel(e)
{
  if (gesture.on) {
    gesture.on = false;
    /* Undo visual feedback */
    if (slidemode) document.body.style.opacity = gesture.opacity;
  }
}


/* doubleClick -- handle a double click on the body */
function doubleClick(event)
{
  var h;

  if (event.button != 0 || event.altKey || event.ctrlKey ||
      event.metaKey || event.shiftKey) return;

  if (!noclick)  {
    /* In slide mode, with the mouseButtonClick() handler installed to
     * advance the slides on a single click, a double click cancels
     * the effect of the single click: It removes the action that
     * mouseButtonClick() had put on the queue. */
    clearTimeout(singleClickTimer);
    singleClickTimer = null;
  }

  /* The double click may have selected some text, so unselect everything. */
  if (! slidemode) document.getSelection().removeAllRanges();

  /* Find on which slide, if any, the clicks occurred. */
  h = event.target;
  while (h && ! isStartOfSlide(h)) h = h.previousSibling || h.parentNode;

  if (syncmode) {
    warnSyncMode();
  } else if (secondwindow?.closed === false) {
    // There is 2nd window. If the double click was on a slide, let
    // the 2nd window move to that slide, otherwise do nothing.
    if (h) secondwindow.postMessage({ event: "slide", v: h.id });
  } else if (!slidemode) {
    // Enter slide mode. If the double click was on or inside a slide,
    // start with that slide.
    curslide = h;  // May be null
    toggleModeAndFullscreen();
  }

  event.preventDefault();
  event.stopPropagation();
}


/* hashchange -- handle fragment id event, make target slide the current one */
function hashchange(e)
{
  var e;

  if (!location.hash) return;
  if (slidemode)
    // In slidemode, try to show the targeted slide, if any.
    targetSlide(location.hash.substring(1))
  else if (!commentsVisible &&
      (e = document.getElementById(location.hash.substring(1))?.
	  closest('.comment'))) {
    // In index mode, if comments are currently hidden and the target
    // is a comment (or inside a comment) then make make that comment
    // visible again, if it wasn't already.
    toggleOneComment(e, true);
    e.scrollIntoView();
  }
}


/* message -- handle a postMessage */
function message(e)
{
  var newEvent, h;

  if (e.source == secondwindow) { // Message from 2nd window to 1st window

    switch (e.data.event) {
    case "init":		// Second window has started
      document.body.classList.add("has-2nd-window");
      secondwindow.postMessage({event: "startTime", v: startTime});
      secondwindow.postMessage({event: "duration", v: duration});
      secondwindow.postMessage({event: "pauseStartTime", v: pauseStartTime});
      secondwindow.postMessage({event: document.body.classList
        .contains("darkmode") ? "darkmodeOn" : "darkmodeOff"});
      // Remember previous state and make speaker notes visible if
      // they are currently hidden.
      commentsWereVisible = commentsVisible;
      if (! commentsVisible) toggleComments();
      break;
    case "startTime":		// Other window informs us of a new start time
      startTime = e.data.v;
      forceClocks = true;
      requestClocksUpdate();	// Queue an update to the clocks
      break;
    case "duration":		// Other window informs us of a new duration
      duration = e.data.v;
      forceClocks = true;
      requestClocksUpdate();	// Queue an update to the clocks
      break;
    case "pauseStartTime":	// Other window got a pause/resume event
      pauseStartTime = e.data.v;
      if (pauseStartTime) document.body.classList.add("paused");
      else document.body.classList.remove("paused");
      forceClocks = true;
      requestClocksUpdate();	// Queue an update to the clocks
      break;
    case "keydown":
      newEvent = new KeyboardEvent("keydown", {key: e.data.v, bubbles: true});
      document.body.dispatchEvent(newEvent);
      break;
    case "slide":		// Make the slide with given id current
      if ((h = findSlide(e.data.v))) {
	if (curslide != h) curslide?.classList.remove("active");
	curslide = h;
	curslide.classList.add("active");
	curslide.scrollIntoView({behavior: "smooth", block: "center"});
	history.replaceState({}, "", "#" + curslide.id) // Show in location bar
      }
      break;
    case "noslide":		// 2nd window left slide mode
      curslide?.classList.remove("active");
      document.body.classList.remove("has-2nd-window");
      // Hide speaker notes if they were hidden before the 2nd window opened.
      if (! commentsWereVisible && commentsVisible) toggleComments();
      // Put current slide in the URL, so the index view can highlight it.
      if (curslide) location.replace("#" + curslide.id);
      curslide = null;
      break;
    case "darkmodeOn":		// Second window tells us it entered dark mode
      toggleDarkMode("on");
      break;
    case "darkmodeOff":		// Second window tells us it left dark mode
      toggleDarkMode("off");
      break;
    case 'pause':		// Second window tells us a video was paused
      if ((h = document.getElementById(e.data.id))) {
	h.b6pausing = true;
	h.pause();
      }
      break;
    case 'play':		// Second window tells us a video was started
      if ((h = document.getElementById(e.data.id))) {
	h.b6playing = true;
	h.play();
      }
      break;
    case 'seeked':		// Second window tells us a video was seeked
      if ((h = document.getElementById(e.data.id))) {
	h.b6seeking = true;
	h.currentTime = e.data.v;
      }
      break;
    case 'volumechange':	// Second window tells us a video was (un)muted
      if ((h = document.getElementById(e.data.id))) h.muted = e.data.v;
      console.log(`volume = ${h.volume}`);
      break;
    }

  } else if (e.source == firstwindow) { // Message from 1st window to 2nd

    switch (e.data.event) {
    case "startTime":		// 1st window tells us of new start time
      startTime = e.data.v;
      forceClocks = true;
      requestClocksUpdate();	// Queue an update to the clocks
      break;
    case "duration":		// 1st window tells us of new duration
      duration = e.data.v;
      forceClocks = true;
      requestClocksUpdate();	// Queue an update to the clocks
      break;
    case "pauseStartTime":	// 1st window got a pause/resume event
      pauseStartTime = e.data.v;
      if (pauseStartTime) document.body.classList.add("paused");
      else document.body.classList.remove("paused");
      forceClocks = true;
      requestClocksUpdate();	// Queue an update to the clocks
      break;
    case "click":
      newEvent = new MouseEvent("click", {detail: 1, bubbles: true});
      document.body.dispatchEvent(newEvent);
      break;
    case "slide":		// First window tells us to go to a slide
      if ((h = findSlide(e.data.v))) makeCurrent(h);
      break;
    case "keydown":
      newEvent = new KeyboardEvent("keydown", {key: e.data.v, bubbles: true});
      document.body.dispatchEvent(newEvent);
      break;
    case "darkmodeOn":		// First window tells us it entered dark mode
      toggleDarkMode("on");
      break;
    case "darkmodeOff":		// First window tells us it left dark mode
      toggleDarkMode("off");
      break;
    case "sync-on":
      syncmode = true;
      break;
    case "sync-off":
      syncmode = false;
      break;
    case "sync":		// Navigate ("+", "-", etc, or a slide ID)
      syncSlide(e.data.v);
      break;
    case 'pause':		// First window tells us a video was paused
      if ((h = document.getElementById(e.data.id))) {
	h.b6pausing = true;
	h.pause();
      }
      break;
    case 'play':		// First window tells us a video started
      if ((h = document.getElementById(e.data.id))) {
	h.b6playing = true;
	h.play();
      }
      break;
    case 'seeked':		// First window tells us a video was seeked
      if ((h = document.getElementById(e.data.id))) {
	h.b6seeking = true;
	h.currentTime = e.data.v;
      }
      break;
    case 'volumechange':	// First window tells us a video was (un)muted
      if ((h = document.getElementById(e.data.id))) h.muted = e.data.v;
      console.log(`volume = ${h.volume}`);
      break;
    }
  }
}


/* windowResize -- handle a resize of the window */
function windowResize(ev)
{
  if (slidemode) scaleBody();	// Recalculate the transform property
}


/* syncSlide -- handle the command string from a server-sent event */
function syncSlide(command)
{
  if (secondwindow?.closed !== false) {
    // There is no 2nd window, or we are ourselves the 2nd window.
    // Just after entering slidemode, finishToggleMode() won't have
    // run yet and curslide will not be set, which means next and
    // previous will do nothing. But that is OK.
    // The ":on" and ":off" messages are internal messages,
    // generated in message().
    switch (command) {
    case "+": if (!slidemode) toggleMode(); nextSlideOrElt(); break;
    case "++": if (!slidemode) toggleMode(); nextSlide(); break;
    case "-": if (!slidemode) toggleMode(); previousSlideOrElt(); break;
    case "--": if (!slidemode) toggleMode(); previousSlide(); break;
    case "^": if (!slidemode) toggleMode(); firstSlide(); break;
    case "$": if (!slidemode) toggleMode(); lastSlide(); break;
    case "0": if (slidemode) toggleMode(); break;
    case ":dark-on": toggleDarkMode("on"); break;
    case ":dark-off": toggleDarkMode("off"); break;
    default: if (!slidemode) toggleMode(); targetSlide(command); // ID or #
    }
  } else {				// There is a 2nd window
    secondwindow.postMessage({event: "sync", v: command});
  }
}


/* syncHandler -- handle a server-sent event with a slide number or slide ID */
function syncHandler(event)
{
  if (syncmode) syncSlide(event.data);
}


/* fullscreenChanged -- handle a fullscreenchange event */
function fullscreenChanged(ev)
{
  console.assert(!firstwindow);	// We assume this is the first window

  if (switchFullscreen) {
    // We are entering or leaving fullscreen mode because the F1 or F
    // key was pressed. Reset the flag, but don't change slide mode.
    switchFullscreen = false;
  } else {
    // We are entering or leaving fullscreen mode, but not because the
    // F1 or F keys were pressed. (Most likely, the Escape key was
    // pressed while in fullscreen mode, or the user used a browser
    // function to enter fullscreen mode.) If we are leaving
    // fullscreen mode while in slide mode, then leave slide mode. And
    // if we are entering fullscreen mode while not in slide mode,
    // then enter slide mode.
    if ((! document.fullscreenElement && slidemode) ||
	(document.fullscreenElement && !slidemode)) {
      // If the help text is on screen, remove it. Do this before
      // calling toggleMode(), because toggleMode() changes the style
      // attribute of all toplevel elements and we don't want the
      // style of the helptext to change.
      if (helptext?.parentElement) helptext.remove();
      if (toctext) toctext.close();
      toggleMode();
    }
  }
}


/* playButtonClick -- handle activation of the play/stop button */
function playButtonClick(ev)
{
  if (syncmode) warnSyncMode();
  else if (secondwindow?.closed !== false) toggleModeAndFullscreen();
  else secondwindow.postMessage({event: "keydown", v: "a"});

  // Avoid capturing keyboard events that are meant for navigating slides:
  ev.currentTarget.blur();
  ev.stopPropagation();
  ev.preventDefault();
}


/* secondWindowButtonClick -- handle activation of the 2nd-window button */
function secondWindowButtonClick(ev)
{
  console.assert(!firstwindow);	// We're on the first window

  if (syncmode) warnSyncMode()
  else if (secondwindow?.closed !== false) openSecondWindow()
  else secondwindow.postMessage({event: "keydown", v: "a"});

  // Avoid capturing keyboard events that are meant for navigating slides:
  ev.currentTarget.blur();
  ev.stopPropagation();
  ev.preventDefault();
}


/* prevButtonClick -- handle activation of the prevbutton */
function prevButtonClick(ev)
{
  // We're on the first window.
  console.assert(!firstwindow);

  if (secondwindow?.closed === false) {
    // There is a second window, send a left arrow key key event to it.
    secondwindow.postMessage({event: "keydown", v: "ArrowLeft"});
    ev.currentTarget.blur();
    ev.stopPropagation();
    ev.preventDefault();
  } else {
    // Start slide mode, as if play was clicked
    console.assert(!slidemode);
    playButtonClick(ev);
  }
}


/* nextButtonClick -- handle activation of the nextbutton */
function nextButtonClick(ev)
{
  // We're on the first window.
  console.assert(!firstwindow);

  if (secondwindow?.closed === false) {
    // There is a second window, send a space bar key event to it.
    secondwindow.postMessage({event: "keydown", v: " "});
    ev.currentTarget.blur();
    ev.stopPropagation();
    ev.preventDefault();
  } else {
    // Start slide mode, as if play was clicked
    console.assert(!slidemode);
    playButtonClick(ev);
  }
}


/* darkModeButtonClick -- handle activation of the darkmodebutton */
function darkModeButtonClick(ev)
{
  if (syncmode) warnSyncMode()
  else toggleDarkMode();

  // Avoid capturing keyboard events that are meant for navigating slides:
  ev.currentTarget.blur();

  ev.stopPropagation();
  ev.preventDefault();
}


/* commentButtonClick -- handle activation of the commentbutton */
function commentButtonClick(ev)
{
  if (syncmode) warnSyncMode();
  else requestAnimationFrame(() => toggleComments());

  // Avoid capturing keyboard events that are meant for navigating slides:
  ev.currentTarget.blur();

  ev.stopPropagation();
  ev.preventDefault();
}


/* beforeUnload -- handle a beforeunload event */
function beforeUnload(ev)
{
  if (secondwindow?.closed === false)
    // We are a firstwindow that has a second window. Close it.
    secondwindow.close();
  else if (firstwindow)
    // We are a second window. Tell the first window to exit slidemode.
    firstwindow.postMessage({event: 'keydown', v: 'Escape'});
}


/* initDarkMode -- set hasDarkMode depending on the style sheet and slides */
function initDarkMode()
{
  // If the body element has one of the classes darkmode or lightmode,
  // the author doesn't intend for any slides to change, so we set
  // hasDarkMode to false. Otherwise we check if the style sheet
  // supports dark mode.
  //
  // A style sheet that supports the classes "darkmode" and
  // "lightmode" on the body element should signal that by setting the
  // property "--has-darkmode" to "1" on the body element.
  //
  hasDarkMode =
    ! document.body.classList.contains('darkmode') &&
    ! document.body.classList.contains('lightmode') &&
    window.getComputedStyle(document.body)
	  .getPropertyValue('--has-darkmode') == "1";
}


/* addUI -- add buttons for slide mode and help */
function addUI()
{
  var playbutton, secondwindowbutton, helpbutton, prevbutton, nextbutton,
      darkmodebutton, commentbutton, div, playbuttons, secondwindowbuttons,
      helpbuttons, prevbuttons, nextbuttons, darkmodebuttons, commentbuttons;

  if (firstwindow) return;	// Do not add buttons on a second window

  // Wrap the buttons in a div with class "b6-ui".
  // If there already are elements with that class, use the first such one.
  if (! (div = document.getElementsByClassName("b6-ui")[0])) {
    div = document.createElement("div");
    div.setAttribute("class", "b6-ui");
    document.body.prepend(div);	// Insert the div before the slides.
  }

  // Create a play button. Clicking it has the same effect as pressing
  // the "A" key, i.e., enter slide mode.
  // If there already are such buttons, use those.
  playbuttons = document.getElementsByClassName("b6-playbutton");
  if (playbuttons.length == 0) {
    playbutton = document.createElement("button");
    playbutton.innerHTML = "<span>" + _("▶\uFE0E") + "</span> <span>" +
      _("play/<wbr>stop") + "</span>";
    playbutton.setAttribute("class", "b6-playbutton");
    playbutton.setAttribute("title", _("play slides or stop playing"));
    div.append(playbutton);
  }
  for (playbutton of playbuttons) {
    playbutton.addEventListener("click", playButtonClick);
    playbutton.addEventListener("dblclick", ignoreEvent);
  }

  // Create a 2nd-window button. Clicking it has the same effect as
  // pressing "2" when in slide mode, i.e., create a second window.
  // If there already are such buttons, use those.
  secondwindowbuttons =
    document.getElementsByClassName("b6-secondwindowbutton");
  if (secondwindowbuttons.length == 0) {
    secondwindowbutton = document.createElement("button");
    secondwindowbutton.innerHTML = "<span>" + _("⧉") + "</span> <span>" +
      _("play in 2nd window") + "</span>";
    secondwindowbutton.setAttribute("class", "b6-secondwindowbutton");
    secondwindowbutton.setAttribute("title",
      _("play/stop slides in a 2nd window"));
    div.append(secondwindowbutton);
  }
  for (secondwindowbutton of secondwindowbuttons) {
    secondwindowbutton.addEventListener("click", secondWindowButtonClick);
    secondwindowbutton.addEventListener("dblclick", ignoreEvent);
  }

  /* Create  buttons for next and previous. */
  // If there already are such buttons, use those.
  prevbuttons = document.getElementsByClassName("b6-prevbutton");
  if (prevbuttons.length == 0) {
    prevbutton = document.createElement("button");
    prevbutton.innerHTML = "<span>" + _("❮") + "</span> <span>" +
      _("back") + "</span>";
    prevbutton.setAttribute("class", "b6-prevbutton");
    prevbutton.setAttribute("title", _("previous slide"))
    div.append(prevbutton);
  }
  for (prevbutton of prevbuttons) {
    prevbutton.addEventListener("click", prevButtonClick);
    prevbutton.addEventListener("dblclick", ignoreEvent);
  }

  nextbuttons = document.getElementsByClassName("b6-nextbutton");
  if (nextbuttons.length == 0) {
    nextbutton = document.createElement("button");
    nextbutton.innerHTML = "<span>" + _("❯") + "</span> <span>" +
      _("forward") + "</span>";
    nextbutton.setAttribute("class", "b6-nextbutton");
    nextbutton.setAttribute("title", _("next slide or element"))
    div.append(nextbutton);
  }
  for (nextbutton of nextbuttons) {
    nextbutton.addEventListener("click", nextButtonClick);
    nextbutton.addEventListener("dblclick", ignoreEvent);
  }

  // Create a dark mode toggle, if the style sheet has support for
  // dark mode. Clicking it has the same effect as pressing "d" when
  // in slide mode, i.e., add or remove class=darkmode on BODY.
  if (hasDarkMode) {
    darkmodebuttons = document.getElementsByClassName("b6-darkmodebutton");
    if (darkmodebuttons.length == 0) {
      darkmodebutton = document.createElement("button");
      darkmodebutton.innerHTML = "<span>" + _("◑") + "</span> <span>" +
	_("dark mode") + "</span>";
      darkmodebutton.setAttribute("class", "b6-darkmodebutton");
      darkmodebutton.setAttribute("title", _("toggle dark mode on/off"));
      div.append(darkmodebutton);
    }
    for (darkmodebutton of darkmodebuttons) {
      darkmodebutton.addEventListener("click", darkModeButtonClick);
      darkmodebutton.addEventListener("dblclick", ignoreEvent);
    }
  }

  // Create a button to toggle the display of comments.
  commentbuttons = document.getElementsByClassName("b6-commentbutton");
  if (commentbuttons.length == 0) {
    commentbutton = document.createElement("button");
    commentbutton.innerHTML = "<span>" + _("🗊") + "</span> <span>" +
      _("notes") + "</span>";
    commentbutton.setAttribute("class", "b6-commentbutton");
    commentbutton.setAttribute("title", _("show/hide notes"));
    div.append(commentbutton);
  }
  for (commentbutton of commentbuttons) {
    commentbutton.addEventListener("click", commentButtonClick);
    commentbutton.addEventListener("dblclick", ignoreEvent);
  }

  // Create a help button. Clicking it has the same effect as pressing
  // "?" when in slide mode, i.e., pop up the help window.
  // If there already is such a button, use that.
  helpbuttons = document.getElementsByClassName("b6-helpbutton");
  if (helpbuttons.length == 0) {
    helpbutton = document.createElement("button");
    helpbutton.innerHTML = "<span>" + _("?") + "</span> <span>" + _("help") +
      "</span>";
    helpbutton.setAttribute("class", "b6-helpbutton");
    helpbutton.setAttribute("title", _("help"));
    div.append(helpbutton);
  }
  for (helpbutton of helpbuttons) {
    helpbutton.addEventListener("click", ev => {
      help();
      ev.currentTarget.blur();
      ev.preventDefault();
      ev.stopPropagation();
    });
    helpbutton.addEventListener("dblclick", ignoreEvent);
  }

  // // Add logo of b6+ with a link to its home page.
  // div.insertAdjacentHTML("beforeend",
  //   "<a href=\"https://www.w3.org/Talks/Tools/b6plus/\" class=b6pluslink>" +
  //     "<img src=\"https://www.w3.org/Talks/Tools/b6plus/b6plus-logo.svg\" " +
  //     "alt=\"b6+\"></a>");

}


/* checkURL -- process query parameters ("full", "static" and "sync") */
function checkURL()
{
  var h;

  const params = new URLSearchParams(location.search);
  if (params.get("full") != null) fullmode = true;
  if (params.get("static") != null) interactive = false;
  if ((h = params.get("visible-notes")) != null) commentsDefault = h !== 'off';
  if ((syncURL = params.get("sync"))) tryToggleSync();
}


/* checkIfFramed -- if we're inside an iframe, add target=_parent to links */
function checkIfFramed()
{
  var anchors, i;

  if (window.parent != window) { // Only if we're not the top document
    anchors = document.getElementsByTagName('a');
    for (i = 0; i < anchors.length; i++)
      if (!anchors[i].hasAttribute('target'))
	anchors[i].setAttribute('target', '_parent');
    document.body.classList.add('framed'); // Allow the style to do things
  }
}


/* checkOptions -- look for b6plus options in the class attribute on body */
function checkOptions()
{
  var c, t;

  for (c of document.body.classList)
    if (c === 'noclick') {
      noclick = 1;
    } else if ((t = c.match(/^hidemouse(=([0-9.]+))?$/))) {
      hideMouseTime = 1000 * (t[2] ?? 5); // Default is 5s if no time given
    } else if ((t = c.match(/^incremental-([a-z]+)$/))) {
      if (t[1] !== "freeze" && t[1] !== "reset" && t[1] !== "forwardonly" &&
	  t[1] !== "symmetric")
	console.warn(`"${t[1]}" is not a valid value after "incremental=". Must be one of "symmetric", "reset", "forwardonly" or "freeze". Falling back to "${incrementalsBehavior}".`);
      else
	incrementalsBehavior = t[1];
    } else if (c === 'loop') {
      loopSlideShow = true;
    } else if (c === 'visible-notes') {
      commentsDefault = true;
    }

  /* Default time for automatically advancing slides. 0 means don't advance. */
  slideTiming = timeToMillisec(document.body.dataset.timing);
}


/* initLanguage -- determine the language to localize to */
function initLanguage()
{
  var i;

  // Get language from the HTML element, default to en-us
  language = (document.documentElement.getAttribute("lang") ?? "en-us")
    .toLowerCase();

  // Remove subtags until we have a match among the translations of "min"
  while (!translations["min"][language] && (i = language.lastIndexOf("-")) >= 0)
    language = language.slice(0, i);
}


/* checkIfSecondWindow -- if this is a second windo, configure it */
function checkIfSecondWindow()
{
  var styleElt;

  if (window.opener && window.opener != window) {

    // If this is a second window, remember the corresponding first
    // one, so we can use postMessage() on it. We need to store it in
    // a variable, because after the next open("#foo"), window.opener
    // will be reset to window.
    firstwindow = window.opener;

    // Modify the title.
    document.title = "Drag to 2nd screen, then press F for full screen  |  " +
      document.title + "  |  b6+";

    // Accessibility hint.
    if (interactive) document.body.setAttribute("role", "application");

    // Add a message handler for messages from the first window.
    window.addEventListener("message", message);

    // Go into slide mode. Once in slide mode, finishToggleMode() will
    // send an "init" event to the first window.
    toggleMode();
 }
}


/* recordMousePosition -- actions when the mouse is over a slide */
function recordMousePosition(ev)
{
  mouseX = ev.clientX;
  mouseY = ev.clientY;
}


/* showURL -- show a popover with the URL of the slide under the mouse */
function showURL()
{
  // This shows the URL of the slide that the mouse is over, but only
  // when the Alt key is pressed and only in index mode.
  //
  var url, button, span, h, rect;

  console.assert(!slidemode);

  // Create an overlay if not created yet.
  if (! hoverOverlay) {
    hoverOverlay = document.createElement('div');
    button = document.createElement('button');
    button.textContent = _('Copy URL');
    button.style.marginRight = '1em';
    button.addEventListener('click',
      (f) => navigator.clipboard.writeText(f.currentTarget.value));
    span = document.createElement('span');
    span.style.wordBreak = 'break-all';
    hoverOverlay.append(button, span);
    hoverOverlay.style.margin = '0 -100% 0 0';
    hoverOverlay.style.maxWidth = '90%';
    hoverOverlay.style.position = 'absolute';
    hoverOverlay.popover = 'auto';
    document.body.append(hoverOverlay);
  }

  h = document.elementFromPoint(mouseX, mouseY);
  while (h && ! isStartOfSlide(h)) h = h.previousSibling || h.parentNode;
  if (h) {
    url = new URL(location);
    url.hash = h.id;
    hoverOverlay.firstChild.value =
      hoverOverlay.firstChild.nextSibling.textContent = url.toString();

    requestAnimationFrame(() => {
      // First pop it up in the top left corner.
      hoverOverlay.style.top = '0';
      hoverOverlay.style.left = '0';
      hoverOverlay.showPopover({source: h});

      // Now move the overlay as near as possible to the mouse position
      // without extending outside the viewport.
      rect = hoverOverlay.getBoundingClientRect();
      hoverOverlay.style.left = (visualViewport.pageLeft +
	  Math.max(0, Math.min(visualViewport.width -
	      rect.width, mouseX - 2))) + 'px';
      hoverOverlay.style.top = (visualViewport.pageTop + mouseY - 2) + 'px';
    });
  }
}


/* toggleOneComment -- make a comment element visible or invisible */
function toggleOneComment(h, makeVisible)
{
  if (makeVisible) {
    console.assert(h.b6savedstyle !== undefined);
    h.style.cssText = h.b6savedstyle;
  } else {
    if (h.b6savedstyle === undefined) h.b6savedstyle = h.style.cssText;
    h.style.visibility = "hidden";
    h.style.position = "absolute";
    h.style.overflow = "hidden";
    h.style.top = h.style.left = h.style.width = h.style.height = "0";
  }
}


/* toggleComments -- hide or show comments (speaker notes) after slides */
function toggleComments()
{
  var e, after = false;
  var oldrect, newrect;

  // Get the position in the viewport of one of the slides that is
  // visible in the viewport, so we can scroll the page to the same
  // slide after we hide or show the comments. Either use the same
  // slide we used last time we were here, if it is still visible, or
  // the first slide that is visible.
  if (!visibleSlide?.b6IsInViewport) {
    visibleSlide = document.body.firstChild;
    while (visibleSlide && !visibleSlide.b6IsInViewport)
      visibleSlide = visibleSlide.nextSibling;
  }
  oldrect = visibleSlide?.getBoundingClientRect();

  // Hide or show all comments, except any that occur before the first slide.
  if (commentsVisible) {	// Comments are currently visible
    for (const h of document.body.children) {
      if (isStartOfSlide(h))
	after = true;
      else if (after && h.classList.contains('comment'))
	toggleOneComment(h, false)
    }
    commentsVisible = false;
  } else {			// Comments are currently hidden.
    for (const h of document.body.children) {
      if (isStartOfSlide(h))
	after = true;
      else if (after && h.nodeType === 1 && h.classList.contains('comment'))
	toggleOneComment(h, true)
    }
    commentsVisible = true;
  }

  // If the current target is a comment (or inside a comment), make
  // sure that comment is visible.
  if (! commentsVisible &&
      (e = document.getElementById(location.hash.substring(1))
	?.closest('.comment')))
    toggleOneComment(e, true);

  // Scroll such that the same slide is at the same position in the
  // viewport.
  visibleSlide?.scrollIntoView({block: "center"});
  newrect = visibleSlide?.getBoundingClientRect();
  if (oldrect && newrect)
    scroll(visualViewport.pageLeft - oldrect.left + newrect.left,
      visualViewport.pageTop - oldrect.top + newrect.top);
}


/* trackVisibleSlides -- keep track of which slides are in the viewport */
function trackVisibleSlides()
{
  var observer;

  // Slides that are visible have b6IsInViewport set to true. This is
  // used in toggleComments() to scroll the document to approximately
  // the same slide after comments were made visible or invisible.
  observer = new IntersectionObserver((entries, observer) => {
    for (const e of entries)
      if (e.isIntersecting) e.target.b6IsInViewport = true
      else e.target.b6IsInViewport = false});

  for (const h of document.body.children)
    if (isStartOfSlide(h)) observer.observe(h);
}


/* initLiveRegion -- find or create an ARIA live region for announcing slides */
function initLiveRegion()
{
  /* Find or create an element to announce the slides in speech. */
  if ((liveregion =
      document.querySelector("[role=region][aria-live=assertive]"))) {
    savedContent = liveregion.innerHTML;	// Remember its content, if any
    liveregion.innerHTML = "";
  } else {
    liveregion = document.createElement("div");
    liveregion.setAttribute("role", "region");
    liveregion.setAttribute("aria-live", "assertive");
    document.body.appendChild(liveregion);
    savedContent = _("Stopped.");		// Default to an English message
  }
}


/* initialize -- add event handlers, initialize state */
function initialize()
{
  initLanguage();		// Determine the language for localized text
  checkIfFramed();		// Add target attributes if needed
  checkOptions();		// Look for options in body.classList
  checkURL();			// Parse query parameters (full, static)
  initLiveRegion();		// Find or create an ARIA live region
  numberSlides();		// Count & number the slides and give them IDs
  instrumentVideos();		// Add event handlers to any video elements
  document.body.classList.add('b6plus'); // Tell style sheet that b6+ is used
  checkIfSecondWindow();	// If this is a secondwindow, configure it
  window.addEventListener('resize', windowResize, true);

  if (interactive) {		// Only add event listeners if not static
    initClocks();		// Find and initialize clock elements
    initDarkMode();		// Set hasDarkMode to true or false
    addUI();			// Add buttons for slide mode and help
    trackVisibleSlides();	// Install an IntersectionObserver
    if (! commentsDefault) toggleComments(); // Hide elts with class=comment
    document.addEventListener('click', mouseButtonClick, false);
    document.addEventListener('keydown', keyDown, true);
    document.addEventListener('dblclick', doubleClick, false);
    window.addEventListener('hashchange', hashchange, false);
    document.addEventListener('touchstart', gestureStart, false);
    document.addEventListener('touchmove', gestureMove, false);
    document.addEventListener('touchend', gestureEnd, false);
    document.addEventListener('touchcancel', gestureCancel, false);
    window.addEventListener("message", message, false);
    window.addEventListener("beforeunload", beforeUnload, false);
    document.addEventListener('mousemove', recordMousePosition);
    if (!firstwindow)
      document.addEventListener("fullscreenchange", fullscreenChanged, false);
  }

  if (fullmode) toggleMode();	// Slide mode, but not fullscreen
}


/* initializeLayout -- initialization that needs all resources to be loaded */
function initializeLayout()
{
  autosize();			// Maybe shrink images with class=autosize
  textFit();			// Maybe shrink font on slides w/ class=textfit
}


/* main */
if (!!document.b6IsLoaded) return; // Don't load b6plus twice
document.b6IsLoaded = true;

if (document.readyState !== 'loading') initialize();
else document.addEventListener('DOMContentLoaded', initialize);

if (document.readyState === 'complete') initializeLayout();
else window.addEventListener('load', initializeLayout);

})();
