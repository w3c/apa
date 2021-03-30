<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" dir="ltr">
	<head>
<?php include "_head.phi"; ?>
		<title>APA Communication</title>
	</head>
	<body>
<?php include "_header.phi"; ?>
		<h1>APA Communication</h1>

		<p>The APA Working Group uses the following tools and procedures to perform its work.</p>

		<section>
			<h2>Teleconferences</h2>
			<p>The APA WG and its task forces participate in the following teleconferences. Unless otherwise mentioned, times are given in Boston time because the UTC time floats with U.S. Daylight Savings Time changes. Follow the link to convert to local time. Meetings take place on <a href="https://www.w3.org/2006/tools/wiki/Category:WebEx">WebEx</a>, using the link given on the meeting name. <a href="https://www.w3.org/wiki/IRC">IRC</a> is used for text chat and <a href="http://dev.w3.org/cvsweb/~checkout~/2002/scribe/scribedoc.htm?content-type=text/html">minute taking</a>. It is not expected that participants will join all meetings; instead please strive to be a regular participant in the meeting(s) of greatest relevance to your work in the group.</p>
			<ul>
				<?php
					include "../../2017/01/telecon-info/filtered-telecon-list.phi";
					showTeleconList("ag-coga", "apa-plan", "apa-rqtf", "apa-rqtf-plan", "apa-tpac", "apa-wg", "aria-personalization", "aria-personalization-plan", "apa-pronunciation", "apa-pronunciation-plan", "coga-plan");
				?>
			</ul>
			<p><a href="minutes">Minutes of past teleconferences</a> are available.</p>
		</section>

		<section>
			<h2>Face to Face Meetings</h2>
			<!--
			<p>The next anticipated Face to Face meeting is the week of 19 - 23 September in Lisbon, Portugal as part of <a href="https://www.w3.org/2016/09/TPAC/">TPAC 2016</a>.</p>
			-->
			<p><a href="wiki/Meetings">Previous meetings</a> of the APA WG are available.</p>
		</section>

		<section>
			<h2>Email lists</h2>
			<ul>
				<li><strong>public-apa@w3.org</strong> - Working Group discussion list; public archive; public can post; inquire to subscribe (<a href="http://lists.w3.org/Archives/Public/public-apa/">public-apa archives</a>).</li>
				<li><strong>public-apa-admin@w3.org</strong> - Working Group decision list; public archive; must be WG member to post or subscribe (<a href="http://lists.w3.org/Archives/Public/public-apa-admin/">public-apa-admin archives</a>).</li>
				<!--
				<li><strong>public-apa-comments@w3.org</strong> - For WG to receive public comments on publications; public archive; anyone may post; only editors subscribe (<a href="http://lists.w3.org/Archives/Public/public-apa-comments/">public-apa-comments archives</a>).</li>
				-->
				<li><strong>wai-xtech@w3.org</strong> - Public discussion list on technical topics in web accessibility and where specification review announcements and submissions are copied; public archive; anyone may post or subscribe (<a href="http://lists.w3.org/Archives/Public/wai-xtech/">wai-xtech archives</a>).</li>
				<li><strong>w3c-wai-ig@w3.org</strong> - Announcements only Working Group activities; public archive; anyone may post or subscribe (<a href="http://lists.w3.org/Archives/Public/w3c-wai-ig/">w3c-wai-ig archives</a>).</li>
			</ul>
		</section>

		<section>
			<h2>Source repository</h2>
			<p>Publications under development are maintained in the <a href="https://github.com/w3c/pfwg/">APA GitHub repository</a>. This distributed source control system allows multiple people to edit simultaneously, public view of changes as they are committed, and "pull requests" to enable people without direct commit access to suggest contributions. Publication editors are designated by the WG chair and have direct commit access. Editors commit to execute the group consensus, request review of non-editorial changes, process conflicting input (from issues, pull requests, and discussions) in a neutral manner, and maintain document quality.</p>
			<!--<p><a href="editors/">Information for editors</a></p>-->
		</section>

		<section>
			<h2>IRC</h2>
			<p>W3C Working Groups use <a href="https://www.w3.org/wiki/IRC">IRC</a> for synchronous text chat and, with the aid of some IRC bots, to record minutes of teleconferences. The APA WG uses the following IRC channels. They are available at any time but are only routinely logged during teleconferences.</p>
			<ul>
				<li><a href="irc://irc.w3.org/apa">#apa</a> for the main Working Group.</li>
				<li><a href="irc://irc.w3.org/html-a11y">#html-a11y</a> for the HTML Accessibility Task Force.</li>
				<li><a href="irc://irc.w3.org/coga">#coga</a> for the Cognitive Accessibility Task Force.</li>
				<li><a href="irc://irc.w3.org/rd">#rd</a> for the Research and Development Task Force.</li>
			</ul>
		</section>

		<section>
			<h2>Other</h2>
			<p>The APA WG uses the following web-based resources as well:</p>
			<ul>
				<li><a href="wiki/">Wiki</a>, to develop or record content not immediately intended for formal publication. This is writeable by WG members and publicly readable.</li>
				<li><a href="http://www.w3.org/2002/09/wbs/83907/">Web-Based Surveys (WBS)</a>, to measure aggregate group opinion. These can be completed by WG members with publicly readable results.</li>
				<li><a href="track/">Issue Tracker</a>, to track issues and action items. This is maintainable by WG members and publicly readable.</li>
				<li><a href="https://www.w3.org/Bugs/Public/">Bugzilla</a>, to track issues specific to publications. This shared tool allows some collaboration with other W3C groups, but in general is not actively used by the WG. Users with a <a href="https://www.w3.org/Bugs/Public/createaccount.cgi">W3C Bugzilla account</a> can file or comment on issues, and bugs are publicly readable.</li>
				<li><a href="https://github.com/w3c/pfwg/issues">GitHub Issues</a>, to track issues for publications maintained in the GitHub repository. Users with a <a href="https://github.com/">GitHub account</a> can file or comment on ussues, and issues are publicly readable.</li>
			</ul>
		</section>

<?php include "_footer.phi"; ?>
	</body>
</html>