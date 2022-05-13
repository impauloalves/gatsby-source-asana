const axios = require("axios");

async function getTasks(projectId, fields, token) {
  const tasks = [];
  let offset = "";
  try {
    do {
      let url = `https://app.asana.com/api/1.0/projects/${projectId}/tasks?limit=100`;
      if (fields) url += `&opt_fields=${fields.join(",")}`;
      if (offset) url += `&offset=${offset}`;
      const { data: response } = await axios(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const { data, next_page } = response;
      tasks.push(...data);
      offset = (next_page && next_page.offset) || "";
    } while (offset);
  } catch (error) {
    throw new Error(JSON.stringify(error.response.data));
  }
  return tasks;
}

exports.sourceNodes = async (
  { actions, createContentDigest, createNodeId },
  { apiToken, projectId, fields }
) => {
  // Arbitrary node type constant
  const ITEM_TYPE = "Task";

  try {
    // Get tasks
    const tasks = await getTasks(projectId, fields, apiToken);
    // Convert raw book results to nodes
    for (task of tasks) {
      actions.createNode({
        id: createNodeId(`${ITEM_TYPE}-${task.gid}`),
        ...task,
        internal: {
          type: ITEM_TYPE,
          contentDigest: createContentDigest(task),
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
};
