import { Request } from "express";

export interface reqInterface extends Request{
    user?:any
}