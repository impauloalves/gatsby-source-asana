## Description

Gatsby Source plugin for pulling tasks from Asana projects.
### Learning Resources

* https://www.gatsbyjs.com/
* https://asana.com/
* https://developers.asana.com/docs/personal-access-token/
## How to install

```sh
npm install --save gatsby-source-asana
```
## Examples of usage

In your gatsby-config.js :

```js
{
  resolve: `gatsby-source-asana`,
  options: {
    apiToken: `<your Asana token>`,
    projectId: `<your Asana project id>`,
    fields: ['name', 'assignee']
  }
}
```

## How to query for data (source plugins only)

### Query all tasks

```js
export const query = graphql`
{
  allTask {
    nodes {
      id
      name
    }
  }
}
```

### Query a single task by id

```js
export const pageQuery = graphql`
  query ($id: String!) {
    task(id: { eq: $id }) {
      id
    }
  }
`;
```