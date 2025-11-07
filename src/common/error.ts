export class APIError extends Error {
    constructor(message: any, public status: number = 500){
        super(message)
    }
}