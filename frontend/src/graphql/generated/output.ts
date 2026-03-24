import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  JSON: { input: any; output: any; }
  Upload: { input: any; output: any; }
};

export type BlogModel = {
  __typename?: 'BlogModel';
  author: UserModel;
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  posterUrl?: Maybe<Scalars['String']['output']>;
  posts: Array<PostModel>;
  tags: Array<TagModel>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type BlogPagination = {
  __typename?: 'BlogPagination';
  data: Array<BlogModel>;
  page: Scalars['Int']['output'];
  perPage: Scalars['Int']['output'];
  totalCount: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type CommentModel = {
  __typename?: 'CommentModel';
  author: UserModel;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  parentId?: Maybe<Scalars['String']['output']>;
  post?: Maybe<PostModel>;
  replies: Array<CommentModel>;
  text: Scalars['String']['output'];
};

export type CreateBlogInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  postIds: Array<Scalars['String']['input']>;
  tags: Array<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type CreatePostInput = {
  content: Scalars['JSON']['input'];
  tags: Array<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type FiltersInput = {
  onlySubscriptions?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  changeBlogPoster: Scalars['Boolean']['output'];
  changeProfileAvatar: UserModel;
  changeProfilePoster: UserModel;
  createBlog: BlogModel;
  createComment: CommentModel;
  createPost: PostModel;
  createTag: TagModel;
  deleteBlog: Scalars['Boolean']['output'];
  deleteBlogPoster: Scalars['Boolean']['output'];
  deleteComment: Scalars['Boolean']['output'];
  deletePost: PostDeleteResponse;
  deleteTag: Scalars['Boolean']['output'];
  pinPost: PostModel;
  pinPostToBlog: PostModel;
  removeProfileAvatar: UserModel;
  removeProfilePoster: UserModel;
  signIn: UserModel;
  signOutAccount: Scalars['Boolean']['output'];
  signUp: UserModel;
  subscribeToUser: Scalars['Boolean']['output'];
  unPinPost: UnPinPostResponse;
  unPinPostFromBlog: UnPinPostResponse;
  unsubscribeFromUser: Scalars['Boolean']['output'];
  updateBlog: Scalars['Boolean']['output'];
  updateComment: Scalars['Boolean']['output'];
  updatePost: Scalars['Boolean']['output'];
  updatePostOrBlogTags: Scalars['Boolean']['output'];
  updateUser: UserModel;
  uploadImage: UploadImageModel;
};


export type MutationChangeBlogPosterArgs = {
  blogId: Scalars['String']['input'];
  posterFile: Scalars['Upload']['input'];
};


export type MutationChangeProfileAvatarArgs = {
  file: Scalars['Upload']['input'];
};


export type MutationChangeProfilePosterArgs = {
  file: Scalars['Upload']['input'];
};


export type MutationCreateBlogArgs = {
  data: CreateBlogInput;
  poster?: InputMaybe<Scalars['Upload']['input']>;
};


export type MutationCreateCommentArgs = {
  parentId?: InputMaybe<Scalars['String']['input']>;
  postId: Scalars['String']['input'];
  text: Scalars['String']['input'];
};


export type MutationCreatePostArgs = {
  blogId?: InputMaybe<Scalars['String']['input']>;
  data: CreatePostInput;
};


export type MutationCreateTagArgs = {
  name: Scalars['String']['input'];
};


export type MutationDeleteBlogArgs = {
  blogId: Scalars['String']['input'];
};


export type MutationDeleteBlogPosterArgs = {
  blogId: Scalars['String']['input'];
};


export type MutationDeleteCommentArgs = {
  commentId: Scalars['String']['input'];
};


export type MutationDeletePostArgs = {
  postId: Scalars['String']['input'];
};


export type MutationDeleteTagArgs = {
  name: Scalars['String']['input'];
};


export type MutationPinPostArgs = {
  blogId: Scalars['String']['input'];
  postId: Scalars['String']['input'];
};


export type MutationPinPostToBlogArgs = {
  blogId: Scalars['String']['input'];
  postId: Scalars['String']['input'];
};


export type MutationSignInArgs = {
  data: SignInInput;
};


export type MutationSignUpArgs = {
  data: SignUpInput;
};


export type MutationSubscribeToUserArgs = {
  toId: Scalars['String']['input'];
};


export type MutationUnPinPostArgs = {
  blogId: Scalars['String']['input'];
  postId: Scalars['String']['input'];
};


export type MutationUnPinPostFromBlogArgs = {
  blogId: Scalars['String']['input'];
  postId: Scalars['String']['input'];
};


export type MutationUnsubscribeFromUserArgs = {
  toId: Scalars['String']['input'];
};


export type MutationUpdateBlogArgs = {
  blogId: Scalars['String']['input'];
  data: UpdateBlogInput;
  poster?: InputMaybe<Scalars['Upload']['input']>;
};


export type MutationUpdateCommentArgs = {
  commentId: Scalars['String']['input'];
  text: Scalars['String']['input'];
};


export type MutationUpdatePostArgs = {
  data: UpdatePostInput;
  postId: Scalars['String']['input'];
};


export type MutationUpdatePostOrBlogTagsArgs = {
  tags: Array<Scalars['String']['input']>;
  to: UpdatePostOrBlogTagsInput;
};


export type MutationUpdateUserArgs = {
  data: UpdateUserInput;
};


export type MutationUploadImageArgs = {
  image: Scalars['Upload']['input'];
};

export type PostDeleteResponse = {
  __typename?: 'PostDeleteResponse';
  postId: Scalars['String']['output'];
};

export type PostModel = {
  __typename?: 'PostModel';
  author: UserModel;
  blog?: Maybe<BlogModel>;
  commentsCount: Scalars['Int']['output'];
  content: Scalars['JSON']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  likesCount: Scalars['Int']['output'];
  tags: Array<TagModel>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  viewsCount: Scalars['Int']['output'];
};

export type PostPagination = {
  __typename?: 'PostPagination';
  data: Array<PostModel>;
  page: Scalars['Int']['output'];
  perPage: Scalars['Int']['output'];
  totalCount: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  blogsForPin: Array<BlogModel>;
  findTagsBySearchString: Array<TagModel>;
  getAllBlogsPagination: BlogPagination;
  getAllPostComments: Array<CommentModel>;
  getAllPostsPagination: PostPagination;
  getAllUsersPagination: UserPagination;
  getBlogById: BlogModel;
  getFreePostsForPin: Array<PostModel>;
  getPostById: PostModel;
  getUserByUsername: UserModel;
  userProfile: UserModel;
};


export type QueryFindTagsBySearchStringArgs = {
  search: Scalars['String']['input'];
};


export type QueryGetAllBlogsPaginationArgs = {
  filters?: InputMaybe<FiltersInput>;
  searchParams?: InputMaybe<SearchParamsInput>;
};


export type QueryGetAllPostCommentsArgs = {
  postId: Scalars['String']['input'];
};


export type QueryGetAllPostsPaginationArgs = {
  filters?: InputMaybe<FiltersInput>;
  searchParams?: InputMaybe<SearchParamsInput>;
};


export type QueryGetAllUsersPaginationArgs = {
  onlySubscriptions: Scalars['Boolean']['input'];
  searchParams?: InputMaybe<SearchParamsInput>;
  searchStr?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetBlogByIdArgs = {
  blogId: Scalars['String']['input'];
};


export type QueryGetFreePostsForPinArgs = {
  searchStr?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetPostByIdArgs = {
  postId: Scalars['String']['input'];
};


export type QueryGetUserByUsernameArgs = {
  username: Scalars['String']['input'];
};

export type SearchParamsInput = {
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
};

export type SignInInput = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type SignUpInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type TagModel = {
  __typename?: 'TagModel';
  blogs: Array<BlogModel>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  posts: Array<PostModel>;
  updatedAt: Scalars['DateTime']['output'];
};

export type UnPinPostResponse = {
  __typename?: 'UnPinPostResponse';
  postId: Scalars['String']['output'];
};

export type UpdateBlogInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  postIds?: InputMaybe<Array<Scalars['String']['input']>>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePostInput = {
  content?: InputMaybe<Scalars['JSON']['input']>;
  likesCount?: InputMaybe<Scalars['Int']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
  viewsCount?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdatePostOrBlogTagsInput = {
  blogId?: InputMaybe<Scalars['String']['input']>;
  postId?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserInput = {
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  posterUrl?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type UploadImageModel = {
  __typename?: 'UploadImageModel';
  url: Scalars['String']['output'];
};

export type UserModel = {
  __typename?: 'UserModel';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  blogs: Array<BlogModel>;
  comments?: Maybe<Array<CommentModel>>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  posterUrl?: Maybe<Scalars['String']['output']>;
  posts: Array<PostModel>;
  subscribers: Array<Scalars['String']['output']>;
  subscriptions: Array<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  username: Scalars['String']['output'];
};

export type UserPagination = {
  __typename?: 'UserPagination';
  data: Array<UserModel>;
  page: Scalars['Int']['output'];
  perPage: Scalars['Int']['output'];
  totalCount: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type AuthUserFragmentFragment = { __typename?: 'UserModel', id: string, username: string, email: string, description?: string | null, avatarUrl?: string | null, posterUrl?: string | null, subscriptions: Array<string>, subscribers: Array<string>, createdAt: any, updatedAt: any };

export type BlogFragmentFragment = { __typename?: 'BlogModel', id: string, title: string, description: string, posterUrl?: string | null, createdAt: any, tags: Array<{ __typename?: 'TagModel', id: string, name: string }>, author: { __typename?: 'UserModel', username: string, avatarUrl?: string | null } };

export type CommentFieldsFragment = { __typename?: 'CommentModel', id: string, text: string, parentId?: string | null, createdAt: any, author: { __typename?: 'UserModel', username: string, avatarUrl?: string | null }, replies: Array<{ __typename?: 'CommentModel', id: string, text: string, parentId?: string | null, createdAt: any, replies: Array<{ __typename?: 'CommentModel', id: string, text: string, parentId?: string | null, createdAt: any, replies: Array<{ __typename?: 'CommentModel', id: string, text: string, parentId?: string | null, createdAt: any, replies: Array<{ __typename?: 'CommentModel', id: string, text: string, parentId?: string | null, createdAt: any, author: { __typename?: 'UserModel', username: string, avatarUrl?: string | null } }>, author: { __typename?: 'UserModel', username: string, avatarUrl?: string | null } }>, author: { __typename?: 'UserModel', username: string, avatarUrl?: string | null } }>, author: { __typename?: 'UserModel', username: string, avatarUrl?: string | null } }> };

export type RepliesFieldsFragment = { __typename?: 'CommentModel', id: string, text: string, parentId?: string | null, createdAt: any, author: { __typename?: 'UserModel', username: string, avatarUrl?: string | null } };

export type PostFragmentFragment = { __typename?: 'PostModel', id: string, title: string, content: any, createdAt: any, author: { __typename?: 'UserModel', username: string, avatarUrl?: string | null } };

export type ChangeBlogPosterMutationVariables = Exact<{
  blogId: Scalars['String']['input'];
  posterFile: Scalars['Upload']['input'];
}>;


export type ChangeBlogPosterMutation = { __typename?: 'Mutation', changeBlogPoster: boolean };

export type DeleteBlogPosterMutationVariables = Exact<{
  blogId: Scalars['String']['input'];
}>;


export type DeleteBlogPosterMutation = { __typename?: 'Mutation', deleteBlogPoster: boolean };

export type ChangeProfileAvatarMutationVariables = Exact<{
  file: Scalars['Upload']['input'];
}>;


export type ChangeProfileAvatarMutation = { __typename?: 'Mutation', changeProfileAvatar: { __typename?: 'UserModel', avatarUrl?: string | null } };

export type ChangeProfilePosterMutationVariables = Exact<{
  file: Scalars['Upload']['input'];
}>;


export type ChangeProfilePosterMutation = { __typename?: 'Mutation', changeProfilePoster: { __typename?: 'UserModel', posterUrl?: string | null } };

export type CreateBlogMutationVariables = Exact<{
  data: CreateBlogInput;
  poster?: InputMaybe<Scalars['Upload']['input']>;
}>;


export type CreateBlogMutation = { __typename?: 'Mutation', createBlog: { __typename?: 'BlogModel', id: string } };

export type CreateCommentMutationVariables = Exact<{
  text: Scalars['String']['input'];
  postId: Scalars['String']['input'];
  parentId?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateCommentMutation = { __typename?: 'Mutation', createComment: { __typename?: 'CommentModel', id: string, text: string, parentId?: string | null, createdAt: any, author: { __typename?: 'UserModel', username: string, avatarUrl?: string | null }, replies: Array<{ __typename?: 'CommentModel', id: string, text: string, parentId?: string | null, createdAt: any, replies: Array<{ __typename?: 'CommentModel', id: string, text: string, parentId?: string | null, createdAt: any, replies: Array<{ __typename?: 'CommentModel', id: string, text: string, parentId?: string | null, createdAt: any, replies: Array<{ __typename?: 'CommentModel', id: string, text: string, parentId?: string | null, createdAt: any, author: { __typename?: 'UserModel', username: string, avatarUrl?: string | null } }>, author: { __typename?: 'UserModel', username: string, avatarUrl?: string | null } }>, author: { __typename?: 'UserModel', username: string, avatarUrl?: string | null } }>, author: { __typename?: 'UserModel', username: string, avatarUrl?: string | null } }> } };

export type CreatePostMutationVariables = Exact<{
  data: CreatePostInput;
  blogId?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost: { __typename?: 'PostModel', id: string } };

export type DeleteBlogMutationVariables = Exact<{
  blogId: Scalars['String']['input'];
}>;


export type DeleteBlogMutation = { __typename?: 'Mutation', deleteBlog: boolean };

export type DeleteCommentMutationVariables = Exact<{
  commentId: Scalars['String']['input'];
}>;


export type DeleteCommentMutation = { __typename?: 'Mutation', deleteComment: boolean };

export type DeletePostMutationVariables = Exact<{
  postId: Scalars['String']['input'];
}>;


export type DeletePostMutation = { __typename?: 'Mutation', deletePost: { __typename?: 'PostDeleteResponse', postId: string } };

export type PinPostMutationVariables = Exact<{
  blogId: Scalars['String']['input'];
  postId: Scalars['String']['input'];
}>;


export type PinPostMutation = { __typename?: 'Mutation', pinPost: { __typename?: 'PostModel', id: string, title: string, content: any, createdAt: any, tags: Array<{ __typename?: 'TagModel', id: string, name: string }>, author: { __typename?: 'UserModel', username: string, avatarUrl?: string | null } } };

export type RemoveProfileAvatarMutationVariables = Exact<{ [key: string]: never; }>;


export type RemoveProfileAvatarMutation = { __typename?: 'Mutation', removeProfileAvatar: { __typename?: 'UserModel', avatarUrl?: string | null } };

export type RemoveProfilePosterMutationVariables = Exact<{ [key: string]: never; }>;


export type RemoveProfilePosterMutation = { __typename?: 'Mutation', removeProfilePoster: { __typename?: 'UserModel', posterUrl?: string | null } };

export type SignOutMutationVariables = Exact<{ [key: string]: never; }>;


export type SignOutMutation = { __typename?: 'Mutation', signOutAccount: boolean };

export type SignUpMutationVariables = Exact<{
  data: SignUpInput;
}>;


export type SignUpMutation = { __typename?: 'Mutation', signUp: { __typename?: 'UserModel', id: string, username: string, email: string, description?: string | null, avatarUrl?: string | null, posterUrl?: string | null, subscriptions: Array<string>, subscribers: Array<string>, createdAt: any, updatedAt: any } };

export type SignInMutationVariables = Exact<{
  data: SignInInput;
}>;


export type SignInMutation = { __typename?: 'Mutation', signIn: { __typename?: 'UserModel', id: string, username: string, email: string, description?: string | null, avatarUrl?: string | null, posterUrl?: string | null, subscriptions: Array<string>, subscribers: Array<string>, createdAt: any, updatedAt: any } };

export type SubscribeMutationVariables = Exact<{
  toId: Scalars['String']['input'];
}>;


export type SubscribeMutation = { __typename?: 'Mutation', subscribeToUser: boolean };

export type TogglePinBlogMutationVariables = Exact<{
  blogId: Scalars['String']['input'];
  postId: Scalars['String']['input'];
}>;


export type TogglePinBlogMutation = { __typename?: 'Mutation', pinPostToBlog: { __typename?: 'PostModel', blog?: { __typename?: 'BlogModel', id: string } | null } };

export type UnPinPostMutationVariables = Exact<{
  blogId: Scalars['String']['input'];
  postId: Scalars['String']['input'];
}>;


export type UnPinPostMutation = { __typename?: 'Mutation', unPinPost: { __typename?: 'UnPinPostResponse', postId: string } };

export type UnsubscribeMutationVariables = Exact<{
  toId: Scalars['String']['input'];
}>;


export type UnsubscribeMutation = { __typename?: 'Mutation', unsubscribeFromUser: boolean };

export type UpdateBlogMutationVariables = Exact<{
  data: UpdateBlogInput;
  blogId: Scalars['String']['input'];
  poster?: InputMaybe<Scalars['Upload']['input']>;
}>;


export type UpdateBlogMutation = { __typename?: 'Mutation', updateBlog: boolean };

export type UpdateCommentMutationVariables = Exact<{
  text: Scalars['String']['input'];
  commentId: Scalars['String']['input'];
}>;


export type UpdateCommentMutation = { __typename?: 'Mutation', updateComment: boolean };

export type UpdatePostMutationVariables = Exact<{
  postId: Scalars['String']['input'];
  data: UpdatePostInput;
}>;


export type UpdatePostMutation = { __typename?: 'Mutation', updatePost: boolean };

export type UpdateProfileMutationVariables = Exact<{
  data: UpdateUserInput;
}>;


export type UpdateProfileMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'UserModel', email: string, username: string, description?: string | null } };

export type GetTagsBySearchStringQueryVariables = Exact<{
  search: Scalars['String']['input'];
}>;


export type GetTagsBySearchStringQuery = { __typename?: 'Query', findTagsBySearchString: Array<{ __typename?: 'TagModel', id: string, name: string }> };

export type GetAllBlogsQueryVariables = Exact<{
  searchParams: SearchParamsInput;
  filters?: InputMaybe<FiltersInput>;
}>;


export type GetAllBlogsQuery = { __typename?: 'Query', getAllBlogsPagination: { __typename?: 'BlogPagination', page: number, perPage: number, totalPages: number, totalCount: number, data: Array<{ __typename?: 'BlogModel', id: string, title: string, description: string, posterUrl?: string | null, createdAt: any, tags: Array<{ __typename?: 'TagModel', id: string, name: string }>, author: { __typename?: 'UserModel', username: string, avatarUrl?: string | null } }> } };

export type GetAllFreePostsForPinQueryVariables = Exact<{
  searchStr?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetAllFreePostsForPinQuery = { __typename?: 'Query', getFreePostsForPin: Array<{ __typename?: 'PostModel', id: string, title: string }> };

export type GetAllPostCommentsQueryVariables = Exact<{
  postId: Scalars['String']['input'];
}>;


export type GetAllPostCommentsQuery = { __typename?: 'Query', getAllPostComments: Array<{ __typename?: 'CommentModel', id: string, text: string, parentId?: string | null, createdAt: any, author: { __typename?: 'UserModel', username: string, avatarUrl?: string | null }, replies: Array<{ __typename?: 'CommentModel', id: string, text: string, parentId?: string | null, createdAt: any, replies: Array<{ __typename?: 'CommentModel', id: string, text: string, parentId?: string | null, createdAt: any, replies: Array<{ __typename?: 'CommentModel', id: string, text: string, parentId?: string | null, createdAt: any, replies: Array<{ __typename?: 'CommentModel', id: string, text: string, parentId?: string | null, createdAt: any, author: { __typename?: 'UserModel', username: string, avatarUrl?: string | null } }>, author: { __typename?: 'UserModel', username: string, avatarUrl?: string | null } }>, author: { __typename?: 'UserModel', username: string, avatarUrl?: string | null } }>, author: { __typename?: 'UserModel', username: string, avatarUrl?: string | null } }> }> };

export type GetAllPostsQueryVariables = Exact<{
  searchParams: SearchParamsInput;
  filters?: InputMaybe<FiltersInput>;
}>;


export type GetAllPostsQuery = { __typename?: 'Query', getAllPostsPagination: { __typename?: 'PostPagination', page: number, perPage: number, totalCount: number, totalPages: number, data: Array<{ __typename?: 'PostModel', id: string, title: string, content: any, createdAt: any, tags: Array<{ __typename?: 'TagModel', id: string, name: string }>, author: { __typename?: 'UserModel', username: string, avatarUrl?: string | null } }> } };

export type GetAllUsersQueryVariables = Exact<{
  searchParams: SearchParamsInput;
  searchStr: Scalars['String']['input'];
  onlySubscriptions: Scalars['Boolean']['input'];
}>;


export type GetAllUsersQuery = { __typename?: 'Query', getAllUsersPagination: { __typename?: 'UserPagination', page: number, perPage: number, totalCount: number, totalPages: number, data: Array<{ __typename?: 'UserModel', id: string, avatarUrl?: string | null, username: string, description?: string | null }> } };

export type GetBlogByIdQueryVariables = Exact<{
  blogId: Scalars['String']['input'];
}>;


export type GetBlogByIdQuery = { __typename?: 'Query', getBlogById: { __typename?: 'BlogModel', id: string, title: string, description: string, posterUrl?: string | null, createdAt: any, posts: Array<{ __typename?: 'PostModel', id: string, title: string, content: any, createdAt: any, tags: Array<{ __typename?: 'TagModel', id: string, name: string }>, author: { __typename?: 'UserModel', username: string, avatarUrl?: string | null } }>, tags: Array<{ __typename?: 'TagModel', id: string, name: string }>, author: { __typename?: 'UserModel', username: string, avatarUrl?: string | null } } };

export type GetBlogsForPinQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBlogsForPinQuery = { __typename?: 'Query', blogsForPin: Array<{ __typename?: 'BlogModel', id: string, title: string }> };

export type GetPostByIdQueryVariables = Exact<{
  postId: Scalars['String']['input'];
}>;


export type GetPostByIdQuery = { __typename?: 'Query', getPostById: { __typename?: 'PostModel', id: string, title: string, content: any, createdAt: any, updatedAt: any, likesCount: number, viewsCount: number, commentsCount: number, blog?: { __typename?: 'BlogModel', id: string } | null, author: { __typename?: 'UserModel', username: string, avatarUrl?: string | null }, tags: Array<{ __typename?: 'TagModel', id: string, name: string }> } };

export type GetUserByUsernameQueryVariables = Exact<{
  username: Scalars['String']['input'];
}>;


export type GetUserByUsernameQuery = { __typename?: 'Query', getUserByUsername: { __typename?: 'UserModel', id: string, username: string, description?: string | null, avatarUrl?: string | null, posterUrl?: string | null, posts: Array<{ __typename?: 'PostModel', id: string, title: string, content: any, createdAt: any, updatedAt: any, likesCount: number, viewsCount: number, commentsCount: number, tags: Array<{ __typename?: 'TagModel', id: string, name: string }>, author: { __typename?: 'UserModel', username: string, avatarUrl?: string | null } }>, blogs: Array<{ __typename?: 'BlogModel', id: string, title: string, description: string, posterUrl?: string | null, createdAt: any, tags: Array<{ __typename?: 'TagModel', id: string, name: string }>, author: { __typename?: 'UserModel', username: string, avatarUrl?: string | null } }> } };

export const AuthUserFragmentFragmentDoc = gql`
    fragment AuthUserFragment on UserModel {
  id
  username
  email
  description
  avatarUrl
  posterUrl
  subscriptions
  subscribers
  createdAt
  updatedAt
}
    `;
export const BlogFragmentFragmentDoc = gql`
    fragment BlogFragment on BlogModel {
  id
  title
  description
  tags {
    id
    name
  }
  posterUrl
  createdAt
  author {
    username
    avatarUrl
  }
}
    `;
export const RepliesFieldsFragmentDoc = gql`
    fragment RepliesFields on CommentModel {
  id
  text
  parentId
  createdAt
  author {
    username
    avatarUrl
  }
}
    `;
export const CommentFieldsFragmentDoc = gql`
    fragment CommentFields on CommentModel {
  id
  text
  parentId
  createdAt
  author {
    username
    avatarUrl
  }
  replies {
    ...RepliesFields
    replies {
      ...RepliesFields
      replies {
        ...RepliesFields
        replies {
          ...RepliesFields
        }
      }
    }
  }
}
    ${RepliesFieldsFragmentDoc}`;
export const PostFragmentFragmentDoc = gql`
    fragment PostFragment on PostModel {
  id
  title
  content
  author {
    username
    avatarUrl
  }
  createdAt
}
    `;
export const ChangeBlogPosterDocument = gql`
    mutation ChangeBlogPoster($blogId: String!, $posterFile: Upload!) {
  changeBlogPoster(blogId: $blogId, posterFile: $posterFile)
}
    `;
export type ChangeBlogPosterMutationFn = Apollo.MutationFunction<ChangeBlogPosterMutation, ChangeBlogPosterMutationVariables>;

/**
 * __useChangeBlogPosterMutation__
 *
 * To run a mutation, you first call `useChangeBlogPosterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeBlogPosterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeBlogPosterMutation, { data, loading, error }] = useChangeBlogPosterMutation({
 *   variables: {
 *      blogId: // value for 'blogId'
 *      posterFile: // value for 'posterFile'
 *   },
 * });
 */
export function useChangeBlogPosterMutation(baseOptions?: Apollo.MutationHookOptions<ChangeBlogPosterMutation, ChangeBlogPosterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangeBlogPosterMutation, ChangeBlogPosterMutationVariables>(ChangeBlogPosterDocument, options);
      }
export type ChangeBlogPosterMutationHookResult = ReturnType<typeof useChangeBlogPosterMutation>;
export type ChangeBlogPosterMutationResult = Apollo.MutationResult<ChangeBlogPosterMutation>;
export type ChangeBlogPosterMutationOptions = Apollo.BaseMutationOptions<ChangeBlogPosterMutation, ChangeBlogPosterMutationVariables>;
export const DeleteBlogPosterDocument = gql`
    mutation DeleteBlogPoster($blogId: String!) {
  deleteBlogPoster(blogId: $blogId)
}
    `;
export type DeleteBlogPosterMutationFn = Apollo.MutationFunction<DeleteBlogPosterMutation, DeleteBlogPosterMutationVariables>;

/**
 * __useDeleteBlogPosterMutation__
 *
 * To run a mutation, you first call `useDeleteBlogPosterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteBlogPosterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteBlogPosterMutation, { data, loading, error }] = useDeleteBlogPosterMutation({
 *   variables: {
 *      blogId: // value for 'blogId'
 *   },
 * });
 */
export function useDeleteBlogPosterMutation(baseOptions?: Apollo.MutationHookOptions<DeleteBlogPosterMutation, DeleteBlogPosterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteBlogPosterMutation, DeleteBlogPosterMutationVariables>(DeleteBlogPosterDocument, options);
      }
export type DeleteBlogPosterMutationHookResult = ReturnType<typeof useDeleteBlogPosterMutation>;
export type DeleteBlogPosterMutationResult = Apollo.MutationResult<DeleteBlogPosterMutation>;
export type DeleteBlogPosterMutationOptions = Apollo.BaseMutationOptions<DeleteBlogPosterMutation, DeleteBlogPosterMutationVariables>;
export const ChangeProfileAvatarDocument = gql`
    mutation ChangeProfileAvatar($file: Upload!) {
  changeProfileAvatar(file: $file) {
    avatarUrl
  }
}
    `;
export type ChangeProfileAvatarMutationFn = Apollo.MutationFunction<ChangeProfileAvatarMutation, ChangeProfileAvatarMutationVariables>;

/**
 * __useChangeProfileAvatarMutation__
 *
 * To run a mutation, you first call `useChangeProfileAvatarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeProfileAvatarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeProfileAvatarMutation, { data, loading, error }] = useChangeProfileAvatarMutation({
 *   variables: {
 *      file: // value for 'file'
 *   },
 * });
 */
export function useChangeProfileAvatarMutation(baseOptions?: Apollo.MutationHookOptions<ChangeProfileAvatarMutation, ChangeProfileAvatarMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangeProfileAvatarMutation, ChangeProfileAvatarMutationVariables>(ChangeProfileAvatarDocument, options);
      }
export type ChangeProfileAvatarMutationHookResult = ReturnType<typeof useChangeProfileAvatarMutation>;
export type ChangeProfileAvatarMutationResult = Apollo.MutationResult<ChangeProfileAvatarMutation>;
export type ChangeProfileAvatarMutationOptions = Apollo.BaseMutationOptions<ChangeProfileAvatarMutation, ChangeProfileAvatarMutationVariables>;
export const ChangeProfilePosterDocument = gql`
    mutation ChangeProfilePoster($file: Upload!) {
  changeProfilePoster(file: $file) {
    posterUrl
  }
}
    `;
export type ChangeProfilePosterMutationFn = Apollo.MutationFunction<ChangeProfilePosterMutation, ChangeProfilePosterMutationVariables>;

/**
 * __useChangeProfilePosterMutation__
 *
 * To run a mutation, you first call `useChangeProfilePosterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeProfilePosterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeProfilePosterMutation, { data, loading, error }] = useChangeProfilePosterMutation({
 *   variables: {
 *      file: // value for 'file'
 *   },
 * });
 */
export function useChangeProfilePosterMutation(baseOptions?: Apollo.MutationHookOptions<ChangeProfilePosterMutation, ChangeProfilePosterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangeProfilePosterMutation, ChangeProfilePosterMutationVariables>(ChangeProfilePosterDocument, options);
      }
export type ChangeProfilePosterMutationHookResult = ReturnType<typeof useChangeProfilePosterMutation>;
export type ChangeProfilePosterMutationResult = Apollo.MutationResult<ChangeProfilePosterMutation>;
export type ChangeProfilePosterMutationOptions = Apollo.BaseMutationOptions<ChangeProfilePosterMutation, ChangeProfilePosterMutationVariables>;
export const CreateBlogDocument = gql`
    mutation createBlog($data: CreateBlogInput!, $poster: Upload) {
  createBlog(data: $data, poster: $poster) {
    id
  }
}
    `;
export type CreateBlogMutationFn = Apollo.MutationFunction<CreateBlogMutation, CreateBlogMutationVariables>;

/**
 * __useCreateBlogMutation__
 *
 * To run a mutation, you first call `useCreateBlogMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateBlogMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createBlogMutation, { data, loading, error }] = useCreateBlogMutation({
 *   variables: {
 *      data: // value for 'data'
 *      poster: // value for 'poster'
 *   },
 * });
 */
export function useCreateBlogMutation(baseOptions?: Apollo.MutationHookOptions<CreateBlogMutation, CreateBlogMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateBlogMutation, CreateBlogMutationVariables>(CreateBlogDocument, options);
      }
export type CreateBlogMutationHookResult = ReturnType<typeof useCreateBlogMutation>;
export type CreateBlogMutationResult = Apollo.MutationResult<CreateBlogMutation>;
export type CreateBlogMutationOptions = Apollo.BaseMutationOptions<CreateBlogMutation, CreateBlogMutationVariables>;
export const CreateCommentDocument = gql`
    mutation CreateComment($text: String!, $postId: String!, $parentId: String) {
  createComment(text: $text, postId: $postId, parentId: $parentId) {
    ...CommentFields
  }
}
    ${CommentFieldsFragmentDoc}`;
export type CreateCommentMutationFn = Apollo.MutationFunction<CreateCommentMutation, CreateCommentMutationVariables>;

/**
 * __useCreateCommentMutation__
 *
 * To run a mutation, you first call `useCreateCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCommentMutation, { data, loading, error }] = useCreateCommentMutation({
 *   variables: {
 *      text: // value for 'text'
 *      postId: // value for 'postId'
 *      parentId: // value for 'parentId'
 *   },
 * });
 */
export function useCreateCommentMutation(baseOptions?: Apollo.MutationHookOptions<CreateCommentMutation, CreateCommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCommentMutation, CreateCommentMutationVariables>(CreateCommentDocument, options);
      }
export type CreateCommentMutationHookResult = ReturnType<typeof useCreateCommentMutation>;
export type CreateCommentMutationResult = Apollo.MutationResult<CreateCommentMutation>;
export type CreateCommentMutationOptions = Apollo.BaseMutationOptions<CreateCommentMutation, CreateCommentMutationVariables>;
export const CreatePostDocument = gql`
    mutation createPost($data: CreatePostInput!, $blogId: String) {
  createPost(data: $data, blogId: $blogId) {
    id
  }
}
    `;
export type CreatePostMutationFn = Apollo.MutationFunction<CreatePostMutation, CreatePostMutationVariables>;

/**
 * __useCreatePostMutation__
 *
 * To run a mutation, you first call `useCreatePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPostMutation, { data, loading, error }] = useCreatePostMutation({
 *   variables: {
 *      data: // value for 'data'
 *      blogId: // value for 'blogId'
 *   },
 * });
 */
export function useCreatePostMutation(baseOptions?: Apollo.MutationHookOptions<CreatePostMutation, CreatePostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument, options);
      }
export type CreatePostMutationHookResult = ReturnType<typeof useCreatePostMutation>;
export type CreatePostMutationResult = Apollo.MutationResult<CreatePostMutation>;
export type CreatePostMutationOptions = Apollo.BaseMutationOptions<CreatePostMutation, CreatePostMutationVariables>;
export const DeleteBlogDocument = gql`
    mutation DeleteBlog($blogId: String!) {
  deleteBlog(blogId: $blogId)
}
    `;
export type DeleteBlogMutationFn = Apollo.MutationFunction<DeleteBlogMutation, DeleteBlogMutationVariables>;

/**
 * __useDeleteBlogMutation__
 *
 * To run a mutation, you first call `useDeleteBlogMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteBlogMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteBlogMutation, { data, loading, error }] = useDeleteBlogMutation({
 *   variables: {
 *      blogId: // value for 'blogId'
 *   },
 * });
 */
export function useDeleteBlogMutation(baseOptions?: Apollo.MutationHookOptions<DeleteBlogMutation, DeleteBlogMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteBlogMutation, DeleteBlogMutationVariables>(DeleteBlogDocument, options);
      }
export type DeleteBlogMutationHookResult = ReturnType<typeof useDeleteBlogMutation>;
export type DeleteBlogMutationResult = Apollo.MutationResult<DeleteBlogMutation>;
export type DeleteBlogMutationOptions = Apollo.BaseMutationOptions<DeleteBlogMutation, DeleteBlogMutationVariables>;
export const DeleteCommentDocument = gql`
    mutation DeleteComment($commentId: String!) {
  deleteComment(commentId: $commentId)
}
    `;
export type DeleteCommentMutationFn = Apollo.MutationFunction<DeleteCommentMutation, DeleteCommentMutationVariables>;

/**
 * __useDeleteCommentMutation__
 *
 * To run a mutation, you first call `useDeleteCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCommentMutation, { data, loading, error }] = useDeleteCommentMutation({
 *   variables: {
 *      commentId: // value for 'commentId'
 *   },
 * });
 */
export function useDeleteCommentMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCommentMutation, DeleteCommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCommentMutation, DeleteCommentMutationVariables>(DeleteCommentDocument, options);
      }
export type DeleteCommentMutationHookResult = ReturnType<typeof useDeleteCommentMutation>;
export type DeleteCommentMutationResult = Apollo.MutationResult<DeleteCommentMutation>;
export type DeleteCommentMutationOptions = Apollo.BaseMutationOptions<DeleteCommentMutation, DeleteCommentMutationVariables>;
export const DeletePostDocument = gql`
    mutation DeletePost($postId: String!) {
  deletePost(postId: $postId) {
    postId
  }
}
    `;
export type DeletePostMutationFn = Apollo.MutationFunction<DeletePostMutation, DeletePostMutationVariables>;

/**
 * __useDeletePostMutation__
 *
 * To run a mutation, you first call `useDeletePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePostMutation, { data, loading, error }] = useDeletePostMutation({
 *   variables: {
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useDeletePostMutation(baseOptions?: Apollo.MutationHookOptions<DeletePostMutation, DeletePostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeletePostMutation, DeletePostMutationVariables>(DeletePostDocument, options);
      }
export type DeletePostMutationHookResult = ReturnType<typeof useDeletePostMutation>;
export type DeletePostMutationResult = Apollo.MutationResult<DeletePostMutation>;
export type DeletePostMutationOptions = Apollo.BaseMutationOptions<DeletePostMutation, DeletePostMutationVariables>;
export const PinPostDocument = gql`
    mutation PinPost($blogId: String!, $postId: String!) {
  pinPost(blogId: $blogId, postId: $postId) {
    ...PostFragment
    tags {
      id
      name
    }
  }
}
    ${PostFragmentFragmentDoc}`;
export type PinPostMutationFn = Apollo.MutationFunction<PinPostMutation, PinPostMutationVariables>;

/**
 * __usePinPostMutation__
 *
 * To run a mutation, you first call `usePinPostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePinPostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [pinPostMutation, { data, loading, error }] = usePinPostMutation({
 *   variables: {
 *      blogId: // value for 'blogId'
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function usePinPostMutation(baseOptions?: Apollo.MutationHookOptions<PinPostMutation, PinPostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PinPostMutation, PinPostMutationVariables>(PinPostDocument, options);
      }
export type PinPostMutationHookResult = ReturnType<typeof usePinPostMutation>;
export type PinPostMutationResult = Apollo.MutationResult<PinPostMutation>;
export type PinPostMutationOptions = Apollo.BaseMutationOptions<PinPostMutation, PinPostMutationVariables>;
export const RemoveProfileAvatarDocument = gql`
    mutation RemoveProfileAvatar {
  removeProfileAvatar {
    avatarUrl
  }
}
    `;
export type RemoveProfileAvatarMutationFn = Apollo.MutationFunction<RemoveProfileAvatarMutation, RemoveProfileAvatarMutationVariables>;

/**
 * __useRemoveProfileAvatarMutation__
 *
 * To run a mutation, you first call `useRemoveProfileAvatarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveProfileAvatarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeProfileAvatarMutation, { data, loading, error }] = useRemoveProfileAvatarMutation({
 *   variables: {
 *   },
 * });
 */
export function useRemoveProfileAvatarMutation(baseOptions?: Apollo.MutationHookOptions<RemoveProfileAvatarMutation, RemoveProfileAvatarMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveProfileAvatarMutation, RemoveProfileAvatarMutationVariables>(RemoveProfileAvatarDocument, options);
      }
export type RemoveProfileAvatarMutationHookResult = ReturnType<typeof useRemoveProfileAvatarMutation>;
export type RemoveProfileAvatarMutationResult = Apollo.MutationResult<RemoveProfileAvatarMutation>;
export type RemoveProfileAvatarMutationOptions = Apollo.BaseMutationOptions<RemoveProfileAvatarMutation, RemoveProfileAvatarMutationVariables>;
export const RemoveProfilePosterDocument = gql`
    mutation RemoveProfilePoster {
  removeProfilePoster {
    posterUrl
  }
}
    `;
export type RemoveProfilePosterMutationFn = Apollo.MutationFunction<RemoveProfilePosterMutation, RemoveProfilePosterMutationVariables>;

/**
 * __useRemoveProfilePosterMutation__
 *
 * To run a mutation, you first call `useRemoveProfilePosterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveProfilePosterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeProfilePosterMutation, { data, loading, error }] = useRemoveProfilePosterMutation({
 *   variables: {
 *   },
 * });
 */
export function useRemoveProfilePosterMutation(baseOptions?: Apollo.MutationHookOptions<RemoveProfilePosterMutation, RemoveProfilePosterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveProfilePosterMutation, RemoveProfilePosterMutationVariables>(RemoveProfilePosterDocument, options);
      }
export type RemoveProfilePosterMutationHookResult = ReturnType<typeof useRemoveProfilePosterMutation>;
export type RemoveProfilePosterMutationResult = Apollo.MutationResult<RemoveProfilePosterMutation>;
export type RemoveProfilePosterMutationOptions = Apollo.BaseMutationOptions<RemoveProfilePosterMutation, RemoveProfilePosterMutationVariables>;
export const SignOutDocument = gql`
    mutation SignOut {
  signOutAccount
}
    `;
export type SignOutMutationFn = Apollo.MutationFunction<SignOutMutation, SignOutMutationVariables>;

/**
 * __useSignOutMutation__
 *
 * To run a mutation, you first call `useSignOutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignOutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signOutMutation, { data, loading, error }] = useSignOutMutation({
 *   variables: {
 *   },
 * });
 */
export function useSignOutMutation(baseOptions?: Apollo.MutationHookOptions<SignOutMutation, SignOutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignOutMutation, SignOutMutationVariables>(SignOutDocument, options);
      }
export type SignOutMutationHookResult = ReturnType<typeof useSignOutMutation>;
export type SignOutMutationResult = Apollo.MutationResult<SignOutMutation>;
export type SignOutMutationOptions = Apollo.BaseMutationOptions<SignOutMutation, SignOutMutationVariables>;
export const SignUpDocument = gql`
    mutation SignUp($data: SignUpInput!) {
  signUp(data: $data) {
    ...AuthUserFragment
  }
}
    ${AuthUserFragmentFragmentDoc}`;
export type SignUpMutationFn = Apollo.MutationFunction<SignUpMutation, SignUpMutationVariables>;

/**
 * __useSignUpMutation__
 *
 * To run a mutation, you first call `useSignUpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignUpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signUpMutation, { data, loading, error }] = useSignUpMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useSignUpMutation(baseOptions?: Apollo.MutationHookOptions<SignUpMutation, SignUpMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignUpMutation, SignUpMutationVariables>(SignUpDocument, options);
      }
export type SignUpMutationHookResult = ReturnType<typeof useSignUpMutation>;
export type SignUpMutationResult = Apollo.MutationResult<SignUpMutation>;
export type SignUpMutationOptions = Apollo.BaseMutationOptions<SignUpMutation, SignUpMutationVariables>;
export const SignInDocument = gql`
    mutation SignIn($data: SignInInput!) {
  signIn(data: $data) {
    ...AuthUserFragment
  }
}
    ${AuthUserFragmentFragmentDoc}`;
export type SignInMutationFn = Apollo.MutationFunction<SignInMutation, SignInMutationVariables>;

/**
 * __useSignInMutation__
 *
 * To run a mutation, you first call `useSignInMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignInMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signInMutation, { data, loading, error }] = useSignInMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useSignInMutation(baseOptions?: Apollo.MutationHookOptions<SignInMutation, SignInMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignInMutation, SignInMutationVariables>(SignInDocument, options);
      }
export type SignInMutationHookResult = ReturnType<typeof useSignInMutation>;
export type SignInMutationResult = Apollo.MutationResult<SignInMutation>;
export type SignInMutationOptions = Apollo.BaseMutationOptions<SignInMutation, SignInMutationVariables>;
export const SubscribeDocument = gql`
    mutation Subscribe($toId: String!) {
  subscribeToUser(toId: $toId)
}
    `;
export type SubscribeMutationFn = Apollo.MutationFunction<SubscribeMutation, SubscribeMutationVariables>;

/**
 * __useSubscribeMutation__
 *
 * To run a mutation, you first call `useSubscribeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSubscribeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [subscribeMutation, { data, loading, error }] = useSubscribeMutation({
 *   variables: {
 *      toId: // value for 'toId'
 *   },
 * });
 */
export function useSubscribeMutation(baseOptions?: Apollo.MutationHookOptions<SubscribeMutation, SubscribeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SubscribeMutation, SubscribeMutationVariables>(SubscribeDocument, options);
      }
export type SubscribeMutationHookResult = ReturnType<typeof useSubscribeMutation>;
export type SubscribeMutationResult = Apollo.MutationResult<SubscribeMutation>;
export type SubscribeMutationOptions = Apollo.BaseMutationOptions<SubscribeMutation, SubscribeMutationVariables>;
export const TogglePinBlogDocument = gql`
    mutation TogglePinBlog($blogId: String!, $postId: String!) {
  pinPostToBlog(blogId: $blogId, postId: $postId) {
    blog {
      id
    }
  }
}
    `;
export type TogglePinBlogMutationFn = Apollo.MutationFunction<TogglePinBlogMutation, TogglePinBlogMutationVariables>;

/**
 * __useTogglePinBlogMutation__
 *
 * To run a mutation, you first call `useTogglePinBlogMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTogglePinBlogMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [togglePinBlogMutation, { data, loading, error }] = useTogglePinBlogMutation({
 *   variables: {
 *      blogId: // value for 'blogId'
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useTogglePinBlogMutation(baseOptions?: Apollo.MutationHookOptions<TogglePinBlogMutation, TogglePinBlogMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<TogglePinBlogMutation, TogglePinBlogMutationVariables>(TogglePinBlogDocument, options);
      }
export type TogglePinBlogMutationHookResult = ReturnType<typeof useTogglePinBlogMutation>;
export type TogglePinBlogMutationResult = Apollo.MutationResult<TogglePinBlogMutation>;
export type TogglePinBlogMutationOptions = Apollo.BaseMutationOptions<TogglePinBlogMutation, TogglePinBlogMutationVariables>;
export const UnPinPostDocument = gql`
    mutation UnPinPost($blogId: String!, $postId: String!) {
  unPinPost(blogId: $blogId, postId: $postId) {
    postId
  }
}
    `;
export type UnPinPostMutationFn = Apollo.MutationFunction<UnPinPostMutation, UnPinPostMutationVariables>;

/**
 * __useUnPinPostMutation__
 *
 * To run a mutation, you first call `useUnPinPostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnPinPostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unPinPostMutation, { data, loading, error }] = useUnPinPostMutation({
 *   variables: {
 *      blogId: // value for 'blogId'
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useUnPinPostMutation(baseOptions?: Apollo.MutationHookOptions<UnPinPostMutation, UnPinPostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnPinPostMutation, UnPinPostMutationVariables>(UnPinPostDocument, options);
      }
export type UnPinPostMutationHookResult = ReturnType<typeof useUnPinPostMutation>;
export type UnPinPostMutationResult = Apollo.MutationResult<UnPinPostMutation>;
export type UnPinPostMutationOptions = Apollo.BaseMutationOptions<UnPinPostMutation, UnPinPostMutationVariables>;
export const UnsubscribeDocument = gql`
    mutation Unsubscribe($toId: String!) {
  unsubscribeFromUser(toId: $toId)
}
    `;
export type UnsubscribeMutationFn = Apollo.MutationFunction<UnsubscribeMutation, UnsubscribeMutationVariables>;

/**
 * __useUnsubscribeMutation__
 *
 * To run a mutation, you first call `useUnsubscribeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnsubscribeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unsubscribeMutation, { data, loading, error }] = useUnsubscribeMutation({
 *   variables: {
 *      toId: // value for 'toId'
 *   },
 * });
 */
export function useUnsubscribeMutation(baseOptions?: Apollo.MutationHookOptions<UnsubscribeMutation, UnsubscribeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnsubscribeMutation, UnsubscribeMutationVariables>(UnsubscribeDocument, options);
      }
export type UnsubscribeMutationHookResult = ReturnType<typeof useUnsubscribeMutation>;
export type UnsubscribeMutationResult = Apollo.MutationResult<UnsubscribeMutation>;
export type UnsubscribeMutationOptions = Apollo.BaseMutationOptions<UnsubscribeMutation, UnsubscribeMutationVariables>;
export const UpdateBlogDocument = gql`
    mutation UpdateBlog($data: UpdateBlogInput!, $blogId: String!, $poster: Upload) {
  updateBlog(data: $data, blogId: $blogId, poster: $poster)
}
    `;
export type UpdateBlogMutationFn = Apollo.MutationFunction<UpdateBlogMutation, UpdateBlogMutationVariables>;

/**
 * __useUpdateBlogMutation__
 *
 * To run a mutation, you first call `useUpdateBlogMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateBlogMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateBlogMutation, { data, loading, error }] = useUpdateBlogMutation({
 *   variables: {
 *      data: // value for 'data'
 *      blogId: // value for 'blogId'
 *      poster: // value for 'poster'
 *   },
 * });
 */
export function useUpdateBlogMutation(baseOptions?: Apollo.MutationHookOptions<UpdateBlogMutation, UpdateBlogMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateBlogMutation, UpdateBlogMutationVariables>(UpdateBlogDocument, options);
      }
export type UpdateBlogMutationHookResult = ReturnType<typeof useUpdateBlogMutation>;
export type UpdateBlogMutationResult = Apollo.MutationResult<UpdateBlogMutation>;
export type UpdateBlogMutationOptions = Apollo.BaseMutationOptions<UpdateBlogMutation, UpdateBlogMutationVariables>;
export const UpdateCommentDocument = gql`
    mutation UpdateComment($text: String!, $commentId: String!) {
  updateComment(text: $text, commentId: $commentId)
}
    `;
export type UpdateCommentMutationFn = Apollo.MutationFunction<UpdateCommentMutation, UpdateCommentMutationVariables>;

/**
 * __useUpdateCommentMutation__
 *
 * To run a mutation, you first call `useUpdateCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCommentMutation, { data, loading, error }] = useUpdateCommentMutation({
 *   variables: {
 *      text: // value for 'text'
 *      commentId: // value for 'commentId'
 *   },
 * });
 */
export function useUpdateCommentMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCommentMutation, UpdateCommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCommentMutation, UpdateCommentMutationVariables>(UpdateCommentDocument, options);
      }
export type UpdateCommentMutationHookResult = ReturnType<typeof useUpdateCommentMutation>;
export type UpdateCommentMutationResult = Apollo.MutationResult<UpdateCommentMutation>;
export type UpdateCommentMutationOptions = Apollo.BaseMutationOptions<UpdateCommentMutation, UpdateCommentMutationVariables>;
export const UpdatePostDocument = gql`
    mutation UpdatePost($postId: String!, $data: UpdatePostInput!) {
  updatePost(data: $data, postId: $postId)
}
    `;
export type UpdatePostMutationFn = Apollo.MutationFunction<UpdatePostMutation, UpdatePostMutationVariables>;

/**
 * __useUpdatePostMutation__
 *
 * To run a mutation, you first call `useUpdatePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePostMutation, { data, loading, error }] = useUpdatePostMutation({
 *   variables: {
 *      postId: // value for 'postId'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdatePostMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePostMutation, UpdatePostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePostMutation, UpdatePostMutationVariables>(UpdatePostDocument, options);
      }
export type UpdatePostMutationHookResult = ReturnType<typeof useUpdatePostMutation>;
export type UpdatePostMutationResult = Apollo.MutationResult<UpdatePostMutation>;
export type UpdatePostMutationOptions = Apollo.BaseMutationOptions<UpdatePostMutation, UpdatePostMutationVariables>;
export const UpdateProfileDocument = gql`
    mutation UpdateProfile($data: UpdateUserInput!) {
  updateUser(data: $data) {
    email
    username
    description
  }
}
    `;
export type UpdateProfileMutationFn = Apollo.MutationFunction<UpdateProfileMutation, UpdateProfileMutationVariables>;

/**
 * __useUpdateProfileMutation__
 *
 * To run a mutation, you first call `useUpdateProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProfileMutation, { data, loading, error }] = useUpdateProfileMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateProfileMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProfileMutation, UpdateProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProfileMutation, UpdateProfileMutationVariables>(UpdateProfileDocument, options);
      }
export type UpdateProfileMutationHookResult = ReturnType<typeof useUpdateProfileMutation>;
export type UpdateProfileMutationResult = Apollo.MutationResult<UpdateProfileMutation>;
export type UpdateProfileMutationOptions = Apollo.BaseMutationOptions<UpdateProfileMutation, UpdateProfileMutationVariables>;
export const GetTagsBySearchStringDocument = gql`
    query getTagsBySearchString($search: String!) {
  findTagsBySearchString(search: $search) {
    id
    name
  }
}
    `;

/**
 * __useGetTagsBySearchStringQuery__
 *
 * To run a query within a React component, call `useGetTagsBySearchStringQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTagsBySearchStringQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTagsBySearchStringQuery({
 *   variables: {
 *      search: // value for 'search'
 *   },
 * });
 */
export function useGetTagsBySearchStringQuery(baseOptions: Apollo.QueryHookOptions<GetTagsBySearchStringQuery, GetTagsBySearchStringQueryVariables> & ({ variables: GetTagsBySearchStringQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTagsBySearchStringQuery, GetTagsBySearchStringQueryVariables>(GetTagsBySearchStringDocument, options);
      }
export function useGetTagsBySearchStringLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTagsBySearchStringQuery, GetTagsBySearchStringQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTagsBySearchStringQuery, GetTagsBySearchStringQueryVariables>(GetTagsBySearchStringDocument, options);
        }
// @ts-ignore
export function useGetTagsBySearchStringSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetTagsBySearchStringQuery, GetTagsBySearchStringQueryVariables>): Apollo.UseSuspenseQueryResult<GetTagsBySearchStringQuery, GetTagsBySearchStringQueryVariables>;
export function useGetTagsBySearchStringSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTagsBySearchStringQuery, GetTagsBySearchStringQueryVariables>): Apollo.UseSuspenseQueryResult<GetTagsBySearchStringQuery | undefined, GetTagsBySearchStringQueryVariables>;
export function useGetTagsBySearchStringSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTagsBySearchStringQuery, GetTagsBySearchStringQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTagsBySearchStringQuery, GetTagsBySearchStringQueryVariables>(GetTagsBySearchStringDocument, options);
        }
export type GetTagsBySearchStringQueryHookResult = ReturnType<typeof useGetTagsBySearchStringQuery>;
export type GetTagsBySearchStringLazyQueryHookResult = ReturnType<typeof useGetTagsBySearchStringLazyQuery>;
export type GetTagsBySearchStringSuspenseQueryHookResult = ReturnType<typeof useGetTagsBySearchStringSuspenseQuery>;
export type GetTagsBySearchStringQueryResult = Apollo.QueryResult<GetTagsBySearchStringQuery, GetTagsBySearchStringQueryVariables>;
export const GetAllBlogsDocument = gql`
    query GetAllBlogs($searchParams: SearchParamsInput!, $filters: FiltersInput) {
  getAllBlogsPagination(searchParams: $searchParams, filters: $filters) {
    data {
      ...BlogFragment
    }
    page
    perPage
    totalPages
    totalCount
  }
}
    ${BlogFragmentFragmentDoc}`;

/**
 * __useGetAllBlogsQuery__
 *
 * To run a query within a React component, call `useGetAllBlogsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllBlogsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllBlogsQuery({
 *   variables: {
 *      searchParams: // value for 'searchParams'
 *      filters: // value for 'filters'
 *   },
 * });
 */
export function useGetAllBlogsQuery(baseOptions: Apollo.QueryHookOptions<GetAllBlogsQuery, GetAllBlogsQueryVariables> & ({ variables: GetAllBlogsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllBlogsQuery, GetAllBlogsQueryVariables>(GetAllBlogsDocument, options);
      }
export function useGetAllBlogsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllBlogsQuery, GetAllBlogsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllBlogsQuery, GetAllBlogsQueryVariables>(GetAllBlogsDocument, options);
        }
// @ts-ignore
export function useGetAllBlogsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetAllBlogsQuery, GetAllBlogsQueryVariables>): Apollo.UseSuspenseQueryResult<GetAllBlogsQuery, GetAllBlogsQueryVariables>;
export function useGetAllBlogsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllBlogsQuery, GetAllBlogsQueryVariables>): Apollo.UseSuspenseQueryResult<GetAllBlogsQuery | undefined, GetAllBlogsQueryVariables>;
export function useGetAllBlogsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllBlogsQuery, GetAllBlogsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllBlogsQuery, GetAllBlogsQueryVariables>(GetAllBlogsDocument, options);
        }
export type GetAllBlogsQueryHookResult = ReturnType<typeof useGetAllBlogsQuery>;
export type GetAllBlogsLazyQueryHookResult = ReturnType<typeof useGetAllBlogsLazyQuery>;
export type GetAllBlogsSuspenseQueryHookResult = ReturnType<typeof useGetAllBlogsSuspenseQuery>;
export type GetAllBlogsQueryResult = Apollo.QueryResult<GetAllBlogsQuery, GetAllBlogsQueryVariables>;
export const GetAllFreePostsForPinDocument = gql`
    query GetAllFreePostsForPin($searchStr: String) {
  getFreePostsForPin(searchStr: $searchStr) {
    id
    title
  }
}
    `;

/**
 * __useGetAllFreePostsForPinQuery__
 *
 * To run a query within a React component, call `useGetAllFreePostsForPinQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllFreePostsForPinQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllFreePostsForPinQuery({
 *   variables: {
 *      searchStr: // value for 'searchStr'
 *   },
 * });
 */
export function useGetAllFreePostsForPinQuery(baseOptions?: Apollo.QueryHookOptions<GetAllFreePostsForPinQuery, GetAllFreePostsForPinQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllFreePostsForPinQuery, GetAllFreePostsForPinQueryVariables>(GetAllFreePostsForPinDocument, options);
      }
export function useGetAllFreePostsForPinLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllFreePostsForPinQuery, GetAllFreePostsForPinQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllFreePostsForPinQuery, GetAllFreePostsForPinQueryVariables>(GetAllFreePostsForPinDocument, options);
        }
// @ts-ignore
export function useGetAllFreePostsForPinSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetAllFreePostsForPinQuery, GetAllFreePostsForPinQueryVariables>): Apollo.UseSuspenseQueryResult<GetAllFreePostsForPinQuery, GetAllFreePostsForPinQueryVariables>;
export function useGetAllFreePostsForPinSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllFreePostsForPinQuery, GetAllFreePostsForPinQueryVariables>): Apollo.UseSuspenseQueryResult<GetAllFreePostsForPinQuery | undefined, GetAllFreePostsForPinQueryVariables>;
export function useGetAllFreePostsForPinSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllFreePostsForPinQuery, GetAllFreePostsForPinQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllFreePostsForPinQuery, GetAllFreePostsForPinQueryVariables>(GetAllFreePostsForPinDocument, options);
        }
