import type { ErrorRequestHandler, RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

const unexpectedRequest: RequestHandler = (_req, res) => {
	res.status(StatusCodes.NOT_FOUND).send("Not Found");
};

const defaultErrorHandler = (err, req, res, next) => {
	console.error("Error:", err.message);

	res.status(err.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
		status: "error",
		message: err.message || "Internal Server Error",
	});
};

export default (): [RequestHandler, ErrorRequestHandler] => [unexpectedRequest, defaultErrorHandler];
