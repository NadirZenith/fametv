<?php

namespace AppBundle\Serializer;

use Sonata\CoreBundle\Serializer\BaseSerializerHandler;
use JMS\Serializer\Context;
use JMS\Serializer\GraphNavigator;
use JMS\Serializer\VisitorInterface;
use Sonata\CoreBundle\Model\ManagerInterface;

class ThumbSerializerHandler extends BaseSerializerHandler
{

    protected $pool;

    public function __construct(ManagerInterface $manager, $pool)
    {
        parent::__construct($manager);

        $this->pool = $pool;
    }

    /**
     * {@inheritdoc}
     */
    public static function getType()
    {
        return 'app_thumb';
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

            $provider = $this->getPool()->getProvider($data->getProviderName());
            $format = 'archive';
            /*$format = 'wide';*/
            $format = $provider->getFormatName($data, $format);

            $data = [
                'id' => $data->getId(),
                'width' => $data->getBox()->getWidth(),
                'height' => $data->getBox()->getHeight(),
                'url' => $provider->generatePublicUrl($data, $format),
            ];

            return $visitor->visitArray($data, $type, $context);
        }
    }

    /**
     * 
     * @return \Sonata\MediaBundle\Provider\Pool
     */
    private function getPool()
    {
        return $this->pool;
    }
}
