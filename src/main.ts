import * as core from '@actions/core'
import * as exec from '@actions/exec'
import semver from 'semver'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const workspace: string = core.getInput('workspace')
    const token: string = core.getInput('token')
    const url: string = core.getInput('url')
    const version = core.getInput('openhexa_version')

    // Install openhexa.sdk
    try {
      if (!version || semver.valid(version)) {
        core.info(`Installing openhexa.sdk ${version}...`)
        await exec.exec(
          `python -m pip install openhexa.sdk${version ? `==${version}` : ''}`
        )
      } else if (version) {
        // We have a git branch
        core.info(`Installing openhexa.sdk from branch ${version}`)
        await exec.exec(
          `python -m pip install https://github.com/blsq/openhexa-sdk-python/archive/refs/heads/${version}.zip`
        )
      }
    } catch (err) {
      core.setFailed(
        `Failed to install openhexa.sdk: ${err}. Do you need to install python? Use 'install_python: true'`
      )
    }
    core.info('Installing openhexa.sdk... Done!')
    core.info('Configuring openhexa.sdk...')
    await exec.exec('openhexa', ['config', 'set_url', url])
    core.info(`Adding workspace ${workspace} to openhexa.sdk...`)
    const res = await exec.exec('openhexa', ['workspaces', 'add', workspace], {
      env: { HEXA_TOKEN: token }
    })
    core.info(`${res}`)
    if (res !== 0) {
      throw new Error('Failed to add workspace to openhexa.sdk')
    }
    core.info('Configuring openhexa.sdk... Done!')
    core.info(
      "OpenHEXA is now configured and ready to use! Just run 'openhexa' to see the available commands."
    )
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
