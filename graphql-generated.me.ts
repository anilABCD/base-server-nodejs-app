type Schema  = { 
  query: Query;
  mutation: Mutation;
}

export { Schema }

type Query = { 
  test_messages: [Message];
  messages: [Message];
}

export { Query }

type Mutation = { 
  sendMessage(input: SendMessageInput): Message;
}

export { Mutation }

type SendMessageInput = { 
  senderId: string;
  receiverId: string;
  message: string;
}

export { SendMessageInput }

type Message = { 
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
}

export { Message }

