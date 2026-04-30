export const demoUsers = [
  {
    name: 'Maya Fernandes',
    email: 'maya@example.com',
    password: 'password123',
    bio: 'Frontend engineer who writes about shipping calm interfaces.',
    role: 'user',
  },
  {
    name: 'Arjun Mehta',
    email: 'arjun@example.com',
    password: 'password123',
    bio: 'Backend developer interested in APIs that stay readable after six months.',
    role: 'user',
  },
  {
    name: 'Neha Kapoor',
    email: 'neha@example.com',
    password: 'password123',
    bio: 'Product-minded engineer who prefers straightforward interfaces over clever ones.',
    role: 'user',
  },
  {
    name: 'Rahul Nair',
    email: 'rahul@example.com',
    password: 'password123',
    bio: 'Full-stack developer who keeps release notes almost as tidy as code.',
    role: 'user',
  },
  {
    name: 'Sana Iqbal',
    email: 'sana@example.com',
    password: 'password123',
    bio: 'Designer turned engineer with a habit of documenting every rough edge.',
    role: 'user',
  },
  {
    name: 'Vikram Das',
    email: 'vikram@example.com',
    password: 'password123',
    bio: 'QA-focused developer who notices when a workflow feels off before a metric does.',
    role: 'user',
  },
  {
    name: 'Site Admin',
    email: 'admin@example.com',
    password: 'password123',
    bio: 'Keeps moderation and editorial changes under control.',
    role: 'admin',
  },
]

