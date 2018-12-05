import offer from './offer';
import reptile from './reptile';

export default app => {
  app.use('/api',offer);
  app.use('/',reptile);
}