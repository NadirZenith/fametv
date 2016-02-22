<?php

namespace AppBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Sonata\NewsBundle\Model\CommentInterface;

class LoadNewsData extends AbstractFixture implements ContainerAwareInterface, OrderedFixtureInterface
{

    private $container;
    private $date;

    public function load(ObjectManager $manager)
    {

        $this->date = new \DateTime();

        $this->addPost(1, 'dicas-fame');
        $this->addPost(2, 'dicas-fame');
        $this->addPost(3, 'dicas-fame');
        $this->addPost(4, 'dicas-fame');

        $this->addPost(1, 'famers');
        $this->addPost(2, 'famers');
        $this->addPost(3, 'famers');
        $this->addPost(4, 'famers');

        $this->addPost(1, 'eventos');
        $this->addPost(2, 'eventos');
        $this->addPost(3, 'eventos');
        $this->addPost(4, 'eventos');
    }

    public function addPost($media, $collection = 'default', $title = false)
    {
        $manager = $this->getPostManager();
        $faker = $this->getFaker();
        $title = $title ? $title : $faker->sentence(6);
        $post = $manager->create();

        $post->setCollection($this->getCollection($collection));
        $post->setAbstract($faker->sentence(30));
        $post->setEnabled(true);
        $post->setTitle($title);
        $post->setPublicationDateStart($this->date->modify('+1 day'));
        /* $post->setPublicationDateStart($faker->dateTimeBetween('-30 days', '-1 days')); */
        $id = $this->getMedia($media)->getId();
        $raw = <<<RAW
### Gist Formatter
Now a specific gist from github
<% gist '1552362', 'gistfile1.txt' %>
### Media Formatter
Load a media from a <code>SonataMediaBundle</code> with a specific format
<% media $id, 'reference' %>
RAW
        ;
        $raw .= sprintf("### %s\n\n%s\n\n### %s\n\n%s", $faker->sentence(rand(3, 6)), $faker->text(1000), $faker->sentence(rand(3, 6)), $faker->text(1000)
        );
        $post->setRawContent($raw);
        $post->setImage($this->getMedia($media));
        $post->setContentFormatter('markdown');
        $post->setContent($this->getPoolFormatter()->transform($post->getContentFormatter(), $post->getRawContent()));
        $post->setCommentsDefaultStatus(CommentInterface::STATUS_VALID);

        $manager->save($post);
    }

    public function getMedia($id)
    {
        return $this->getReference(sprintf('media_%s', $id));
    }

    public function getCollection($id)
    {
        return $this->getReference(sprintf('collection_%s', $id));
    }

    public function setContainer(ContainerInterface $container = null)
    {
        $this->container = $container;
    }

    public function getPoolFormatter()
    {
        return $this->container->get('sonata.formatter.pool');
    }

    /**
     * @return \Sonata\NewsBundle\Model\PostManagerInterface
     */
    public function getPostManager()
    {
        return $this->container->get('sonata.news.manager.post');
    }

    /**
     * @return \Faker\Generator
     */
    public function getFaker()
    {
        return $this->container->get('faker.generator');
    }

    function getOrder()
    {
        return 4;
    }
}
