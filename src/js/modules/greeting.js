mmooc = mmooc || {};

mmooc.greeting = function () {

    function redesignPage() {
        $('#wrapper').addClass('diploma-page');
    }

    function fixLinkToModules($content) {
        if ($content.find(".alert li > a").size() <= 0) {
            return;
        }

        redesignPage();
        mmooc.api.getModulesForCurrentCourse(function (modules) {
            var firstItemPerModule = {};
            for (var i in modules) {
                firstItemPerModule[modules[i].id] = modules[i].items[0];
            }

            $('.alert li > a').each(function () {
                var oldPath = $(this).attr('href');
                var moduleNumber = /courses\/\d+\/modules\/(\d+)/.exec(oldPath);
                if (moduleNumber.length > 0) {
                    $(this).attr('href', firstItemPerModule[moduleNumber[1]].html_url);
                }
            });

        });
    }

    return {
        enableGreetingButtonIfNecessary: function () {
            var $content = $("#content");
            var $diplomaButton = $content.find(".sikt-diploma-button");
            var $formIdDiv = $content.find(".sikt-diploma-formId");
            var $nameEntryIdDiv = $content.find(".sikt-diploma-nameEntryId");
            var $emailEntryIdDiv = $content.find(".sikt-diploma-emailEntryId");

            if ($diplomaButton.length && $formIdDiv.length && $nameEntryIdDiv.length && $emailEntryIdDiv.length) {
                $diplomaButton.button().click(function () {
                    if ($diplomaButton.hasClass('btn-done')) {
                        return;
                    }

                    $('#info').html(mmooc.util.renderTemplateWithData("waitIcon", {}));

                    var formId = $formIdDiv.text();
                    var nameEntryId = $nameEntryIdDiv.text();
                    var emailEntryId = $emailEntryIdDiv.text();
                    var str1 = "https://docs.google.com/forms/d/";
                    var str2 = "/formResponse";
                    var googleurl = str1.concat(formId, str2);

                    str1 = "entry.";
                    var nameEntry = str1.concat(nameEntryId);
                    var emailEntry = str1.concat(emailEntryId);

                    mmooc.api.getUserProfile(function (profile) {
                        var values = {};
                        values[nameEntry] = profile.name;
                        values[emailEntry] = profile.primary_email;

                        $.ajax({
                            url: googleurl,
                            data: values,
                            type: "POST",
                            dataType: "xml",
                            complete: function (jqXHR) {
                                switch (jqXHR.status) {
                                    case 0:
                                        str1 = "Diplom ble sendt til denne eposten:";
                                        var s = str1.concat(profile.primary_email);
                                        $('#info').html(s);
                                        $diplomaButton.addClass('btn-done');
                                        break;
                                    default:
                                        $('#info').addClass('error');
                                        $('#info').html("En feil oppstod. Ta kontakt med kursansvarlig for &aring; f&aring; hjelp.");
                                }
                            }
                        }); //End Google callback
                    }); //End Canvas user profile callback
                }); //End diploma button clicked
                redesignPage();
            } //End if valid diploma fields

            fixLinkToModules($content);
        },
        enableNewGreetingButtonIfNecessary: function () {
            var $content = $("#content");
            var $newDiplomaButton = $content.find(".new-sikt-diploma-button");
            var $scriptUrlDiv = $content.find(".new-sikt-diploma-scriptId");

            if ($newDiplomaButton.length && $scriptUrlDiv.length) {
                $newDiplomaButton.button().click(function () {
                    if ($newDiplomaButton.hasClass('btn-done')) {
                        return;
                    }

                    $('#info').html(mmooc.util.renderTemplateWithData("waitIcon", {}));

                    var scriptUrl = $scriptUrlDiv.text();

                    mmooc.api.getUserProfile(function (profile) {
                        var values = {};
                        values["Navn"] = profile.name;
                        values["Epost"] = profile.primary_email;

						$.ajax({
							url: scriptUrl,
							data: values,
                            type: "POST",
                            dataType: "json",
							beforeSend: function () {
								console.log("Loading");
							},

							error: function (jqXHR, textStatus, errorThrown) {
								console.log(jqXHR);
								console.log(textStatus);
								console.log(errorThrown);
								var s = "Diplom ble ikke sendt. Følgende gikk galt: " + jqXHR + textStatus + errorThrown;
								$('#info').html(s);
								$newDiplomaButton.addClass('btn-done');
							},

							success: function (result) {
								console.log(result);
								if(result.result == "success")
								{
									var s = "Diplom ble sendt til " + profile.name + " med denne eposten: " + profile.primary_email;
									$('#info').html(s);
								}
								else
								{
									var s = "Diplom kunne ikke sendes fordi: " + result.result;
									$('#info').html(s);
								}
								$newDiplomaButton.addClass('btn-done');
							},

							complete: function () {
								console.log('Finished all tasks');
							}
						});

                    }); //End Canvas user profile callback
                }); //End diploma button clicked
                redesignPage();
            } //End if valid diploma fields

            fixLinkToModules($content);
        }
        
    }
}();