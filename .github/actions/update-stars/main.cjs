const core = require('@actions/core');
const {readFileSync, writeFileSync} = require("fs");
const axios = require("axios");

const ghGraphQlUrl = 'https://api.github.com/graphql'
const gitlabGraphQlUrl = 'https://gitlab.com/api/graphql'
const githubNameRegexp = new RegExp('https://github.com/([a-zA-Z0-9][a-zA-Z0-9-]{0,38}/[a-zA-Z0-9._-]{1,100})')
const gitlabNameRegExp = new RegExp('https://gitlab.com/([\\w-]+/[\\w-]+)')

async function doGraphQlQuery(url, query, headers = {}) {
    try {
        let fetchResponse = await axios({
            data: JSON.stringify({query}),
            method: 'POST',
            url: url,
            headers: {
                'content-type': 'application/json',
                ...headers
            }
        })
        let data = fetchResponse.data
        return Object.values(data.data || {})
    } catch (e) {
        console.error(e)
    }
    return []
}

function gatherUrls() {
    let components = JSON.parse(readFileSync('src/routes/components/components.json'))
    let tools = JSON.parse(readFileSync('src/routes/tools/tools.json'))
    let templates = JSON.parse(readFileSync('src/routes/templates/templates.json'))

    return [
        ...components.map(component => component.url),
        ...tools.map(tool => tool.url),
        ...templates.map(template => template.url)
    ]
}

// Github

function getAllGHRepos () {
    return gatherUrls()
        .filter(url => url !== false && githubNameRegexp.test(url))
        .map(gitHubUrl => gitHubUrl.match(githubNameRegexp)[1].toLowerCase())
        .map(validName => ({owner: validName.split('/')[0], repo: validName.split('/')[1]}))
}

function ghRepoGraphQl({owner, repo}) {
    let identifier = owner + '_' + repo + '_' + Math.random() + ''
    identifier = identifier.replace(/[^a-zA-Z0-9_]/g, '_')
    identifier = identifier.replace(/^[0-9]/g, '_')
    return `${identifier}: repository(name: "${repo}", owner: "${owner}"){nameWithOwner stargazerCount}`
}

async function getGHStars() {
    const repoData = getAllGHRepos();
    let body = 'query{' + "\n" + repoData.map(repoInfo => ghRepoGraphQl(repoInfo)).join("\n") + "\n" + '}'
    let lines = await doGraphQlQuery(ghGraphQlUrl, body, {
        'authorization': 'Bearer ' + core.getInput('token', {
            // required: true,
            trimWhitespace: true
        })
    })
    let result = {}
    lines.forEach(line => result[line?.nameWithOwner.toLowerCase()] = line?.stargazerCount)
    delete result[undefined]
    return result
}

// Gitlab

function getAllGitlabRepos () {
    return gatherUrls()
        .filter(url => url !== false && gitlabNameRegExp.test(url))
        .map(url => url.match(gitlabNameRegExp)[1])
}

function gitlabRepoGraphQl(name) {
    let identifier = name + '_' + Math.random() + ''
    identifier = identifier.replace(/[^a-zA-Z0-9_]+/g, '_')
    identifier = identifier.replace(/^[0-9]/g, '_')
    return `${identifier}: project(fullPath: "${name}"){starCount fullPath}`
}

async function getGitlabStars() {
    const repoData = getAllGitlabRepos();
    console.log(repoData)
    let body = 'query{' + "\n" + repoData.map(repoInfo => gitlabRepoGraphQl(repoInfo)).join("\n") + "\n" + '}'
    let lines = await doGraphQlQuery(gitlabGraphQlUrl, body)
    let result = {}
    lines.forEach(line => result[line?.fullPath.toLowerCase()] = line?.starCount)
    delete result[undefined]
    return result
}

async function main() {
    const github = await getGHStars();
    const gitlab = await getGitlabStars();
    writeFileSync('src/lib/stars.json', JSON.stringify({ github, gitlab }))
}

try {
    core.info('Start')
    main().then(() => core.info('Done'))
} catch (error) {
    core.setFailed(error);
}