import { UserModel } from "../models";

export type UpdateUserModel = Partial<Omit<UserModel, 'subscriptions' | 'subscribers' | 'comments' | 'blogs' | 'posts'>>