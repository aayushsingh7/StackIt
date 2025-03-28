import { Devvit } from '@devvit/public-api';

// Adds a new menu item to the subreddit allowing to create a new post
Devvit.addMenuItem({
  label: 'StackIt',
  location: 'subreddit',
  onPress: async (_event, context) => {
    const { reddit, ui } = context;
    const subreddit = await reddit.getCurrentSubreddit();
    const post = await reddit.submitPost({
      title: 'StackIt – Build the Tallest Tower!',
      subredditName: subreddit.name,
      preview: (
        <vstack height="100%" width="100%" alignment="middle center">
          <text size="large">Loading StackIt...</text>
        </vstack>
      ),
    });
    ui.showToast({ text: 'Created post!' });
    ui.navigateTo(post);
  },
});
