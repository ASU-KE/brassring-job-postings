CONTENTS OF THIS FILE
---------------------

 * Introduction
 * Installation
 * Requirements
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

This module requires the following inside of your root composer.json file.

 * Add the following code snippet to tell Composer where to look for asu/brassring_job_postings.
  "repositories": [
      {
          "type": "composer",
          "url": "https://github.com/ASU-KE/brassring-job-postings"
      }
  ],
 * Run, 'composer require asu/brassring_job_postings'


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
