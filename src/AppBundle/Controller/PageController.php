<?php

/*
 * This file is part of the Sonata package.
 *
 * (c) Thomas Rabaix <thomas.rabaix@sonata-project.org>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace AppBundle\Controller;

use Sonata\PageBundle\CmsManager\CmsManagerInterface;
use Sonata\PageBundle\CmsManager\CmsManagerSelectorInterface;
use Sonata\PageBundle\Exception\InternalErrorException;
use Sonata\PageBundle\Exception\PageNotFoundException;
use Sonata\PageBundle\Listener\ExceptionListener;
use Sonata\PageBundle\Page\PageServiceManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Sonata\PageBundle\Controller\PageController as BaseController;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

/**
 * Page controller.
 *
 * @author Thomas Rabaix <thomas.rabaix@sonata-project.org>
 */
class PageController extends Controller
{

    /**
     * @throws AccessDeniedException
     *
     * @return Response
     */
    public function viewAction($slug)
    {
        $page = $this->getPageManager()->findOneBy(['slug' => $slug]);


        if ($seoPage = $this->getSeoPage()) {
            $seoPage
                ->setTitle($page->getTitle())
                ->addMeta('name', 'description', $page->getName())
                ->addMeta('property', 'og:title', $page->getTitle())
                ->addMeta('property', 'og:type', 'page')
                ->addMeta('property', 'og:url', $this->generateUrl('app_page_view', array(
                        'slug' => $page->getSlug()
                        ), UrlGeneratorInterface::ABSOLUTE_URL))
            /* ->addMeta('property', 'og:description', $post->getAbstract()) */
            ;
        }

        return $this->render('AppBundle::app.html.twig', array(
                'page' => $page,
        ));
    }

    /**
     * @return ExceptionListener
     */
    public function getPageManager()
    {
        return $this->get('sonata.page.manager.page');
    }

    /**
     * @return SeoPageInterface
     */
    public function getSeoPage()
    {
        if ($this->has('sonata.seo.page')) {
            return $this->get('sonata.seo.page');
        }

        return;
    }
}
