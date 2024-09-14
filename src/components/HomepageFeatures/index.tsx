import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Img: React.ComponentType<React.ComponentProps<'png'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Android',
    Img: require('@site/static/img/screenshot-android.png').default,
    description: (
      <>
        Hemlock is a native Android app, written in Kotlin.
      </>
    ),
  },
  {
    title: 'iOS',
    Img: require('@site/static/img/screenshot-ios.png').default,
    description: (
      <>
        Hemlock is a native iOS app, written in Swift.
      </>
    ),
  },
  {
    title: 'Powered by Evergreen™',
    Img: require('@site/static/img/screenshot-staffclient.png').default,
    description: (
      <>
        Hemlock uses the same Evergreen server
        as the online catalog, so it never has stale data.
      </>
    ),
  },
];

function Feature({title, Img, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img className={styles.featureImg} src={Img} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
