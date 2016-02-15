<?php

namespace AppBundle\Serializer;

use Sonata\CoreBundle\Serializer\BaseSerializerHandler;
use JMS\Serializer\Context;
use JMS\Serializer\GraphNavigator;
use JMS\Serializer\VisitorInterface;
use Sonata\CoreBundle\Model\ManagerInterface;

class MediaSerializerHandler extends BaseSerializerHandler
{

    protected $pool;
    protected $template;

    public function __construct(ManagerInterface $manager, $pool, $template)
    {
        parent::__construct($manager);

        $this->pool = $pool;
        $this->template = $template;
    }

    /**
     * Serialize data object to id.
     *
     * @param VisitorInterface $visitor
     * @param object           $data
     * @param array            $type
     * @param Context          $context
     *
     * @return int|null
     */
    public function serializeObjectToId(VisitorInterface $visitor, $data, array $type, Context $context)
    {
        //$data is a -> Media
        /* dd(func_get_args()); */

        $className = $this->manager->getClass();
        if ($data instanceof $className) {

            $provider = $this->getPool()->getProvider($data->getProviderName());

            $format_reference = $provider->getFormatName($data, 'reference');
            $format_preview = $provider->getFormatName($data, 'prev');

            $options = [
                'width' => null,
                'height' => null
            ];
            $options = $provider->getHelperProperties($data, $format_reference, $options);

            /* $html = $this->render($provider->getTemplate('helper_view'), array( */
            $html = $this->render('AppBundle:Provider:view_video_api.html.twig', array(
                'media' => $data,
                'format' => $format_reference,
                'options' => $options,
            ));

            $data = [
                'id' => $data->getId(),
                'preview' => $provider->generatePublicUrl($data, $format_preview),
                'reference' => $provider->generatePublicUrl($data, $format_reference),
                'html' => $html,
            ];

            return $visitor->visitArray($data, $type, $context);
        }

        return;

        return $this->render($provider->getTemplate('helper_view'), array(
                'media' => $media,
                'format' => $format,
                'options' => $options,
        ));
    }

    /**
     * @param string $template
     * @param array  $parameters
     *
     * @return mixed
     */
    public function render($template, array $parameters = array())
    {
        return $this->template->render($template, $parameters);
    }

    /**
     * 
     * @return \Sonata\MediaBundle\Provider\Pool
     */
    private function getPool()
    {
        return $this->pool;
    }

    /**
     * {@inheritdoc}
     */
    public static function getType()
    {
        return 'app_media';
    }
}
