const core = require('@actions/core');
const request = require('superagent');

(async () => {
  const url = core.getInput('url', { required: true });
  let json = core.getInput('json');

  let obj;
  try {
    obj = JSON.parse(json);
  } catch (err) {
    core.setFailed(`Invalid json:`, err);
    return;
  }

  try {
    const res = await request.post(url).send(obj);
    console.log('Response body:', res.body);
    if (res.status < 200 || res.status > 299) {
      core.setFailed(`Status code was not 2xx. Was: ${res.status}`);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
})();
