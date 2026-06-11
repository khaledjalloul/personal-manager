
const { REACT_APP_CLIENT_URL, REACT_APP_STRAVA_CLIENT_ID } = process.env;

const OATH_URL = "https://www.strava.com/oauth/authorize";

const PARAMS: Record<string, string> = {
  "client_id": REACT_APP_STRAVA_CLIENT_ID ?? "",
  "response_type": "code",
  "approval_prompt": "force",
  "scope": "read,activity:read_all",
}

export const getStravaAuthUrl = (redirectUrl: string) => {
  const params = new URLSearchParams({
    ...PARAMS,
    "redirect_uri": `${REACT_APP_CLIENT_URL}/#${redirectUrl}`,
  });
  return `${OATH_URL}?${params.toString()}`;
}
