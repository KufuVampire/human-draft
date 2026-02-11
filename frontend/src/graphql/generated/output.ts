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
  posts?: Maybe<Array<PostModel>>;
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
  parent?: Maybe<CommentModel>;
  post?: Maybe<PostModel>;
  replies: Array<CommentModel>;
  text: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type CreateBlogInput = {
  description: Scalars['String']['input'];
  postIds: Array<Scalars['ID']['input']>;
  posterUrl?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type CreatePostInput = {
  content: Scalars['JSON']['input'];
  id?: InputMaybe<Scalars['String']['input']>;
  tags: Array<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  changeProfileAvatar: UserModel;
  changeProfilePoster: UserModel;
  createBlog: BlogModel;
  createComment: CommentModel;
  createPost: PostModel;
  createTag: TagModel;
  deleteBlog: BlogModel;
  deleteComment: CommentModel;
  deletePost: Scalars['Boolean']['output'];
  deleteTag: Scalars['Boolean']['output'];
  pinPostToBlog: PostModel;
  removeProfileAvatar: UserModel;
  removeProfilePoster: UserModel;
  signIn: UserModel;
  signOutAccount: Scalars['Boolean']['output'];
  signUp: UserModel;
  subscribeToUser: Scalars['Boolean']['output'];
  unPinPostFromBlog: PostModel;
  unsubscribeFromUser: Scalars['Boolean']['output'];
  updateBlog: BlogModel;
  updateComment: CommentModel;
  updatePost: PostModel;
  updatePostOrBlogTags: Scalars['Boolean']['output'];
  updateUser: UserModel;
  uploadImage: UploadImageModel;
};


export type MutationChangeProfileAvatarArgs = {
  file: Scalars['Upload']['input'];
};


export type MutationChangeProfilePosterArgs = {
  file: Scalars['Upload']['input'];
};


export type MutationCreateBlogArgs = {
  data: CreateBlogInput;
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


export type MutationDeleteCommentArgs = {
  commentId: Scalars['String']['input'];
};


export type MutationDeletePostArgs = {
  postId: Scalars['String']['input'];
};


export type MutationDeleteTagArgs = {
  name: Scalars['String']['input'];
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

export type PostModel = {
  __typename?: 'PostModel';
  author: UserModel;
  blog?: Maybe<BlogModel>;
  comments: Array<CommentModel>;
  commentsCount: Scalars['Int']['output'];
  content: Scalars['JSON']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  likesCount: Scalars['Int']['output'];
  tags?: Maybe<Array<TagModel>>;
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
  findTagsBySearchString: Array<TagModel>;
  getAllBlogsPagination: BlogPagination;
  getAllPostsPagination: PostPagination;
  getAllUsersPagination: UserPagination;
  getPostById: PostModel;
  getUserByUsername: UserModel;
  userProfile: UserModel;
};


export type QueryFindTagsBySearchStringArgs = {
  search: Scalars['String']['input'];
};


export type QueryGetAllBlogsPaginationArgs = {
  searchParams?: InputMaybe<SearchParamsInput>;
};


export type QueryGetAllPostsPaginationArgs = {
  searchParams?: InputMaybe<SearchParamsInput>;
};


export type QueryGetAllUsersPaginationArgs = {
  onlySubscriptions: Scalars['Boolean']['input'];
  searchParams?: InputMaybe<SearchParamsInput>;
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

export type UpdateBlogInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  posterUrl?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePostInput = {
  content: Scalars['JSON']['input'];
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
  blogs?: Maybe<Array<BlogModel>>;
  comments?: Maybe<Array<CommentModel>>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  posterUrl?: Maybe<Scalars['String']['output']>;
  posts?: Maybe<Array<PostModel>>;
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

export type ChangeProfileAvatarMutationVariables = Exact<{
  file: Scalars['Upload']['input'];
}>;


export type ChangeProfileAvatarMutation = { __typename?: 'Mutation', changeProfileAvatar: { __typename?: 'UserModel', avatarUrl?: string | null } };

export type ChangeProfilePosterMutationVariables = Exact<{
  file: Scalars['Upload']['input'];
}>;


export type ChangeProfilePosterMutation = { __typename?: 'Mutation', changeProfilePoster: { __typename?: 'UserModel', posterUrl?: string | null } };

export type CreatePostMutationVariables = Exact<{
  data: CreatePostInput;
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost: { __typename?: 'PostModel', id: string, content: any, createdAt: any, updatedAt: any, likesCount: number, viewsCount: number, commentsCount: number, author: { __typename?: 'UserModel', id: string }, blog?: { __typename?: 'BlogModel', id: string } | null } };

export type DeletePostMutationVariables = Exact<{
  postId: Scalars['String']['input'];
}>;


export type DeletePostMutation = { __typename?: 'Mutation', deletePost: boolean };

export type RemoveProfileAvatarMutationVariables = Exact<{ [key: string]: never; }>;


export type RemoveProfileAvatarMutation = { __typename?: 'Mutation', removeProfileAvatar: { __typename?: 'UserModel', avatarUrl?: string | null } };

export type RemoveProfilePosterMutationVariables = Exact<{ [key: string]: never; }>;


export type RemoveProfilePosterMutation = { __typename?: 'Mutation', removeProfilePoster: { __typename?: 'UserModel', posterUrl?: string | null } };

export type SignOutMutationVariables = Exact<{ [key: string]: never; }>;


export type SignOutMutation = { __typename?: 'Mutation', signOutAccount: boolean };

export type SignUpMutationVariables = Exact<{
  data: SignUpInput;
}>;


export type SignUpMutation = { __typename?: 'Mutation', signUp: { __typename?: 'UserModel', username: string, id: string, email: string, description?: string | null, posterUrl?: string | null, avatarUrl?: string | null, createdAt: any, updatedAt: any, subscribers: Array<string>, subscriptions: Array<string> } };

export type SignInMutationVariables = Exact<{
  data: SignInInput;
}>;


export type SignInMutation = { __typename?: 'Mutation', signIn: { __typename?: 'UserModel', username: string, id: string, email: string, description?: string | null, posterUrl?: string | null, avatarUrl?: string | null, createdAt: any, updatedAt: any, subscribers: Array<string>, subscriptions: Array<string> } };

export type SubscribeMutationVariables = Exact<{
  toId: Scalars['String']['input'];
}>;


export type SubscribeMutation = { __typename?: 'Mutation', subscribeToUser: boolean };

export type UnsubscribeMutationVariables = Exact<{
  toId: Scalars['String']['input'];
}>;


export type UnsubscribeMutation = { __typename?: 'Mutation', unsubscribeFromUser: boolean };

export type UpdateProfileMutationVariables = Exact<{
  data: UpdateUserInput;
}>;


export type UpdateProfileMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'UserModel', email: string, username: string, description?: string | null } };

export type GetTagsBySearchStringQueryVariables = Exact<{
  search: Scalars['String']['input'];
}>;


export type GetTagsBySearchStringQuery = { __typename?: 'Query', findTagsBySearchString: Array<{ __typename?: 'TagModel', id: string, name: string }> };

export type GetAllPostsQueryVariables = Exact<{
  searchParams: SearchParamsInput;
}>;


export type GetAllPostsQuery = { __typename?: 'Query', getAllPostsPagination: { __typename?: 'PostPagination', page: number, perPage: number, totalCount: number, totalPages: number, data: Array<{ __typename?: 'PostModel', id: string, title: string, content: any, createdAt: any, updatedAt: any, likesCount: number, viewsCount: number, commentsCount: number, tags?: Array<{ __typename?: 'TagModel', id: string, name: string }> | null, author: { __typename?: 'UserModel', username: string, avatarUrl?: string | null } }> } };

export type GetAllUsersQueryVariables = Exact<{
  searchParams: SearchParamsInput;
  searchStr: Scalars['String']['input'];
  onlySubscriptions: Scalars['Boolean']['input'];
}>;


export type GetAllUsersQuery = { __typename?: 'Query', getAllUsersPagination: { __typename?: 'UserPagination', page: number, perPage: number, totalCount: number, totalPages: number, data: Array<{ __typename?: 'UserModel', id: string, avatarUrl?: string | null, username: string, description?: string | null }> } };

export type GetPostByIdQueryVariables = Exact<{
  postId: Scalars['String']['input'];
}>;


export type GetPostByIdQuery = { __typename?: 'Query', getPostById: { __typename?: 'PostModel', id: string, title: string, content: any, createdAt: any, updatedAt: any, likesCount: number, viewsCount: number, commentsCount: number, blog?: { __typename?: 'BlogModel', id: string } | null, author: { __typename?: 'UserModel', username: string, avatarUrl?: string | null }, comments: Array<{ __typename?: 'CommentModel', id: string, author: { __typename?: 'UserModel', id: string } }>, tags?: Array<{ __typename?: 'TagModel', id: string, name: string }> | null } };

export type GetUserByUsernameQueryVariables = Exact<{
  username: Scalars['String']['input'];
}>;


export type GetUserByUsernameQuery = { __typename?: 'Query', getUserByUsername: { __typename?: 'UserModel', id: string, username: string, description?: string | null, avatarUrl?: string | null, posterUrl?: string | null, posts?: Array<{ __typename?: 'PostModel', id: string, title: string, content: any, createdAt: any, updatedAt: any, likesCount: number, viewsCount: number, commentsCount: number, tags?: Array<{ __typename?: 'TagModel', id: string, name: string }> | null, author: { __typename?: 'UserModel', username: string, avatarUrl?: string | null } }> | null, blogs?: Array<{ __typename?: 'BlogModel', id: string, title: string, description: string, posterUrl?: string | null, createdAt: any, updatedAt: any, tags: Array<{ __typename?: 'TagModel', id: string, name: string }>, author: { __typename?: 'UserModel', username: string, avatarUrl?: string | null } }> | null } };

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
export const CreatePostDocument = gql`
    mutation createPost($data: CreatePostInput!) {
  createPost(data: $data) {
    id
    author {
      id
    }
    blog {
      id
    }
    content
    createdAt
    updatedAt
    likesCount
    viewsCount
    commentsCount
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
export const DeletePostDocument = gql`
    mutation DeletePost($postId: String!) {
  deletePost(postId: $postId)
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
    username
    id
    email
    description
    posterUrl
    avatarUrl
    createdAt
    updatedAt
    subscribers
    subscriptions
  }
}
    `;
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
    username
    id
    email
    description
    posterUrl
    avatarUrl
    createdAt
    updatedAt
    subscribers
    subscriptions
  }
}
    `;
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
export const GetAllPostsDocument = gql`
    query getAllPosts($searchParams: SearchParamsInput!) {
  getAllPostsPagination(searchParams: $searchParams) {
    data {
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
    page
    perPage
    totalCount
    totalPages
  }
}
    `;

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
    comments {
      id
      author {
        id
      }
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
      id
      title
      description
      posterUrl
      tags {
        id
        name
      }
      author {
        username
        avatarUrl
      }
      createdAt
      updatedAt
    }
  }
}
    `;

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