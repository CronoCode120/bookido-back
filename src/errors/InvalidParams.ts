import { ErrorCode } from './ErrorCode.js'

class InvalidParamsError extends Error {
  readonly code: string

  constructor(msg: string) {
    super(msg)
    this.code = ErrorCode.INVALID_PARAMS
  }
}

export default InvalidParamsError