export type GetAllFreePostsForPinQueryHookResult = ReturnType<typeof useGetAllFreePostsForPinQuery>;
export type GetAllFreePostsForPinLazyQueryHookResult = ReturnType<typeof useGetAllFreePostsForPinLazyQuery>;
export type GetAllFreePostsForPinSuspenseQueryHookResult = ReturnType<typeof useGetAllFreePostsForPinSuspenseQuery>;
export type GetAllFreePostsForPinQueryResult = Apollo.QueryResult<GetAllFreePostsForPinQuery, GetAllFreePostsForPinQueryVariables>;
export const GetAllPostCommentsDocument = gql`
    query GetAllPostComments($postId: String!) {
  getAllPostComments(postId: $postId) {
    ...CommentFields
  }
}
    ${CommentFieldsFragmentDoc}`;

/**
 * __useGetAllPostCommentsQuery__
 *
 * To run a query within a React component, call `useGetAllPostCommentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllPostCommentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllPostCommentsQuery({
 *   variables: {
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useGetAllPostCommentsQuery(baseOptions: Apollo.QueryHookOptions<GetAllPostCommentsQuery, GetAllPostCommentsQueryVariables> & ({ variables: GetAllPostCommentsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllPostCommentsQuery, GetAllPostCommentsQueryVariables>(GetAllPostCommentsDocument, options);
      }
export function useGetAllPostCommentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllPostCommentsQuery, GetAllPostCommentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllPostCommentsQuery, GetAllPostCommentsQueryVariables>(GetAllPostCommentsDocument, options);
        }
// @ts-ignore
export function useGetAllPostCommentsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetAllPostCommentsQuery, GetAllPostCommentsQueryVariables>): Apollo.UseSuspenseQueryResult<GetAllPostCommentsQuery, GetAllPostCommentsQueryVariables>;
export function useGetAllPostCommentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllPostCommentsQuery, GetAllPostCommentsQueryVariables>): Apollo.UseSuspenseQueryResult<GetAllPostCommentsQuery | undefined, GetAllPostCommentsQueryVariables>;
export function useGetAllPostCommentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllPostCommentsQuery, GetAllPostCommentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllPostCommentsQuery, GetAllPostCommentsQueryVariables>(GetAllPostCommentsDocument, options);
        }
export type GetAllPostCommentsQueryHookResult = ReturnType<typeof useGetAllPostCommentsQuery>;
export type GetAllPostCommentsLazyQueryHookResult = ReturnType<typeof useGetAllPostCommentsLazyQuery>;
export type GetAllPostCommentsSuspenseQueryHookResult = ReturnType<typeof useGetAllPostCommentsSuspenseQuery>;
export type GetAllPostCommentsQueryResult = Apollo.QueryResult<GetAllPostCommentsQuery, GetAllPostCommentsQueryVariables>;
export const GetAllPostsDocument = gql`
    query getAllPosts($searchParams: SearchParamsInput!, $filters: FiltersInput) {
  getAllPostsPagination(searchParams: $searchParams, filters: $filters) {
    data {
      ...PostFragment
      tags {
        id
        name
      }
    }
    page
    perPage
    totalCount
    totalPages
  }
}
    ${PostFragmentFragmentDoc}`;

/**
 * __useGetAllPostsQuery__
 *
 * To run a query within a React component, call `useGetAllPostsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllPostsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllPostsQuery({
 *   variables: {
 *      searchParams: // value for 'searchParams'
 *      filters: // value for 'filters'
 *   },
 * });
 */
