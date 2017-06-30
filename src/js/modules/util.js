this.mmooc = this.mmooc || {};


this.mmooc.util = function () {
    return {
        renderTemplateWithData: function (template, data) {
            var html = "";
            try {
                html = mmooc.templates[template](data);
            } catch (e) {
                console.log(e);
            }

            return html;

        },

        getPageTitleBeforeColon: function () {
            // For discussion pages we only want the title to be "<discussion>" instead of "Discussion: <discussion>"
            var title = document.title;
            if (title.indexOf(":")) {
                title = title.substring(0, title.indexOf(":"));
            }
            return title;
        },

        getPageTitleAfterColon: function () {
            // For discussion pages we only want the title to be "<discussion>" instead of "Discussion: <discussion>"
            var title = document.title;
            if (title.indexOf(":")) {
                title = title.substring(title.indexOf(":") + 1, title.length);
            }
            return title;
        },

        filterCourse: function(course) {
            return course.name != "SELFREGISTER";
        },
        filterSearchAllCourse: function(course) {
            return course.course.name != "SELFREGISTER";
        },
        callWhenElementIsPresent: function(classId, callback) {
            var checkExist = setInterval(function() {
                var checkClassId = classId;
                if($(checkClassId).length) {
                  clearInterval(checkExist);
                  callback();
                }
            }, 100);
        },

        arraySorted: function (array, elementToSort) {
            if (Object.prototype.toString.call(array) === '[object Array]' && elementToSort) {
                return array.sort(function (a, b) {
                    if (a.hasOwnProperty(elementToSort) && b.hasOwnProperty(elementToSort)) {
                        var field1 = a[elementToSort].toLocaleLowerCase();
                        var field2 = b[elementToSort].toLocaleLowerCase();
                        return field1.localeCompare(field2, 'nb', {usage: 'sort'});
                    }
                    return 0;
                });
            }
            return array;
        },

        goBack: function (e) {//http://stackoverflow.com/questions/9756159/using-javascript-how-to-create-a-go-back-link-that-takes-the-user-to-a-link-i
            var defaultLocation = "https://server";
            var oldHash = window.location.hash;

            history.back(); // Try to go back

            var newHash = window.location.hash;

            /* If the previous page hasn't been loaded in a given time (in this case
             * 1000ms) the user is redirected to the default location given above.
             * This enables you to redirect the user to another page.
             *
             * However, you should check whether there was a referrer to the current
             * site. This is a good indicator for a previous entry in the history
             * session.
             *
             * Also you should check whether the old location differs only in the hash,
             * e.g. /index.html#top --> /index.html# shouldn't redirect to the default
             * location.
             */

            if (
                newHash === oldHash &&
                (typeof(document.referrer) !== "string" || document.referrer === "")
            ) {
                window.setTimeout(function () {
                    // redirect to default location
                    window.location.href = defaultLocation;
                }, 1000); // set timeout in ms
            }
            if (e) {
                if (e.preventDefault)
                    e.preventDefault();
                if (e.preventPropagation)
                    e.preventPropagation();
            }
            return false; // stop event propagation and browser default event
        },

        adaptHeightToIframeContentForId: function (containerId, frameId) {

            var scrollHeight = Number(document.getElementById(frameId).contentWindow.document.body.scrollHeight) + 20;
            document.getElementsByClassName(containerId)[0].style.height = scrollHeight + "px";
        },

        isTeacherOrAdmin: function() {
            var roles = mmooc.api.getRoles();
            return roles != null
                && (roles.indexOf('teacher') != -1
                    || roles.indexOf('admin') != -1);
        },

        setGlobalPeerReviewButtonState: function () {
            if(mmooc.settings.disablePeerReviewButton == true) {
                $(".assignments #right-side :submit").prop("disabled",true);
            }
        },

        formattedDate: function (date) {
            var date = new Date(date);
            var month = mmooc.util.getMonthShortName(date);
            return date.getDate() + ' ' + month + ', ' + date.getFullYear() + ' - ' + date.getHours() + ':'+ (date.getMinutes()<10?'0':'') + date.getMinutes() ;
        },

        getWeekdayShortName: function (date) {
            var weekdays = ["sø", "ma", "ti", "on", "to", "fr", "lø"];
            return weekdays[date.getDay()];
        },

        getMonthShortName: function (date) {
            var months = ["jan", "feb", "mar", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "des"];
            return months[date.getMonth()];
        },
        getCourseCategories: function (courses) {
            var categorys = [];
            var hasOther = false;
            for (var i = 0; i < courses.length; i++) {
                var category = mmooc.util.getCourseCategory(courses[i].course_code);
                if (categorys.indexOf(category) == -1) {
                    if (category == "Andre") {
                      hasOther = true;
                    }
                    else { 
                      categorys.push(category);
                    }
                }
            }
            categorys.sort();
            if (hasOther) {
                categorys.push("Andre");
            }
            return categorys;           
        },
        getCoursesCategorized: function(courses, categorys) {
            var coursesCategorized = [];
            for (var i = 0; i < categorys.length; i++) {
                var categoryCourses = [];
                for (var j = 0; j < courses.length; j++) {
                    var category = mmooc.util.getCourseCategory(courses[j].course_code);
                    if (categorys[i] == category) {
                        categoryCourses.push(courses[j]);
                    }
                }
                categoryCourses.sort(function(a,b){
                    return a.name > b.name;
                });
                var categoryObj = {
                    title: categorys[i],
                    courses: categoryCourses
                }
                coursesCategorized.push(categoryObj);
            }
            return coursesCategorized;
        },
        getCourseCategory: function (courseCode) {
            var category = "Andre";
            if (courseCode && courseCode.indexOf("::") > -1) {
                category = courseCode.substring(0, courseCode.indexOf("::"));
            }
            return category;            
        }
    };
}();

