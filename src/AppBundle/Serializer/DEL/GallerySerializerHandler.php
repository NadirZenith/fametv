<?php

namespace AppBundle\Serializer;

use Sonata\CoreBundle\Serializer\BaseSerializerHandler;
use JMS\Serializer\Context;
use JMS\Serializer\GraphNavigator;
use JMS\Serializer\VisitorInterface;
use Sonata\CoreBundle\Model\ManagerInterface;

class GallerySerializerHandler extends BaseSerializerHandler
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

        $className = $this->manager->getClass();
        if ($data instanceof $className) {

            $galleryHasMedias = $data->getGalleryHasMedias();
            /* d($galleryHasMedias); */

            $galData = [];
            foreach ($galleryHasMedias as $galMedia) {
                $data = $galMedia->getMedia();
                $provider = $this->getPool()->getProvider($data->getProviderName());
                $format = 'wide';
                $format = $provider->getFormatName($data, $format);

                $options = $provider->getHelperProperties($data, $format, []);
/*
                d($options);
 */
                $options['width'] = null;
                $options['height'] = null;
                $html = $this->render($provider->getTemplate('helper_view'), array(
                    'media' => $data,
                    'format' => $format,
                    'options' => $options,
                ));

                $galData[] = [
                    'id' => $data->getId(),
                    'width' => $data->getBox()->getWidth(),
                    'height' => $data->getBox()->getHeight(),
                    'url' => $provider->generatePublicUrl($data, $format),
                    'html' => $html
                ];
            }

            /* dd($galData); */

            return $visitor->visitArray($galData, $type, $context);
        }

        return;
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
        return 'app_gallery';
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
}
