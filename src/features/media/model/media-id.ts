const MONGO_ID_REGEX = /^[a-f\d]{24}$/i
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isValidMediaIdFormat(mediaId: string) {
  return MONGO_ID_REGEX.test(mediaId) || UUID_REGEX.test(mediaId)
}
