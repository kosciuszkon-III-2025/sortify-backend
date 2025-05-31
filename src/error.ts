export default class ErrorRes extends Error {
	statusCode: number

	constructor(message: any, statusCode = 500) {
		super(message);
		this.name = "ProductSubmissionError";
		this.statusCode = statusCode;
		Error.captureStackTrace?.(this, ErrorRes);
	}

	response(): Response {
		return new Response(this.message, { status: this.statusCode })
	}
}
