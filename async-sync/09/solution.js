export default async (registrationFormUrl, submitFormUrl, nickname) => {
  const response1 = await get(registrationFormUrl);
  if (response1.status !== 200) {
    throw new Error(`Status: ${response1.status}`);
  }
  const token = getToken(response1.data);

  const response2 = await post(submitFormUrl, { nickname, token });
  if (response2.status !== 302) {
    throw new Error(`Status: ${response2.status}`);
  }
};