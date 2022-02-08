<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" dir="ltr">
	<head>
<?php include "../../_head.phi"; ?> 		
<title>CSS Accessibility Task Force</title>
	</head>
	<body>
<?php include "../../_header.phi"; ?>		
 		<h1>CSS Accessibility Task Force (CSS A11Y TF)<br /> <span class="subhead">of the APA, ARIA, and CSS WGs</span></h1>
		<section id="contents">
			<h2>Page Contents</h2>
				<ul>
					<li><a href="#announcements">Announcements</a></li>
					<li><a href="#communication">Meetings and Communication</a></li>
					<li><a href="#work">Current Work</a></li>
					<li><a href="#contribute">How to Comment, Contribute, and Participate</a></li>
					<li><a href="#administrative">Administrative Information</a></li>
				</ul>
		</section>
		<section id="announcements">
			<h2>Announcements</h2>
<?php
$group = "CSS-A11Y";
require_once "../../_db_connect.phi";
$sth = $dbh->prepare("select * from announcements where `group` = :group and (date_start <= curdate() or date_start IS NULL) and (date_end >= curdate() or date_end is null) order by date_display, date_start, header;");
$sth->bindValue(":group", $group, PDO::PARAM_STR);
$sth->execute();
if ($sth->rowCount() > 0) {
	while ($row = $sth->fetch()) {
		print("<p>");
		if ($row['date_display'] != null) print("<em>" . $row['date_display'] . "</em> - ");
		else if ($row['date_start'] != null) print("<em>" . $row['date_start'] . "</em> - ");
		if ($row['header'] != null) print("<strong>" . $row['header']  . "</strong>: ");
		print($row['text']);
		print("</p>");
	}
} else {
	print("<p>No announcements at the moment.</p>");
}
?>
		</section>
		
		<section id="communication">
			<h2>Meetings and Communication</h2>
			<p>The CSS A11Y TF conducts its work using a variety of synchronous and asynchronous tools. Most work is done via email and issues as shown below, supplemented by occasional teleconferences.</p>
			<ul>
				<li>Most work is conducted via the <a href="https://github.com/w3c/css-a11y/issues">css-a11y issue tracker</a>;</li>
				<li><a href="#email">Email lists</a>, used largely for administrative matters;</li>
				<li>IRC discussion on the <a href="irc://irc.w3.org/css-a11y">#css-a11y</a> IRCchannel, used largely for minute-taking;</li>
				<li><a href="/2002/09/wbs/94039/">Web-Based Surveys (WBS)</a>;</li>
				<li>Teleconferences when needed (also see <a href="minutes">meeting minutes</a>);</li>
				<li>Face to face meetings when needed, primarily at the annual Technical Plenary;</li>
				<li>GitHub resources, currently in one repository but potentially later in others:
					<ul>
						<li><a href="https://github.com/w3c/css-a11y/">CSS-A11y main source repository</a>;</li>
						<li><a href="https://github.com/w3c/css-a11y/wiki">Wiki</a>;</li>
						<li><a href="https://github.com/w3c/css-aam/">Separate repository for CSS Accessibility API Mappings deliverable</a>.</li>
					</ul>
				</li>
			</ul>
			<p>These tools are used by participants of the Task Force. For ways non-participants can contribute, see <a href="../../contribute">how to contribute to the Working Group and file comments</a>.</p>
			
			<section id="teleconferences">
				<h3>Teleconferences</h3>
				<p>Teleconference details will be announced when a time is selected.</p>
			</section>
			<section id="minutes">
				<h3>Meeting Minutes</h3>
				<p><a href="minutes">Minutes from previous meetings</a> are available.</p>
			</section>
			<section id="email">
				<h3>Mailing Lists</h3>
				<p>The CSS A11Y TF uses the public-css-a11y@w3.org mailing list (<a href="http://lists.w3.org/Archives/Public/public-css-a11y/">mailing list archives</a>) for email discussion. Participants are automatically added to the mailing list when they become a participant of the Task Force. Non-subscribers may post, but you must join the task force to subscribe to the list.</p>
			</section>
		</section>
		
		<section id="work">
			<h2>Current Work</h2>
			<p><a href="https://github.com/w3c/css-a11y/wiki">See the wiki for current planning and draft documents</a>.</p>
		</section>
		<section id="publications">
			<h2>Publications</h2>
			<p>When the Task Force develops publications, they will be listed here. See also the <a href="https://github.com/w3c/css-a11y/">CSS A11Y GitHub repository</a>.</p>

		</section>
		
		<section id="contribute">
			<h2>How to Comment, Contribute, and Participate</h2>
			<p>To join the CSS A11Y TF, individuals must be participants of the APA WG. Participants are expected to <a href="work-statement#participation">actively contribute</a> to the work of the Task Force. If you are interested in participating in the CSS A11Y TF, please send e-mail to: <a href="mailto:ratan@microsoft.com,ted_drake@intuit.com?subject=CSS%20Accessibility%20Task%20Force%20Enquiry">Rossen Atanassov, Ted Drake</a> and include a little bit about what you’re interested in and how you think that you may be able to contribute to the Task Force. Then follow the participation procedures of the Working Group through which you wish to participate, and once you have joined ask <a href="mailto:cooper@w3.org">Michael Cooper</a> or <a href="mailto:chris@w3.org">Chris Lilley</a> to add you to the task force.</p>
			<p>To contribute without joining the task force, see the public contribution information of each sponsoring Working Group for general instructions. To contribute to documents under development, see <a href="https://github.com/w3c/css-aria/">how to contribute to the source repository directly</a>.</p>
			<p><a href="https://www.w3.org/2000/09/dbwg/details?group=94039&amp;public=1">Current participants in the CSS A11Y TF</a>.</p>
		</section> 
		
		<section id="administrative">
			<h2>Administrative Information</h2>
			<p>The CSS Accessibility Task Force (CSS A11Y TF) is a Task Force of the <a href="http://www.w3.org/WAI/APA/">Accessible Platform Architectures Working Group (APA WG)</a>, the <a href="https://www.w3.org/Style/CSS/">Cascading Style Sheets Working Group (CSS WG)</a>, and the <a href="http://www.w3.org/WAI/ARIA/">Accessible Rich Internet Applications Working Group (ARIA WG)</a>. It assists these Working Groups to address accessibility to people with disabilities where impacted by features of Cascading Style Sheets.</p>
			<h3 id="facilitator">Facilitator and Contacts</h3>
			<ul>
				<li><strong>Facilitators:</strong> Rossen Atanassov, Ian Pouncey, Ted Drake</li>
				<li><strong>APA and ARIA Staff Contact:</strong> Michael Cooper</li>
				<li><strong>CSS Staff Contact:</strong> Chris Lilley</li>
			</ul>
			<h3 id="work-statement">Work Statement</h3>
			<p>The <a href="work-statement">CSS Accessibility Task Force Work Statement</a> defines the initial objective, scope, approach, and participation of the Task Force.</p>
		</section>
<?php include "../../_footer.phi"; ?> 		
	</body>
</html>