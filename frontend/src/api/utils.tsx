import {Configuration, ConfigurationParameters} from "api-client";


export function getApiConfiguration(accessToken?: string | null) : Configuration {
  const params: ConfigurationParameters = {
    basePath: import.meta.env.VITE_APP_BASE_URL,
  }
  if (accessToken) {
    params['accessToken'] = accessToken;
  }
  return new Configuration(params);
}
