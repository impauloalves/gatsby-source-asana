const fetch = require("node-fetch").default;

async function getTasks(projectId, token) {
  const tasks = [];
  let offset = "";
  do {
    let url = `https://app.asana.com/api/1.0/projects/${projectId}/tasks?limit=100&opt_fields=name,followers,assignee,description`;
    if (offset) url += `&offset=${offset}`;
    const { data, next_page } = await (
      await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })
    ).json();
    tasks.push(...data);
    offset = next_page && next_page.offset || ""
  } while (offset);
  return tasks;
}

exports.sourceNodes = async ({
  actions,
  createContentDigest,
  createNodeId,
}, {apiToken, projectId}) => {
  // Arbitrary node type constant
  const ITEM_TYPE = "Task";

  // Get tasks
  const tasks = await getTasks(projectId, apiToken);
  // Convert raw tasks results to nodes
  for (task of tasks) {
    console.log("task", task);
    actions.createNode({
      id: createNodeId(`${ITEM_TYPE}-${task.gid}`),
      ...task,
      internal: {
        type: ITEM_TYPE,
        contentDigest: createContentDigest(task),
      },
    });
  }
};
