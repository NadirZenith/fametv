<?php

namespace DevBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class DefaultController extends Controller
{
    /**
     * @Route("/dev")
     * @Template()
     */
    public function indexAction()
    {
        die('xau');
        return array('name' => $name);
    }
}
