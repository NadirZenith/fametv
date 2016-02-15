<?php

/*
 * This file is part of the Sonata project.
 *
 * (c) Sonata Project
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace AppBundle\Permalink;

use Sonata\NewsBundle\Model\PostInterface;
use Sonata\NewsBundle\Permalink\PermalinkInterface;

class VideosPermalink implements PermalinkInterface
{

    public function __construct()
    {
        ;
    }

    /**
     * {@inheritdoc}
     */
    public function generate(PostInterface $post)
    {
        return $post->getId();
        /* return null == $post->getCollection() ? $post->getSlug() : sprintf('%s/%s', $post->getCollection()->getSlug(), $post->getSlug()); */
    }

    /**
     * {@inheritdoc}
     */
    public function getParameters($permalink)
    {
        return ['id' => (int) $permalink];
        /*
          $parameters = explode('/', $permalink);

          if (count($parameters) > 2 || count($parameters) == 0) {
          throw new \InvalidArgumentException('wrong permalink format');
          }

          if (false === strpos($permalink, '/')) {
          $collection = null;
          $slug = $permalink;
          } else {
          list($collection, $slug) = $parameters;
          }

          return array(
          'collection' => $collection,
          'slug' => $slug,
          );
         */
    }
}
