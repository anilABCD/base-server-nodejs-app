export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Message = {
  __typename?: 'Message';
  id: Scalars['ID'];
  message: Scalars['String'];
  receiverId: Scalars['ID'];
  senderId: Scalars['ID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  sendMessage?: Maybe<Message>;
};


export type MutationSendMessageArgs = {
  input?: InputMaybe<SendMessageInput>;
};

export type Query = {
  __typename?: 'Query';
  messages?: Maybe<Array<Maybe<Message>>>;
  test_messages?: Maybe<Array<Maybe<Message>>>;
};

export type SendMessageInput = {
  message: Scalars['String'];
  receiverId: Scalars['ID'];
  senderId: Scalars['ID'];
};