export function useGetAllPostsQuery(baseOptions: Apollo.QueryHookOptions<GetAllPostsQuery, GetAllPostsQueryVariables> & ({ variables: GetAllPostsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllPostsQuery, GetAllPostsQueryVariables>(GetAllPostsDocument, options);
      }
export function useGetAllPostsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllPostsQuery, GetAllPostsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllPostsQuery, GetAllPostsQueryVariables>(GetAllPostsDocument, options);
        }
// @ts-ignore
export function useGetAllPostsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetAllPostsQuery, GetAllPostsQueryVariables>): Apollo.UseSuspenseQueryResult<GetAllPostsQuery, GetAllPostsQueryVariables>;
export function useGetAllPostsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllPostsQuery, GetAllPostsQueryVariables>): Apollo.UseSuspenseQueryResult<GetAllPostsQuery | undefined, GetAllPostsQueryVariables>;
export function useGetAllPostsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllPostsQuery, GetAllPostsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllPostsQuery, GetAllPostsQueryVariables>(GetAllPostsDocument, options);
        }
export type GetAllPostsQueryHookResult = ReturnType<typeof useGetAllPostsQuery>;
export type GetAllPostsLazyQueryHookResult = ReturnType<typeof useGetAllPostsLazyQuery>;
export type GetAllPostsSuspenseQueryHookResult = ReturnType<typeof useGetAllPostsSuspenseQuery>;
export type GetAllPostsQueryResult = Apollo.QueryResult<GetAllPostsQuery, GetAllPostsQueryVariables>;
export const GetAllUsersDocument = gql`
    query getAllUsers($searchParams: SearchParamsInput!, $searchStr: String!, $onlySubscriptions: Boolean!) {
  getAllUsersPagination(
    searchParams: $searchParams
    searchStr: $searchStr
    onlySubscriptions: $onlySubscriptions
  ) {
    data {
      id
      avatarUrl
      username
      description
    }
    page
    perPage
    totalCount
    totalPages
  }
}
    `;

