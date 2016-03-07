<?php

// src/AppBundle/EventListener/LocaleListener.php

namespace AppBundle\EventListener;

use Symfony\Component\HttpKernel\Event\GetResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class ContactMeListener implements EventSubscriberInterface
{

    protected $mailer;

    public function onKernelRequest(GetResponseEvent $event)
    {
        if (!$event->isMasterRequest()) {
            // don't do anything if it's not the master request
            return;
        }

        $request = $event->getRequest();
        $name = $request->get('name', FALSE);
        $email = $request->get('email', FALSE);
        $message = $request->get('message', FALSE);

        if (empty($name) || empty($email) || empty($message)) {
            return;
        }

        /* $to = get_option('admin_email'); */
        $to = 'albertino05@gmail.com';
        $subject = "Website Contact Form:  $name";
        $body = "You have received a new message from your website contact form.\n\n" . "Here are the details:\n\nName: $name\n\nEmail: $email\n\nMessage:\n$message";
        $headers = array('Content-Type: text/html; charset=UTF-8');

        /* $sent = wp_mail($to, $subject, $body, $headers); */

        $message = \Swift_Message::newInstance()
            ->setSubject($subject)
            ->setFrom('send@example.com')
            ->setTo($to)
            ->setBody(
            $body
            /*
              $this->renderView(
              // app/Resources/views/Emails/registration.html.twig
              'Emails/registration.html.twig', array('name' => $name)
              ), 'text/html'
             */
        );

        $sent = $this->mailer->send($message);
        $response = new \Symfony\Component\HttpFoundation\JsonResponse(array('success' => $sent));

        $event->setResponse($response);
    }

    public function setMailer($mailer)
    {
        $this->mailer = $mailer;
    }

    public static function getSubscribedEvents()
    {
        return array(
            KernelEvents::REQUEST => array(array('onKernelRequest', 23)),
        );
    }
}
