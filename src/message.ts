
export type DevvitMessage = 
     | {type: 'initialData'; data:{username:string; highestScore:number}}
     | {type: 'leaderboard_data'; data: {username:string; highestScore:number}[]};

/** Message from the web view to Devvit. */
export type WebViewMessage =
  | { type: 'webViewReady' }
  | { type: 'updateHighScore'; data: { username:string; newHighScore: number } }
  | {type: 'leaderboard'};

/**
 * Web view MessageEvent listener data type. The Devvit API wraps all messages
 * from Blocks to the web view.
 */
export type DevvitSystemMessage = {
  data: { message: DevvitMessage };
  /** Reserved type for messages sent via `context.ui.webView.postMessage`. */
  type?: 'devvit-message' | string;
};