/**
 * __useGetAllUsersQuery__
 *
 * To run a query within a React component, call `useGetAllUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllUsersQuery({
 *   variables: {
 *      searchParams: // value for 'searchParams'
 *      searchStr: // value for 'searchStr'
 *      onlySubscriptions: // value for 'onlySubscriptions'
 *   },
 * });
 */
export function useGetAllUsersQuery(baseOptions: Apollo.QueryHookOptions<GetAllUsersQuery, GetAllUsersQueryVariables> & ({ variables: GetAllUsersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllUsersQuery, GetAllUsersQueryVariables>(GetAllUsersDocument, options);
      }
export function useGetAllUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllUsersQuery, GetAllUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllUsersQuery, GetAllUsersQueryVariables>(GetAllUsersDocument, options);
        }
// @ts-ignore
export function useGetAllUsersSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetAllUsersQuery, GetAllUsersQueryVariables>): Apollo.UseSuspenseQueryResult<GetAllUsersQuery, GetAllUsersQueryVariables>;
export function useGetAllUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllUsersQuery, GetAllUsersQueryVariables>): Apollo.UseSuspenseQueryResult<GetAllUsersQuery | undefined, GetAllUsersQueryVariables>;
export function useGetAllUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllUsersQuery, GetAllUsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllUsersQuery, GetAllUsersQueryVariables>(GetAllUsersDocument, options);
        }
