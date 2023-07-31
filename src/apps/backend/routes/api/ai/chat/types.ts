

export interface AIChatRequestBody {
  user: {
    id: string,
    name: string;
  },
  withUser: {
    id: string;
    name: string;
  }
  messages: {
    fromUserId: string;
    content: string;
  }[],
  customScript: string;
  emojis: string;
  isPPV?: boolean;
}

export interface AIChatResponseBody {
  message: string;
  cost: {
    input: number;
    output: number;
    total: number;
  }
}
