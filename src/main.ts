import * as core from '@actions/core'
import * as exec from '@actions/exec'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const workspace: string = core.getInput('workspace')
    const token: string = core.getInput('token')
    const url: string = core.getInput('url')
    const install_python = core.getInput('install_python')

    // Install python if requested
    if (install_python === 'true') {
      await exec.exec('sudo apt-get update')
      await exec.exec('sudo apt-get install python3.11')
    }

    // Install openhexa.sdk
    try {
      core.info('Installing openhexa.sdk...')
      await exec.exec('pip install openhexa.sdk==0.1.37')
    } catch (err) {
      core.setFailed(
        `Failed to install openhexa.sdk: ${err}. Do you need to install python? Use 'install_python: true'`
      )
    }
    core.info('Installing openhexa.sdk... Done!')
    core.info('Configuring openhexa.sdk...')
    await exec.exec('openhexa', ['config', 'set_url', url])
    await exec.exec('openhexa', [
      'workspaces',
      'add',
      workspace,
      `token=${token}`
    ])
    core.info('Configuring openhexa.sdk... Done!')
    core.info(
      "OpenHEXA is now configured and ready to use! Just run 'openhexa' to see the available commands."
    )
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