export type GetAllUsersQueryHookResult = ReturnType<typeof useGetAllUsersQuery>;
export type GetAllUsersLazyQueryHookResult = ReturnType<typeof useGetAllUsersLazyQuery>;
export type GetAllUsersSuspenseQueryHookResult = ReturnType<typeof useGetAllUsersSuspenseQuery>;
export type GetAllUsersQueryResult = Apollo.QueryResult<GetAllUsersQuery, GetAllUsersQueryVariables>;
export const GetBlogByIdDocument = gql`
    query GetBlogById($blogId: String!) {
  getBlogById(blogId: $blogId) {
    ...BlogFragment
    posts {
      ...PostFragment
      tags {
        id
        name
      }
    }
  }
}
    ${BlogFragmentFragmentDoc}
${PostFragmentFragmentDoc}`;

/**
 * __useGetBlogByIdQuery__
 *
 * To run a query within a React component, call `useGetBlogByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBlogByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBlogByIdQuery({
 *   variables: {
 *      blogId: // value for 'blogId'
 *   },
 * });
 */
export function useGetBlogByIdQuery(baseOptions: Apollo.QueryHookOptions<GetBlogByIdQuery, GetBlogByIdQueryVariables> & ({ variables: GetBlogByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBlogByIdQuery, GetBlogByIdQueryVariables>(GetBlogByIdDocument, options);
      }
export function useGetBlogByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBlogByIdQuery, GetBlogByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBlogByIdQuery, GetBlogByIdQueryVariables>(GetBlogByIdDocument, options);
        }
// @ts-ignore
export function useGetBlogByIdSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetBlogByIdQuery, GetBlogByIdQueryVariables>): Apollo.UseSuspenseQueryResult<GetBlogByIdQuery, GetBlogByIdQueryVariables>;
export function useGetBlogByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetBlogByIdQuery, GetBlogByIdQueryVariables>): Apollo.UseSuspenseQueryResult<GetBlogByIdQuery | undefined, GetBlogByIdQueryVariables>;
export function useGetBlogByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetBlogByIdQuery, GetBlogByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetBlogByIdQuery, GetBlogByIdQueryVariables>(GetBlogByIdDocument, options);
        }
