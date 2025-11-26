import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: 获取所有文章
export async function GET() {
    try {
        const posts = await prisma.post.findMany({
            include: {
                category: true, // 连同分类信息一起查出来
            },
            orderBy: {
                createdAt: 'desc', // 按时间倒序
            },
        })
        return NextResponse.json(posts)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
    }
}

// POST: 创建新文章
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { title, content, categoryId, published } = body

        if (!title || !content) {
            return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
        }

        const post = await prisma.post.create({
            data: {
                title,
                content,
                published: published || false,
                categoryId,
            },
        })

        return NextResponse.json(post)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
    }
}
