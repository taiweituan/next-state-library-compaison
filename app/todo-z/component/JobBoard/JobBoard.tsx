import { useQuery } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useState } from "react"

interface CardProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className = "" }: CardProps) {
  return <div className={`rounded-2xl bg-white shadow-md ${className} p-4`}>{children}</div>
}

interface CardContentProps {
  children: React.ReactNode
  className?: string
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return <div className={`p-2 ${className}`}>{children}</div>
}
export interface Reactions {
  likes: number
  dislikes: number
}
interface Post {
  id: number
  title: string
  body: string
  tags: string[]
  reactions: Reactions
  views: number
  userId: number
}

export interface BlogPostsApiResponse {
  posts: Post[]
  total: number
  skip: number
  limit: number
}

// Mock API fetch function
const fetchBlogPosts = async ({
  queryKey,
}: {
  queryKey: [string, { page: number; skip: number }]
}): Promise<BlogPostsApiResponse> => {
  const [_key, { page, skip = 0 }] = queryKey
  const res = await fetch(`https://dummyjson.com/posts?limit=2&page=${page}&skip=${skip * 2}`)
  return res.json() as unknown as BlogPostsApiResponse
}

const useFetchBlogPosts = ({ page = 1, skip = 0 }) => {
  const { isLoading, data, isError } = useQuery({
    queryKey: ["blogPosts", { page, skip }],
    queryFn: fetchBlogPosts,
    staleTime: 300000,
  })

  return { isLoading, data, isError }
}

export default function BlogPosts() {
  const [page, setPage] = useState<number>(1)

  const { data, isLoading, isError } = useFetchBlogPosts({ page, skip: page })

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-xl font-bold">Fake Blog Posts</h1>
      {isLoading && <p>Loading posts...</p>}
      {isError && <p>Error loading posts.</p>}
      <div className="grid gap-4">
        {data?.posts?.map((post: Post) => (
          <Card key={post.id}>
            <CardContent className="p-4">
              <h2 className="font-bold">{post.title}</h2>
              <p>{post.body}</p>
              <p className="text-sm text-gray-500">Author: {post.userId}</p>
              <p className="text-sm text-gray-500">Views: {post.views}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-4 flex justify-between">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>
        <button onClick={() => setPage(page + 1)}>Next</button>
      </div>
      <ReactQueryDevtools initialIsOpen={true} />
    </div>
  )
}
