<style>
	span.label {
		display: inline-block;
		padding: 0.25em;
	}
</style>

# Reviewing a document for APA

Part of the responsibilities of the APA is to review W3C documents with respect to accessibility. This document outlines the process for someone within APA to read and review a W3C document from an accessibility perspective. Note that within _this_ document, the words "document" and "specification" are used interchangeably.

The reason for a review is to catch any accessibility concerns early in the document generation process so they can be addressed. At times, it is not immediately obvious that accessibility may be impacted. The people within APA have the expertise to make these determinations. The reviewer(s) will document any concerns and bring these to the larger group for further discussion. If the group agrees, APA will file and track issues in the repository of the group that owns the document.

## APA Github repositories related to document review

These repositories are used within the APA document review process. However, as an APA member performing a document review, you only need to interact with the "a11y-tracking" repo.

- **[a11y-request](https://github.com/w3c/a11y-request)** - review requests for a specific version of a document or specification.

- **[a11y-tracking](https://github.com/w3c/a11y-tracking)** - discuss the document and draft issues or questions that may need to be raised about the document.

- **[a11y-longitudinal-tracking](https://github.com/w3c/a11y-longitudinal-tracking)** - holds the results of all the documents reviews APA does *over time.* This allows APA to track issues filed against a document and how a document has changed across versions. This repository is used for tracking issues and specifications only. The automated Github process automatically notes linked issues that are closed. There should be no need for additional comments in this repository.

## Review process overview

More details of the review process are provided in specific sections below.

1. The working group with a document to review completes the Framework for Accessible Specification of Technologies, [FAST checklist](https://w3c.github.io/fast/checklist). This is combined with other relevant information, and an issue is created in the APA [w3c/a11y-request](https://github.com/w3c/a11y-request) repository.

   Here is a completed request: [Web Sustainability Guidelines 2025-10-06 #133](https://github.com/w3c/a11y-request/issues/133)
   
   For reference, there is an established [process for W3C groups to request a review from APA, and other Horizontal Review groups](https://www.w3.org/guide/documentreview/).

2. Review request issues in a11y-request are discussed at an APA meeting. Reviewers are requested and will be assigned to an associated issue in a11y-tracking.

3. After the request has been discussed and reviewers identified, a meta issue gets created in a11y-tracking as a workspace for internal discussion by assignees. The reviewers are assigned to this meta-thread. Any APA member may self-assign themselves to a meta-thread and participate in the document review.

   Here is the meta-thread created for the a11y-request above: [Web Sustainability Guidelines (meta thread) #270](https://github.com/w3c/a11y-tracking/issues/270).

4. Assignees review the document within the requested timeframe. They discuss potential concerns with other assignees in the meta-thread issue.

   See the discussion within [Web Sustainability Guidelines (meta thread) #270](https://github.com/w3c/a11y-tracking/issues/270).

5. If a concern needs to be raised with the document's owning working group, the reviewer creates an issue in a11y-tracking. When creating the issue, select the option, "Add a review comment (pending discussion by APA WG)" from the popup displayed. Follow the instructions within the issue template to create the issue. Add the <span class=label style="background-color: #FBCA04; color: black;">agenda+</span> label to the issue.

   Here is an example: [Suggestions for Enhancing Accessibility Clarity in the WSG Draft #281](https://github.com/w3c/a11y-tracking/issues/281)

6. If there are no concerns with the document, the reviewer(s) add a comment in the a11y-tracking meta-thread issue and mark that with <span class=label style="background-color: #FBCA04; color: black;">agenda+</span>. Provide a brief explanation of why there are no concerns.

7. APA reviews <span class=label style="background-color: #FBCA04; color: black;">agenda+</span> issues within a11y-tracking associated with document reviews during a weekly meeting. This may be a meta-thread comment indicating that there are no APA concerns with the document. Or it is an issue drafted as potential APA comments concerning the document. The group discusses the issue or comment to determine how to proceed.

8. If the APA group agrees there are no concerns with the document, the meta-issue is closed. The APA chairs will add a comment to and close the original a11y-request issue.

9. If the APA group agrees that an issue needs to be filed, any edits and modifications are made during the meeting.

10. If the group agrees to file the issue, the author of the a11y-tracking issue creates an issue in the document's owning working group repository. Follow the process documented in the [Decision to file](#decision-to-file) section in this document.

   Here is an example: [Suggestions for Enhancing Accessibility Clarity in the WSG Draft #205](https://github.com/w3c/sustainableweb-wsg/issues/205) in [sustainableweb-wsg](https://github.com/w3c/sustainableweb-wsg)

11. Once the review of a document is completed and all issues are filed with the owning working group, an issue is created in the a11y-longitudinal-tracking repository. There is only one a11y-longitudinal-tracking issue per document - this one issue covers the life of that document, across revisions.

12. Following each APA review, links to the meta-thread, and any issues raised, are collated into one comment, which is added to the a11y-longitudinal-tracking issue thread for the document.

   This provides a snapshot of the state of the document at the point it was reviewed (and because all the issues have been created within Github, the status is easily tracked). It also allows APA to follow the accessibility changes of the document over time.

## Assigning the review

When a review is requested, it is discussed at an APA weekly meeting and members volunteer to perform the review. Before accepting responsibility for a review, note any deadline for completion. Please do not volunteer if you cannot commit to the review deadline.

Once one or more members are assigned to the review, an issue is created in a11y-tracking with the same title as the a11y-request and the label review-meta-thread. The reviewers are assigned to this meta thread. APA members can find the issues assigned to them via <https://github.com/issues/assigned>.

The APA chairs will create the meta-thread issue.

Note that issues may also come into a11y-tracking without a review request. They relate to other review processes, which are similar but not documented here.

The meta-thread issue includes a link to the original spec review request, which in turn links to the document, and FAST Checklist results for the sepec, as well as pertinent info for the review, from the group developing the document.

The meta issue is also assigned the following labels:

- the spec short name via <span class=label style="background: #6bc5c6; color: black;">s:\<spec-short-name\></span>

- the working/interest/community group name via <span class=label style="background: #005a9c; color: white;">\<w|i|c\>g:\<group-short-name\></span>

- <span class=label style="background: #f259f8; color: black;">review-meta-thread</span>

As documented in the overview above, use the meta issue to take notes or discuss the issue with other reviewers. Note questions or concerns that you would like to discuss with other reviewers before drafting an issue for the APA group to review.

Here is one example: [Web Sustainability Guidelines (meta thread) #270](https://github.com/w3c/a11y-tracking/issues/270).

## Performing the review

Read through the document with an eye to possible accessibility issues. Use the completed Framework for Accessible Specification of Technologies (FAST) checklist available via the original issue in a11y-tracking. This will help direct you to the features covered in the document that need review. It has specific examples and questions that pertain to WCAG requirements and beyond. However, remember that members of the working group that created the document may not have in-depth knowledge of accessibility. Don't rely entirely on the FAST checklist as you review the document; use your own accessibility knowledge.

You are part of the APA due to your extensive accessibility knowledge and ability to provide a wider perspective to a variety of topics. Think of the various use cases and situations where things built with/to the specification may be used, and how that may affect people with disabilities. Folks without the APA members' accessibility experience "don't know what they don't know". They may never consider alternative ways of accessing the information or technology provided within the specification.

Where appropriate, refer to the various [Accessibility User Requirements](https://www.w3.org/WAI/research/user-requirements/) documents published by APA and the task forces. These documents define specific requirements for various technologies.

Other general knowledge W3C documents may also help guide your review:

- [Web Platform Design Principles Group Note](https://www.w3.org/TR/design-principles/)

- [Privacy Principles Statement](https://www.w3.org/TR/privacy-principles/)

- [Ethical Web Principles Statement](https://www.w3.org/TR/ethical-web-principles/)

Consider accessibility in the broader sense of how the specified technology will be used. For example, an API may not seem to have accessibility requirements. However, if it details a transport mechanism for content, does it provide for any additional attributes or materials needed to support accessibility? For example, semantic structure, providing alternative text for images, captions or subtitles, localization, etc.?

Are there parts or functions of the document that may expose a person as having a disability? For example, detecting use of an assistive technology to access the feature. This violates the privacy of the user.

If the document provides a mechanism to create a new user interface or interface element, are there instructions for the implementor to include accessibility requirements. Often this suggests the need for an Accessibility Considerations section. Here are a few specifications that contain an Accessibility Considerations section:

- [Compute Pressure Level 1](https://www.w3.org/TR/compute-pressure/#accessibility-considerations) W3C Recommendation

- [CSS Image Animation Module Level 1](https://drafts.csswg.org/css-image-animation-1/#a11y)Editor's Draft from April 2026

## Spec review etiquette

As a first step, you may discuss the concerns with other reviewers in the meta-thread for the document review. If you have concerns, the next step is to create a proposed issue in a11y-tracking that will be discussed on an APA call, as documented in the overview above. Review the basic etiquette below before creating an issue in a11y-tracking.

- Include only one accessibility concern per a11y-tracking issue! This allows APA to use the Github process to input and review issues with the APA group and track them correctly.

- If you find editorial issues beyond minor edits, you may file an issue directly in the document owner's Github repository. These issues are filed as yourself rather than on behalf of APA. Keep general editorial comments separate from accessibility concerns. Try to group editorial concerns into a single issue.

  - For minor editorial issues such as typos, you can make a pull request directly in the git repository for the document. The URI for that repository is available within the original a11y-request issue. If you are not comfortable making a fix and pull request, clearly document the problems in a single issue with explicit instructions to locate the problems. File this issue directly in the GitHub repository for the document, **not** within a11y-tracking.

- Anyone is encouraged to file issues, or comment on issues, as themselves. However, only issues within a11y-tracking that have been discussed and agreed upon by the APA group are filed on behalf of APA. When filing an issue on your own outside of the APA review, please make it clear whether:

  - you are also member of the working group whose document is being reviewed and are filing from your role within that working group; or

  - you are filing the issue completely on your own or from another working group perspective

## Creating proposed issues, for APA Discussion

The reviewer records any concerns by creating an issue in a11y-tracking. This issue will then be discussed by the wider APA group at a working group meeting. The group will review, make any edits and determine if it should be filed with working group who owns the document.

[Create a new issue in a11y-tracking using the "Add a review comment (pending discussion by APA WG)" template](https://github.com/w3c/a11y-tracking/issues/new?template=add-a-review-comment--pending-discussion-by-apa-wg.md). The template is provided to create the issue with all the necessary information. The template includes instructions below the prompts for information. Leave the instructions intact as you will use these steps later to file the issue, if approved by the group. The template items for the issue are...

- Write a short, succinct title. Tie this to the meta-thread and original a11y-request by including the meta-thread issue number in the title. This issue number will be removed if this issue gets filed with the document's working group repository.

- Add the spec identification label (beginning with an **s**: ) that is found in the original a11y-request and meta-thread issues. For example, <span class=label style="background: #6bc5c6; color: black;">s:annotation-model</span>, or <span class=label style="background: #6bc5c6; color: black;">s:css-variables</span>.

- Also add the pending <span class=label style="background: #e11d21; color: white;">pending</span> label to indicate this needs to be reviewed by the APA working group.

- Describe the issue.

- Always include the **location of the text** your comment references. Do this by listing the section number and name, followed by a **URI**. Where you can, use dated versions of the spec and point to the section in that **dated version**. Adding the detailed location information takes longer but makes it easier to find the correct location when the issue is read by others. For example:

   ```
   Extended Metadata Block
   <http://www.w3.org/TR/2010/WD-WOFF-20101116/#Metadata>
   ```

- Write your comment, in as succinct and well-organized a way as possible. It is helpful to **quote the text you are commenting on** at the beginning of your comment.

- When the issue is ready for review, add the <span class=label style="background-color: #FBCA04; color: black;">agenda+</span> label. This will prompt the APA co-chairs to add this issue to an upcoming meeting agenda.

- Submit the new a11y-tracking issue.

## Issue discussion

Once the issue is created within a11y-tracking and flagged with the <span class=label style="background-color: #FBCA04; color: black;">agenda+</span> label, the APA chairs will add it to a meeting agenda. The agenda will contain a link to the issue. APA members should review the issue before the meeting and come prepared to discuss it.

At the meeting, the author of the issue, the reviewer, will present a summary and suggested actions. It will save time during the meeting if members have reviewed the issue before the meeting and prepared any feedback. The working group will discuss the issue and decide if the issue should be filed against the document. They may ask the reviewer to include additional comments or clarifications.

### Decision to file

If approved by the group, the proposed comment will be filed as a new issue in the document's repository, and the existing proposed comment issue in a11y-tracking will be transformed into a tracking issue, so APA can monitor progress on resolving the issue.

In order to achieve this, the reviewer goes through a series of steps, which are detailed in the comment in the proposed tracking issue. Here's a summary of, and further guidance on, those steps...

- Make any required edits provided during the APA review.

- Re-create the issue in the repository for the document's working group repository. The working group repository link is found in the original a11y-request issue that started the review process.

   The instructions detailing the process to file the issue in the document's group's repository are in the a11y-tracking issue.

- Use your original comment as the starting point for that new issue adding any suggestions that arose from the APA working group. Add an <span class=label style="background-color: #f9c9ff; color: black;">a11y-needs-resolution</span> label to the **new** issue in the document's working group repository. This flags the issue for that working group.

- When you file the issue with the working group, it will be associated with your name. Thus, please make it clear that you are a member of APA filing on behalf of APA.

- To finish, continue to follow the process outlined within the a11y-tracking issue. This will also provide the review management tooling with the ability to link the new issue, in the document's repository, with the tracking issue.

- When you are finished the body of the a11y-tracking issue should contain the following (with the correct URI for the newly-filed issue in the document's group's repository):

   > **This is a tracker issue.** Only discuss things here if they are a11y group internal meta-discussions about the issue. \**Contribute to the actual discussion at the following link:\**
   >
   > § url_for_the_issue_raised

The a11y-tracking issue will then be used to monitor and contribute to the group's work on resolving the issue.

### Decision not to file

If the working group does not agree to pursue the issue, the reviewer will update their a11y-tracking issue to:

- Include a summary of the decision and reasoning within the issue.

- Include the link to the minutes of the meeting where the issue was discussed

- Mark the issue closed.

If the reviewer still feels strongly about the issue, they may file it on their own. It must be clear the issue is from the individual and not as a representative of APA.

## Completing the review

When the review is complete and all issues have been discussed and any necessary action taken, the review is complete.

- An APA chair will create or add to a comment in an a11y-longitudinal-tracking issue for the spec, as described above. This comment include links to all of the issues created in the document's working group repository as a result of this review.

- They will close the a11y-tracking issue.

- They will close the original a11y-request issue as completed.
