export const CONSTANTS = {
  localesAllowed: ['es', 'fr', 'id', 'fr'],
  localeToLanguage: {
    es: 'es_ES',
    en: 'en_US',
    id: 'id_ID',
    fr: 'fr_FR',
  },
  statusCodes: {
    ok: 200,
    created: 201,
    accepted: 202,
    notContent: 204,
    unauthorized: 401,
    forbidden: 403,
    notFound: 404,
    unprocessableEntity: 412,
    serviceUnavailable: 503,
  },
  errors: {
    unauthorized: 'Unauthorized',
    forbidden: 'Forbidden',
    notFound: 'Not Found',
    unprocessableEntity: 'Unprocessable Entity',
    serviceUnavailable: 'Service Unavailable',
  },
  defaultErrorMessages: {
    unauthorized: () => 'No authorized',
    forbidden: () => 'You do not have permissions to do the action',
    notFound: (resource) => `${resource} not found`,
    unprocessable_entity: () => 'Validation error',
  },
};
