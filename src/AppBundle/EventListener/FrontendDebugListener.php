<?php

namespace AppBundle\EventListener;

use Symfony\Component\HttpKernel\Event\FilterResponseEvent;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\RedirectResponse;

class FrontendDebugListener
{

    private $key;

    public function __construct($key)
    {
        $this->key = $key;
    }

    public function onKernelResponse(FilterResponseEvent $event)
    {

        $request = $event->getRequest();

        if ($request->query->has($this->key)) {
            $response = new RedirectResponse(strtok($request->getUri(), '?'));
            $response->headers->setCookie(new Cookie($this->key, true));

            $event->setResponse($response);
        }
    }
}
