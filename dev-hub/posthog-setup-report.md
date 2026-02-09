# PostHog post-wizard report

The wizard has completed a deep integration of your DevHUB project. PostHog analytics has been set up using the modern `instrumentation-client.ts` approach for Next.js 16.1.6 App Router. The integration includes automatic pageview tracking, exception capture, and custom event tracking for key user interactions. A reverse proxy has been configured to improve tracking reliability by routing PostHog requests through your Next.js server.

## Integration Summary

The following files were created or modified:

| File | Change Type | Description |
|------|-------------|-------------|
| `instrumentation-client.ts` | Created | PostHog client-side initialization with debug mode, exception capture, and reverse proxy configuration |
| `next.config.ts` | Modified | Added PostHog reverse proxy rewrites for EU region |
| `.env` | Created | Environment variables for PostHog API key and host |
| `components/ExploreBtn.tsx` | Modified | Added `explore_events_clicked` event tracking |
| `components/EventCard.tsx` | Modified | Added `event_card_clicked` event tracking with event properties |
| `components/Navbar.tsx` | Modified | Added `nav_link_clicked` event tracking with link name |

## Events Tracked

| Event Name | Description | File |
|------------|-------------|------|
| `explore_events_clicked` | User clicks the 'Explore Events' button on the homepage | `components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicks on an event card to view event details (includes event_title, event_slug, event_location, event_date properties) | `components/EventCard.tsx` |
| `nav_link_clicked` | User clicks on a navigation link in the navbar (includes link_name property) | `components/Navbar.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

### Dashboard
- **Analytics basics**: [https://eu.posthog.com/project/124689/dashboard/517071](https://eu.posthog.com/project/124689/dashboard/517071)

### Insights
- **User Engagement Trends**: [https://eu.posthog.com/project/124689/insights/h3XPpfjb](https://eu.posthog.com/project/124689/insights/h3XPpfjb) - Daily trends of key user interactions
- **Event Discovery Funnel**: [https://eu.posthog.com/project/124689/insights/ZTm0eUSc](https://eu.posthog.com/project/124689/insights/ZTm0eUSc) - Conversion funnel from homepage view to event card click
- **Popular Events by Clicks**: [https://eu.posthog.com/project/124689/insights/RWvIMA38](https://eu.posthog.com/project/124689/insights/RWvIMA38) - Breakdown of event card clicks by event title
- **Navigation Usage by Link**: [https://eu.posthog.com/project/124689/insights/xtqFotJi](https://eu.posthog.com/project/124689/insights/xtqFotJi) - Navigation patterns breakdown
- **Daily Active Users (Event Viewers)**: [https://eu.posthog.com/project/124689/insights/qdeFV4do](https://eu.posthog.com/project/124689/insights/qdeFV4do) - Unique users viewing events per day

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
