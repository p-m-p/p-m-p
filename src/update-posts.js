import { readFileSync, writeFileSync } from 'fs'
import { XMLParser } from 'fast-xml-parser'

async function getPosts(url, count = 3) {
  const response = await fetch(url)

  if (response.ok) {
    const data = await response.text()
    const parser = new XMLParser()
    const { feed } = parser.parse(data)

    return feed.entry.slice(0, count)
  }

  return []
}

function postDate(date) {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

const posts = (await getPosts('https://philparsons.co.uk/feed/feed.xml'))
  .map((post) => `[**${post.title}**](${post.id})<br>${postDate(post.updated)}`)
  .join('\n\n')

writeFileSync(
  'README.md',
  readFileSync('README.md', 'utf8').replace(
    /(<!-- blog posts -->)[\s\S]*?(<!-- \/blog posts -->)/,
    `$1\n${posts}\n$2`
  )
)