const blogSubjects = [
  {
    titleStem: 'Getting search inputs to feel fast without over-building them',
    context:
      'Search bars usually look simple right until a project adds large lists, impatient users, and uneven API timings.',
    points: [
      'Debouncing the request reduced noise without making the field feel sluggish.',
      'A plain empty state helped people understand that the filter actually worked.',
    ],
    closing:
      'The best outcome was not a dramatic speed gain. It was the interface staying understandable even when the data changed quickly.',
    tags: ['frontend', 'search', 'ux'],
  },
  {
    titleStem: 'Why API pagination becomes a design choice earlier than expected',
    context:
      'Teams often treat pagination like a backend detail until the list page needs filters, sorting, and stable URLs.',
    points: [
      'The response shape stayed calmer once page metadata lived next to the records.',
      'Keeping limits predictable made it easier to reason about list performance during testing.',
    ],
    closing:
      'A small pagination contract ended up helping product discussions as much as it helped the API layer.',
    tags: ['backend', 'api', 'pagination'],
  },
  {
    titleStem: 'Nested comments only stay readable when the data model stays boring',
    context:
      'Comment threads become awkward quickly when parent-child relationships are hidden behind clever shortcuts.',
    points: [
      'A direct parent reference was easier to debug than a more ambitious tree structure.',
      'Recursive rendering stayed manageable once each comment shape stayed consistent.',
    ],
    closing:
      'The less surprising the data layer felt, the easier it was to keep the UI recursive without making it fragile.',
    tags: ['comments', 'backend', 'react'],
  },
  {
    titleStem: 'The quiet value of good empty states on content-heavy screens',
    context:
      'Most content products spend time on loaded states and very little time on the moments where nothing matches a filter.',
    points: [
      'Short, specific copy reduced the number of people who thought the screen had crashed.',
      'A clear next action made the search and filter tools feel safer to use.',
    ],
    closing:
      'An empty state is often the part of the product that teaches people how confident they should feel while exploring.',
    tags: ['ux', 'frontend', 'content'],
  },
  {
    titleStem: 'Form validation feels different when the wording respects how people work',
    context:
      'Validation is usually technically correct long before it becomes helpful to the person filling out the form.',
    points: [
      'Field messages improved once they explained what to fix instead of simply declaring failure.',
      'Client-side checks helped speed, but server-side validation remained the real authority.',
    ],
    closing:
      'The form did not need more rules. It needed clearer language around the rules it already had.',
    tags: ['forms', 'frontend', 'validation'],
  },
  {
    titleStem: 'A small admin role can remove a lot of workflow friction',
    context:
      'Content tools usually begin with strict ownership rules, then eventually need moderation and correction paths.',
    points: [
      'Role-aware authorization was easier to maintain than one-off exceptions inside route handlers.',
      'The UI became less confusing once admin powers were explicit rather than implied.',
    ],
    closing:
      'The goal was not to widen access casually. It was to make the exceptional cases deliberate and traceable.',
    tags: ['auth', 'admin', 'backend'],
  },
  {
    titleStem: 'Release checklists still matter even on small student projects',
    context:
      'A small app can still break in ways that look obvious only after someone tries to run it on a different machine.',
    points: [
      'Writing down the setup path caught missing env examples and stale scripts quickly.',
      'A seed command with known credentials reduced the time spent proving that auth actually worked.',
    ],
    closing:
      'The checklist was less about process theatre and more about saving future debugging time.',
    tags: ['setup', 'docs', 'workflow'],
  },
  {
    titleStem: 'Styling dark mode is easier when colors are treated like real tokens',
    context:
      'Theme work gets messy when colors are scattered through component files and adjusted one selector at a time.',
    points: [
      'A small set of theme variables handled most of the contrast work without rewriting components.',
      'Persisting the preference made the feature feel intentional instead of decorative.',
    ],
    closing:
      'Dark mode only feels finished when it changes the whole visual system rather than a handful of background colors.',
    tags: ['frontend', 'dark-mode', 'css'],
  },
  {
    titleStem: 'Markdown editors are often enough when rich text needs to stay practical',
    context:
      'Many teams reach for heavy editors even when the actual need is headings, lists, quotes, and code blocks.',
    points: [
      'A lightweight toolbar covered the common formatting actions without adding a complicated dependency surface.',
      'Live preview helped people trust the formatting rules before publishing.',
    ],
    closing:
      'The editor felt better once it focused on the few actions people genuinely used instead of trying to mimic a full word processor.',
    tags: ['editor', 'markdown', 'frontend'],
  },
  {
    titleStem: 'Why blog lists need better metadata than just a title and a date',
    context:
      'Lists start to feel generic when every card looks interchangeable and asks the user to open each item for context.',
    points: [
      'A short excerpt made the scan path faster than another decorative badge would have.',
      'Author and date details helped the list feel grounded without adding noise.',
    ],
    closing:
      'A good list page quietly answers whether an item is worth opening before the user has to commit to a click.',
    tags: ['frontend', 'blogs', 'ui'],
  },
  {
    titleStem: 'Schema design gets simpler when comments and blogs do less',
    context:
      'The temptation with content systems is to put too much convenience logic directly into the database models.',
    points: [
      'Keeping the blog and comment schemas small made test data easier to reason about.',
      'Formatting and tree-building stayed easier to change when they lived outside the models.',
    ],
    closing:
      'Boring models tend to age better because fewer presentation choices get trapped inside the persistence layer.',
    tags: ['mongodb', 'schema', 'backend'],
  },
  {
    titleStem: 'Code review becomes easier when handlers read like request stories',
    context:
      'A route handler is easier to trust when each step tells a clear story: validate, authorize, mutate, respond.',
    points: [
      'Small controller helpers removed duplication without turning the code into a maze of abstractions.',
      'Readable error messages made it easier to debug failures during review.',
    ],
    closing:
      'Most review friction came from tangled flow, not from the amount of code on screen.',
    tags: ['code-review', 'express', 'backend'],
  },
  {
    titleStem: 'Infinite scroll is useful when it stays optional',
    context:
      'People often debate infinite scroll versus pagination as if one has to replace the other everywhere.',
    points: [
      'Keeping pagination as the default preserved clear navigation for assignment requirements and direct testing.',
      'An optional infinite mode gave the interface a higher-scoring polish without removing predictability.',
    ],
    closing:
      'The compromise worked because the feature was framed as a browsing mode, not as a full replacement.',
    tags: ['frontend', 'infinite-scroll', 'pagination'],
  },
  {
    titleStem: 'The first helpful thing an API can do is fail consistently',
    context:
      'Nothing slows down frontend work faster than response shapes that change depending on which branch of logic failed.',
    points: [
      'A shared error handler kept route code shorter and failures easier to surface in the UI.',
      'Consistent messages made fallback states less guessy during development.',
    ],
    closing:
      'Predictable failure behavior gave the client side a cleaner contract than another layer of abstraction would have.',
    tags: ['api', 'errors', 'backend'],
  },
  {
    titleStem: 'Tiny accessibility fixes usually improve everybody’s workflow',
    context:
      'Accessibility work is often described as extra, even though many of the fixes also help speed and clarity for everyone else.',
    points: [
      'Better focus states made keyboard use calmer during long form editing sessions.',
      'Real labels and clear section headings improved orientation on dense screens.',
    ],
    closing:
      'Accessibility wins were rarely flashy, but they consistently made the product feel less brittle.',
    tags: ['accessibility', 'frontend', 'ux'],
  },
  {
    titleStem: 'Testing seeded data is a quiet shortcut to better demos',
    context:
      'Teams often validate the code path but forget to validate that the demo data actually shows the intended features.',
    points: [
      'Known logins removed the friction of proving auth and authorization flows during review.',
      'A larger demo dataset made search, pagination, and filtering feel real instead of staged.',
    ],
    closing:
      'Demo data does not replace testing, but it does expose whether a feature still feels coherent when used in sequence.',
    tags: ['testing', 'seed', 'demo'],
  },
  {
    titleStem: 'Route files stay calmer when middleware owns the repeated checks',
    context:
      'Authentication and authorization logic become hard to trust when every controller rewrites them slightly differently.',
    points: [
      'Shared middleware kept the happy path inside handlers much shorter.',
      'Role checks became easier to extend once the user identity was attached to the request consistently.',
    ],
    closing:
      'The code felt less magical once repeated permission work had a single, obvious entry point.',
    tags: ['middleware', 'jwt', 'backend'],
  },
  {
    titleStem: 'Why excerpts matter more than decorative preview cards',
    context:
      'A preview card earns its place by helping somebody decide whether to open a post, not by looking clever in a grid.',
    points: [
      'Consistent excerpts gave the list a faster reading rhythm than inconsistent first paragraphs.',
      'Small metadata details kept the cards feeling authored instead of auto-generated.',
    ],
    closing:
      'The card design improved most once it was treated like an information hierarchy problem rather than a branding exercise.',
    tags: ['cards', 'blogs', 'frontend'],
  },
  {
    titleStem: 'When frontend state is simple, context usually beats overengineering',
    context:
      'It is easy to pull in bigger state tools before checking whether the app really needs them.',
    points: [
      'A small auth context was enough for session state without spreading token logic across components.',
      'Keeping page data local made each screen easier to debug in isolation.',
    ],
    closing:
      'The choice stayed defensible because the state model matched the size of the problem instead of anticipating three future rewrites.',
    tags: ['react', 'state', 'frontend'],
  },
  {
    titleStem: 'Practical deployment notes save more time than perfect architecture slides',
    context:
      'A project usually feels production-aware when the run path is documented, not when the folder names look formal.',
    points: [
      'Health checks and clear environment variables reduced the time spent guessing whether the backend had actually started.',
      'A dedicated handoff guide turned setup into a repeatable action instead of a conversation.',
    ],
    closing:
      'The real sign of maturity was not complexity. It was whether another person could run the project without asking for live help.',
    tags: ['deployment', 'setup', 'workflow'],
  },
]

