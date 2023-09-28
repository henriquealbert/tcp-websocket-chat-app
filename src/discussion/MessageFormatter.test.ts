import { describe, expect, test } from 'vitest'
import { DiscussionWithReplies, MessageFormatter } from './MessageFormatter'

describe('MessageFormatter', () => {
  test('formatFindOneResponse formats a single discussion correctly', () => {
    const formatter = new MessageFormatter()
    const now = new Date()
    const discussion: DiscussionWithReplies = {
      id: 'xthbsuv',
      reference: 'iztybsd',
      content: 'Hey, folks. What do you think of my video? Does it have enough "polish"?',
      createdAt: now,
      updatedAt: now,
      userId: 'user-id',
      user: {
        id: 'user-id',
        clientId: 'janedoe',
        createdAt: now,
        updatedAt: now
      },
      replies: [
        {
          id: 'reply-id',
          content: "I think it's great!",
          createdAt: now,
          updatedAt: now,
          discussionId: 'xthbsuv',
          userId: 'user-id',
          user: {
            id: 'user-id',
            clientId: 'johndoe',
            createdAt: now,
            updatedAt: now
          }
        }
      ]
    }

    const result = formatter.formatFindOneResponse('iofetzv.0s', discussion)
    expect(result).toBe(
      'iofetzv.0s|xthbsuv|iztybsd|(janedoe|"Hey, folks. What do you think of my video? Does it have enough ""polish""?",johndoe|I think it\'s great!)\n'
    )
  })

  test('formatFindAllResponse formats all discussions correctly', () => {
    const formatter = new MessageFormatter()
    const now = new Date()
    const discussions: DiscussionWithReplies[] = [
      {
        id: 'iztybsd',
        reference: 'iofetzv.0s',
        content: 'Hey, folks! What do you think of my video?',
        createdAt: now,
        updatedAt: now,
        userId: 'user-id',
        user: {
          id: 'user-id',
          clientId: 'janedoe',
          createdAt: now,
          updatedAt: now
        },
        replies: [
          {
            id: 'reply-id',
            content: "I think it's great!",
            createdAt: now,
            updatedAt: now,
            discussionId: 'iztybsd',
            userId: 'user-id',
            user: {
              id: 'user-id',
              clientId: 'johndoe',
              createdAt: now,
              updatedAt: now
            }
          }
        ]
      }
    ]

    const result = formatter.formatFindAllResponse('ycbmzvl', discussions)
    expect(result).toBe(
      'ycbmzvl|(iztybsd|iofetzv.0s|(janedoe|"Hey, folks! What do you think of my video?",johndoe|I think it\'s great!))\n'
    )
  })
})
