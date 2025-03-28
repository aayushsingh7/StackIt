import './createPost.js';

import { Devvit, useState, useWebView } from '@devvit/public-api';

import type { DevvitMessage, WebViewMessage } from './message.js';


Devvit.configure({
  redditAPI: true,
  redis: true,
  media:true,
});

// Add a custom post type to Devvit
Devvit.addCustomPostType({
  name: 'StackIt',
  height: 'regular',
  render: (context) => {
    // Load username with `useAsync` hook
    const [username] = useState(async () => {
      return (await context.reddit.getCurrentUsername()) ?? 'anon';
    });

    // Load latest high score from redis with `useAsync` hook
    const [highestScore, setHighestScore] = useState(async () => {
      const redisHighScore = await context.redis.get(`highScore_${username}`);
      return Number(redisHighScore ?? 0);
    });

    const webView = useWebView<WebViewMessage, DevvitMessage>({
      // URL of your web view content
      url: 'page.html',

      // Handle messages sent from the web view
      async onMessage(message, webView) {
        if (!message || typeof message.type === 'undefined') {
          console.error('Invalid message received:', message, webView);
          return; // Exit early if the message is invalid
        }

        switch (message.type) {
          case 'webViewReady':
            // console.log("----------------------------------------- web view ready --------------------------------------------");
            // Send initial data to web view
            webView.postMessage({
              type: 'initialData',
              data: {
                username: username,
                highestScore: highestScore,
              },
            });
            break;

          case 'updateHighScore':
            const { newHighScore } = message.data;

            // Update high score in Redis if new score is higher
            if (newHighScore > highestScore) {
              await context.redis.set(
                `highScore_${username}`,
                newHighScore.toString()
              );
              setHighestScore(newHighScore);
            }
            break;

          case 'leaderboard':
            // Fetch leaderboard from Redis
            try {
              // Get all high scores
              // @ts-ignore
              const keys = await context.redis.keys('highScore_*');

              // Fetch scores for each user
              const leaderboardData = await Promise.all(
                keys.map(async (key: any) => {
                  const score = await context.redis.get(key);
                  return {
                    username: key.replace('highScore_', ''),
                    highestScore: Number(score || 0),
                  };
                })
              );

              // Sort leaderboard by highest score in descending order
              const sortedLeaderboard = leaderboardData
                .sort((a: any, b: any) => b.highestScore - a.highestScore)
                .slice(0, 10); // Limit to top 10 scores

              // Send leaderboard back to web view
              webView.postMessage({
                type: 'leaderboard_data',
                data: sortedLeaderboard,
              });
            } catch (error) {
              console.error('Error fetching leaderboard:', error);
            }
            break;

          default:
            console.error(`Unknown message type: ${message}`);
            break;
        }
      },
      onUnmount() {
        context.ui.showToast('Web view closed!');
      },
    });

    // Render the custom post type
    return (
      <vstack grow padding="small" >
    <image
    url={"1.png"}
    height="100%"
    width="100%"
    imageWidth={500}
    imageHeight={400}
    onPress={() => webView.mount()}
    resizeMode="fit"
    description="Generative artwork: Fuzzy Fingers"
  />
      </vstack>
    );
  },
});

export default Devvit;