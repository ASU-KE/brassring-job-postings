CONTENTS OF THIS FILE
---------------------

 * Introduction
 * Installation
 * Requirements
 * Recommended Modules
 * Configuration
 * Maintainers


INTRODUCTION
------------

This module allows for displaying Brassring job postings based on a list of departments.


INSTALLATION
------------

 * Install the Brassring Job Postings module as you would normally install a contributed
   Drupal module. Visit https://www.drupal.org/node/1897420 for further information.
 * Run, "composer require asu/brassring_job_postings" to install using Composer.


REQUIREMENTS
------------

This module is private and requires the following inside of your root composer.json file along
with requesting access to the repository.

 * Add the following code snippet to tell Composer where to look for asu/brassring_job_postings.
  "repositories": [
      {
          "type": "vcs",
          "url": "https://github.com/ASU-KE/brassring_job_postings"
      }
  ],
 * You will be required to provide a GITHUB authentication token with access to module.
 * You can request access to the private repository by emailing RTS Helpdesk via email which
   will auto-generate a ticket.
   Here is an example email:
   - To: rtshelp@asu.edu
   - Subject: Request access to github repository
   - Body: Hi RTS,
           Please route this request to KE Web Services team.
           I would like to request access to the GITHUB repository for the Drupal 8 Brassring
           Job Postings module. My GITHUB handle/email is "github_handle_or_email".


CONFIGURATION
-------------

    1. Navigate to Administration > Extend and enable the module.
    2. Go to Administation > Structure > Block layout > select a Place block
       button to add a Brassring Job Postings block to a region.
    3. Use the "Configure" link of the block to configure it accordingly to your
       needs.


MAINTAINERS
-----------

 * ASU Knowledge Enterprise - https://research.asu.edu/about-us
