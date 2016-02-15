<?php

namespace AppBundle\DataFixtures\ORM;

use Sonata\MediaBundle\Model\GalleryInterface;
use Sonata\MediaBundle\Model\MediaInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\DataFixtures\AbstractFixture;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Finder\Finder;

class LoadMediaData extends AbstractFixture implements ContainerAwareInterface, OrderedFixtureInterface
{

    public function load(ObjectManager $manager)
    {

        $manager = $this->getMediaManager();
        $faker = $this->getFaker();
        $category = 'default';
        $context = 'news';
        $videos = Finder::create()->name('video*.mp4')->in(__DIR__ . '/../data/videos');

        $i = 1;
        foreach ($videos as $file) {
            $media = $manager->create();
            $media->setBinaryContent($file);
            $media->setEnabled(true);
            $media->setName($faker->sentence(3));
            $media->setDescription('Media Description');
            $media->setAuthorName('Author Name');
            $media->setCopyright('CC BY-NC-SA 4.0');
            $media->setCategory($this->getReference(sprintf('category_%s', $category)));

            $manager->save($media, $context, 'sonata.media.provider.video');

            $this->setReference(sprintf('media_%s', $i ++), $media);
        }
    }

    /**
     * @return \Sonata\MediaBundle\Model\MediaManagerInterface
     */
    public function getMediaManager()
    {
        return $this->container->get('sonata.media.manager.media');
    }

    /**
     * @return \Sonata\MediaBundle\Model\MediaManagerInterface
     */
    public function getGalleryManager()
    {
        return $this->container->get('sonata.media.manager.gallery');
    }

    /**
     * @return \Faker\Generator
     */
    public function getFaker()
    {
        return $this->container->get('faker.generator');
    }
    private $container;

    function getOrder()
    {
        return 3;
    }

    public function setContainer(ContainerInterface $container = null)
    {
        $this->container = $container;
    }
}
