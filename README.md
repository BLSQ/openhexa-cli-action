# OpenHEXA Github Action
This action will install and configure the OpenHEXA CLI in your workflow. You will be able to use the `openhexa` command to interact with the OpenHEXA API.

## How to use this action
To use this action, you need to add the following step to your workflow:

```yaml
- name: Setup Python
  uses: actions/setup-python@v2

- name: Install OpenHEXA CLI
  uses: blsq/openhexa-cli-action@v1
  with:
    workspace: <insert-workspace-slug>
    token: ${{ secrets.OH_TOKEN }}

- name: Push pipeline to your OpenHEXA Instance
  run: openhexa pipeline push . --name "First version of the pipeline" --description "This pipeline is used to push data to OpenHEXA" --link https://github.com/... 
```

You have to replace `<insert-workspace-slug>` with the slug of your workspace. You can find it in the URL of your workspace: `https://app.openhexa.org/workspaces/<workspace-slug>`. You also need to provide a token to authenticate with the OpenHEXA API. You can get this token in the OpenHEXA web interface on `https://app.openhexa.org/workspaces/<workspace-slug>/pipelines/`.