const writingAngles = [
  {
    title: 'after the first version started to feel crowded',
    context:
      'The first clue was not a crash. It was the page beginning to feel heavier every time another small requirement landed.',
    practice: 'We removed a few nice-to-have touches and the core flow became clearer immediately.',
    quote: 'When the first version feels crowded, the answer is usually clarity before scale.',
    takeaway: 'That reset kept the feature focused enough to survive the next round of edits.',
    tags: ['cleanup'],
  },
  {
    title: 'while keeping the code readable for another developer',
    context:
      'The design work mattered, but the code also needed to stay legible for whoever touched it after handoff.',
    practice: 'Naming the boundaries clearly reduced the need for comments in the critical paths.',
    quote: 'Readable code is often just code that decides one thing at a time.',
    takeaway: 'The implementation became easier to review because the intent stayed visible in the structure.',
    tags: ['readability'],
  },
  {
    title: 'before handing the project to someone new',
    context:
      'Handoff pressure is useful because it exposes every assumption that only made sense to the original author.',
    practice: 'The setup path improved the moment we tried to write it for somebody who had never seen the repo before.',
    quote: 'If the handoff guide is vague, the setup probably is too.',
    takeaway: 'That perspective forced a few rough edges into the open before they became another person’s problem.',
    tags: ['handoff'],
  },
  {
    title: 'when small interface details started shaping trust',
    context:
      'The more the app asked people to write or edit content, the more trust depended on tiny feedback loops staying honest.',
    practice: 'Explicit states beat subtle states whenever the user needed to know whether an action had really worked.',
    quote: 'Trust is often a sum of tiny confirmations, not one big success state.',
    takeaway: 'That is what made the feature feel settled rather than merely finished.',
    tags: ['trust'],
  },
  {
    title: 'after test data made the rough edges obvious',
    context:
      'The feature looked fine with two records, then became much easier to judge once the list started behaving like real content.',
    practice: 'Larger demo data exposed layout, search, and browsing problems faster than more abstract review notes did.',
    quote: 'A realistic dataset is one of the quickest ways to stop fooling yourself about UX.',
    takeaway: 'Once the data felt real, the right simplifications became much easier to defend.',
    tags: ['demo'],
  },
]

