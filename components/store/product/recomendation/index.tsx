import dynamic from 'next/dynamic';
const WeRecomend = dynamic(() => import('./WeRecomend'));
const BuyTogether = dynamic(() => import('./BuyTogether'));
import styles from '../styles/recomendationMain.module.css';
import ErrorBoundary from 'common/helpers/ErrorBoundery';

const Recomendation = ({ product }) => {
  return (
    <div className={styles.Container}>
      <div className={styles.Wrapper}>
        <div className={styles.Content}>
          <ErrorBoundary>
            <WeRecomend product={product} />
          </ErrorBoundary>

          <ErrorBoundary>
            <BuyTogether product={product} />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default Recomendation;
