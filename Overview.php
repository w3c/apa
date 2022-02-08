<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" dir="ltr">
	<head>
		<?php include "_head.phi"; ?>
		<title>Accessible Platform Architectures (APA) Working Group</title>
	</head>
	<body>
		<?php include "_header.phi"; ?>
		<h1>Accessible Platform Architectures (APA) Working Group</h1>
		<p>The mission of the Accessible Platform Architectures Working Group (APA WG) is to ensure W3C specifications provide support for accessibility to people with disabilities. The group advances this mission through review of W3C specifications, development of technical support materials, collaboration with other Working Groups, and coordination of harmonized accessibility strategies within W3C.</p>
		<section id="announcements">
			<h2>Announcements</h2>
			<?php $group = "APA";
require_once "_db_connect.phi";
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
		<section id="work">
			<h2>Current Work</h2>
			<p>The APA WG is engaged on the following work:</p>
			<ul>
				<li>Publications: The Working Group maintains a comprehensive list of <a href="deliverables">publications and status</a>, which include: <ul>
						<li>Several <a href="https://www.w3.org/TR/?title=accessibility%20user%20requirements">Accessibility User Requirements</a> guides for specific technologies;</li>
						<li><a href="https://w3c.github.io/apa/fast/">Framework for Accessible Specification of Technologies</a> plus <a href="https://w3c.github.io/apa/fast/checklist.html">FAST checklist</a>,</li>
						<li><a href="https://w3c.github.io/apa/captcha/">Inaccessibility of CAPTCHA</a>,</li>
						<li><a href="https://www.w3.org/TR/?title=pronunciation">Pronunciation technology</a> to provide for proper pronunciation in HTML content when using text to speech (TTS) synthesis,</li>
						<li><a href="https://www.w3.org/TR/?title=personalization">Personalization technology</a> to enable design of sites in a way that they can be personalized to the needs of each user allows more optimal accessibility.</li>
					</ul>
				</li>
				<li>Specification reviews: input is solicited on the <a href="http://lists.w3.org/Archives/Public/w3c-wai-ig/">WAI Interest Group mailing list</a>, tracked in the <a href="https://www.w3.org/WAI/APA/wiki/Category:Spec_Review">APA specification review wiki pages</a>and comments are copied to the <a href="https://lists.w3.org/Archives/Public/public-apa/">public-apa mailing list</a>.</li>
				<li>Community groups: the Working Group maintains a <a href="https://www.w3.org/WAI/APA/wiki/Community_Groups">list of community groups to track</a>.</li>
			</ul>
			<p>The <a href="project">APA Project Plan</a> details intended timeline and milestones for this work.</p>
		</section>
		<section>
			<h2>Horizontal Review</h2>
			<p>The APA Working Group performs <a href="https://www.w3.org/wiki/DocumentReview">accessibility horizontal review</a> of other technologies under development by W3C. Documents reviewed from 2015 to present are shown in the <a href="https://www.w3.org/WAI/APA/wiki/Category:Spec_Review">Specification Review list</a>. Active reviews under way are shown in the <a href="https://w3c.github.io/horizontal-issue-tracker/?repo=w3c/a11y-review">Accessibility Review Comment Tracker</a>. The group also reviews <a href="https://github.com/w3c/strategy/issues?q=is%3Aissue+is%3Aopen+label%3A%22Horizontal+review+requested%22%22">charters of groups</a> to check that deliverables and liaisons reflect accessibility needs.</p>
			<p>To request review of a GitHub issue from the APA, add the "a11y-tracker" label to the issue. If the APA files an issue or agrees to comment on an issue, the label will be changed to "a11y-needs-resolution". To request review outside of a GitHub issue context, send email to <a href="mailto:group-apa-chairs@w3.org">group-apa-chairs@w3.org</a>.</p>
		</section>
		<section id="taskforces">
			<h2>Task Forces</h2>
			<p>The APA WG uses <a href="task-forces">task forces</a> to focus work on specific projects. Task Forces are described on the related page.</p>
		</section>
		<section id="contribute">
			<h2>How to Comment, Contribute, and Participate</h2>
			<p>The APA Working Group engages with stakeholders in a variety of ways. See the following resources for information on:</p>
			<ul>
				<li><a href="contribute">How to contribute to the Working Group and file comments</a>;</li>
				<li><a href="https://github.com/w3c/apa/">How to contribute to the source repository directly</a>;</li>
				<li><a href="participation">How to participate in (join) the Working Group</a>.</li>
			</ul>
		</section>
		<section id="communication">
			<h2>Meetings and Communication</h2>
			<p>The APA WG conducts its work using a variety of synchronous and asynchronous tools. The <a href="communication">communication</a> page provides details about:</p>
			<ul>
				<li>Teleconferences of the Working Group and its task forces (also see <a href="minutes">meeting minutes</a>);</li>
				<li>Face to face meetings (also see face to face <a href="wiki/Meetings">meeting pages</a>);</li>
				<li>Email lists;</li>
				<li><a href="https://github.com/w3c/apa/">apa source repository</a>;</li>
				<li><a href="wiki/">Wiki</a>;</li>
				<li><a href="/2002/09/wbs/83907/">Web-Based Surveys (WBS)</a>;</li>
				<li><a href="track/">Issue Tracker</a>;</li>
				<li><a href="https://www.w3.org/Bugs/Public/">Bugzilla</a>;</li>
				<li><a href="https://github.com/w3c/apa/issues">apa source repository issue tracker</a>.</li>
			</ul>
			<p>These tools are used by participants of the Working Group. For ways non-participants can contribute, see <a href="contribute">how to contribute to the Working Group and file comments</a>.</p>
			<section id="minutes">
				<h3>Meeting Minutes</h3>
				<p><a href="minutes">Minutes from previous meetings</a> are available.</p>
			</section>
		</section>
		<section id="administrative">
			<h2>Administrative Information</h2>
			<p> Work of the APA WG is in accordance with the <a href="http://www.w3.org/2015/Process-20150901/">W3C Process</a>. APA work is funded in part by the <a href="http://www.w3.org/WAI/Core2015/">WAI Core 2015 Project</a>. The work of this group does not necessarily reflect the views or policies of the funders.</p>
			<p>The chairs of the APA WG, responsible for overall leadership and management, are <a href="mailto:matkinson@tpgi.com">Matthew Atkinson</a> and <a href="mailto:janina@rednote.net">Janina Sajka</a>. The staff contact, responsible for <a href="http://www.w3.org/Consortium/Process/">W3C Process</a> and general support, is <a href="http://www.w3.org/People/cooper/">Michael Cooper</a>. Administrative inquiries may be sent to <a href="mailto:group-apa-chairs@w3.org">group-apa-chairs@w3.org</a>.</p>
			<p>The Accessible Platform Architectures maintains the following operational resources:</p>
			<ul>
				<li><a href="decision-policy">Decision policy</a>;</li>
				<li><a href="wiki/Decisions">Record of decisions made by the WG</a>;</li>
				<li><a href="archive">Archives of past activity</a>;</li>
				<li><a href="minutes">meeting minutes</a>.</li>
			</ul>
			<p>W3C maintains a <a href="http://www.w3.org/2004/01/pp-impl/83907/status">public list of any patent disclosures</a> made in connection with the deliverables of the group; that page also includes instructions for disclosing a patent.</p>
			<p><a href="https://www.w3.org/2000/09/dbwg/details?group=83907&amp;public=1">Current participants in the APA WG</a>.</p>
		</section>
		<?php include "_footer.phi"; ?>
	</body>
</html>
