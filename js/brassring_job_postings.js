var $jq = jQuery.noConflict();

jQuery(document).ready(function ($jq) {
  $jq("#jobPostings").empty();

  // Clean up and replace XML being stored in staff and student divs
  if($jq(".staffResponse").html() != 'error') {
    $jq(".staffResponse").html(xmlCleanup($jq(".staffResponse").html(), true));
  } else {
    $jq(".staffResponse").html(xmlCleanup($jq(".staffResponse").html(), false));
  }

  if($jq(".studentResponse").html() != 'error') {
    $jq(".studentResponse").html(xmlCleanup($jq(".studentResponse").html(), true));
  } else {
    $jq(".studentResponse").html(xmlCleanup($jq(".studentResponse").html(), false));
  }

  // Update and display departments filter based on selected job type
  $jq("select#openings").change(function () {
    if ($jq(this).val() == "filter") {
      $jq(".deptfilter").hide();
      return true;
    }
    $jq(".deptfilter").show();
    if ($jq(this).val() == "staff") {
      $jq("#departments").html($jq(".staffResponse > .deptListData").html());
      return true;
    }
    $jq("#departments").html($jq(".studentResponse > .deptListData").html());
  });

  // Career job type dropdown trigger
  $jq("form#jobTypeSelect").submit(function (event) {
    event.preventDefault();
    $jq("#jobPostings").empty();
    if ($jq("select").first().val() == "staff") {
      $jq("#jobPostings").append(
        $jq(".staffResponse > .jobPostingsData").html()
      );
      $jq("#jobPostings").hide();
      $jq("#jobPostings").slideDown(750);
      if (
        $jq("select#departments").first().val() == "filter" ||
        $jq("select#departments").first().val() == undefined
      ) {
        return true;
      }
      $jq("#jobPostings").hide();
      keepOnlyDeptPostings($jq("select#departments").first().val());
    } else if ($jq("select").first().val() == "student") {
      $jq("#jobPostings").append(
        $jq(".studentResponse > .jobPostingsData").html()
      );
      $jq("#jobPostings").hide();
      $jq("#jobPostings").slideDown(750);
      if (
        $jq("select#departments").first().val() == "filter" ||
        $jq("select#departments").first().val() == undefined
      ) {
        return true;
      }
      $jq("#jobPostings").hide();
      keepOnlyDeptPostings($jq("select#departments").first().val());
    }
  });

  function keepOnlyDeptPostings(dept) {
    $jq("#jobPostings .jobPost").each(function () {
      if ($jq(this).find(".deptValue").text() != dept) {
        $jq(this).css("display", "none");
      }
    });
    $jq("#jobPostings").slideDown(750);
  }

  // Filter XML data from BrassRing and return ready for use by Drupal widget.
  function xmlCleanup(dataSource, performCleanup) {
    if(performCleanup) {
      newContent = dataSource;
      newContent = newContent.replaceAll("&lt;", "<");
      newContent = newContent.replaceAll("&gt;", ">");
      newContent = newContent.replaceAll("&amp;", "&");
      newContent = newContent.replace(
        '<string xmlns="http://integrationuri.org/">',
        ""
      );
      newContent = newContent.replace("</string>", "");
      newContent = newContent.replaceAll("&lt;", "<");
      newContent = newContent.replaceAll("&gt;", ">");
      newContent = newContent.replaceAll("&amp;", "&");

      var xml = newContent,
        xmlDoc = $jq.parseXML(xml),
        $xml = $jq(xmlDoc),
        $jobTitle = $xml.find('Question[Id="42323"]'),
        $jobLink = $xml.find("JobDetailLink"),
        $jobCloseDate = $xml.find('Question[Id="42261"]'),
        $jobDepartment = $xml.find('Question[Id="8318"]');
        $jobId = $xml.find('Question[Id="8341"]');

      var list = [];

      $jobTitle.each(function (index) {
        var holder = [
          $jq(this).html(),
          $jobLink.eq(index).html(),
          $jobCloseDate.eq(index).html(),
          $jobDepartment.eq(index).html(),
          $jobId.eq(index).html(),
        ];
        list.push(holder);
      });

      list.sort();

      let deptsListArray = [];
      let jobPostings = "";
      let deptsList = "<option value='filter'>Filter by department</option>";
      let today = getTodayDate();

      $jq(list).each(function (index) {
        if (list[index][2].startsWith(today)) {
          return true;
        }

        var deptValue = list[index][3].replaceAll(" ", "_").toLowerCase();

        jobPostings += "<div class='jobPost'>";
        jobPostings +=
          "<div><a target='_blank' href='" +
          list[index][1] +
          "'>" +
          list[index][0] +
          "</a></div>";
        jobPostings +=
          "<div><strong>Department:</strong> " + list[index][3] + "</div>";
        jobPostings +=
          "<div><strong>Close date:</strong> " + list[index][2] + "</div>";
           jobPostings +=
          "<div><strong>Job number:</strong> " + list[index][4] + "</div>";
        jobPostings +=
          "<div class='deptValue' style='display: none'>" + deptValue + "</div>";
        jobPostings += "</div>";

        if (deptsListArray.includes(list[index][3])) {
          return true;
        }

        deptsListArray.push(list[index][3]);
      });

      deptsListArray.sort();

      $jq(deptsListArray).each(function (index) {
        var deptValue = deptsListArray[index].replaceAll(" ", "_").toLowerCase();
        deptsList +=
          "<option value=" +
          deptValue +
          ">" +
          deptsListArray[index] +
          "</option>";
      });

      return (
        "<div class='jobPostingsData'>" +
        jobPostings +
        "</div>" +
        "<div class='deptListData'>" +
        deptsList +
        "</div>"
      );
    } else {
      return (
        "<div class='jobPostingsData'>An error occurred.</div>"
      );
    }
  }

  // Return today's date in d-F (e.g. 06-April) format.
  function getTodayDate() {
    const month = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const date = new Date();

    let day = date.getDate().toString();

    if (day.length == 1) {
      day = "0" + day;
    }

    let fullMonth = month[date.getMonth()];

    return day + "-" + fullMonth;
  }
});
