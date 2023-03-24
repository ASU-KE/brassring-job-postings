<?php

namespace Drupal\brassring_job_postings\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Block\BlockPluginInterface;
use GuzzleHttp\Client;

/**
 * Provides a 'Brassring Job Postings' Block.
 *
 * @Block(
 *   id = "brassring_job_postings_block",
 *   admin_label = @Translation("Brassring Job Postings block"),
 *   category = @Translation("Brassring Job Postings"),
 * )
 */
class BrassringJobPostingsBlock extends BlockBase implements BlockPluginInterface {

  /**
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state)
  {
    $form = parent::blockForm($form, $form_state);
    $posting_title = isset($this->configuration['posting_title']) ? $this->configuration['posting_title'] : "";
    $posting_callout = isset($this->configuration['posting_callout']) ? $this->configuration['posting_callout'] : "";
    $staff_depts = isset($this->configuration['staff_depts']) ? $this->configuration['staff_depts'] : "";
    $student_depts = isset($this->configuration['student_depts']) ? $this->configuration['student_depts'] : "";
    $dept_filter = isset($this->configuration['dept_filter']) ? $this->configuration['dept_filter'] : "";

    $form['posting_title'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Title'),
      '#description' => $this->t('Add a title to the section.'),
      '#default_value' => $posting_title,
      '#required' => true
    ];

    $form['posting_callout'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Callout'),
      '#description' => $this->t('Add additional callout text.'),
      '#default_value' => $posting_callout,
      '#required' => true
    ];

    $form['staff_depts'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Staff job listing departments'),
      '#description' => $this->t('Add comma separated departments for staff job postings.'),
      '#default_value' => $staff_depts,
      '#required' => true
    ];

    $form['student_depts'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Student job listing departments'),
      '#description' => $this->t('Add comma separated departments for student job postings.'),
      '#default_value' => $student_depts,
      '#required' => true
    ];

    $form['dept_filter'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Would you like to enable the ability for users to filter jobs by department?'),
      '#description' => $this->t('Check the box to enable department filtering.'),
      '#default_value' => $dept_filter,
      '#required' => false
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state)
  {

    parent::blockSubmit($form, $form_state);

    $this->configuration['posting_title'] = $form_state->getValue('posting_title');
    $this->configuration['posting_callout'] = $form_state->getValue('posting_callout');
    $this->configuration['staff_depts'] = $form_state->getValue('staff_depts');
    $this->configuration['student_depts'] = $form_state->getValue('student_depts');
    $this->configuration['dept_filter'] = $form_state->getValue('dept_filter');

  }

  /**
   * {@inheritdoc}
   */
  public function build() {

    function getBrassringAPIData($dept_list, $staff = false) {

      $client = new Client();

      $siteID = $staff ? "5494" : "5495";

      try {
        $response = $client->request('POST', 'https://Import.brassring.com/WebRouter/WebRouter.asmx/route',
          [
            'verify' => false,
            'headers' => ['Content-Type' => 'application/x-www-form-urlencoded'],
            'form_params' => [
              'inputXml' => "<Envelope version='01.00'><Sender><Id>12345</Id><Credential>25620</Credential></Sender><TransactInfo transactId='1' transactType='data'><TransactId>01/27/2010</TransactId><TimeStamp>12:00:00 AM</TimeStamp></TransactInfo><Unit UnitProcessor='SearchAPI'><Packet><PacketInfo packetType='data'><packetId>1</packetId></PacketInfo><Payload><InputString> <ClientId>25620</ClientId><SiteId>" . $siteID . "</SiteId><PageNumber>1</PageNumber><OutputXMLFormat>0</OutputXMLFormat> <AuthenticationToken/><HotJobs/><ProximitySearch><Distance/><Measurement/><Country/><State/><City/><zipCode/></ProximitySearch><JobMatchCriteriaText/><SelectedSearchLocaleId/><Questions><Question Sortorder='ASC' Sort='No'><Id>8318</Id> <Value><![CDATA[" . $dept_list . "]]></Value></Question></Questions></InputString></Payload></Packet></Unit></Envelope>",
            ],
          ]
        );
        return $response->getBody();
      }
      catch (\Exception $error) {
        $logger = \Drupal::logger('HTTP Client error');
        $logger->error($error->getMessage());
        return null;
      }
    }

    $config = $this->getConfiguration();

    if(getBrassringAPIData($config['staff_depts'], true) != null) {
      $staff_postings = getBrassringAPIData($config['staff_depts'], true);
    } else {
      $staff_postings = 'error';
    }

    if(getBrassringAPIData($config['student_depts'], false) != null) {
      $student_postings = getBrassringAPIData($config['student_depts'], false);
    } else {
      $student_postings = 'error';
    }

    $build = [];

    $build = [
      '#theme' => 'brassring_job_postings',
      '#posting_title' => $config['posting_title'],
      '#posting_callout' => $config['posting_callout'],
      '#staff_postings' => $staff_postings,
      '#student_postings' => $student_postings,
      '#dept_filter' => $config['dept_filter'],
    ];

    return $build;

  }

  /**
   * {@inheritdoc}
   */
  public function getCacheMaxAge() {
    return 0;
  }

}
