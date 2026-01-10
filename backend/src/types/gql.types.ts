import type { Request, Response } from "express";

export interface IGQLContext {
	req: Request,
	res: Response
}