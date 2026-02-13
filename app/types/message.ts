export type MessageTokens = {
  input: number;
  output: number;
  reasoning: number;
  cache?: {
    read: number;
    write: number;
  };
};

export type MessageUsage = {
  tokens: MessageTokens;
  cost?: number;
  providerId?: string;
  modelId?: string;
  contextPercent?: number | null;
};

export type MessageAttachment = {
  id: string;
  url: string;
  mime: string;
  filename: string;
};

export type MessageDiffEntry = {
  file: string;
  diff: string;
  before?: string;
  after?: string;
};

export type MessageStatus = 'streaming' | 'complete' | 'error';

export type Message = {
  id: string;
  parentId?: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  status: MessageStatus;

  agent?: string;
  model?: string;
  providerId?: string;
  modelId?: string;
  variant?: string;

  time?: number;
  usage?: MessageUsage;
  attachments?: MessageAttachment[];
  diffs?: MessageDiffEntry[];
  error?: { name: string; message: string } | null;
  classification?: 'real_user' | 'system_injection' | 'unknown';
};

// Payload types are intentionally `unknown`-heavy — they will be narrowed
// as individual event handlers are extracted from App.vue.
export type GlobalEventMap = {
  'message:delta': { messageId: string; content: string; [key: string]: unknown };
  'message:updated': { messageId: string; [key: string]: unknown };
  'message:finish': {
    finish?: string;
    sessionId?: string;
    messageId?: string;
    parentID?: string;
    error?: { name: string; message: string } | null;
  };

  'tool:call': { callId: string; toolName: string; [key: string]: unknown };
  'tool:result': { callId: string; [key: string]: unknown };

  'permission:asked': { requestID: string; [key: string]: unknown };
  'permission:replied': { requestID: string; [key: string]: unknown };

  'question:asked': { requestID: string; [key: string]: unknown };
  'question:replied': { requestID: string; [key: string]: unknown };
  'question:rejected': { requestID: string; [key: string]: unknown };

  'session:updated': { id: string; [key: string]: unknown };
  'session:deleted': { id: string; [key: string]: unknown };
  'session:diff': { sessionId?: string; [key: string]: unknown };
  'session:status': { sessionId?: string; [key: string]: unknown };

  'todo:updated': { sessionID: string; todos: unknown[] };

  'pty:data': { shellId: string; [key: string]: unknown };
  'pty:exit': { shellId: string; [key: string]: unknown };

  'reasoning:delta': { messageId?: string; content: string; [key: string]: unknown };
  'reasoning:finish': { messageId?: string; [key: string]: unknown };
};