function buildCodeBlock(subject, index) {
  if (index % 6 !== 0) {
    return ''
  }

  const key = subject.tags[0] || 'feature'

  return [
    '',
    '```js',
    `const ${key.replace(/-/g, '_')}Checklist = ['clarity', 'feedback', 'ownership']`,
    `${key.replace(/-/g, '_')}Checklist.forEach((item) => console.log(item))`,
    '```',
  ].join('\n')
}

function buildContent(subject, angle, index) {
  return [
    '## Context',
    `${subject.context} ${angle.context}`,
    '',
    '## What helped',
    `- ${subject.points[0]}`,
    `- ${subject.points[1]}`,
    `- ${angle.practice}`,
    '',
    `> ${angle.quote}`,
    '',
    '## Takeaway',
    `${subject.closing} ${angle.takeaway}`,
    buildCodeBlock(subject, index),
  ].join('\n')
}

export function buildDemoBlogs(usersByEmail) {
  const authors = demoUsers.filter((user) => user.role === 'user')
  const totalBlogs = blogSubjects.length * writingAngles.length

  return Array.from({ length: totalBlogs }, (_, index) => {
    const subject = blogSubjects[index % blogSubjects.length]
    const angle = writingAngles[Math.floor(index / blogSubjects.length)]
    const author = authors[index % authors.length]
    const authorRecord = usersByEmail.get(author.email)
    const tags = [...new Set([...subject.tags, ...angle.tags])]
    const createdAt = new Date(Date.now() - (totalBlogs - index) * 1000 * 60 * 60 * 14)

    return {
      title: `${subject.titleStem} ${angle.title}`,
      content: buildContent(subject, angle, index),
      tags,
      author: authorRecord._id,
      likes: index % 3 === 0 ? [usersByEmail.get('admin@example.com')._id] : [],
      createdAt,
      updatedAt: createdAt,
    }
  })
}

export function buildDemoCommentThreads(blogs, usersByEmail) {
  const commenters = demoUsers.filter((user) => user.role === 'user')

  return blogs.slice(0, 18).map((blog, index) => {
    const firstCommentAuthor = usersByEmail.get(commenters[(index + 1) % commenters.length].email)
    const secondCommentAuthor = usersByEmail.get(commenters[(index + 2) % commenters.length].email)
    const replyAuthor = usersByEmail.get(commenters[(index + 3) % commenters.length].email)

    return {
      blogId: blog._id,
      topLevelComments: [
        {
          author: firstCommentAuthor._id,
          content: `This post landed well because it stayed concrete. The part about ${blog.tags[0]} felt especially usable in a real code review.`,
        },
        {
          author: secondCommentAuthor._id,
          content: `I liked that this was written like working notes instead of a polished essay. That makes the advice easier to reuse later.`,
        },
      ],
      replies: [
        {
          replyToIndex: 0,
          author: replyAuthor._id,
          content: 'Agreed. It reads like something a team could actually keep open while implementing the feature.',
        },
      ],
    }
  })
}

export const demoLoginAccounts = demoUsers.map((user) => ({
  name: user.name,
  role: user.role,
  email: user.email,
  password: user.password,
}))