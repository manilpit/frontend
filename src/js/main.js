jQuery(function($) {
//    $('.header-bar').show(); //To avoid displaying the old contents while the javascript is loading. Selectors are set to display:none in CSS.
//    $(".ic-Layout-contentMain").show(); //Same as above.
	
//	$('.header-bar').css("visibility", "visible");
//	$(".ic-Layout-contentMain").css("visibility", "visible");
	
    mmooc.routes.addRouteForPath(/\/$/, function() {
        var parentId = 'content'
        if (document.location.search === "?mmpf") {
            mmooc.powerFunctions.show(parentId);
        } else {
            //Kommentar
            window.location.href = "/courses";
        }
    });

    mmooc.routes.addRouteForQueryString(/invitation=/, function() {
    });

    mmooc.routes.addRouteForPath(/\/login$/, function() {
        $('#register_link').html("<i>Trenger du en konto?</i><b>Klikk her.</b>");
    });

    mmooc.routes.addRouteForPath(/\/courses$/, function() {
        mmooc.menu.hideRightMenu();
        mmooc.courseList.listCourses('content', mmooc.courseList.showAddCourseButton);
    });
    
    mmooc.routes.addRouteForPath(/\/courses\/\d+$/, function() {
        mmooc.groups.interceptLinksToGroupPage();
//        mmooc.coursePage.hideCourseInvitationsForAllUsers();
        
        var courseId = mmooc.api.getCurrentCourseId();
        var queryString = document.location.search; 
        if (queryString === "?allcanvabadges") { //query string = ?allcanvabadges 
            var courseId = mmooc.api.getCurrentCourseId();
            mmooc.menu.showCourseMenu(courseId, 'Utmerkelser', 'Utmerkelser'); 
            //Should be refactored to use json api instead 
            var canvabadgesForCurrentCourse = '<iframe allowfullscreen="true" height="680" id="tool_content" mozallowfullscreen="true" name="tool_content" src="' + mmooc.settings.CanvaBadgeProtocolAndHost + '/badges/course/' + courseId + '" tabindex="0" webkitallowfullscreen="true" width="100%"></iframe>';
            $("#content").append(canvabadgesForCurrentCourse);
        } 
        else if(!(mmooc.util.isTeacherOrAdmin()) && $(".self_enrollment_link").length) //Route to list of all courses if student and not enrolled in course.
        {
            window.location.href = "/search/all_courses";
        }
        else {
            mmooc.menu.showCourseMenu(courseId, mmooc.i18n.Course + 'forside', null);
            mmooc.coursePage.listModulesAndShowProgressBar();
            mmooc.announcements.printAnnouncementsUnreadCount();
            mmooc.coursePage.replaceUpcomingInSidebar();
            mmooc.coursePage.overrideUnregisterDialog();
            
            mmooc.coursePage.printDeadlinesForCourse();
        }
    });
    
    mmooc.routes.addRouteForPath(/\/search\/all_courses$/, function() {
        mmooc.enroll.printAllCoursesContainer();
        mmooc.enroll.printAllCourses();
    });

    mmooc.routes.addRouteForPath(/\/profile\/settings$/, function() {
		var notificationButtonHTML = mmooc.util.renderTemplateWithData("notifications", {});
		document.getElementById('confirm_email_channel').insertAdjacentHTML('beforebegin', notificationButtonHTML);
    });

    mmooc.routes.addRouteForPath(/\/courses\/\d+\/announcements$/, function() {
        var courseId = mmooc.api.getCurrentCourseId();
        mmooc.menu.showCourseMenu(courseId, 'Kunngjøringer', mmooc.util.getPageTitleBeforeColon());
        mmooc.api.getModulesForCurrentCourse(function(modules) {
            mmooc.discussionTopics.printDiscussionUnreadCount(modules);
        });
        mmooc.announcements.printAnnouncementsUnreadCount();
        mmooc.announcements.setAnnouncementsListUnreadClass();
    });

    mmooc.routes.addRouteForPath(/\/courses\/\d+\/discussion_topics$/, function() {
        var courseId = mmooc.api.getCurrentCourseId();
        mmooc.menu.showCourseMenu(courseId, 'Diskusjoner', mmooc.util.getPageTitleBeforeColon());
        mmooc.discussionTopics.setDiscussionsListUnreadClass();
        mmooc.discussionTopics.insertSearchButton();
        mmooc.discussionTopics.hideUnreadCountInDiscussionList();
        mmooc.api.getModulesForCurrentCourse(function(modules) {
            mmooc.discussionTopics.printDiscussionUnreadCount(modules, "discussionslist");
        });
        mmooc.announcements.printAnnouncementsUnreadCount();        
    });

    mmooc.routes.addRouteForPath(/\/courses\/\d+\/groups$/, function() {
        mmooc.groups.interceptLinksToGroupPage();
        var courseId = mmooc.api.getCurrentCourseId();
        mmooc.menu.showCourseMenu(courseId, 'Grupper', mmooc.util.getPageTitleBeforeColon());
        mmooc.api.getModulesForCurrentCourse(function(modules) {
            mmooc.discussionTopics.printDiscussionUnreadCount(modules);
        });
        mmooc.announcements.printAnnouncementsUnreadCount();
    });

    mmooc.routes.addRouteForPath(/\/courses\/\d+\/users$/, function() {
        var courseId = mmooc.api.getCurrentCourseId();
        mmooc.menu.showCourseMenu(courseId, '', mmooc.util.getPageTitleBeforeColon());
    });

    mmooc.routes.addRouteForPath(/\/groups\/\d+$/, function() {
        var courseId = mmooc.api.getCurrentCourseId();
        mmooc.menu.showCourseMenu(courseId, 'Grupper', mmooc.util.getPageTitleBeforeColon());
    });

    //Path for showing all dicussions, i.e. the discussion tab on the course front page.
    mmooc.routes.addRouteForPath(/\/groups\/\d+\/discussion_topics$/, function() {
        var courseId = mmooc.api.getCurrentCourseId();
        mmooc.menu.showCourseMenu(courseId, 'Grupper', mmooc.util.getPageTitleAfterColon());

        //TODO: Check whether or not courseId is undefined or not valid, only insert the group header
        //when it is.
        mmooc.groups.showGroupHeader();
    });

    //Path for showing a group discussion or creating a new discussion
    mmooc.routes.addRouteForPath([/\/groups\/\d+\/discussion_topics\/\d+$/, /\/groups\/\d+\/discussion_topics\/new$/], function() {
        mmooc.menu.showLeftMenu();
        mmooc.menu.listModuleItems();
        mmooc.menu.showDiscussionGroupMenu();
                
        if (!mmooc.util.isTeacherOrAdmin()) {
        	mmooc.menu.hideSectionTabsHeader();
        }
    });

    mmooc.routes.addRouteForPath([/\/groups\/\d+\/discussion_topics\/\d+$/], function() {
        mmooc.groups.moveSequenceLinks();
        if (!mmooc.util.isTeacherOrAdmin()) {
            mmooc.menu.hideRightMenu();
        }
    });

    mmooc.routes.addRouteForPath([/\/courses\/\d+\/discussion_topics\/\d+/, /\/courses\/\d+\/discussion_topics\/new/], function() {
        // For discussion pages we only want the title to be "<discussion>" instead of "Discussion: <discussion>"
        var title = mmooc.util.getPageTitleAfterColon();

        var courseId = mmooc.api.getCurrentCourseId();
        if (!mmooc.util.isTeacherOrAdmin()) {
            mmooc.menu.hideRightMenu();
            var contentId = mmooc.api.getCurrentTypeAndContentId().contentId;
            mmooc.api.getDiscussionTopic(courseId, contentId, mmooc.discussionTopics.setDiscussionTopicPubDate);
        }

        // Announcements are some as type of discussions, must use a hack to determine if this is an announcement
        if (mmooc.api.currentPageIsAnnouncement()) {
            mmooc.menu.showCourseMenu(courseId, 'Kunngjøringer', title);
            mmooc.menu.showBackButton("/courses/" + courseId + "/announcements", "Tilbake til kunngjøringer");
            mmooc.announcements.addMarkAsReadButton();
        } else if (mmooc.api.getCurrentModuleItemId() == null) {
            // Only show course menu if this discussion is not a module item
            // Note detection if this is a module item is based on precense of query parameter
            mmooc.menu.showCourseMenu(courseId, 'Diskusjoner', title);
            mmooc.menu.showBackButton("/courses/" + courseId + "/discussion_topics", "Tilbake til diskusjoner");
        }
    });

    mmooc.routes.addRouteForPathOrQueryString([/\/courses\/\d+\/assignments\/\d+/, /\/courses\/\d+\/quizzes\/\d+/], /module_item_id=/, function() {
        mmooc.menu.showLeftMenu();
        mmooc.menu.listModuleItems();
        mmooc.pages.modifyMarkAsDoneButton();
        mmooc.pages.duplicateMarkedAsDoneButton();
        mmooc.util.callWhenElementIsPresent(".sikt-diploma-button", mmooc.greeting.enableGreetingButtonIfNecessary);
        mmooc.util.callWhenElementIsPresent(".new-sikt-diploma-button", mmooc.greeting.enableNewGreetingButtonIfNecessary);
        // mmooc.pages.changeTranslations();
    });
    
    // example route: /courses/54/assignments/369 - assignment which may be a peer review (hverandrevurdering)
    mmooc.routes.addRouteForPath(/\/courses\/\d+\/assignments\/\d+/, function() {
        mmooc.pages.redesignAssignmentPage();
        mmooc.util.setGlobalPeerReviewButtonState();
    });

    // Assignment submission which might be your own or someone else's: Peer review (hverandrevurdering)
    mmooc.routes.addRouteForPath(/\/courses\/\d+\/assignments\/\d+\/submissions\/\d+/, function() {
        mmooc.pages.redesignPeerReviewAndOwnSubmissionDetailsPage();
    });
    
    mmooc.routes.addRouteForPath(/\/courses\/\d+\/external_tools\/\d+$/, function() {
        function isBadgesafePage() {
            function extractPluginNumber(input) {
                 return input.substring(input.lastIndexOf('/') + 1);
            }

            var badgesafeUrl = mmooc.menu.extractBadgesLinkFromPage().url;

            return extractPluginNumber(badgesafeUrl) === extractPluginNumber(window.location.pathname);
        };

        if (isBadgesafePage()) {
            var courseId = mmooc.api.getCurrentCourseId();
            mmooc.menu.showCourseMenu(courseId, 'Utmerkelser', 'Utmerkelser');
        }
    });
    
    mmooc.routes.addRouteForPath(/\/courses\/\d+\/modules\/items\/\d+$/, function() { //Canva Badges uses this route for instance
        mmooc.menu.showLeftMenu();
        mmooc.menu.listModuleItems();
    });

    mmooc.routes.addRouteForPath([/\/pages/], function() {
        mmooc.pages.showBackLinkIfNecessary();
        mmooc.util.callWhenElementIsPresent(".sikt-diploma-button", mmooc.greeting.enableGreetingButtonIfNecessary);
        mmooc.util.callWhenElementIsPresent(".new-sikt-diploma-button", mmooc.greeting.enableNewGreetingButtonIfNecessary);
    });

    mmooc.routes.addRouteForPath([/\/login\/canvas/], function() {
        mmooc.pages.replaceCreateAccountLink();
    });

    mmooc.routes.addRouteForQueryString(/enrolled=1/, function() {
        window.location.href = "/courses";
    });

    mmooc.routes.addRouteForPath(/enroll\/[0-9A-Z]+$/, function() {
        if(document.location.search == "")
        {
            mmooc.enroll.changeEnrollPage();
        }
    });

    try {
        mmooc.menu.renderLeftHeaderMenu();
        mmooc.menu.showUserMenu();
    } catch (e) {
        console.log(e);
    }

    try {
        mmooc.routes.performHandlerForUrl(document.location);
    } catch (e) {
        console.log(e);
    }

    try {
        mmooc.menu.injectGroupsPage();
        mmooc.groups.changeGroupListURLs(document.location.href);

        mmooc.pages.updateSidebarWhenMarkedAsDone();
        mmooc.pages.updateSidebarWhenContributedToDiscussion();
        mmooc.menu.alterHomeLink();
        mmooc.menu.alterCourseLink();
        
        mmooc.footer.addLicenseInFooter();

    } catch(e) {
      console.log(e);
    }

    

});