export type GetBlogByIdQueryHookResult = ReturnType<typeof useGetBlogByIdQuery>;
export type GetBlogByIdLazyQueryHookResult = ReturnType<typeof useGetBlogByIdLazyQuery>;
export type GetBlogByIdSuspenseQueryHookResult = ReturnType<typeof useGetBlogByIdSuspenseQuery>;
export type GetBlogByIdQueryResult = Apollo.QueryResult<GetBlogByIdQuery, GetBlogByIdQueryVariables>;
export const GetBlogsForPinDocument = gql`
    query GetBlogsForPin {
  blogsForPin {
    id
    title
  }
}
    `;

/**
 * __useGetBlogsForPinQuery__
 *
 * To run a query within a React component, call `useGetBlogsForPinQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBlogsForPinQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBlogsForPinQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetBlogsForPinQuery(baseOptions?: Apollo.QueryHookOptions<GetBlogsForPinQuery, GetBlogsForPinQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBlogsForPinQuery, GetBlogsForPinQueryVariables>(GetBlogsForPinDocument, options);
      }
export function useGetBlogsForPinLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBlogsForPinQuery, GetBlogsForPinQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBlogsForPinQuery, GetBlogsForPinQueryVariables>(GetBlogsForPinDocument, options);
        }
// @ts-ignore
export function useGetBlogsForPinSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetBlogsForPinQuery, GetBlogsForPinQueryVariables>): Apollo.UseSuspenseQueryResult<GetBlogsForPinQuery, GetBlogsForPinQueryVariables>;
export function useGetBlogsForPinSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetBlogsForPinQuery, GetBlogsForPinQueryVariables>): Apollo.UseSuspenseQueryResult<GetBlogsForPinQuery | undefined, GetBlogsForPinQueryVariables>;
export function useGetBlogsForPinSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetBlogsForPinQuery, GetBlogsForPinQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetBlogsForPinQuery, GetBlogsForPinQueryVariables>(GetBlogsForPinDocument, options);
        }
export type GetBlogsForPinQueryHookResult = ReturnType<typeof useGetBlogsForPinQuery>;
export type GetBlogsForPinLazyQueryHookResult = ReturnType<typeof useGetBlogsForPinLazyQuery>;
export type GetBlogsForPinSuspenseQueryHookResult = ReturnType<typeof useGetBlogsForPinSuspenseQuery>;
export type GetBlogsForPinQueryResult = Apollo.QueryResult<GetBlogsForPinQuery, GetBlogsForPinQueryVariables>;
export const GetPostByIdDocument = gql`
    query getPostById($postId: String!) {
  getPostById(postId: $postId) {
    id
    title
    content
    createdAt
    updatedAt
    blog {
      id
    }
    author {
      username
      avatarUrl
    }
    tags {
      id
      name
    }
    likesCount
    viewsCount
    commentsCount
  }
}
    `;

/**
 * __useGetPostByIdQuery__
 *
 * To run a query within a React component, call `useGetPostByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPostByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPostByIdQuery({
 *   variables: {
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useGetPostByIdQuery(baseOptions: Apollo.QueryHookOptions<GetPostByIdQuery, GetPostByIdQueryVariables> & ({ variables: GetPostByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPostByIdQuery, GetPostByIdQueryVariables>(GetPostByIdDocument, options);
      }
export function useGetPostByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPostByIdQuery, GetPostByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPostByIdQuery, GetPostByIdQueryVariables>(GetPostByIdDocument, options);
        }
// @ts-ignore
export function useGetPostByIdSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetPostByIdQuery, GetPostByIdQueryVariables>): Apollo.UseSuspenseQueryResult<GetPostByIdQuery, GetPostByIdQueryVariables>;
export function useGetPostByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPostByIdQuery, GetPostByIdQueryVariables>): Apollo.UseSuspenseQueryResult<GetPostByIdQuery | undefined, GetPostByIdQueryVariables>;
export function useGetPostByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPostByIdQuery, GetPostByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPostByIdQuery, GetPostByIdQueryVariables>(GetPostByIdDocument, options);
        }
export type GetPostByIdQueryHookResult = ReturnType<typeof useGetPostByIdQuery>;
export type GetPostByIdLazyQueryHookResult = ReturnType<typeof useGetPostByIdLazyQuery>;
export type GetPostByIdSuspenseQueryHookResult = ReturnType<typeof useGetPostByIdSuspenseQuery>;
export type GetPostByIdQueryResult = Apollo.QueryResult<GetPostByIdQuery, GetPostByIdQueryVariables>;
export const GetUserByUsernameDocument = gql`
    query GetUserByUsername($username: String!) {
  getUserByUsername(username: $username) {
    id
    username
    description
    avatarUrl
    posterUrl
    posts {
      id
      title
      content
      createdAt
      updatedAt
      tags {
        id
        name
      }
      likesCount
      viewsCount
      commentsCount
      author {
        username
        avatarUrl
      }
    }
    blogs {
      ...BlogFragment
    }
  }
}
    ${BlogFragmentFragmentDoc}`;

/**
 * __useGetUserByUsernameQuery__
 *
 * To run a query within a React component, call `useGetUserByUsernameQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserByUsernameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserByUsernameQuery({
 *   variables: {
 *      username: // value for 'username'
 *   },
 * });
 */
