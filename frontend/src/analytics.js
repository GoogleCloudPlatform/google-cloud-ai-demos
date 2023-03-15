/* example file src/analytics.js */
import googleAnalytics from '@analytics/google-analytics';
import Analytics from 'analytics';

const analytics = Analytics({
  app: 'awesome-app',
  plugins: [
    googleAnalytics({
      measurementIds: [process.env.REACT_APP_GA_MEASUREMENT_ID],
    }),
  ],
});

/* export the instance for usage in your app */
export default analytics;
