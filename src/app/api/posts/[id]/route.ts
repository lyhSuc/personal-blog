import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: 获取单篇文章
export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params
        const post = await prisma.post.findUnique({
            where: { id },
            include: { category: true },
        })

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 })
        }

        return NextResponse.json(post)
    } catch (error) {
        console.error('GET post error:', error)
        return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 })
    }
}

// PUT: 更新文章
export async function PUT(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params
        const body = await request.json()
        const { title, content, categoryId, published } = body

        const post = await prisma.post.update({
            where: { id },
            data: {
                title,
                content,
                categoryId,
                published,
            },
        })

        return NextResponse.json(post)
    } catch (error) {
        console.error('PUT post error:', error)
        return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
    }
}

// DELETE: 删除文章
export async function DELETE(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params
        await prisma.post.delete({
            where: { id },
        })

        return NextResponse.json({ message: 'Post deleted' })
    } catch (error) {
        console.error('DELETE post error:', error)
        return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
    }
}