export function useGetUserByUsernameQuery(baseOptions: Apollo.QueryHookOptions<GetUserByUsernameQuery, GetUserByUsernameQueryVariables> & ({ variables: GetUserByUsernameQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserByUsernameQuery, GetUserByUsernameQueryVariables>(GetUserByUsernameDocument, options);
      }
export function useGetUserByUsernameLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserByUsernameQuery, GetUserByUsernameQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserByUsernameQuery, GetUserByUsernameQueryVariables>(GetUserByUsernameDocument, options);
        }
// @ts-ignore
export function useGetUserByUsernameSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetUserByUsernameQuery, GetUserByUsernameQueryVariables>): Apollo.UseSuspenseQueryResult<GetUserByUsernameQuery, GetUserByUsernameQueryVariables>;
export function useGetUserByUsernameSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserByUsernameQuery, GetUserByUsernameQueryVariables>): Apollo.UseSuspenseQueryResult<GetUserByUsernameQuery | undefined, GetUserByUsernameQueryVariables>;
export function useGetUserByUsernameSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserByUsernameQuery, GetUserByUsernameQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserByUsernameQuery, GetUserByUsernameQueryVariables>(GetUserByUsernameDocument, options);
        }
export type GetUserByUsernameQueryHookResult = ReturnType<typeof useGetUserByUsernameQuery>;
export type GetUserByUsernameLazyQueryHookResult = ReturnType<typeof useGetUserByUsernameLazyQuery>;
export type GetUserByUsernameSuspenseQueryHookResult = ReturnType<typeof useGetUserByUsernameSuspenseQuery>;
export type GetUserByUsernameQueryResult = Apollo.QueryResult<GetUserByUsernameQuery, GetUserByUsernameQueryVariables>;