<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" dir="ltr">
	<head>
<?php include "../../_head.phi"; ?> 		
<title>Pronunciation Task Force</title>
	</head>
	<body>
<?php include "../../_header.phi"; ?>		
 		<h1>Pronunciation Task Force<br /> <span class="subhead">of the APA WG</span></h1>
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
$group = "Pronunciation";
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
		<section id="pronunciation-overview">
			<section id="pronunciation-overview-page">
			<h2>Pronunciation Overview</h2>
			<p><a href="https://www.w3.org/WAI/pronunciation/">Pronunciation Overview</a> provides an overview of the overall pronunciation technique in W3C.</p>
			</section>
			<section id="pronunciation-video">
			<h2>Pronunciation Video</h2>
			<p>There is also a short <a href="https://ln.sync.com/dl/10e1a9c60/92faztk9-he4wbve6-twt5jp3h-zuh6brfd" aria-label="APA-Pronunciation-video.mp4">pronunciation technical video</a> available, it shows the demo of pronunciation technical and approaches for controlling pronunciation in spans of web content where uniform markup can make the difference.</p>
			</section>
		</section>
		
		<section id="communication">
			<h2>Meetings and Communication</h2>
			<p>The APA WG conducts its work using a variety of synchronous and asynchronous tools. The <a href="#communication">communication</a> page provides details about:</p>
			<ul>
				<li><a href="https://www.w3.org/WAI/APA/task-forces/pronunciation/wiki/Pronunciation_Meeting">Teleconferences of the Pronunciation Task Force</a>;</li>
				<li>Face to face meetings (The Task Force will plan a face-to-face meeting at a later stage.);</li>
				<li><a href="#email">Email lists</a>;</li>
				<li>IRC discussion on the <a href="irc://irc.w3.org/pronunciation">#pronunciation</a> IRCchannel, used largely for minute-taking;</li>
				<li><a href="https://github.com/w3c/pronunciation/">Pronunciation source repository</a>;</li>
				<li><a href="https://github.com/w3c/pronunciation/wiki/">Wiki</a>;</li>
				<li><a href="https://www.w3.org/2002/09/wbs/110437/">Web-Based Surveys (WBS)</a>;</li>
				<li><a href="https://www.w3.org/WAI/APA/task-forces/pronunciation/track/">pronunciation Issue Tracker</a>;</li>
				<li><a href="https://github.com/w3c/pronunciation/issues">Pronunciation source repository issue tracker</a>;</li>
				<li><a href="https://www.w3.org/2000/09/dbwg/details?group=110437&amp;public=1">Current participants in the Pronunciation Task Force</a>.</li>
			</ul>
			<p>These tools are used by participants of the Task Force. For ways non-participants can contribute, see <a href="../../contribute">how to contribute to the Working Group and file comments</a>.</p>
			
			<section id="teleconferences">
				<h3>Teleconferences</h3>
			<p><a href="https://www.w3.org/2017/08/telecon-info_pronunciation-wed">Pronunciation Task Force meetings</a>: Wednesdays at 9:00 until 10:00 Boston time.</p>
			</section>
			<section id="minutes">
				<h3>Meeting Minutes</h3>
				<p><a href="minutes">Minutes from previous meetings</a> are available.</p>
			</section>
			<section id="email">
				<h3>Mailing Lists</h3>
				<p>The Pronunciation Task Force uses the public-pronunciation@w3.org mailing list (<a href="https://lists.w3.org/Archives/Public/public-pronunciation/">mailing list archives</a>) for email discussion. Participants are automatically added to the mailing list when they become a participant of the Task Force.</p>
			</section>
		</section>
		
		<section id="work">
			<h2>Current Work</h2>
			<p><a href="https://github.com/w3c/pronunciation/blob/master/README.md">See the wiki for current planning and draft documents</a>.</p>
		</section>
		<section id="publications">
			<h2>Publications</h2>
			<ul>
				<li><strong><a href="https://www.w3.org/TR/pronunciation-explainer/">Explainer: Improving Spoken Presentation on the Web</a></strong> provides an overview of the work. It:
					<ul>
					  <li>Briefly introduces the context for W3C work on pronunciation</li>
					  <li>Describes the advantages and disadvantages of two approaches</li>
					  <li>Poses questions for additional input</li>
					</ul>
				</li>
				<li>
					<strong><a href="https://www.w3.org/TR/pronunciation-user-scenarios/">Pronunciation User Scenarios</a></strong> provides examples of:
					<ul>
					  <li>End-users, including screen reader users</li>
					  <li>Content providers, including educators</li>
					  <li>Software developers, including content managements systems</li>
					</ul>
				</li>
				<li>
					<strong><a href="https://www.w3.org/TR/pronunciation-gap-analysis-and-use-cases/">Pronunciation Gap Analysis and Use Cases</a></strong> provides details on the analysis. It:
					<ul>
					  <li>Provides more detailed context</li>
					  <li>Describes required features for pronunciation and spoken presentation</li>
					  <li>Describes specific implementation approaches for introducing presentation authoring markup into HTML5 (called “use cases”)</li>
					  <li>Provides a gap analysis</li>
					  <li>Describes how the required features may be met by existing approaches</li>
					</ul>
				</li>
				
			</ul>

		</section>
		
		<section id="contribute">
			<h2>How to Comment, Contribute, and Participate</h2>
			<p>To join the Pronunciation Task Force, individuals must be participants of the APA WG. Participants are expected to <a href="work-statement#participation">actively contribute</a> to the work of the Task Force. If you are interested in participating in the Spoken Pronunciation Task Force, please send e-mail to: <a href="mailto:janina@rednote.net">Janina Sajka</a>, <a href="mailto:iali@ets.org">Irfan Ali</a> and <a href="mailto:pgrenier@gmail.com">Paul Grenier</a> and include a little bit about what you’re interested in and how you think that you may be able to contribute to the Task Force. Then follow the <a href="../../participation">APA Working Group participation</a> procedures to join the Working Group, and once you have joined ask <a href="mailto:ran@w3.org">Ruoxi(Roy) Ran</a> to add you to the task force.</p>
			<p>To contribute without joining the task force, see the <a href="../../contribute">APA Working Group contribute page</a> for general instructions. To contribute to documents under development, see <a href="https://github.com/w3c/pronunciation/">how to contribute to the source repository directly</a>.</p>
			<p><a href="https://www.w3.org/2000/09/dbwg/details?group=110437&amp;public=1">Current participants in the Spoken Pronunciation Task Force</a>.</p>
		</section> 
		
		<section id="administrative">
			<h2>Administrative Information</h2>
			<p>The Spoken Pronunciation Task Force is a Task Force of the <a href="http://www.w3.org/WAI/APA/">Accessible Platform Architectures (APA) Working Group</a>. It assists these Working Groups to produce techniques, understanding, and guidance documents, as well as updates to existing related W3C  material that addresses the cognitive space.</p>
			<h3 id="facilitator">Facilitator and Contacts</h3>
			<ul>
				<li> <strong>Task Force facilitator:</strong> <a href="mailto:iali@ets.org">Irfan Ali</a>, <a href="mailto:pgrenier@gmail.com">Paul Grenier</a></li>
				
				<li><strong>Staff Contact: </strong><a href="http://www.w3.org/People/cooper/">Michael Cooper</a>, <a href="http://www.w3.org/People/roy/">Ruoxi(Roy) Ran</a> </li>
			</ul>
			<h3 id="work-statement">Work Statement</h3>
			<p>The <a href="work-statement">Spoken Pronunciation Accessibility Task Force Work Statement</a> defines the initial objective, scope, approach, and participation of the Task Force.</p>
		</section>
<?php include "../../_footer.phi"; ?> 		
	</body>
</html>