var $jq = jQuery.noConflict();

jQuery(document).ready(function ($jq) {
  $jq("#jobPostings").empty();

  // Career job type dropdown trigger
  $jq("form#jobTypeSelect").submit(function (event) {
    event.preventDefault();
    $jq("#jobPostings").empty();
    if ($jq("select").first().val() == "staff") {
      $jq(".loading-feature").show();
      getOpportunities($jq(".staffResponse").html());
    } else if ($jq("select").first().val() == "student") {
      $jq(".loading-feature").show();
      getOpportunities($jq(".studentResponse").html());
    }
  });

  // Clean the string that is returned from Brassring, turn into XML and return only data needed.
  function getOpportunities(xmlResponse) {
    newContent = xmlResponse;
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

    var list = [];

    $jobTitle.each(function (index) {
      var holder = [
        $jq(this).html(),
        $jobLink.eq(index).html(),
        $jobCloseDate.eq(index).html(),
        $jobDepartment.eq(index).html(),
      ];
      list.push(holder);
    });

    list.sort();

    var jobPostings = "";

    let today = getTodayDate();

    $jq(list).each(function (index) {
      if (list[index][2].startsWith(today)) {
        return true;
      }
      jobPostings += "<div>";
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
      jobPostings += "</div>";
    });

    $jq("#jobPostings").append(jobPostings);

    $jq("#jobPostings").hide();

    $jq(".loading-feature").hide();

    $jq("#jobPostings").slideDown(750);
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
