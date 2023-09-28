import { Discussion, Reply, User } from '@prisma/client'

type ReplyWithUser = Reply & {
  user: User
}

export type DiscussionWithReplies = Discussion & {
  user: User
  replies: ReplyWithUser[]
}

export class MessageFormatter {
  formatFindOneResponse(requestId: string, discussion: DiscussionWithReplies): string {
    const formattedReplies = this.formatReplies(discussion.replies)
    const formattedDiscussionContent = this.formatContent(
      discussion.user.clientId,
      discussion.content
    )

    const repliesString = formattedReplies.join(',')
    const replyPart = formattedReplies.length > 0 ? `,${repliesString}` : ''

    return `${requestId}|${discussion.id}|${discussion.reference}|(${formattedDiscussionContent}${replyPart})\n`
  }

  formatFindAllResponse(requestId: string, discussions: DiscussionWithReplies[]): string {
    const formattedDiscussions = this.formatDiscussions(discussions)
    return `${requestId}|(${formattedDiscussions.join(',')})\n`
  }

  private formatDiscussions(discussions: DiscussionWithReplies[]): string[] {
    const formattedDiscussions = []

    for (let i = 0; i < discussions.length; i++) {
      formattedDiscussions.push(this.formatDiscussion(discussions[i]))
    }

    return formattedDiscussions
  }

  private formatDiscussion(discussion: DiscussionWithReplies): string {
    const formattedReplies = this.formatReplies(discussion.replies)
    const formattedDiscussionContent = this.formatContent(
      discussion.user.clientId,
      discussion.content
    )

    const repliesString = formattedReplies.join(',')
    const replyPart = formattedReplies.length > 0 ? `,${repliesString}` : ''

    return `${discussion.id}|${discussion.reference}|(${formattedDiscussionContent}${replyPart})`
  }

  private formatReplies(replies: ReplyWithUser[]): string[] {
    const formattedReplies = []

    for (let i = 0; i < replies.length; i++) {
      formattedReplies.push(this.formatReply(replies[i]))
    }

    return formattedReplies
  }

  private formatReply(reply: ReplyWithUser): string {
    return this.formatContent(reply.user.clientId, reply.content)
  }

  formatContent(userId: string, content: string): string {
    const formattedContent = content.includes(',') ? `"${content.replace(/"/g, '""')}"` : content

    return `${userId}|${formattedContent}`
  }
}
